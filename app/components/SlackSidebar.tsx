import { Channel, DirectMessage, User } from '../slack-gen/page';

interface SlackSidebarProps {
  workspaceName: string;
  channels: Channel[];
  directMessages: DirectMessage[];
  users: User[];
}

export default function SlackSidebar({ workspaceName, channels, directMessages, users }: SlackSidebarProps) {
  return (
    <div className="w-64 bg-purple-900 text-white flex flex-col h-full">
      {/* Workspace Header */}
      <div className="h-14 border-b border-purple-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-700 rounded flex items-center justify-center font-bold text-sm">
            {workspaceName.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-bold text-lg">{workspaceName}</h1>
        </div>
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Channels Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 px-2">
            <button className="flex items-center gap-1 text-sm font-semibold text-white hover:text-gray-200">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Channels</span>
            </button>
            <button className="text-white hover:text-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="space-y-0.5">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between px-2 py-1 hover:bg-purple-800 rounded cursor-pointer group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {channel.isPrivate ? (
                    <svg className="w-4 h-4 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="flex-shrink-0 text-gray-300 font-bold">#</span>
                  )}
                  <span className="text-sm truncate text-gray-200">
                    {channel.name}
                  </span>
                </div>
                {channel.unreadCount && channel.unreadCount > 0 && (
                  <div className="flex-shrink-0 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                    {channel.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div>
          <div className="flex items-center justify-between mb-2 px-2">
            <button className="flex items-center gap-1 text-sm font-semibold text-white hover:text-gray-200">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Direct Messages</span>
            </button>
            <button className="text-white hover:text-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="space-y-0.5">
            {directMessages.map((dm) => {
              const user = users.find(u => u.id === dm.userId);
              if (!user) return null;

              return (
                <div
                  key={dm.id}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-purple-800 rounded cursor-pointer"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-5 h-5 rounded object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 bg-purple-700 rounded flex items-center justify-center text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {dm.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-purple-900"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-200 truncate">
                    {user.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="h-14 border-t border-purple-800 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-purple-700 rounded flex items-center justify-center text-sm font-semibold">
            👤
          </div>
          <span className="text-sm text-white truncate">Preferences</span>
        </div>
        <button className="text-white hover:text-gray-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
