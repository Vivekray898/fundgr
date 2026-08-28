// components/deals/DealsNavigation.tsx
"use client";
import React from "react";
import { Tag, Sparkles, Star, Package, Clock, Eye, Home } from "lucide-react";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";

const DealsNavigation = ({ 
  activeSection, 
  onNavigate 
}: { 
  activeSection: string; 
  onNavigate: (id: string) => void;
}) => {
  const { enabled } = useCatalogueMode();

  const navigationLinks = enabled ? [
    { id: "all", label: "Alle Produkte", icon: Home },
    { id: "kategorien", label: "Kategorien", icon: Package },
    { id: "neuheiten", label: "Neuheiten", icon: Sparkles },
    { id: "saisonal", label: "Saisonal", icon: Clock },
  ] : [
    { id: "all", label: "Alle Angebote", icon: Home },
    { id: "angebote", label: "Angebote", icon: Tag },
    { id: "neuheiten", label: "Neuheiten", icon: Sparkles },
    { id: "top", label: "Top-Angebote", icon: Star },
    { id: "kategorien", label: "Kategorien", icon: Package },
    { id: "saisonal", label: "Saisonal", icon: Clock },
  ];

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-rose-100 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 sm:py-3 scrollbar-hide">
          {navigationLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 whitespace-nowrap ${
                activeSection === link.id
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200/50"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              }`}
            >
              <link.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsNavigation;