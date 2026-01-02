import { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore.js';
import Message from './Message.jsx';
import { Send, Loader2, MessageSquare, Paperclip, X } from 'lucide-react';
import toast from 'react-hot-toast';
import MessageSkeleton from './MessageSkeleton.jsx';

const ChatBox = () => {
  const { messages, activeRoomId, sendMessage, emitTyping, typingUsers } = useChatStore();

  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const roomMessages = activeRoomId ? messages[activeRoomId] || [] : [];

  useEffect(() => {
    if (!activeRoomId) return;

    setIsLoadingMessages(true);
    const timer = setTimeout(() => {
      setIsLoadingMessages(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [activeRoomId]);

  useEffect(() => {
    if (isLoadingMessages) return;

    const t = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    return () => clearTimeout(t);
  }, [roomMessages.length, typingUsers.length, isLoadingMessages]);

  useEffect(() => {
    if (activeRoomId && !isLoadingMessages) {
      inputRef.current?.focus();
    }
  }, [activeRoomId, isLoadingMessages]);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !file) || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(text, file);
      setText('');
      setFile(null);
      emitTyping(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  if (!activeRoomId) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full text-gray-500 px-6 animate-fadeIn">
        <div className="w-16 md:w-20 h-16 md:h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 animate-bounce-slow shadow-lg">
          <MessageSquare className="w-8 md:w-10 h-8 md:h-10 text-indigo-600" />
        </div>
        <p className="text-base md:text-lg font-semibold text-gray-700 mb-1">No Chat Selected</p>
        <p className="text-sm text-gray-500 text-center">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 md:px-4 py-2 md:py-3 bg-linear-to-b from-slate-50 to-white custom-scrollbar">
        {isLoadingMessages ? (
          <MessageSkeleton />
        ) : roomMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-fadeIn">
            <div className="w-14 md:w-16 h-14 md:h-16 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <MessageSquare className="w-7 md:w-8 h-7 md:h-8 text-indigo-600" />
            </div>
            <p className="text-center text-gray-600 font-medium text-sm md:text-base">No messages yet</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Start the conversation!</p>
          </div>
        ) : (
          <>
            {roomMessages.map((msg, index) => (
              <Message key={`${msg.timestamp}-${index}`} msg={msg} />
            ))}

            {typingUsers.length > 0 && (
              <div className="flex items-start gap-2 px-1 py-2 animate-fadeInUp">
                <div className="flex items-center gap-2 bg-white rounded-2xl px-3 py-2 shadow-sm border border-gray-200">
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                    {typingUsers[0].charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium hidden sm:inline">
                    {typingUsers.length === 1 ? `${typingUsers[0]} is typing` : `${typingUsers.join(', ')} are typing`}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="shrink-0 border-t border-gray-200 p-2 md:p-3 bg-white shadow-lg">
        {/* File Preview */}
        {file && (
          <div className="mb-2 flex items-center gap-2 bg-linear-to-r from-indigo-50 to-purple-50 p-2 rounded-lg border border-indigo-200 animate-fadeIn">
            {file.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(file)} className="w-12 h-12 object-cover rounded-lg" alt="preview" />
            ) : (
              <div className="w-12 h-12 bg-linear-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Paperclip className="w-6 h-6 text-indigo-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="w-7 h-7 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || isLoadingMessages}
            className="w-9 h-9 bg-linear-to-br from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Paperclip className="w-4 h-4 text-indigo-600" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.zip,.mp4"
          />

          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              emitTyping(true);
            }}
            onBlur={() => emitTyping(false)}
            disabled={isSending || isLoadingMessages}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />

          <button
            type="submit"
            disabled={(!text.trim() && !file) || isSending || isLoadingMessages}
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-3 md:px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 md:gap-2 font-medium min-w-15 md:min-w-17.5"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline text-sm">Sending</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Send</span>
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
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

export default ChatBox;