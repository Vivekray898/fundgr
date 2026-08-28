// components/deals/DealsNavigation.tsx
"use client";
import React from "react";
import { Tag, Sparkles, Star, Package, Clock, Eye } from "lucide-react";
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
    { id: "all", label: "Alle Kategorien", icon: Package },
    { id: "kategorien", label: "Kategorien", icon: Tag },
    { id: "neuheiten", label: "Neuheiten", icon: Sparkles },
    { id: "saisonal", label: "Saisonal", icon: Clock },
  ] : [
    { id: "all", label: "Alle Angebote", icon: Tag },
    { id: "angebote", label: "Angebote", icon: Tag },
    { id: "neuheiten", label: "Neuheiten", icon: Sparkles },
    { id: "top", label: "Top-Angebote", icon: Star },
    { id: "kategorien", label: "Kategorien", icon: Package },
    { id: "saisonal", label: "Saisonale Artikel", icon: Clock },
  ];

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {navigationLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                activeSection === link.id
                  ? "bg-rose-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsNavigation;