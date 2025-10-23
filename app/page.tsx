'use client';

import Image from "next/image";
import { useState } from "react";
import TweetCard from "./components/TweetCard";

interface TweetVariation {
  tweet: string;
  explanation: string;
}

export default function Home() {
  const [tweetContent, setTweetContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [pastedImages, setPastedImages] = useState<string[]>([]);
  const [optimizedTweets, setOptimizedTweets] = useState<TweetVariation[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultICP = `Target Audience: Crypto enthusiasts on X (Twitter)

Demographics:
- Age: 25-45
- Tech-savvy early adopters
- Active on crypto Twitter (#CryptoTwitter)
- Interest in DeFi, NFTs, and blockchain technology

Psychographics:
- Value transparency and decentralization
- Follow crypto influencers and thought leaders
- Engage with market analysis and alpha calls
- FOMO-driven but increasingly educated
- Community-oriented (DAO participants)

Pain Points:
- Information overload in fast-moving markets
- Difficulty distinguishing signal from noise
- Fear of missing opportunities
- Concerns about security and scams

Engagement Style:
- Prefer concise, high-signal content
- Respond well to data and charts
- Appreciate humor and meme culture
- Value insider insights and early information`;

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Check if the item is an image
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault(); // Prevent default paste behavior for images

        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            setPastedImages(prev => [...prev, imageUrl]);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setPastedImages(prev => prev.filter((_, i) => i !== index));
  };

  const optimizeTweet = async () => {
    if (!tweetContent.trim()) {
      setError('Please enter tweet content first');
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      const response = await fetch('/api/optimize-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tweetContent,
          targetAudience: targetAudience || defaultICP,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to optimize tweet');
      }

      setOptimizedTweets(data.variations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error optimizing tweet:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image with Opacity */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/grok.png_large"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Tweet Generator
          </h1>

          {/* 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              {/* Tweet Content Input */}
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Tweet Content
                </label>
                <textarea
                  value={tweetContent}
                  onChange={(e) => setTweetContent(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Paste or type your tweet content here... (Ctrl+V for images)"
                  className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />

                {/* Pasted Images Display */}
                {pastedImages.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pasted Images ({pastedImages.length})
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {pastedImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Pasted ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            aria-label="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optimize Button */}
                <button
                  onClick={optimizeTweet}
                  disabled={isOptimizing || !tweetContent.trim()}
                  className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isOptimizing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Optimizing with Grok...
                    </span>
                  ) : (
                    'Optimize with Grok'
                  )}
                </button>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
              </div>

              {/* Target Audience / ICP Input */}
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Target Audience / ICP
                </label>
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder={defaultICP}
                  className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Right Column - Output */}
            <div className="space-y-6">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Optimized Tweets
                </h2>

                {optimizedTweets.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400 text-center py-12">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-lg font-medium">Ready to optimize!</p>
                    <p className="text-sm mt-2">Enter your tweet content and click "Optimize with Grok"</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {optimizedTweets.map((variation, index) => (
                      <div key={index} className="space-y-2">
                        <TweetCard
                          content={variation.tweet}
                          author="You"
                          handle="@yourhandle"
                          timestamp="now"
                        />
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            <span className="font-semibold">Why this works:</span> {variation.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
