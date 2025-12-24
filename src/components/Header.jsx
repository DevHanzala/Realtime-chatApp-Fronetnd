import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { MessageCircle, LogOut, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10  bg-opacity-20 rounded-xl flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 group-hover:scale-110">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold hidden sm:block">Real-Time Chat</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm bg-white font-medium text-slate-900 bg-opacity-90 px-4 py-2 rounded-lg backdrop-blur-sm">
                  👋 {user?.displayName || user?.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-white text-slate-900 bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white text-indigo-600 bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-white text-indigo-600 bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10  bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white border-opacity-20 animate-slideDown">
            {user ? (
              <div className="space-y-3">
                <div className="font-medium text-center bg-white text-slate-900 bg-opacity-90 px-4 py-3 rounded-lg">
                  👋 {user?.displayName || user?.email}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-slate-900 bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 bg-opacity-90 hover:bg-opacity-100 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 bg-opacity-90 hover:bg-opacity-100 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
