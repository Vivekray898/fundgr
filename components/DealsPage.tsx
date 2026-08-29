// components/DealsPage.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Container from "./Container";
import DealsSection from "./deals/DealsSection";
import DealsNavigation from "./deals/DealsNavigation";
import ThemesSection from "./deals/ThemesSection";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";
import CategoryGrid from "./sortiment/CategoryGrid";
import { Category, Product } from "@/sanity.types";

interface DealsPageProps {
  dealProducts: Product[];
  newProducts: Product[];
  hotProducts: Product[];
  featuredCategories: Category[];
  seasonalCategories: any[];
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
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Helper to scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Height of sticky header + padding
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
      
      let currentSection = "all";
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            currentSection = id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled]);

  // Get all products for "all" section
  const getAllProducts = () => {
    const all = [...dealProducts, ...newProducts, ...hotProducts];
    // Remove duplicates by _id
    const unique = all.filter((product, index, self) => 
      index === self.findIndex((p) => p._id === product._id)
    );
    return unique;
  };

  const allProducts = getAllProducts();

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
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
          {/* All Products Section */}
          {allProducts.length > 0 && (
            <DealsSection
              id="all"
              title={enabled ? "Alle Produkte" : "Alle Angebote"}
              description={enabled ? "Entdecken Sie unsere gesamte Produktpalette" : "Alle aktuellen Angebote auf einen Blick"}
              products={allProducts as any} // Cast to any to avoid type mismatch
              linkHref="/shop"
              showViewAll={true}
            />
          )}

          {/* Deals Section - Only when catalogue mode is OFF */}
          {!enabled && dealProducts.length > 0 && (
            <DealsSection
              id="angebote"
              title="Aktuelle Angebote"
              description="Unsere besten Deals für Sie"
              products={dealProducts as any} // Cast to any
              linkHref="/shop?deal=true"
              showViewAll={true}
            />
          )}

          {/* New Products Section */}
          {newProducts.length > 0 && (
            <DealsSection
              id="neuheiten"
              title="Neuheiten"
              description="Entdecken Sie unsere neuesten Produkte"
              products={newProducts as any} // Cast to any
              linkHref="/shop?status=new"
              showViewAll={!enabled}
            />
          )}

          {/* Hot Products Section - Only when catalogue mode is OFF */}
          {!enabled && hotProducts.length > 0 && (
            <DealsSection
              id="top"
              title="Top-Angebote"
              description="Unsere meistverkauften Produkte"
              products={hotProducts as any} // Cast to any
              linkHref="/shop?status=hot"
              showViewAll={true}
            />
          )}

          {/* Featured Categories */}
          {featuredCategories?.length > 0 && (
            <section id="kategorien" className="scroll-mt-24 pt-4">
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
              {/* Cast to any to avoid type mismatch */}
              <CategoryGrid categories={featuredCategories as any} />
            </section>
          )}

          {/* Seasonal Categories */}
          {seasonalCategories?.length > 0 && (
            <section id="saisonal" className="scroll-mt-24">
              <ThemesSection themes={seasonalCategories} />
            </section>
          )}
        </div>
      </Container>
    </div>
  );
};

export default DealsPage;