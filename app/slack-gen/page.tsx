'use client';

import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import SlackSidebar from '../components/SlackSidebar';
import SlackMessage from '../components/SlackMessage';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  unreadCount?: number;
}

export interface DirectMessage {
  id: string;
  userId: string;
  isOnline: boolean;
}

export default function SlackGenerator() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Jesse Pollak', avatar: '' },
    { id: '2', name: 'Brian Armstrong', avatar: '' },
    { id: '3', name: 'Alex', avatar: '' },
  ]);

  const [channels, setChannels] = useState<Channel[]>([
    { id: '1', name: 'general', isPrivate: false },
    { id: '2', name: 'Listings', isPrivate: false, unreadCount: 1 },
    { id: '3', name: 'token-launch-q5', isPrivate: false },
    { id: '4', name: 'bnb-listing', isPrivate: true, unreadCount: 26 },
    { id: '5', name: 'Zora', isPrivate: true },
  ]);

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([
    { id: '1', userId: '1', isOnline: true },
    { id: '2', userId: '2', isOnline: true },
    { id: '3', userId: '3', isOnline: true },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '1',
      content: "Yeah, weird. They don't understand, the base trenches are for everyone",
      timestamp: '',
    },
    {
      id: '2',
      userId: '2',
      content: "Hey Alex, I just heard back from the budget team.\nWe have $25M allocated to the Q4 marketing budget.\n\nGot any idea?",
      timestamp: '8:26',
    },
    {
      id: '3',
      userId: '3',
      content: "Really? Great.\n\nI have something in mind. Can I use my delegate access on your account?\n\nShould be fun",
      timestamp: '8:34',
    },
    {
      id: '4',
      userId: '2',
      content: "WTF ALEX?!",
      timestamp: '9:17',
    },
  ]);

  const [activeChannel, setActiveChannel] = useState<string>('Marketing');
  const [activeChannelMembers, setActiveChannelMembers] = useState<number>(4);
  const [editMode, setEditMode] = useState<'messages' | 'channels' | 'users'>('messages');
  const [workspaceName, setWorkspaceName] = useState<string>('Coinbase');
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const slackPreviewRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async () => {
    if (!slackPreviewRef.current) return;

    setIsCopying(true);
    setCopySuccess(false);

    try {
      const blob = await htmlToImage.toBlob(slackPreviewRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });

      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy image. Please try again.');
    } finally {
      setIsCopying(false);
    }
  };

  const addUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: 'New User',
      avatar: '',
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    setMessages(messages.filter(m => m.userId !== id));
  };

  const addChannel = (isPrivate: boolean) => {
    const newChannel: Channel = {
      id: Date.now().toString(),
      name: 'new-channel',
      isPrivate,
    };
    setChannels([...channels, newChannel]);
  };

  const updateChannel = (id: string, updates: Partial<Channel>) => {
    setChannels(channels.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteChannel = (id: string) => {
    setChannels(channels.filter(c => c.id !== id));
  };

  const addMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      userId: users[0]?.id || '1',
      content: 'New message',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(messages.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const handleImagePaste = (userId: string, e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            updateUser(userId, { avatar: imageUrl });
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Slack Conversation Generator
        </h1>

        {/* Edit Mode Selector & Copy Button */}
        <div className="mb-6 flex gap-4 justify-center items-center flex-wrap">
          <button
            onClick={() => setEditMode('messages')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              editMode === 'messages'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Edit Messages
          </button>
          <button
            onClick={() => setEditMode('channels')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              editMode === 'channels'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Edit Channels
          </button>
          <button
            onClick={() => setEditMode('users')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              editMode === 'users'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Edit Users
          </button>

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            disabled={isCopying}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              copySuccess
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isCopying ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Capturing...
              </>
            ) : copySuccess ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Slack Preview */}
          <div className="lg:col-span-2">

            <div ref={slackPreviewRef} className="bg-white rounded-lg shadow-2xl overflow-hidden font-[family-name:var(--font-lato)]" style={{ height: '700px' }}>
              <div className="flex h-full">
                {/* Sidebar */}
                <SlackSidebar
                  workspaceName={workspaceName}
                  channels={channels}
                  directMessages={directMessages}
                  users={users}
                />

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                  {/* Chat Header */}
                  <div className="h-14 border-b border-gray-200 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900">
                        #{activeChannel}
                      </h2>
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        <span className="text-sm">{activeChannelMembers}</span>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const user = users.find(u => u.id === message.userId);
                      return (
                        <SlackMessage
                          key={message.id}
                          name={user?.name || 'Unknown User'}
                          avatar={user?.avatar || ''}
                          content={message.content}
                          timestamp={message.timestamp}
                        />
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        placeholder={`Message #${activeChannel}`}
                        className="flex-1 bg-transparent text-gray-900 outline-none text-sm"
                        readOnly
                      />
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Editor Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4" style={{ height: '700px', overflowY: 'auto' }}>
              {/* Workspace Name Editor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              {/* Channel Name Editor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Active Channel Name
                </label>
                <input
                  type="text"
                  value={activeChannel}
                  onChange={(e) => setActiveChannel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              {/* Users Editor */}
              {editMode === 'users' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h3>
                    <button
                      onClick={addUser}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                    >
                      + Add User
                    </button>
                  </div>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-500 text-xs">No img</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={user.name}
                            onChange={(e) => updateUser(user.id, { name: e.target.value })}
                            className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                          />
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Avatar URL or paste image (Ctrl+V):
                          </label>
                          <input
                            type="text"
                            value={user.avatar}
                            onChange={(e) => updateUser(user.id, { avatar: e.target.value })}
                            onPaste={(e) => handleImagePaste(user.id, e)}
                            placeholder="Paste image or enter URL"
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Channels Editor */}
              {editMode === 'channels' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Channels</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addChannel(false)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                      >
                        + Public
                      </button>
                      <button
                        onClick={() => addChannel(true)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                      >
                        + Private
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {channels.map((channel) => (
                      <div key={channel.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">
                            {channel.isPrivate ? '🔒' : '#'}
                          </span>
                          <input
                            type="text"
                            value={channel.name}
                            onChange={(e) => updateChannel(channel.id, { name: e.target.value })}
                            className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                          />
                          <button
                            onClick={() => deleteChannel(channel.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 dark:text-gray-400">
                            Unread count:
                          </label>
                          <input
                            type="number"
                            value={channel.unreadCount || 0}
                            onChange={(e) => updateChannel(channel.id, { unreadCount: parseInt(e.target.value) || undefined })}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Editor */}
              {editMode === 'messages' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h3>
                    <button
                      onClick={addMessage}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                    >
                      + Add Message
                    </button>
                  </div>
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const user = users.find(u => u.id === message.userId);
                      return (
                        <div key={message.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <select
                              value={message.userId}
                              onChange={(e) => updateMessage(message.id, { userId: e.target.value })}
                              className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                            >
                              {users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="ml-2 text-red-600 hover:text-red-700"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <textarea
                            value={message.content}
                            onChange={(e) => updateMessage(message.id, { content: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                            rows={3}
                          />
                          <input
                            type="text"
                            value={message.timestamp}
                            onChange={(e) => updateMessage(message.id, { timestamp: e.target.value })}
                            placeholder="Timestamp (e.g., 8:26)"
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
