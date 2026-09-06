// components/sortiment/SortimentHero.tsx
import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const SortimentHero = () => {
  return (
    <div className="bg-[#F8F6F2] py-8 sm:py-12 md:py-16 lg:py-20 text-center border-b border-[#E8E3D8]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 bg-[#1a1a1a] text-white text-[10px] sm:text-xs font-semibold rounded-full">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Entdecken Sie unsere Welt
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a]">
          Unser Sortiment
        </h1>
        <p className="text-sm sm:text-base text-[#8A7A6A] mt-2 sm:mt-3 md:mt-4 max-w-2xl mx-auto px-2">
          Entdecken Sie unsere vielfältigen Produktkategorien für Ihr Zuhause, 
          Ihren Garten und Ihre Projekte.
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 mt-4 sm:mt-6">
          <span className="px-2.5 sm:px-3 py-1 bg-white/70 backdrop-blur-sm border border-[#E8E3D8] rounded-full text-[10px] sm:text-xs text-[#1a1a1a]">
            🏠 Wohnen
          </span>
          <span className="px-2.5 sm:px-3 py-1 bg-white/70 backdrop-blur-sm border border-[#E8E3D8] rounded-full text-[10px] sm:text-xs text-[#1a1a1a]">
            🌿 Garten
          </span>
          <span className="px-2.5 sm:px-3 py-1 bg-white/70 backdrop-blur-sm border border-[#E8E3D8] rounded-full text-[10px] sm:text-xs text-[#1a1a1a]">
            🔧 Werkzeug
          </span>
        </div>
      </div>
    </div>
  );
};

export default SortimentHero;