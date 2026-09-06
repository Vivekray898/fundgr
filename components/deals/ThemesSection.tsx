// components/deals/ThemesSection.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Clock, Eye } from "lucide-react";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";

interface Theme {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  description?: string;
  seasonalMessage?: string;
}

const ThemesSection = ({ themes }: { themes: Theme[] }) => {
  const { enabled } = useCatalogueMode();

  return (
    <section id="saisonal" className="mb-12 scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">
            {enabled ? "Saisonale Kategorien" : "Saisonale Artikel"}
          </h2>
          <p className="text-[#8A7A6A] text-sm mt-1">
            {enabled 
              ? "Entdecken Sie unsere saisonalen Kategorien" 
              : "Nur für begrenzte Zeit verfügbar"}
          </p>
        </div>
        <Link href="/sortiment" className="text-[#B8923A] hover:text-[#9A7A2A] text-sm font-medium transition-colors">
          Zu allen Kategorien →
        </Link>
      </div>

      {themes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <Link
              key={theme._id}
              href={`/category/${theme.slug}`}
              className="group block overflow-hidden rounded-lg border border-[#E8E3D8] hover:shadow-lg hover:border-[#D4A853] transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                {theme.image ? (
                  <Image
                    src={theme.image}
                    alt={theme.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F8F6F2] flex items-center justify-center">
                    {enabled ? (
                      <Eye className="w-12 h-12 text-[#D4A853]" />
                    ) : (
                      <Clock className="w-12 h-12 text-[#D4A853]" />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white">{theme.title}</h3>
                  <p className="text-sm text-white/80 line-clamp-2">
                    {theme.seasonalMessage || theme.description || `Entdecken Sie ${theme.title}`}
                  </p>
                  {enabled && (
                    <span className="inline-block mt-2 text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      Im Markt erhältlich
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-[#F8F6F2] rounded-lg border border-[#E8E3D8]">
          <Clock className="w-10 h-10 text-[#E8E3D8] mx-auto mb-2" />
          <p className="text-[#8A7A6A]">
            {enabled 
              ? "Keine saisonalen Kategorien verfügbar." 
              : "Keine saisonalen Artikel verfügbar."}
          </p>
        </div>
      )}
    </section>
  );
};

export default ThemesSection;