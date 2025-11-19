'use client';

import Link from 'next/link';

const MORNING_URLS = [
  'https://x.com/HNTbandit',
  'https://x.com/SharpLink',
  'https://x.com/joechalom',
  'https://x.com/OndoFinance',
  'https://x.com/ventuals',
  'https://x.com/LiteStrategy',
  'https://x.com/BadgerDAO',
  'https://x.com/bitfinex',
  'https://x.com/eth_strategy',
  'https://x.com/TheCryptoLark',
  'https://x.com/meanwhile',
  'https://x.com/ztownsend',
];

export default function MorningUrlsPage() {
  const openAllUrls = () => {
    MORNING_URLS.forEach((url) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    });
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
            Morning URLs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your daily Twitter/X accounts to check
          </p>
        </div>

        {/* Open All Button */}
        <div className="mb-6">
          <button
            onClick={openAllUrls}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            Open All URLs ({MORNING_URLS.length} tabs)
          </button>
        </div>

        {/* URL List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            URLs ({MORNING_URLS.length})
          </h2>
          <div className="space-y-3">
            {MORNING_URLS.map((url, index) => {
              const username = url.replace('https://x.com/', '@');
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono w-8">
                      #{index + 1}
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">
                      {username}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm font-semibold"
                    >
                      Open
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(url)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm font-semibold"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg p-6">
          <p className="text-blue-900 dark:text-blue-100 text-sm">
            <strong>Tip:</strong> Click "Open All URLs" to open all {MORNING_URLS.length} accounts in separate tabs at once.
            Make sure your browser allows pop-ups for this site!
          </p>
        </div>
      </div>
    </div>
  );
}
