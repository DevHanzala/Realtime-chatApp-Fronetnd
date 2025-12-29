import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore.js';
import useChatStore from '../store/chatStore.js';
import ChatBox from '../components/ChatBox.jsx';
import toast from 'react-hot-toast';
import { Users, Wifi, WifiOff, MessageCircle, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const { user, users, fetchUsers, loading: authLoading } = useAuthStore();
  const {
    disconnectSocket,
    onlineUsers,
    socketConnected,
    error,
    joinRoom,
    activeRoomId,
  } = useChatStore();

  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true);

  useEffect(() => {
    if (!user) return;

    const store = useChatStore.getState();
    store.initListeners();
    store.connectSocket();

    return () => store.disconnectSocket();
  }, [user]);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  useEffect(() => {
    if (error) toast.error(`Chat error: ${error}`);
  }, [error]);

  // Get active chat user
  const getActiveChatUser = () => {
    if (!activeRoomId) return null;
    const otherUserEmail = activeRoomId.split('_').find(email => email !== user?.email);
    return users.find(u => u.email === otherUserEmail);
  };

  const activeChatUser = getActiveChatUser();

  const handleUserClick = (u) => {
    const sorted = [user?.email, u.email].sort();
    const roomId = sorted.join('_');
    joinRoom(roomId);
    setShowSidebarOnMobile(false); // Hide sidebar on mobile when chat opens
    toast.success(`Chatting with ${u.username || u.email}`);
  };

  const handleBackToUsers = () => {
    setShowSidebarOnMobile(true);
  };

  if (authLoading) {
    return (
      <div className="flex flex-col flex-1 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-indigo-600">Restoring session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 md:py-6 px-2 md:px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-20 mb-4 md:mb-6">
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-4 md:p-6">
            <div className="flex items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className="w-10 md:w-12 h-10 md:h-12  bg-opacity-20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold">Real-Time Chat Room</h2>
                  <p className="text-indigo-100 text-xs md:text-sm mt-1 flex flex-wrap items-center gap-2">
                    <span className="truncate max-w-37.5 sm:max-w-none">Welcome, {user?.displayName || user?.email}</span>
                    {socketConnected ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-500 bg-opacity-30 px-2 py-1 rounded-full whitespace-nowrap">
                        <Wifi className="w-3 h-3" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-red-500 bg-opacity-30 px-2 py-1 rounded-full whitespace-nowrap">
                        <WifiOff className="w-3 h-3" />
                        Disconnected
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-20" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-full">
            {/* Users Sidebar - Hidden on mobile when chat is active */}
            <div className={`lg:col-span-1 flex flex-col min-h-0 bg-linear-to-br from-slate-50 to-indigo-50 border-r border-slate-200 ${!showSidebarOnMobile && activeRoomId ? 'hidden lg:flex' : 'flex'}`}>
              <div className="shrink-0 p-4 md:p-6 border-b border-slate-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900">All Users</h3>
                    <p className="text-xs text-slate-600">
                      {users.filter(u => u.uid !== user?.uid).length} total • {onlineUsers.filter(email => email !== user?.email).length} online
                    </p>
                  </div>
                </div>
              </div>

              <ul className="flex-1 min-h-0 overflow-y-auto space-y-2 px-4 md:px-6 py-4">
                {users.length <= 1 ? (
                  <li className="text-center py-8 text-gray-500 text-sm">
                    No users found
                  </li>
                ) : (
                  users
                    .filter((u) => u.uid !== user?.uid)
                    .map((u) => {
                      const isOnline = onlineUsers.includes(u.email);
                      const sorted = [user?.email, u.email].sort();
                      const roomId = sorted.join('_');
                      const isActive = activeRoomId === roomId;

                      return (
                        <li
                          key={u.uid}
                          onClick={() => handleUserClick(u)}
                          className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg border-2 border-indigo-400'
                              : 'bg-white bg-opacity-50 hover:bg-opacity-80 border border-transparent hover:border-indigo-200'
                          }`}
                        >
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                              isActive ? 'bg-white text-indigo-600' : 'bg-linear-to-br from-indigo-500 to-purple-500 text-white'
                            }`}>
                              {(u.username || u.email)?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                              isActive ? 'border-indigo-500' : 'border-white'
                            } ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate transition-colors ${
                              isActive ? 'text-white' : 'text-slate-800 group-hover:text-indigo-600'
                            }`}>
                              {u.username || u.email}
                            </p>
                            <p className={`text-xs ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                              {isOnline ? 'Online' : 'Offline'}
                            </p>
                          </div>

                          {isActive && (
                            <div className="text-white text-xs font-bold">●</div>
                          )}
                        </li>
                      );
                    })
                )}
              </ul>
            </div>

            {/* Chat Area - Show back button on mobile when chat is active */}
            <div className={`lg:col-span-3 flex flex-col h-full ${showSidebarOnMobile && activeRoomId ? 'hidden lg:flex' : 'flex'}`}>
              {/* Mobile Back Button */}
              {activeRoomId && activeChatUser && (
                <div className="lg:hidden bg-linear-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center gap-3 border-b border-indigo-700">
                  <button
                    onClick={handleBackToUsers}
                    className="w-9 h-9  bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10  bg-opacity-20 rounded-full flex items-center justify-center font-semibold">
                      {(activeChatUser.username || activeChatUser.email)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{activeChatUser.username || activeChatUser.email}</p>
                      <p className="text-xs text-indigo-200">
                        {onlineUsers.includes(activeChatUser.email) ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <ChatBox />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Chat;

