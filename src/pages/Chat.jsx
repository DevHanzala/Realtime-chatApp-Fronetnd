import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore.js';
import useChatStore from '../store/chatStore.js';
import ChatBox from '../components/ChatBox.jsx';
import toast from 'react-hot-toast';
import { Users, Wifi, WifiOff, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';

const Chat = () => {
  const { user, users, fetchUsers, loading: authLoading } = useAuthStore();
  const {
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
  }, [user, fetchUsers]);

  useEffect(() => {
    if (error) toast.error(`Chat error: ${error}`);
  }, [error]);

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
    setShowSidebarOnMobile(false);
    toast.success(`Chatting with ${u.username || u.email}`);
  };

  const handleBackToUsers = () => {
    setShowSidebarOnMobile(true);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center animate-fadeIn">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-slate-200 rounded-full mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          </div>
          <p className="text-xl font-semibold text-slate-900 mb-2">Restoring session...</p>
          <p className="text-sm text-slate-600">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 py-3 md:py-4 px-2 md:px-3 relative overflow-hidden flex flex-col">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full">
        {/* Header Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-20 mb-3 md:mb-4 shrink-0">
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-3 md:p-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 md:w-12 h-10 md:h-12  rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 md:w-6 h-5 md:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold">Real-Time Chat Room</h2>
                <p className="text-indigo-100 text-xs mt-1 flex flex-wrap items-center gap-2">
                  <span className="truncate max-w-30 sm:max-w-50 md:max-w-none">Welcome, {user?.displayName || user?.email}</span>
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

        {/* Main Chat Container */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-20 flex-1 min-h-0 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-full min-h-0">
            {/* Users Sidebar */}
            <div className={`lg:col-span-1 flex flex-col min-h-0 bg-linear-to-br from-slate-50 to-indigo-50 border-r border-slate-200 ${!showSidebarOnMobile && activeRoomId ? 'hidden lg:flex' : 'flex'}`}>
              <div className="shrink-0 p-3 md:p-4 border-b border-slate-300">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-9 md:w-10 h-9 md:h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-4 md:w-5 h-4 md:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900">All Users</h3>
                    <p className="text-xs text-slate-600">
                      {users.filter(u => u.uid !== user?.uid).length} total • {onlineUsers.filter(email => email !== user?.email).length} online
                    </p>
                  </div>
                </div>
              </div>
<ul className="flex-1 min-h-0 overflow-y-auto space-y-2 px-3 md:px-4 py-3 custom-scrollbar">
  {/* Show loading skeleton while fetching users */}
  {authLoading || users.length === 0 ? (
    <div className="space-y-2 animate-fadeIn">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl bg-white bg-opacity-50 animate-pulse">
          <div className="w-9 md:w-10 h-9 md:h-10 bg-linear-to-br from-gray-200 to-gray-300 rounded-full shrink-0"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  ) : users.filter(u => u.uid !== user?.uid).length === 0 ? (
    <li className="text-center py-8 text-gray-500 text-sm animate-fadeIn">
      <div className="w-16 h-16 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      <p className="font-medium text-gray-600">No users found</p>
      <p className="text-xs text-gray-500 mt-1">Check back later</p>
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
            className={`group flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl transition-all duration-200 cursor-pointer animate-fadeIn ${
              isActive
                ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg border-2 border-indigo-400'
                : 'bg-white bg-opacity-50 hover:bg-opacity-80 border border-transparent hover:border-indigo-200'
            }`}
          >
            <div className="relative shrink-0">
              <div className={`w-9 md:w-10 h-9 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                isActive ? 'bg-white text-indigo-600' : 'bg-linear-to-br from-indigo-500 to-purple-500 text-white'
              }`}>
                {(u.username || u.email)?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
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

            {isActive && <div className="text-white text-xs font-bold">●</div>}
          </li>
        );
      })
  )}
</ul>
            </div>

            {/* Chat Area */}
            <div className={`lg:col-span-3 flex flex-col min-h-0 ${showSidebarOnMobile && activeRoomId ? 'hidden lg:flex' : 'flex'}`}>
              {/* Mobile Back Button */}
              {activeRoomId && activeChatUser && (
                <div className="lg:hidden bg-linear-to-r from-indigo-600 to-purple-600 text-white p-3 flex items-center gap-3 border-b border-indigo-700 shrink-0">
                  <button
                    onClick={handleBackToUsers}
                    className="w-9 h-9  bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9  bg-opacity-20 rounded-full flex items-center justify-center font-semibold text-sm">
                      {(activeChatUser.username || activeChatUser.email)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm">{activeChatUser.username || activeChatUser.email}</p>
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Chat;
