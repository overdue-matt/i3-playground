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

    const fetchCount = Math.min(Math.max(count || 10, 1), 3200); // Twitter allows up to 3200 most recent tweets

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

    let threadContinuations: TwitterTweet[] = []; // Track thread continuations separately

    if (type === 'posts') {
      // Fetch posts with pagination (excluding retweets and replies to get only original posts)
      let nextToken: string | undefined = undefined;
      let allMedia: any[] = [];
      let totalFetched = 0; // Track total tweets fetched from API (for cost control)

      while (totalFetched < fetchCount) {
        const remaining = fetchCount - totalFetched;
        const pageSize = Math.min(remaining, 100); // Max 100 per request

        const url: string = `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=${pageSize}&exclude=retweets,replies&tweet.fields=created_at,public_metrics,attachments,entities,conversation_id,in_reply_to_user_id,note_tweet&expansions=attachments.media_keys&media.fields=type,url,preview_image_url,width,height,alt_text${nextToken ? `&pagination_token=${nextToken}` : ''}`;

        const tweetsResponse: Response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (!tweetsResponse.ok) {
          const errorData = await tweetsResponse.json();
          console.error('Twitter API Error:', JSON.stringify(errorData, null, 2));
          return NextResponse.json(
            { error: `Twitter API error: ${JSON.stringify(errorData)}` },
            { status: tweetsResponse.status }
          );
        }

        const tweetsData: any = await tweetsResponse.json();
        const pageTweets = tweetsData.data || [];

        if (pageTweets.length === 0) {
          console.log(`Pagination stopped: No more tweets available. API tweets fetched: ${totalFetched}, Original posts found: ${tweets.length}`);
          break; // No more tweets available
        }

        totalFetched += pageTweets.length; // Track API usage for cost control

        // Separate original posts from thread continuations
        // A tweet is original if conversation_id === tweet.id
        const originalPosts = pageTweets.filter((tweet: any) =>
          tweet.conversation_id === tweet.id
        );
        const threadReplies = pageTweets.filter((tweet: any) =>
          tweet.conversation_id !== tweet.id
        );

        tweets = tweets.concat(originalPosts);
        threadContinuations = threadContinuations.concat(threadReplies);
        console.log(`Fetched ${pageTweets.length} tweets (${originalPosts.length} original, ${threadReplies.length} thread continuations). API total: ${totalFetched}/${fetchCount}, Originals: ${tweets.length}, Threads: ${threadContinuations.length}`);

        // Collect media from this page
        if (tweetsData.includes?.media) {
          allMedia = allMedia.concat(tweetsData.includes.media);
        }

        // Check if there's a next page
        nextToken = tweetsData.meta?.next_token;
        if (!nextToken) {
          console.log(`Pagination stopped: No next_token. API tweets fetched: ${totalFetched}, Original posts found: ${tweets.length}`);
          break; // No more pages
        }
      }

      console.log(`Final result: Fetched ${totalFetched} tweets from API, found ${tweets.length} original posts and ${threadContinuations.length} thread continuations`);

      // Map all collected media data to tweets
      if (allMedia.length > 0) {
        const mediaMap = new Map(allMedia.map((m: any) => [m.media_key, m]));
        tweets = tweets.map((tweet: any) => {
          if (tweet.attachments?.media_keys) {
            tweet.media = tweet.attachments.media_keys.map((key: string) => mediaMap.get(key)).filter(Boolean);
          }
          return tweet;
        });
        threadContinuations = threadContinuations.map((tweet: any) => {
          if (tweet.attachments?.media_keys) {
            tweet.media = tweet.attachments.media_keys.map((key: string) => mediaMap.get(key)).filter(Boolean);
          }
          return tweet;
        });
      }

      // Use full text from note_tweet for long-form posts (>280 chars)
      const applyFullText = (tweet: any) => {
        if (tweet.note_tweet?.text) {
          tweet.text = tweet.note_tweet.text;
        }
        return tweet;
      };
      tweets = tweets.map(applyFullText);
      threadContinuations = threadContinuations.map(applyFullText);
    } else {
      // Fetch replies (excluding retweets to reduce API costs)
      let nextToken: string | undefined = undefined;
      let allMedia: any[] = [];
      let totalFetched = 0;

      // Fetch tweets with pagination until we have enough replies
      while (tweets.length < fetchCount && totalFetched < 3200) { // Safety limit
        const tweetsResponse: Response = await fetch(
          `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=100&exclude=retweets&tweet.fields=created_at,public_metrics,in_reply_to_user_id,attachments,entities,note_tweet&expansions=attachments.media_keys&media.fields=type,url,preview_image_url,width,height,alt_text${nextToken ? `&pagination_token=${nextToken}` : ''}`,
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

        const tweetsData: any = await tweetsResponse.json();
        const allTweets = tweetsData.data || [];
        totalFetched += allTweets.length;

        if (allTweets.length === 0) {
          console.log(`Pagination stopped: No more tweets available. API tweets fetched: ${totalFetched}, Replies found: ${tweets.length}`);
          break;
        }

        // Collect media from this page
        if (tweetsData.includes?.media) {
          allMedia = allMedia.concat(tweetsData.includes.media);
        }

        // Filter for replies to OTHER users only (exclude self-replies/thread continuations)
        const pageReplies = allTweets.filter((tweet: TwitterTweet) =>
          tweet.in_reply_to_user_id && tweet.in_reply_to_user_id !== userId
        );

        tweets = tweets.concat(pageReplies);
        console.log(`Fetched ${allTweets.length} tweets, found ${pageReplies.length} replies. API total: ${totalFetched}, Replies total: ${tweets.length}/${fetchCount}`);

        // Check for next page
        nextToken = tweetsData.meta?.next_token;
        if (!nextToken) {
          console.log(`Pagination stopped: No next_token. API tweets fetched: ${totalFetched}, Replies found: ${tweets.length}`);
          break;
        }
      }

      // Trim to requested count
      tweets = tweets.slice(0, fetchCount);

      // Map all collected media data to tweets
      if (allMedia.length > 0) {
        const mediaMap = new Map(allMedia.map((m: any) => [m.media_key, m]));
        tweets = tweets.map((tweet: any) => {
          if (tweet.attachments?.media_keys) {
            tweet.media = tweet.attachments.media_keys.map((key: string) => mediaMap.get(key)).filter(Boolean);
          }
          return tweet;
        });
      }

      // Use full text from note_tweet for long-form replies (>280 chars)
      tweets = tweets.map((tweet: any) => {
        if (tweet.note_tweet?.text) {
          tweet.text = tweet.note_tweet.text;
        }
        return tweet;
      });
    }

    // Step 3: Save data to file(s)
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `${username}_${type}_${timestamp}.json`;
    const dataDir = join(process.cwd(), 'data', 'jupiter-audit');

    // Create directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const filePath = join(dataDir, filename);
    const now = new Date().toISOString();

    const savedData = {
      username,
      type,
      count: tweets.length,
      timestamp: now,
      data: tweets,
    };

    await writeFile(filePath, JSON.stringify(savedData, null, 2), 'utf-8');

    // Save ALL posts (originals + thread continuations) to a separate file
    let allPostsFilename: string | null = null;
    if (type === 'posts' && threadContinuations.length > 0) {
      const allPosts = [...tweets, ...threadContinuations];
      // Sort by created_at descending (most recent first)
      allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      allPostsFilename = `${username}_all-posts_${timestamp}.json`;
      const allPostsFilePath = join(dataDir, allPostsFilename);

      const allPostsData = {
        username,
        type: 'all-posts',
        count: allPosts.length,
        timestamp: now,
        data: allPosts,
      };

      await writeFile(allPostsFilePath, JSON.stringify(allPostsData, null, 2), 'utf-8');
      console.log(`Saved ${allPosts.length} total posts (${tweets.length} original + ${threadContinuations.length} thread continuations) to ${allPostsFilename}`);
    }

    // Step 4: Return response
    return NextResponse.json({
      username,
      type,
      count: tweets.length,
      data: tweets,
      timestamp: savedData.timestamp,
      filename: `data/jupiter-audit/${filename}`,
      // Include all-posts info if applicable
      ...(allPostsFilename && {
        allPosts: {
          count: tweets.length + threadContinuations.length,
          filename: `data/jupiter-audit/${allPostsFilename}`,
        },
      }),
    });

  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}