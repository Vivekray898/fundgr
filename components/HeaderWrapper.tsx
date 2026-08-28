// components/HeaderWrapper.tsx
"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the header with no SSR
const HeaderClient = dynamic(() => import("./HeaderClient"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200"></div>
    </div>
  ),
});

const HeaderWrapper = () => {
  return (
    <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse"></div>}>
      <HeaderClient />
    </Suspense>
  );
};

export default HeaderWrapper;