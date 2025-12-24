import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore.js';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowLeft, UserPlus, Loader2 } from 'lucide-react';

const Register = () => {
  const { user, error, register, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
      setIsLoading(false);
    }
  }, [error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!username) {
      toast.error('Username is required');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, username);
      toast.success('Account created successfully!');
      navigate('/chat');
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 sm:w-72 h-64 sm:h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 sm:w-72 h-64 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-64 sm:w-72 h-64 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Main card */}
        <div className="bg-white bg-opacity-95 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-white border-opacity-30 hover:shadow-indigo-200 hover:shadow-opacity-50 transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg animate-bounce-slow">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-sm sm:text-base text-slate-600">Join our real-time communication platform</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username input */}
            <div className="relative animate-slideInLeft">
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Choose a username"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white bg-opacity-70 hover:bg-opacity-100 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                  required 
                />
              </div>
            </div>

            {/* Email input */}
            <div className="relative animate-slideInRight">
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white bg-opacity-70 hover:bg-opacity-100 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                  required 
                />
              </div>
            </div>

            {/* Password input */}
            <div className="relative animate-slideInLeft animation-delay-300">
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white bg-opacity-70 hover:bg-opacity-100 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                  required 
                />
              </div>
            </div>

            {/* Submit button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-xl hover:shadow-indigo-500 hover:shadow-opacity-50 transition-all duration-300 font-semibold transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <p className="text-center mt-8 text-sm sm:text-base text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Terms notice */}
        <p className="text-center mt-6 text-xs sm:text-sm text-slate-500 animate-fadeIn">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
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
          animation: fadeIn 0.6s ease-out;
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
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out 0.2s backwards;
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out 0.3s backwards;
        }
        .animation-delay-300 {
          animation-delay: 0.4s;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;
