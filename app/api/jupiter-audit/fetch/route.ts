import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const TWITTER_API_BASE = 'https://api.twitter.com/2';

interface TwitterUser {
  id: string;
  username: string;
  name: string;
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  [key: string]: any;
}

export async function POST(request: Request) {
  try {
    const { username, type, count } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (!type || !['posts', 'replies'].includes(type)) {
      return NextResponse.json({ error: 'Type must be "posts" or "replies"' }, { status: 400 });
    }

    const fetchCount = Math.min(Math.max(count || 10, 1), 100);

    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (!bearerToken) {
      return NextResponse.json(
        { error: 'Twitter API credentials not configured' },
        { status: 500 }
      );
    }

    // Step 1: Get user ID from username
    const userResponse = await fetch(
      `${TWITTER_API_BASE}/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      return NextResponse.json(
        { error: `Twitter API error: ${errorData.detail || errorData.title || 'User not found'}` },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Step 2: Fetch tweets based on type
    let tweets: TwitterTweet[] = [];

    if (type === 'posts') {
      // Fetch posts (excluding retweets and replies to get only original posts)
      const tweetsResponse = await fetch(
        `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=${fetchCount}&exclude=retweets,replies&tweet.fields=created_at,public_metrics`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!tweetsResponse.ok) {
        const errorData = await tweetsResponse.json();
        console.error('Twitter API Error:', JSON.stringify(errorData, null, 2));
        return NextResponse.json(
          { error: `Twitter API error: ${JSON.stringify(errorData)}` },
          { status: tweetsResponse.status }
        );
      }

      const tweetsData = await tweetsResponse.json();
      tweets = tweetsData.data || [];
    } else {
      // Fetch replies
      const tweetsResponse = await fetch(
        `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=100&tweet.fields=created_at,public_metrics,in_reply_to_user_id`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!tweetsResponse.ok) {
        const errorData = await tweetsResponse.json();
        console.error('Twitter API Error:', JSON.stringify(errorData, null, 2));
        return NextResponse.json(
          { error: `Twitter API error: ${JSON.stringify(errorData)}` },
          { status: tweetsResponse.status }
        );
      }

      const tweetsData = await tweetsResponse.json();
      const allTweets = tweetsData.data || [];

      // Filter for replies only (tweets with in_reply_to_user_id)
      tweets = allTweets
        .filter((tweet: TwitterTweet) => tweet.in_reply_to_user_id)
        .slice(0, fetchCount);
    }

    // Step 3: Save data to file
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `${username}_${type}_${timestamp}.json`;
    const dataDir = join(process.cwd(), 'data', 'jupiter-audit');

    // Create directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const filePath = join(dataDir, filename);

    const savedData = {
      username,
      type,
      count: tweets.length,
      timestamp: new Date().toISOString(),
      data: tweets,
    };

    await writeFile(filePath, JSON.stringify(savedData, null, 2), 'utf-8');

    // Step 4: Return response
    return NextResponse.json({
      username,
      type,
      count: tweets.length,
      data: tweets,
      timestamp: savedData.timestamp,
      filename: `data/jupiter-audit/${filename}`,
    });

  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
