import Link from "next/link";

interface Tool {
  name: string;
  description: string;
  href: string;
  icon: string;
}

const tools: Tool[] = [
  {
    name: "Slack Conversation Generator",
    description: "Create realistic Slack conversation screenshots with customizable users, channels, and messages.",
    href: "/slack-gen",
    icon: "💬",
  },
  {
    name: "X Radar Post Scraper",
    description: "Extract post URLs from X Radar feeds using your logged-in browser session.",
    href: "/x-radar",
    icon: "🎯",
  },
  {
    name: "Jupiter Audit",
    description: "Fetch and save X/Twitter posts or replies for competitive analysis using the Twitter API.",
    href: "/jupiter-audit",
    icon: "🔍",
  },
  // Add more tools here as you build them
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            i3 Playground
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Tools for degens
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-5xl mb-4">{tool.icon}</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {tool.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>
              <div className="mt-6 flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                <span>Launch tool</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          More tools coming soon...
        </div>
      </div>
    </div>
  );
}
