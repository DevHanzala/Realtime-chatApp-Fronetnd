import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import { useEffect } from 'react';
import { MessageCircle, Users, Zap, Shield, ArrowRight } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              Real-Time Communication
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                Redefined
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-2 font-medium">
              Advanced Network Architecture & Protocol Implementation
            </p>
            <p className="text-base text-slate-500">
              Department of Computer Science • University of Karachi
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-20 hover:shadow-indigo-200 hover:shadow-opacity-50 transition-shadow duration-500">
            <div className="p-8 md:p-12">
              {/* Feature Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="group p-6 bg-linear-to-br from-indigo-50 to-blue-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Instant Delivery</h3>
                  <p className="text-sm text-slate-600">WebSocket-powered real-time message transmission with sub-100ms latency</p>
                </div>

                <div className="group p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Secure Protocol</h3>
                  <p className="text-sm text-slate-600">End-to-end encrypted communication ensuring data integrity and privacy</p>
                </div>

                <div className="group p-6 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Multi-User Support</h3>
                  <p className="text-sm text-slate-600">Scalable architecture supporting concurrent connections and sessions</p>
                </div>
              </div>

              {/* Project Description */}
              <div className="mb-10 p-6 bg-linear-to-r from-slate-50 to-indigo-50 rounded-2xl border border-indigo-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-8 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                  Technical Overview
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  This project implements a full-stack real-time communication system leveraging modern networking protocols 
                  and data transmission techniques. The architecture demonstrates practical applications of TCP/IP stack, 
                  WebSocket protocol for bidirectional communication, and RESTful API design patterns. Key implementations 
                  include connection management, message queuing, error handling, and network optimization strategies for 
                  enhanced performance and reliability.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link 
                  to="/register" 
                  className="group relative bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:shadow-indigo-500 hover:shadow-opacity-50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Link>

                <Link 
                  to="/login" 
                  className="group bg-white text-indigo-700 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Footer Info */}
              <div className="pt-8 border-t border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Course:</span> Data Communication and Networking – II
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Submission:</span> January 10, 2026
                  </div>
                </div>
                <p className="mt-4 text-center text-slate-500 text-sm">
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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;