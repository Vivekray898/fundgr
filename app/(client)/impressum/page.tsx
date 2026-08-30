// app/(client)/impressum/page.tsx
import React from "react";
import Container from "@/components/Container";
import Link from "next/link";
import { Building, Mail, Phone, MapPin, ExternalLink, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Impressum - FundGrube BestPreis",
  description: "Impressum der FundGrube BestPreis - Sonderpostenmarkt und Best Preis.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const ImpressumPage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-6 md:py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-3 md:px-0">
          {/* Header - Mobile Optimized */}
          <div className="mb-6 md:mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 mb-3 md:mb-4">
              <Building className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Impressum</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">Angaben gemäß § 5 TMG</p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-10 space-y-4 md:space-y-6">
              {/* Company Name */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-2">Fundgrube Sonderpostenmarkt &amp; Best Preis</h2>
                <p className="text-xs md:text-sm text-gray-600">
                  <strong>Inhaber / Ansprechpartner:</strong> Herr Harinder Singh
                </p>
              </div>

              {/* Locations */}
              <div className="space-y-1.5 md:space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">Standorte</h3>
                <div className="space-y-2.5 md:space-y-3">
                  <div className="border-l-4 border-blue-500 pl-3 md:pl-4">
                    <p className="font-medium text-gray-800 text-sm md:text-base">Blieskastel</p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Saar-Pfalz-Straße 2b
                      <br />
                      66440 Blieskastel
                    </p>
                  </div>
                  <div className="border-l-4 border-rose-500 pl-3 md:pl-4">
                    <p className="font-medium text-gray-800 text-sm md:text-base">Zweibrücken</p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Fruchtmarktstraße 1
                      <br />
                      66482 Zweibrücken
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1.5 md:space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">Kontakt</h3>
                <div className="space-y-1.5 md:space-y-2">
                  <p className="flex items-center gap-2 md:gap-3 text-gray-600 text-xs md:text-sm">
                    <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                    <a href="tel:+4968039943760" className="hover:text-blue-600 break-all">+49 680 39943760</a>
                  </p>
                  <p className="flex items-center gap-2 md:gap-3 text-gray-600 text-xs md:text-sm">
                    <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                    <a href="mailto:fundgrube6@gmail.com" className="hover:text-blue-600 break-all">fundgrube6@gmail.com</a>
                  </p>
                  <p className="flex items-center gap-2 md:gap-3 text-gray-600 text-xs md:text-sm">
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                    <a href="https://www.fundgrube-bestpreis.de" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 break-all">
                      www.fundgrube-bestpreis.de
                    </a>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 md:pt-4 border-t border-gray-200 text-xs md:text-sm text-gray-500">
                <p>Stand: Januar 2026</p>
              </div>
            </div>
          </div>

          {/* Back link - Mobile Optimized */}
          <div className="mt-4 md:mt-6 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors text-sm md:text-base"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ImpressumPage;