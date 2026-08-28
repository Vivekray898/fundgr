// contexts/CatalogueContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSettings } from "@/sanity/queries/settings";

interface CatalogueSettings {
  enabled: boolean;
  pricePlaceholder: string;
  productCardCta: string;
  productPageCta: string;
}

interface CatalogueContextType extends CatalogueSettings {
  loading: boolean;
}

const defaultSettings: CatalogueSettings = {
  enabled: false,
  pricePlaceholder: "Preis im Markt erhältlich",
  productCardCta: "Details ansehen",
  productPageCta: "Bezugsquelle finden",
};

const CatalogueContext = createContext<CatalogueContextType>({
  ...defaultSettings,
  loading: true,
});

export const useCatalogueMode = () => {
  const context = useContext(CatalogueContext);
  if (!context) {
    throw new Error("useCatalogueMode must be used within a CatalogueProvider");
  }
  return context;
};

export const CatalogueProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [settings, setSettings] = useState<CatalogueContextType>({
    ...defaultSettings,
    loading: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (data?.catalogueMode) {
          setSettings({
            enabled: data.catalogueMode.enabled || false,
            pricePlaceholder: data.catalogueMode.pricePlaceholder || defaultSettings.pricePlaceholder,
            productCardCta: data.catalogueMode.productCardCta || defaultSettings.productCardCta,
            productPageCta: data.catalogueMode.productPageCta || defaultSettings.productPageCta,
            loading: false,
          });
        } else {
          setSettings({
            ...defaultSettings,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching catalogue settings:", error);
        setSettings({
          ...defaultSettings,
          loading: false,
        });
      }
    };

    fetchSettings();
  }, []);

  return (
    <CatalogueContext.Provider value={settings}>
      {children}
    </CatalogueContext.Provider>
  );
};