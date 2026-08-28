// app/layout.tsx
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { CatalogueProvider } from "@/components/providers/CatalogueSettingsProvider";
import { getSettings } from "@/sanity/queries/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - FundGrube-Bestpreis online store",
    default: "FundGrube-Bestpreis online store",
  },
  description: "FundGrube-Bestpreis online store, Your one stop shop for all your needs",
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
          <CatalogueProvider initialSettings={catalogueSettings}>
            {children}
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
        </ClerkProvider>
      </body>
    </html>
  );
}