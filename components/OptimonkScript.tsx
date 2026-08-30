// components/OptimonkScript.tsx
"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const ACCOUNT_ID = process.env.NEXT_PUBLIC_OPTIMONK_ACCOUNT_ID || "273301";

export default function OptimonkScript() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Get current hostname
    const hostname = window.location.hostname;
    
    // Allow all subdomains of fundgrube-bestpreis.de
    const isAllowedDomain = 
      hostname === "fundgrube-bestpreis.de" ||
      hostname.endsWith(".fundgrube-bestpreis.de") ||
      hostname === "localhost" || 
      hostname === "127.0.0.1";

    // Only load if on allowed domain
    if (isAllowedDomain) {
      setShouldLoad(true);
      // console.log(`✅ OptiMonk enabled for: ${hostname}`);
    } else {
      // console.log(`⏭️ OptiMonk disabled for: ${hostname}`);
    }
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Script
      id="optimonk"
      strategy="afterInteractive"
      src={`https://onsite.optimonk.com/script.js?account=${ACCOUNT_ID}`}
      async
      onLoad={() => {
        // console.log("✅ OptiMonk loaded successfully");
      }}
      onError={() => {
        // console.warn("⚠️ OptiMonk failed to load");
      }}
    />
  );
}