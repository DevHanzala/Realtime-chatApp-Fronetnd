import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import { useEffect } from 'react';
import { MessageCircle, Users, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';

const Home = () => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/chat', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated background for loading */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="text-center relative z-10 animate-fadeInUp">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-slate-200 rounded-full mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          </div>
          <p className="text-xl font-semibold text-slate-900 mb-2">Loading Session...</p>
          <p className="text-sm text-slate-600">Please wait a moment</p>
          <div className="flex gap-2 justify-center mt-6">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-400"></div>
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
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 sm:w-72 h-64 sm:h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 sm:w-72 h-64 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-64 sm:w-72 h-64 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 sm:mb-6 shadow-lg transform hover:scale-110 hover:rotate-3 transition-all duration-300 animate-bounce-slow">
              <MessageCircle className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight animate-slideInLeft">
              Real-Time Communication
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 animate-gradient">
                Redefined
              </span>
            </h1>
            
            <p className="text-base sm:text-xl text-slate-600 mb-2 font-medium animate-slideInRight">
              Advanced Network Architecture & Protocol Implementation
            </p>
            <p className="text-sm sm:text-base text-slate-500 animate-fadeIn animation-delay-600">
              Department of Computer Science • University of Karachi
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-30 hover:shadow-indigo-200 transition-all duration-500 animate-fadeInUp animation-delay-300">
            <div className="p-6 sm:p-8 md:p-12">
              {/* Feature Grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="group p-4 sm:p-6 bg-linear-to-br from-indigo-50 to-blue-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-slideInUp animation-delay-400">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-linear-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Instant Delivery</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">WebSocket-powered real-time message transmission with sub-100ms latency</p>
                </div>

                <div className="group p-4 sm:p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-slideInUp animation-delay-500">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-linear-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Secure Protocol</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">End-to-end encrypted communication ensuring data integrity and privacy</p>
                </div>

                <div className="group p-4 sm:p-6 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-slideInUp animation-delay-600 sm:col-span-2 md:col-span-1">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <Users className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Multi-User Support</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Scalable architecture supporting concurrent connections and sessions</p>
                </div>
              </div>

              {/* Project Description */}
              <div className="mb-8 sm:mb-10 p-4 sm:p-6 bg-linear-to-r from-slate-50 to-indigo-50 rounded-2xl border border-indigo-100 animate-fadeIn animation-delay-700">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 sm:h-8 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                  Technical Overview
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  This project implements a full-stack real-time communication system leveraging modern networking protocols 
                  and data transmission techniques. The architecture demonstrates practical applications of TCP/IP stack, 
                  WebSocket protocol for bidirectional communication, and RESTful API design patterns. Key implementations 
                  include connection management, message queuing, error handling, and network optimization strategies for 
                  enhanced performance and reliability.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 animate-fadeInUp animation-delay-800">
                <Link 
                  to="/register" 
                  className="group relative bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl hover:shadow-indigo-500 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Link>

                <Link 
                  to="/login" 
                  className="group bg-white text-indigo-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Footer Info */}
              <div className="pt-6 sm:pt-8 border-t border-slate-200 animate-fadeIn animation-delay-900">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="text-slate-600 text-center md:text-left">
                    <span className="font-semibold text-slate-800">Course:</span> Data Communication and Networking – II
                  </div>
                  <div className="text-slate-600 text-center md:text-right">
                    <span className="font-semibold text-slate-800">Submission:</span> January 10, 2026
                  </div>
                </div>
                <p className="mt-3 sm:mt-4 text-center text-slate-500 text-xs sm:text-sm">
                  Developed by: <span className="font-medium text-slate-700">[Your Name]</span> • Roll No: <span className="font-medium text-slate-700">[Your Roll Number]</span>
                </p>
              </div>
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
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out 0.2s backwards;
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out 0.3s backwards;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
      `}</style>
    </div>
  );
};

export default Home;