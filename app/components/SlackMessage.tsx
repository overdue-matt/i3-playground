interface SlackMessageProps {
  name: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export default function SlackMessage({ name, avatar, content, timestamp }: SlackMessageProps) {
  // Generate a color based on the name
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex gap-3 hover:bg-gray-50 px-2 py-1 rounded">
      <div className="flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-9 h-9 rounded object-cover"
          />
        ) : (
          <div className={`w-9 h-9 rounded ${getColorFromName(name)} flex items-center justify-center text-white font-semibold text-sm`}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-gray-900 text-sm">
            {name}
          </span>
          {timestamp && (
            <span className="text-xs text-gray-500">
              {timestamp}
            </span>
          )}
        </div>
        <div className="text-gray-900 text-sm whitespace-pre-wrap break-words">
          {content}
        </div>
      </div>
    </div>
  );
}
