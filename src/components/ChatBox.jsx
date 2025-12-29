import { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore.js';
import Message from './Message.jsx';
import { Send, Loader2, MessageSquare } from 'lucide-react';

const ChatBox = () => {
  const { messages, activeRoomId, sendMessage, emitTyping, typingUsers } = useChatStore();

  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const roomMessages = activeRoomId ? messages[activeRoomId] || [] : [];

  // Simulate loading messages when room changes
  useEffect(() => {
    if (activeRoomId) {
      setIsLoadingMessages(true);
      const timer = setTimeout(() => {
        setIsLoadingMessages(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length, typingUsers.length]);

  useEffect(() => {
    if (activeRoomId && !isLoadingMessages) {
      inputRef.current?.focus();
    }
  }, [activeRoomId, isLoadingMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(text);
      setText('');
      emitTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  if (!activeRoomId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 px-6 animate-fadeIn">
        <div className="w-16 md:w-20 h-16 md:h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 animate-bounce-slow shadow-lg">
          <MessageSquare className="w-8 md:w-10 h-8 md:h-10 text-indigo-600" />
        </div>
        <p className="text-base md:text-lg font-semibold text-gray-700 mb-1">No Chat Selected</p>
        <p className="text-sm text-gray-500 text-center">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-linear-to-b from-slate-50 to-white">
      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 md:px-4 py-3 md:py-4 space-y-3">
        {isLoadingMessages ? (
          <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm font-medium text-slate-700">Loading messages...</p>
            <div className="flex gap-2 justify-center mt-4">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        ) : roomMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-fadeIn">
            <div className="w-14 md:w-16 h-14 md:h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
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

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 px-2 md:px-4 py-2 animate-fadeInUp">
                <div className="flex items-center gap-2 md:gap-3 bg-white rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-sm border border-gray-200">
                  <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                    {typingUsers[0].charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium hidden sm:inline">
                    {typingUsers.length === 1
                      ? `${typingUsers[0]} is typing`
                      : `${typingUsers.join(', ')} are typing`}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 md:p-4 bg-white shadow-lg">
        <div className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
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
            className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm md:text-base"
          />
          <button
            type="submit"
            disabled={!text.trim() || isSending || isLoadingMessages}
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-3 md:px-6 py-2.5 md:py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium min-w-17.5 md:min-w-25"
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
          animation: fadeIn 0.4s ease-out;
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
      `}</style>
    </div>
  );
};

export default ChatBox;
