// components/NoAccess.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./Logo";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Lock, Sparkles } from "lucide-react";

const NoAccess = ({
  details = "Log in to view your cart items and checkout. Don't miss out on your favorite products!",
}: {
  details?: string;
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] sm:min-h-[70vh] py-8 sm:py-12 md:py-16 bg-gradient-to-br from-rose-50 via-pink-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-4 sm:p-6 md:p-8 border-pink-100 shadow-xl shadow-pink-100/30 rounded-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex items-center flex-col space-y-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 rounded-full blur-xl opacity-20"></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center border-2 border-pink-100">
              <Lock className="w-8 h-8 text-rose-500" />
            </div>
          </div>
          <Logo />
          <div className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Willkommen zurück!
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 mt-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-lg border border-pink-100">
            <Sparkles className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <p className="text-center text-sm text-gray-600">{details}</p>
          </div>

          <SignInButton mode="modal">
            <Button 
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-200/50 hover:shadow-rose-300/50 transition-all duration-300" 
              size="lg"
            >
              Anmelden
            </Button>
          </SignInButton>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 mt-2">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Neu hier?
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
          </div>

          <SignUpButton mode="modal">
            <Button 
              variant="outline" 
              className="w-full border-2 border-pink-200 hover:border-rose-300 hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition-all duration-300" 
              size="lg"
            >
              Konto erstellen
            </Button>
          </SignUpButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;