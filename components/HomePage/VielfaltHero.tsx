// components/HomePage/VielfaltHero.tsx
"use client";

import React from "react";
import Link from "next/link";

const VielfaltHero = () => {
  return (
    <div className="bg-[#fcfaf7] border-b border-[#e5e3de]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1e1e1e] leading-tight">
            VIELFALT ZUM<br className="hidden sm:block" /> BESTEN PREIS.
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#3e3a33] mt-4 max-w-2xl mx-auto">
            Entdecken Sie unsere beiden Märkte und finden Sie attraktive Angebote für jeden Bedarf.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/category/fundgrube"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-[#1e1e1e] border-2 border-[#1e1e1e] hover:bg-[#1e1e1e] hover:text-white transition-all duration-300 text-center"
            >
              FundGrube entdecken
            </Link>
            <Link
              href="/category/bestpreis"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold bg-[#1e1e1e] text-white hover:bg-[#3a3a3a] transition-all duration-300 text-center"
            >
              BestPreis entdecken
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VielfaltHero;