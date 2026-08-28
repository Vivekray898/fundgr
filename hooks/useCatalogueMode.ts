// hooks/useCatalogueMode.ts
import { useEffect, useState } from "react";
import { getSettings } from "@/sanity/queries/settings";

interface CatalogueSettings {
  enabled: boolean;
  pricePlaceholder: string;
  productCardCta: string;
  productPageCta: string;
}

export const useCatalogueMode = () => {
  const [settings, setSettings] = useState<CatalogueSettings>({
    enabled: false,
    pricePlaceholder: "Preis im Markt erhältlich",
    productCardCta: "Details ansehen",
    productPageCta: "Bezugsquelle finden",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (data?.catalogueMode) {
          setSettings({
            enabled: data.catalogueMode.enabled || false,
            pricePlaceholder: data.catalogueMode.pricePlaceholder || "Preis im Markt erhältlich",
            productCardCta: data.catalogueMode.productCardCta || "Details ansehen",
            productPageCta: data.catalogueMode.productPageCta || "Bezugsquelle finden",
          });
        }
      } catch (error) {
        console.error("Error fetching catalogue settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { ...settings, loading };
};