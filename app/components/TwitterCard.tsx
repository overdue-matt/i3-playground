interface TwitterCardProps {
  tweet: {
    id: string;
    text: string;
    created_at: string;
    public_metrics?: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
      bookmark_count?: number;
      impression_count?: number;
    };
    author_id?: string;
    media?: Array<{
      media_key: string;
      type: string;
      url?: string;
      preview_image_url?: string;
      width?: number;
      height?: number;
      alt_text?: string;
    }>;
    [key: string]: any;
  };
  username: string;
}

export default function TwitterCard({ tweet, username }: TwitterCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const metrics = tweet.public_metrics;
  const totalEngagement = metrics
    ? metrics.retweet_count + metrics.reply_count + metrics.like_count + metrics.quote_count
    : 0;

  const tweetUrl = `https://x.com/${username}/status/${tweet.id}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-900 dark:hover:bg-gray-750 hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-900 dark:text-white hover:underline">
                @{username}
              </span>
              <span className="text-gray-500 dark:text-gray-400">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(tweet.created_at)}
              </span>
            </div>
          </div>
          {/* X Logo */}
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        {/* Tweet Text */}
        <div className="text-[15px] leading-5 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
          {tweet.text}
        </div>
      </div>

      {/* Media */}
      {tweet.media && tweet.media.length > 0 && (
        <div className={`${tweet.media?.length === 1 ? 'px-0' : 'grid grid-cols-2 gap-1'}`}>
          {tweet.media.map((media, index) => (
            <div key={media.media_key} className="relative bg-gray-100 dark:bg-gray-900">
              {media.type === 'photo' && media.url && (
                <img
                  src={media.url}
                  alt={media.alt_text || 'Tweet image'}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: tweet.media?.length === 1 ? '600px' : '300px' }}
                />
              )}
              {media.type === 'video' && media.preview_image_url && (
                <div className="relative">
                  <img
                    src={media.preview_image_url}
                    alt="Video thumbnail"
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: tweet.media?.length === 1 ? '600px' : '300px' }}
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-blue-500 bg-opacity-90 rounded-full p-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              {media.type === 'animated_gif' && media.preview_image_url && (
                <div className="relative">
                  <img
                    src={media.preview_image_url}
                    alt="GIF preview"
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: tweet.media?.length === 1 ? '600px' : '300px' }}
                  />
                  {/* GIF badge */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded">
                    GIF
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Metrics */}
      <div className="p-4 pt-3">
      {metrics && (
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
          <div className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{formatNumber(metrics.reply_count)}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-green-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{formatNumber(metrics.retweet_count)}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{formatNumber(metrics.like_count)}</span>
          </div>
          {metrics.impression_count && (
            <div className="flex items-center gap-1 hover:text-purple-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{formatNumber(metrics.impression_count)}</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
            <span>Total: {formatNumber(totalEngagement)}</span>
          </div>
        </div>
      )}
      </div>
    </a>
  );
}
