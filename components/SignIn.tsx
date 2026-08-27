"use client";
import { SignInButton } from "@clerk/nextjs";
import React from "react";
import { User } from "lucide-react";

const SignIn = () => {
  return (
    <SignInButton mode="modal">
      <button 
        className="p-1.5 lg:p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-1.5"
        aria-label="Anmelden"
      >
        <User className="w-5 h-5 text-gray-600 hover:text-shop_light_green transition-colors" />
        <span className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-shop_light_green transition-colors">
          Anmelden
        </span>
      </button>
    </SignInButton>
  );
};

export default SignIn;