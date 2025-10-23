import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { tweetContent, targetAudience } = await request.json();

    if (!tweetContent) {
      return NextResponse.json(
        { error: 'Tweet content is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'XAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.x.ai/v1',
    });

    const systemPrompt = `You are an expert X (Twitter) content optimizer powered by Grok. Your job is to analyze tweets and create optimized variations that will perform better based on X's recommendation algorithm.

X's recommendation system reads every post to match users with content they're most likely to find interesting. You should optimize for:
- Engagement (likes, retweets, replies)
- Clarity and impact
- Relevance to the target audience
- Hook strength (first line matters most)
- Thread-worthiness
- Use of relevant hashtags and mentions strategically

Generate exactly 5 optimized tweet variations. For each variation, provide:
1. The optimized tweet text
2. A brief 1-sentence explanation of why this variation is better

Format your response as a JSON array with this structure:
[
  {
    "tweet": "optimized tweet text here",
    "explanation": "one sentence explaining why this is better"
  }
]

Keep tweets under 280 characters. Make them engaging, authentic, and optimized for virality within the target audience.`;

    const userPrompt = `Original Tweet:
${tweetContent}

${targetAudience ? `Target Audience Profile:\n${targetAudience}` : 'Target Audience: Crypto enthusiasts on X (Twitter)'}

Generate 5 optimized variations of this tweet that will perform better on X's recommendation algorithm.`;

    const completion = await client.chat.completions.create({
      model: 'grok-4-fast-reasoning',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from Grok');
    }

    const parsedResponse = JSON.parse(response);

    // Handle both array format and object with variations key
    const variations = Array.isArray(parsedResponse)
      ? parsedResponse
      : parsedResponse.variations || parsedResponse.tweets || [];

    return NextResponse.json({ variations });
  } catch (error) {
    console.error('Error optimizing tweet:', error);
    return NextResponse.json(
      { error: 'Failed to optimize tweet', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
