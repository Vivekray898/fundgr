// app/not-found.tsx (or app/not-found/page.tsx depending on your structure)
import Logo from "@/components/Logo";
import Link from "next/link";
import React from "react";
import { Home, HelpCircle, Mail, ArrowRight } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-20 overflow-hidden">
      {/* Subtle background accent – warm amber tones */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] right-[-120px] w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-120px] w-80 h-80 bg-amber-300/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl mx-auto text-center">
        {/* Logo – placed at top */}
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        {/* Main 404 display – warm amber */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-8xl md:text-9xl font-bold text-[#D4A853] tracking-tight">
            404
          </h1>
          <div className="h-1 w-20 rounded-full bg-[#D4A853] my-5 md:my-7" />
          <p className="text-2xl md:text-3xl font-bold text-[#1a1a1a]">
            Seite nicht gefunden
          </p>
          <p className="text-sm md:text-base mt-4 text-[#8A7A6A] max-w-md mx-auto">
            Die von Ihnen aufgerufene Seite existiert nicht mehr, wurde umbenannt
            oder ist vorübergehend nicht erreichbar.
          </p>
        </div>

        {/* Action buttons – solid amber/black */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-md transition-all duration-200 active:scale-95 shadow-sm w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Zur Startseite</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-[#D4A853] hover:bg-[#c49a3a] rounded-md transition-all duration-200 active:scale-95 shadow-sm w-full sm:w-auto"
          >
            <Mail className="w-4 h-4" />
            <span>Kontakt</span>
          </Link>
        </div>

        {/* Additional link – Hilfe as secondary action */}
        <div className="mt-6">
          <Link
            href="/hilfe"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#B8923A] hover:text-[#9A7A2A] transition-colors hover:underline underline-offset-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Hilfe</span>
          </Link>
        </div>

        {/* Decorative dots – warm amber tones */}
        <div className="flex justify-center gap-2 mt-8">
          <span className="w-2 h-2 rounded-full bg-[#D4A853]/70" />
          <span className="w-2 h-2 rounded-full bg-[#B8923A]/70" />
          <span className="w-2 h-2 rounded-full bg-[#D4A853]/50" />
          <span className="w-2 h-2 rounded-full bg-[#B8923A]/70" />
          <span className="w-2 h-2 rounded-full bg-[#D4A853]/70" />
        </div>

        {/* Small footer note */}
        <p className="mt-8 text-xs text-[#8A7A6A]">
          © {new Date().getFullYear()} – Alle Rechte vorbehalten
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;