import { useEffect, useRef } from 'react';
import useAuthStore from '../store/authStore.js';
import useChatStore from '../store/chatStore.js';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox.jsx';
import toast from 'react-hot-toast';
import { LogOut, Users, Wifi, WifiOff, MessageCircle } from 'lucide-react';

const Chat = () => {
  const { user, logout } = useAuthStore();
  const { connectSocket, disconnectSocket, onlineUsers, socketConnected, error } = useChatStore();
  const navigate = useNavigate();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!user) return;
    connectSocket();

    if (socketConnected && !hasShownToast.current) {
      toast.success('Connected to chat!', { duration: 3000 });
      hasShownToast.current = true;
    }

    return () => disconnectSocket();
  }, [user, socketConnected]);

  useEffect(() => {
    if (error) toast.error(`Chat error: ${error}`);
  }, [error]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-20 mb-6">
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white text-black bg-opacity-20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Real-Time Chat Room</h2>
                  <p className="text-indigo-100 text-sm mt-1 flex items-center gap-2">
                    <span>Welcome, {user?.displayName || user?.email}</span>
                    {socketConnected ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-500 bg-opacity-30 px-2 py-1 rounded-full">
                        <Wifi className="w-3 h-3" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-red-500 bg-opacity-30 px-2 py-1 rounded-full">
                        <WifiOff className="w-3 h-3" />
                        Disconnected
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="group bg-white text-black bg-opacity-20 hover:bg-opacity-30 px-6 py-2.5 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 backdrop-blur-sm border border-white border-opacity-30 hover:border-opacity-50"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-[calc(100vh-200px)]">
            {/* Online Users Sidebar */}
            <div className="lg:col-span-1 bg-linear-to-br from-slate-50 to-indigo-50 p-6 border-r border-slate-200 overflow-y-auto">
              <div className="sticky top-0 bg-linear-to-br from-slate-50 to-indigo-50 pb-4 mb-4 border-b border-slate-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Active Users</h3>
                    <p className="text-xs text-slate-600">{onlineUsers.length} online now</p>
                  </div>
                </div>
              </div>

              <ul className="space-y-2">
                {onlineUsers.map((u) => (
                  <li 
                    key={u} 
                    className="group flex items-center gap-3 p-3 rounded-xl bg-white bg-opacity-50 hover:bg-opacity-80 transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-200"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {u.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {u}
                      </p>
                      <p className="text-xs text-slate-500">Active now</p>
                    </div>
                  </li>
                ))}
                {onlineUsers.length === 0 && (
                  <li className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No users online</p>
                    <p className="text-slate-400 text-xs mt-1">Be the first to start chatting!</p>
                  </li>
                )}
              </ul>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 flex flex-col h-full">
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