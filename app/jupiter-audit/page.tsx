'use client';

import { useState, useEffect } from 'react';
import TwitterCard from '../components/TwitterCard';

interface TwitterData {
  username: string;
  type: 'posts' | 'replies';
  count: number;
  data: any[];
  timestamp: string;
  filename: string;
}

interface SavedData extends TwitterData {
  filename: string;
}

type SortOption = 'recent' | 'likes' | 'retweets' | 'replies' | 'engagement';

export default function JupiterAudit() {
  const [url, setUrl] = useState('');
  const [fetchType, setFetchType] = useState<'posts' | 'replies'>('posts');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TwitterData | null>(null);

  // Saved data state
  const [savedData, setSavedData] = useState<SavedData[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [loadingSaved, setLoadingSaved] = useState(false);

  const extractUsername = (url: string): string | null => {
    // Extract username from URLs like https://x.com/phantom or https://twitter.com/phantom
    const match = url.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/);
    return match ? match[1] : null;
  };

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Reload saved data after successful fetch
  useEffect(() => {
    if (result) {
      loadSavedData();
    }
  }, [result]);

  const loadSavedData = async () => {
    setLoadingSaved(true);
    try {
      const response = await fetch('/api/jupiter-audit/data');
      const data = await response.json();
      if (data.files) {
        setSavedData(data.files);
      }
    } catch (err) {
      console.error('Failed to load saved data:', err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const getUniqueClients = () => {
    const clients = new Set(savedData.map((d) => d.username));
    return Array.from(clients).sort();
  };

  const getFilteredAndSortedPosts = () => {
    let allPosts: any[] = [];

    // Filter by client
    const filtered =
      selectedClient === 'all'
        ? savedData
        : savedData.filter((d) => d.username === selectedClient);

    // Flatten all posts
    filtered.forEach((dataset) => {
      dataset.data.forEach((post: any) => {
        allPosts.push({
          ...post,
          username: dataset.username,
          datasetType: dataset.type,
        });
      });
    });

    // Sort posts
    allPosts.sort((a, b) => {
      const aMetrics = a.public_metrics || {};
      const bMetrics = b.public_metrics || {};

      switch (sortBy) {
        case 'likes':
          return (bMetrics.like_count || 0) - (aMetrics.like_count || 0);
        case 'retweets':
          return (bMetrics.retweet_count || 0) - (aMetrics.retweet_count || 0);
        case 'replies':
          return (bMetrics.reply_count || 0) - (aMetrics.reply_count || 0);
        case 'engagement':
          const aTotal =
            (aMetrics.like_count || 0) +
            (aMetrics.retweet_count || 0) +
            (aMetrics.reply_count || 0) +
            (aMetrics.quote_count || 0);
          const bTotal =
            (bMetrics.like_count || 0) +
            (bMetrics.retweet_count || 0) +
            (bMetrics.reply_count || 0) +
            (bMetrics.quote_count || 0);
          return bTotal - aTotal;
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return allPosts;
  };

  const handleFetch = async () => {
    setError('');
    setResult(null);

    const username = extractUsername(url);
    if (!username) {
      setError('Invalid X.com URL. Please provide a URL like https://x.com/phantom');
      return;
    }

    if (count < 1 || count > 100) {
      setError('Count must be between 1 and 100');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/jupiter-audit/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, type: fetchType, count }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Jupiter Audit
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Fetch and save X/Twitter data for competitive analysis
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                X.com Profile URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://x.com/phantom"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Fetch Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fetch Type
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setFetchType('posts')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                    fetchType === 'posts'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Original Posts Only
                </button>
                <button
                  onClick={() => setFetchType('replies')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                    fetchType === 'replies'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Recent Replies
                </button>
              </div>
            </div>

            {/* Count Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of {fetchType === 'posts' ? 'Posts' : 'Replies'} (1-100)
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Fetch Button */}
            <button
              onClick={handleFetch}
              disabled={loading || !url}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Fetching...' : `Fetch ${count} ${fetchType === 'posts' ? 'Posts' : 'Replies'}`}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Success Display */}
            {result && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
                  Successfully Fetched Data
                </h3>
                <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
                  <p><strong>Username:</strong> @{result.username}</p>
                  <p><strong>Type:</strong> {result.type}</p>
                  <p><strong>Count:</strong> {result.count} items</p>
                  <p><strong>Saved to:</strong> {result.filename}</p>
                  <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
                </div>

                {/* Preview of data */}
                {result.data && result.data.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                    <p className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      Preview (first item):
                    </p>
                    <pre className="bg-green-100 dark:bg-green-900/30 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.data[0], null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            How it works:
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
            <li>1. Paste an X.com profile URL (e.g., https://x.com/phantom)</li>
            <li>2. Choose whether to fetch posts or replies</li>
            <li>3. Set how many items to fetch (default: 10, max: 100)</li>
            <li>4. Data is automatically saved to <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">data/jupiter-audit/</code></li>
            <li>5. Files are named with username, type, and timestamp for easy tracking</li>
          </ul>
        </div>

        {/* Saved Data Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Saved Data Analysis
            </h2>
            <button
              onClick={loadSavedData}
              disabled={loadingSaved}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
            >
              {loadingSaved ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {savedData.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg">No saved data yet.</p>
              <p className="text-sm mt-2">Fetch some data above to get started!</p>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Client Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Client
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Clients ({getUniqueClients().length})</option>
                    {getUniqueClients().map((client) => (
                      <option key={client} value={client}>
                        @{client}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="engagement">Total Engagement</option>
                    <option value="likes">Most Likes</option>
                    <option value="retweets">Most Retweets</option>
                    <option value="replies">Most Replies</option>
                  </select>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Total Datasets
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                    {savedData.length}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Total Posts
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {savedData.reduce((sum, d) => sum + d.data.length, 0)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-4">
                  <div className="text-sm text-pink-600 dark:text-pink-400 font-medium">
                    Clients Tracked
                  </div>
                  <div className="text-2xl font-bold text-pink-900 dark:text-pink-300">
                    {getUniqueClients().length}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Filtered Posts
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {getFilteredAndSortedPosts().length}
                  </div>
                </div>
              </div>

              {/* Posts Grid */}
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {getFilteredAndSortedPosts().map((post) => (
                  <TwitterCard key={post.id} tweet={post} username={post.username} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
