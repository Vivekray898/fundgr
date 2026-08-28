// components/deals/DealsHero.tsx
import React from "react";
import { Tag, Sparkles, Package, Clock } from "lucide-react";

const DealsHero = () => {
  return (
    <div className="relative bg-gradient-to-r from-rose-500 to-orange-500 py-10 sm:py-14">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Angebote & Aktionen
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
            Entdecken Sie unsere aktuellen Deals, Schnäppchen und Saisonangebote
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealsHero;