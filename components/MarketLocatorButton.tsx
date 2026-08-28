// components/MarketLocatorButton.tsx
"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { MapPin, ExternalLink, Phone, Clock, Loader2, ChevronRight, Store, Navigation } from "lucide-react";
import { getBrandWithLocation } from "@/sanity/queries/settings";
import { useEffect, useState } from "react";

interface MarketLocatorButtonProps {
  brandSlug?: string;
  brandName?: string;
  label?: string;
  className?: string;
  variant?: "default" | "compact" | "floating";
}

interface MarketLocation {
  name: string;
  address: string;
  googleMapsUrl: string;
  phone: string;
  openingHours: string;
  additionalInfo?: string;
}

const MarketLocatorButton = ({ 
  brandSlug, 
  brandName,
  label = "Bezugsquelle finden",
  className,
  variant = "default"
}: MarketLocatorButtonProps) => {
  const [location, setLocation] = useState<MarketLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (brandSlug) {
      const fetchLocation = async () => {
        setLoading(true);
        setError(false);
        try {
          const brand = await getBrandWithLocation(brandSlug);
          if (brand?.marketLocation && brand.marketLocation.googleMapsUrl) {
            setLocation(brand.marketLocation);
          } else {
            setError(true);
          }
        } catch (error) {
          console.error("Error fetching brand location:", error);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchLocation();
    } else {
      setError(true);
    }
  }, [brandSlug]);

  const handlePhoneCall = () => {
    if (location?.phone) {
      window.location.href = `tel:${location.phone.replace(/\s/g, '')}`;
    }
  };

  const handleOpenMaps = () => {
    if (location?.googleMapsUrl) {
      window.open(location.googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Loading State - Mobile Optimized
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center gap-2 py-3">
          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
          <span className="text-sm text-gray-400">Lade Marktinformationen...</span>
        </div>
      </div>
    );
  }

  // Error State - Mobile Optimized
  if (error || !location || !location.googleMapsUrl) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200 rounded-xl px-3 py-2.5">
          <Store className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 flex-1">
            {brandName ? `Keine Marktinformationen für ${brandName}` : "Keine Marktinformationen verfügbar"}
          </p>
        </div>
      </div>
    );
  }

  // Compact Variant - For cards and lists
  if (variant === "compact") {
    return (
      <button
        onClick={handleOpenMaps}
        className="w-full flex items-center justify-between bg-transparent border border-gray-200 rounded-xl px-3 py-2.5 active:bg-gray-50 transition-all duration-200"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            {location.name && (
              <p className="text-xs text-gray-400 truncate max-w-[120px]">{location.name}</p>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </button>
    );
  }

  // Floating Variant - Bottom sheet style
  if (variant === "floating") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-3 safe-area-padding animate-slide-up">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={handleOpenMaps}
            className="flex-1 bg-emerald-500 text-white font-medium rounded-xl py-3 px-4 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50"
          >
            <Navigation className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </button>
          {location.phone && (
            <button
              onClick={handlePhoneCall}
              className="border border-gray-200 rounded-xl p-3 active:bg-gray-50 transition-all duration-200"
              aria-label="Call store"
            >
              <Phone className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default Variant - Elegant hollow/outline design
  return (
    <div className="w-full space-y-2.5">
      {/* Main Action Button - Hollow/Outline Design */}
      <button
        onClick={handleOpenMaps}
        className={cn(
          "w-full flex items-center justify-between",
          "border-2 border-emerald-200 hover:border-emerald-400",
          "bg-transparent hover:bg-emerald-50/50",
          "rounded-xl px-4 py-3",
          "active:scale-[0.98] transition-all duration-200",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            {location.name && (
              <p className="text-xs text-gray-400">{location.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-500">
          <span className="text-xs font-medium">Finden</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </button>

      {/* Location Details - Expandable with hollow design */}
      <div className="border border-gray-100 rounded-xl overflow-hidden bg-white/50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-3 py-2.5 active:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Marktinformationen</span>
          </div>
          <ChevronRight 
            className={cn(
              "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
              isExpanded && "rotate-90"
            )}
          />
        </button>

        {isExpanded && (
          <div className="px-3 pb-3 space-y-2 animate-fade-in">
            {/* Location Name & Address */}
            <div className="flex items-start gap-2.5 bg-gray-50/50 rounded-lg px-3 py-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Store className="w-3 h-3 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700">{location.name}</p>
                {location.address && (
                  <p className="text-xs text-gray-400">{location.address}</p>
                )}
              </div>
            </div>

            {/* Phone - Clean action */}
            {location.phone && (
              <button
                onClick={handlePhoneCall}
                className="w-full flex items-center gap-2.5 bg-gray-50/50 rounded-lg px-3 py-2.5 active:bg-gray-100/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 h-3 text-blue-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs text-gray-400">Anrufen</p>
                  <p className="text-xs font-medium text-gray-700">{location.phone}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-300" />
              </button>
            )}

            {/* Opening Hours */}
            {location.openingHours && (
              <div className="flex items-start gap-2.5 bg-gray-50/50 rounded-lg px-3 py-2.5">
                <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Öffnungszeiten</p>
                  <p className="text-xs text-gray-600 whitespace-pre-line">{location.openingHours}</p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {location.additionalInfo && (
              <div className="bg-amber-50/50 border border-amber-100 rounded-lg px-3 py-2">
                <p className="text-xs text-amber-600">{location.additionalInfo}</p>
              </div>
            )}

            {/* Google Maps Action - Hollow button */}
            <button
              onClick={handleOpenMaps}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 active:bg-gray-50 transition-all duration-200"
            >
              <Navigation className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">In Google Maps öffnen</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketLocatorButton;