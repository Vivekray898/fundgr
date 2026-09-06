// app/layout.tsx
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { CatalogueProvider } from "@/components/providers/CatalogueSettingsProvider";
import { getSettings } from "@/sanity/queries/settings";
import type { Metadata } from "next";
import OptimonkScript from "@/components/OptimonkScript";
import { Providers } from "./providers";
import LoadingWrapper from "@/components/LoadingWrapper";

export const metadata: Metadata = {
  title: {
    template: "%s - FundGrube BestPreis - Markenprodukte günstig kaufen",
    default: "FundGrube BestPreis - Markenprodukte günstig kaufen",
  },
  description: "Ihr zuverlässiger Partner für zertifizierte Originalmarken. Maßgeschneiderte Bestellungen in Blieskastel & Zweibrücken.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const catalogueSettings = settings?.catalogueMode || null;

  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <ClerkProvider>
          <Providers>
            <CatalogueProvider initialSettings={catalogueSettings}>
              <LoadingWrapper delay={500}>
                {children}
              </LoadingWrapper>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "#000000",
                    color: "#fff",
                  },
                }}
              />
            </CatalogueProvider>
          </Providers>
        </ClerkProvider>
        
        <OptimonkScript />
      </body>
    </html>
  );
}