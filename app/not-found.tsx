import Logo from "@/components/Logo";
import Link from "next/link";
import React from "react";
import { Home, HelpCircle, Mail, ArrowRight } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-20 overflow-hidden">
      {/* Subtle background accent – solid color, no gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] right-[-120px] w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-120px] w-80 h-80 bg-red-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl mx-auto text-center">
        {/* Logo – placed at top */}
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        {/* Main 404 display – clean, professional, no gradient */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-8xl md:text-9xl font-bold text-indigo-600 tracking-tight">
            404
          </h1>
          <div className="h-1 w-20 rounded bg-indigo-500 my-5 md:my-7" />
          <p className="text-2xl md:text-3xl font-bold text-gray-800">
            Seite nicht gefunden
          </p>
          <p className="text-sm md:text-base mt-4 text-gray-500 max-w-md mx-auto">
            Die von Ihnen aufgerufene Seite existiert nicht mehr, wurde umbenannt
            oder ist vorübergehend nicht erreichbar.
          </p>
        </div>

        {/* Action buttons – solid red & blue, no gradients */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200 active:scale-95 shadow-sm w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Zur Startseite</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-all duration-200 active:scale-95 shadow-sm w-full sm:w-auto"
          >
            <Mail className="w-4 h-4" />
            <span>Kontakt</span>
          </Link>
        </div>

        {/* Additional link – Hilfe as secondary action */}
        <div className="mt-6">
          <Link
            href="/hilfe"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors hover:underline underline-offset-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Hilfe</span>
          </Link>
        </div>

        {/* Decorative dots – clean accent */}
        <div className="flex justify-center gap-2 mt-8">
          <span className="w-2 h-2 rounded-full bg-blue-400/70" />
          <span className="w-2 h-2 rounded-full bg-indigo-400/70" />
          <span className="w-2 h-2 rounded-full bg-red-400/70" />
          <span className="w-2 h-2 rounded-full bg-blue-400/70" />
          <span className="w-2 h-2 rounded-full bg-red-400/70" />
        </div>

        {/* Small footer note (optional, mature & minimal) */}
        <p className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} – Alle Rechte vorbehalten
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;