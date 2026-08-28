// components/DealsPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import Container from "./Container";
import DealsSection from "./deals/DealsSection";
import DealsNavigation from "./deals/DealsNavigation";
import ThemesSection from "./deals/ThemesSection";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";
import CategoryGrid from "./sortiment/CategoryGrid";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  images?: any[];
  price: number;
  discount: number;
  originalPrice?: number;
  isDeal?: boolean;
  dealEndDate?: string;
  status?: string;
}

interface Category {
  _id: string;
  title: string;
  slug?: { current: string } | string;
  image?: string;
  teaserSubtitle?: string;
  description?: string;
  categoryIcon?: string;
  isSeasonal?: boolean;
  productCount?: number;
}

interface DealsPageProps {
  dealProducts: Product[];
  newProducts: Product[];
  hotProducts: Product[];
  featuredCategories: Category[];
  seasonalCategories: Category[];
}

const DealsPage = ({ 
  dealProducts, 
  newProducts, 
  hotProducts, 
  featuredCategories,
  seasonalCategories 
}: DealsPageProps) => {
  const { enabled } = useCatalogueMode();
  const [activeSection, setActiveSection] = useState("all");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = enabled 
        ? ["all", "kategorien", "neuheiten", "saisonal"]
        : ["all", "angebote", "neuheiten", "top", "kategorien", "saisonal"];
      
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled]);

  return (
    <div className="bg-white min-h-screen">
      <DealsNavigation activeSection={activeSection} onNavigate={scrollToSection} />
      
      <Container className="py-4 sm:py-6 md:py-8">
        {/* Hero */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              {enabled ? "Unsere Produktwelten" : "Unsere Angebote"}
            </span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            {enabled 
              ? "Entdecken Sie unsere vielfältigen Produktkategorien" 
              : "Entdecken Sie unsere besten Deals und Neuheiten"}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          {!enabled && (
            <DealsSection
              id="angebote"
              title="Aktuelle Angebote"
              description="Unsere besten Deals für Sie"
              products={dealProducts}
              linkHref="/shop?deal=true"
            />
          )}

          <DealsSection
            id="neuheiten"
            title="Neuheiten"
            description="Entdecken Sie unsere neuesten Produkte"
            products={newProducts}
            linkHref="/shop?status=new"
            showViewAll={!enabled}
          />

          {!enabled && (
            <DealsSection
              id="top"
              title="Top-Angebote"
              description="Unsere meistverkauften Produkte"
              products={hotProducts}
              linkHref="/shop?status=hot"
            />
          )}

          {/* Featured Categories */}
          {(featuredCategories?.length > 0) && (
            <section id="kategorien" className="scroll-mt-24">
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {enabled ? "Unsere Kategorien" : "Beliebte Kategorien"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                  {enabled 
                    ? "Entdecken Sie unsere vielfältigen Produktwelten" 
                    : "Entdecken Sie unsere beliebtesten Kategorien"}
                </p>
              </div>
              <CategoryGrid categories={featuredCategories} />
            </section>
          )}

          {/* Seasonal Categories */}
          {(seasonalCategories?.length > 0) && (
            <ThemesSection themes={seasonalCategories} />
          )}
        </div>
      </Container>
    </div>
  );
};

export default DealsPage;