// components/Loader.tsx
"use client";

import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-500">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#E8E3D8] rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#D4A853] rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-[#1a1a1a] tracking-wide">
            Laden...
          </p>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#D4A853] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#D4A853] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#D4A853] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce {
          animation: bounce 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;