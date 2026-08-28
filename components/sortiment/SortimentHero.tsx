// components/sortiment/SortimentHero.tsx
import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const SortimentHero = () => {
  return (
    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-blue-50 py-8 sm:py-12 md:py-16 lg:py-20 text-center border-b border-pink-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] sm:text-xs font-semibold rounded-full">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Entdecken Sie unsere Welt
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Unser Sortiment
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3 md:mt-4 max-w-2xl mx-auto px-2">
          Entdecken Sie unsere vielfältigen Produktkategorien für Ihr Zuhause, 
          Ihren Garten und Ihre Projekte.
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 mt-4 sm:mt-6">
          <span className="px-2.5 sm:px-3 py-1 bg-white/70 backdrop-blur-sm border border-pink-200 rounded-full text-[10px] sm:text-xs text-gray-600">
            🏠 Wohnen
          </span>
          <span className="px-2.5 sm:px-3 py-1 bg-white/70 backdrop-blur-sm border border-rose-200 rounded-full text-[10px] sm:text-xs text-gray-600">
            🌿 Garten
          </span>
          <span className="px-2.5 sm:px-3 py-1 bg-white/70 backdrop-blur-sm border border-blue-200 rounded-full text-[10px] sm:text-xs text-gray-600">
            🔧 Werkzeug
          </span>
        </div>
      </div>
    </div>
  );
};

export default SortimentHero;