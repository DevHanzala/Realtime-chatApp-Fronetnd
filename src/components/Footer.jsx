import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-700  py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-300">
          © 2025 University of Karachi - DCN-II Lab Project | 
          Real-Time Chat Application System
        </p>
        <p className="text-xs text-gray-200 mt-1 flex items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse inline" /> 
          for Learning
        </p>
      </div>
    </footer>
  );
};

export default Footer;