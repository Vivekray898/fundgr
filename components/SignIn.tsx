"use client";
import { SignInButton } from "@clerk/nextjs";
import React from "react";
import { User } from "lucide-react";

const SignIn = () => {
  return (
    <SignInButton mode="modal">
      <button 
        className="p-1.5 lg:p-2 rounded-full hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 active:from-rose-100 active:to-pink-100 transition-all duration-200 flex items-center gap-1.5 group"
        aria-label="Anmelden"
      >
        <User className="w-5 h-5 text-gray-600 group-hover:text-rose-500 transition-colors" />
        <span className="hidden sm:inline text-sm font-medium text-gray-600 group-hover:text-rose-500 transition-colors">
          Anmelden
        </span>
      </button>
    </SignInButton>
  );
};

export default SignIn;