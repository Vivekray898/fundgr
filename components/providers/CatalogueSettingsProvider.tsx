// components/providers/CatalogueSettingsProvider.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

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

// This component receives settings as props from a server component
export const CatalogueProvider = ({ 
  children,
  initialSettings
}: { 
  children: React.ReactNode;
  initialSettings?: CatalogueSettings | null;
}) => {
  const [settings, setSettings] = useState<CatalogueContextType>({
    ...defaultSettings,
    loading: !initialSettings,
  });

  useEffect(() => {
    if (initialSettings) {
      setSettings({
        ...initialSettings,
        loading: false,
      });
    }
  }, [initialSettings]);

  return (
    <CatalogueContext.Provider value={settings}>
      {children}
    </CatalogueContext.Provider>
  );
};