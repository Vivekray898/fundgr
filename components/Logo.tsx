import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Store } from "lucide-react";

interface LogoProps {
  logoData?: {
    image?: {
      asset?: {
        url?: string;
      };
    };
    alt?: string;
    width?: number;
    height?: number;
  };
}

const Logo = ({ logoData }: LogoProps) => {
  const logoUrl = logoData?.image?.asset?.url;
  const alt = logoData?.alt || "Logo";
  const width = logoData?.width || 180;
  const height = logoData?.height || 50;

  return (
    <Link href="/" className="flex items-center gap-2">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={alt}
          width={width}
          height={height}
          className="w-auto h-auto"
          priority
        />
      ) : (
        <div className="flex items-center gap-2">
          <Store className="w-8 h-8 text-rose-600" />
          <span className="text-xl font-bold text-rose-700">Fundgrube</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;