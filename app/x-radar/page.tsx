'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Post {
  url: string;
  index: number;
}

export default function XRadarPage() {
  const [radarUrl, setRadarUrl] = useState('https://x.com/i/radar/1974956470866465242');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chromeConnected, setChromeConnected] = useState(false);

  const checkChromeConnection = async () => {
    try {
      const response = await fetch('/api/x-radar/check');
      const data = await response.json();
      setChromeConnected(data.connected);
      return data.connected;
    } catch (err) {
      setChromeConnected(false);
      return false;
    }
  };

  const scrapePosts = async () => {
    setLoading(true);
    setError('');
    setPosts([]);

    try {
      const response = await fetch('/api/x-radar/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ radarUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape posts');
      }

      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-purple-600 dark:text-purple-400 hover:underline mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            X Radar Post Scraper
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Fully automated extraction of post URLs from X Radar feeds
          </p>
        </div>

        {/* Setup Instructions */}
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-3 text-lg">Setup (One Time)</h3>
          <div className="space-y-3 text-yellow-800 dark:text-yellow-200">
            <div className="flex items-start gap-2">
              <span className="font-bold text-lg">1.</span>
              <div>
                <p className="font-semibold">Run launch-chrome-debug.bat</p>
                <p className="text-sm">Opens a separate debug Chrome (your regular Chrome can stay open!)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-lg">2.</span>
              <div>
                <p className="font-semibold">First time only: Log into X in that Chrome</p>
                <p className="text-sm">It stays logged in after that</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-lg">3.</span>
              <div>
                <p className="font-semibold">Check connection - you're done!</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={checkChromeConnection}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm font-semibold"
            >
              Check Connection
            </button>
            {chromeConnected && (
              <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                ✓ Connected! Ready to scrape
              </span>
            )}
            {chromeConnected === false && (
              <span className="text-red-600 dark:text-red-400 font-semibold">
                ✗ Not connected - run launch-chrome-debug.bat
              </span>
            )}
          </div>
        </div>

        {/* Scraper Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              X Radar URL
            </label>
            <input
              type="text"
              value={radarUrl}
              onChange={(e) => setRadarUrl(e.target.value)}
              placeholder="https://x.com/i/radar/1974956470866465242"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            onClick={scrapePosts}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Extracting URLs...' : 'Extract URLs'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {posts.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Extracted {posts.length} Post URLs
            </h2>
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    #{post.index + 1}
                  </span>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-mono text-sm truncate ml-4 flex-1"
                  >
                    {post.url}
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(post.url)}
                    className="ml-4 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const urls = posts.map(p => p.url).join('\n');
                navigator.clipboard.writeText(urls);
              }}
              className="mt-6 w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300"
            >
              Copy All URLs
            </button>
          </div>
        )}

        {/* Technical Documentation */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            How This Works (For Devs)
          </h2>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Architecture</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Frontend: Next.js 16 (React)</li>
                <li>Backend: Next.js API routes</li>
                <li>Browser automation: Puppeteer (puppeteer-core)</li>
                <li>Chrome connection: Remote debugging protocol on port 9222</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">The Scraping Process</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>User submits radar URL</strong> → Frontend POST to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">/api/x-radar/scrape</code></li>
                <li><strong>Puppeteer connects</strong> → Uses Chrome DevTools Protocol to connect to Chrome running with <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">--remote-debugging-port=9222</code></li>
                <li><strong>Navigate to radar page</strong> → Opens the URL in a new tab (with user's X login session)</li>
                <li><strong>Inject extraction script</strong> → Runs browser-side JavaScript via <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">page.evaluate()</code></li>
                <li><strong>Script execution:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>Overrides <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">window.open</code> to intercept URLs</li>
                    <li>Finds all post cards (selector: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.cursor-pointer</code> with X links)</li>
                    <li>Clicks each post with 500ms delay</li>
                    <li>Captures URLs from the intercepted <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">window.open</code> calls</li>
                    <li>Returns array of URLs via Promise</li>
                  </ul>
                </li>
                <li><strong>Return to frontend</strong> → API sends JSON response with URLs</li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Key Files</h3>
              <ul className="list-none space-y-1 text-sm font-mono">
                <li>📄 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">app/x-radar/page.tsx</code> - This page</li>
                <li>📄 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">app/api/x-radar/scrape/route.ts</code> - Main scraping logic</li>
                <li>📄 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">app/api/x-radar/check/route.ts</code> - Connection check</li>
                <li>📄 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">launch-chrome-debug.bat</code> - Chrome launcher script</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Full Automation Considerations</h3>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-sm mb-3"><strong>Current limitation:</strong> Requires Chrome with GUI and manual login</p>
                <p className="text-sm mb-2"><strong>For VM/Cloud deployment (100% automated):</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>Switch to headless Chrome (<code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">puppeteer.launch()</code> instead of <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">puppeteer.connect()</code>)</li>
                  <li>Handle X authentication:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Option A: Store and inject cookies/localStorage</li>
                      <li>Option B: Use X API credentials</li>
                      <li>Option C: Persistent browser session in Docker container</li>
                    </ul>
                  </li>
                  <li>Create batch scraper endpoint that accepts multiple radar URLs</li>
                  <li>Set up cron job/scheduler (node-cron or OS-level)</li>
                  <li>Store results (database, file system, webhook, etc.)</li>
                  <li>Consider services like Browserless.io or Apify for managed browser automation</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">The Core Script (Browser-Side)</h3>
              <pre className="bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
{`// Intercept window.open to capture URLs
const capturedUrls = [];
const originalOpen = window.open;
window.open = function(url, target, features) {
  capturedUrls.push(url);
  return originalOpen.call(this, url, target, features);
};

// Find and click all post cards
const postCards = Array.from(
  document.querySelectorAll('.cursor-pointer')
).filter(card =>
  card.querySelector('[href^="https://x.com/"]') &&
  card.querySelector('[dir="auto"]')
);

// Click with delay, capture URLs
function clickNext(index) {
  if (index >= postCards.length) {
    return capturedUrls; // Done
  }
  postCards[index].click();
  setTimeout(() => clickNext(index + 1), 500);
}
clickNext(0);`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
