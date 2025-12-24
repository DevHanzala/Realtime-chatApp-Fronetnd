import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-white font-medium mb-2">
          © 2025 University of Karachi - DCN-II Lab Project
        </p>
        <p className="text-xs text-indigo-100 mb-3">
          Real-Time Chat Application System
        </p>
        <p className="text-xs text-white flex items-center justify-center gap-1.5">
          Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse inline" /> 
          for Learning
        </p>
      </div>
    </footer>
  );
};

export default Footer;