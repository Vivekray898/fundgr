// components/WhatsAppButton.tsx
"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  whatsappUrl: string;
  label?: string;
  variant?: "button" | "contact";
  className?: string;
}

const WhatsAppButton = ({ 
  whatsappUrl, 
  label = "Fragen",
  variant = "button",
  className = ""
}: WhatsAppButtonProps) => {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {variant === "contact" ? (
        <div className="flex items-start gap-4 bg-green-600 rounded-xl px-4 py-4 hover:bg-green-700 transition-colors">
          <MessageCircle className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-base font-bold text-white">Fragen zum Produkt?</p>
            <p className="text-lg font-extrabold text-white underline">WhatsApp</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-sm font-semibold text-gray-700 hover:text-amber-800 transition-colors px-2 py-3 rounded-xl border-2 border-amber-200/60 hover:bg-amber-50 hover:border-amber-400 min-h-[56px] w-full">
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          <span className="whitespace-nowrap">{label}</span>
        </div>
      )}
    </a>
  );
};

export default WhatsAppButton;