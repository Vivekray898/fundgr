import Logo from "@/components/Logo";
import Link from "next/link";
import React from "react";
import { Home, HelpCircle, Mail, ArrowRight } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-blue-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-32 overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-gradient-to-br from-blue-200/20 to-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-rose-100/10 to-pink-100/10 rounded-full blur-3xl" />

      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo />

          {/* 404 Badge */}
          <div className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg">
            <span className="text-white font-bold text-sm tracking-wider">404</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold text-gray-800">
            Looking for something?
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
            We&apos;re sorry. The Web address you entered is not a functioning
            page on our site.
          </p>
        </div>

        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400/30 to-pink-400/30 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
              <svg 
                className="w-14 h-14 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Go to home page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/help"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-rose-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-rose-50 hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300 transition-all duration-300"
            >
              <HelpCircle className="w-4 h-4 text-rose-400" />
              <span>Help</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-all duration-300"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Contact</span>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need more help? Visit our{" "}
            <Link
              href="/help"
              className="font-medium text-rose-500 hover:text-rose-600 transition-colors hover:underline underline-offset-2"
            >
              Help Center
            </Link>
          </p>
        </div>

        {/* Footer Decorative */}
        <div className="flex justify-center gap-3 mt-4">
          <span className="w-2 h-2 rounded-full bg-rose-400/60" />
          <span className="w-2 h-2 rounded-full bg-pink-400/60" />
          <span className="w-2 h-2 rounded-full bg-blue-400/60" />
          <span className="w-2 h-2 rounded-full bg-rose-400/60" />
          <span className="w-2 h-2 rounded-full bg-pink-400/60" />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;