"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, 
  CheckCircle, 
  X, 
  Phone, 
  Mail, 
  Store, 
  ExternalLink, 
  ChevronLeft,
  Clock,
  Navigation,
  Search
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Store data from Sanity
interface StoreData {
  _id?: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  email: string;
  openingHours: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  distance?: string;
  isDefault?: boolean;
}

interface StoreLocatorSettings {
  title?: string;
  placeholder?: string;
  changeStoreText?: string;
  storePageText?: string;
  addressLabel?: string;
  contactLabel?: string;
  openingHoursLabel?: string;
  distanceLabel?: string;
  routeLabel?: string;
  noStoresFound?: string;
  backLabel?: string;
  stores?: StoreData[];
}

// Pure CSS placeholder - no images, no network requests
const StorePlaceholder = ({ name }: { name: string }) => (
  <div className="w-full h-full bg-gradient-to-br from-shop_light_green/20 to-shop_btn_dark_green/20 flex items-center justify-center">
    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
      <Store className="w-5 h-5 text-shop_btn_dark_green" />
    </div>
  </div>
);

interface StoreLocatorProps {
  trigger?: "button" | "link";
  className?: string;
  children?: React.ReactNode;
  onStoreChange?: (store: StoreData) => void;
  settings?: StoreLocatorSettings;
}

const StoreLocator = ({ 
  trigger = "button", 
  className = "", 
  children,
  onStoreChange,
  settings = {}
}: StoreLocatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [showStoreList, setShowStoreList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const offcanvasRef = useRef<HTMLDivElement>(null);

  // Get stores from settings
  const stores = settings?.stores || [];

  // Log stores for debugging
  console.log("StoreLocator settings:", settings);
  console.log("Stores received:", stores);

  // Merge settings with defaults
  const {
    title = "Mein Markt",
    placeholder = "Markt suchen...",
    changeStoreText = "Markt ändern",
    storePageText = "Zum Markt",
    addressLabel = "Adresse",
    contactLabel = "Kontakt",
    openingHoursLabel = "Öffnungszeiten",
    distanceLabel = "Entfernung",
    routeLabel = "Route planen",
    noStoresFound = "Keine Märkte gefunden",
    backLabel = "Zurück",
  } = settings;

  // Set default store
  useEffect(() => {
    if (stores.length > 0 && !selectedStore) {
      // Find default store or use first one
      const defaultStore = stores.find(s => s.isDefault) || stores[0];
      setSelectedStore(defaultStore);
      console.log("Default store set:", defaultStore);
    }
  }, [stores, selectedStore]);

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on click outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDesktop && isOpen && offcanvasRef.current && !offcanvasRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktop, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowStoreList(false);
    setSearchTerm("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowStoreList(false);
    setSearchTerm("");
  };

  const handleStoreSelect = (store: StoreData) => {
    setSelectedStore(store);
    setShowStoreList(false);
    setSearchTerm("");
    if (onStoreChange) {
      onStoreChange(store);
    }
  };

  const handleChangeStore = () => {
    setShowStoreList(true);
    setSearchTerm("");
  };

  const getMapsUrl = (store: StoreData) => {
    if (store.latitude && store.longitude) {
      return `https://maps.google.com/?q=${store.latitude},${store.longitude}`;
    }
    const address = `${store.address}, ${store.zip} ${store.city}`;
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  };

  const handleImageError = (storeName: string) => {
    setImageError(prev => ({ ...prev, [storeName]: true }));
  };

  const filteredStores = stores.filter(store => 
    store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTrigger = () => {
    if (children) {
      return (
        <button onClick={handleOpen} className={className}>
          {children}
        </button>
      );
    }

    if (trigger === "link") {
      return (
        <button
          onClick={handleOpen}
          className={`flex items-center gap-1.5 text-shop_light_green hover:text-shop_btn_dark_green hoverEffect ${className}`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{title}</span>
          <CheckCircle className="w-3 h-3 text-green-600" />
        </button>
      );
    }

    return (
      <button
        onClick={handleOpen}
        className={`flex items-center gap-1.5 text-sm text-gray-600 hover:text-shop_light_green active:bg-gray-100 rounded-full transition-colors px-2.5 py-1.5 ${className}`}
      >
        <MapPin className="w-4 h-4" />
        <span>{title}</span>
        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
      </button>
    );
  };

  // Render store list
  const renderStoreList = () => {
    if (stores.length === 0) {
      return (
        <div className="text-center py-8">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No stores available</p>
          <p className="text-xs text-gray-400 mt-1">Please add stores in Sanity</p>
        </div>
      );
    }

    if (filteredStores.length === 0) {
      return (
        <div className="text-center py-8">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">{noStoresFound}</p>
        </div>
      );
    }

    return filteredStores.map((store) => (
      <button
        key={store.name}
        onClick={() => handleStoreSelect(store)}
        className={`w-full text-left p-3 rounded-xl border transition-all active:scale-[0.98] ${
          selectedStore?.name === store.name
            ? "border-shop_light_green bg-green-50"
            : "border-gray-200 hover:border-shop_light_green/50 active:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            {store.image && !imageError[store.name] ? (
              <Image
                src={store.image}
                alt={store.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                onError={() => handleImageError(store.name)}
              />
            ) : (
              <StorePlaceholder name={store.name} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {store.name}
              </p>
              {store.distance && (
                <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                  {store.distance}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {store.address}, {store.city}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">
                {store.openingHours}
              </span>
            </div>
          </div>
          {selectedStore?.name === store.name && (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          )}
        </div>
      </button>
    ));
  };

  return (
    <>
      {renderTrigger()}

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[200] transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        {/* Panel */}
        <div
          ref={offcanvasRef}
          className={`
            absolute bg-white shadow-2xl transition-all duration-300 ease-in-out
            ${isDesktop 
              ? // Desktop: Right side panel
                `top-0 right-0 h-full w-full max-w-[480px] rounded-l-2xl ${
                  isOpen ? "translate-x-0" : "translate-x-full"
                }`
              : // Mobile: Bottom slide-up
                `bottom-0 left-0 right-0 max-h-[92vh] rounded-t-3xl ${
                  isOpen ? "translate-y-0" : "translate-y-full"
                }`
            }
          `}
          style={isDesktop ? {} : { maxHeight: "92vh" }}
        >
          {/* Desktop: Close button in header */}
          {isDesktop && (
            <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-100 flex items-center justify-between rounded-tl-2xl">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {title}
                </p>
                <p className="text-base font-bold text-gray-800 truncate">
                  {selectedStore?.name || "Markt auswählen"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Schließen"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}

          {/* Mobile: Drag Handle */}
          {!isDesktop && (
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
          )}

          {/* Mobile: Header */}
          {!isDesktop && (
            <div className="sticky top-0 bg-white z-10 px-4 pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {title}
                  </p>
                  <p className="text-base font-bold text-gray-800 truncate">
                    {selectedStore?.name || "Markt auswählen"}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 -mr-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {/* Body */}
          <div 
            className={`overflow-y-auto p-4 ${!isDesktop ? 'pb-28' : 'pb-6'}`}
            style={!isDesktop ? { maxHeight: "calc(92vh - 120px)" } : { maxHeight: "calc(100vh - 80px)" }}
          >
            {showStoreList ? (
              // Store List View
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 text-sm bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-shop_light_green focus:bg-white transition-all"
                    autoFocus
                  />
                </div>

                <button
                  onClick={() => setShowStoreList(false)}
                  className="flex items-center gap-2 text-sm font-medium text-shop_light_green hover:text-shop_btn_dark_green transition-colors mb-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{backLabel}</span>
                </button>

                <div className="space-y-2">
                  {renderStoreList()}
                </div>
              </div>
            ) : (
              // Selected Store View
              selectedStore ? (
                <div className="space-y-4">
                  {/* Store Image */}
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-shop_light_green/30 to-shop_btn_dark_green/30">
                    {selectedStore.image && !imageError[selectedStore.name] ? (
                      <Image
                        src={selectedStore.image}
                        alt={selectedStore.name}
                        width={400}
                        height={208}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(selectedStore.name)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Store className="w-16 h-16 text-shop_btn_dark_green/50 mx-auto mb-2" />
                          <p className="text-shop_btn_dark_green font-semibold text-lg">{selectedStore.name}</p>
                          <p className="text-shop_btn_dark_green/70 text-sm">{selectedStore.city}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded-xl p-3">
                      <Clock className="w-4 h-4 text-green-600 mb-1" />
                      <p className="text-xs text-gray-600 font-medium">{openingHoursLabel}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedStore.openingHours}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <Navigation className="w-4 h-4 text-blue-600 mb-1" />
                      <p className="text-xs text-gray-600 font-medium">{distanceLabel}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedStore.distance || "~2 km"}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      {addressLabel}
                    </h4>
                    <p className="text-sm text-gray-800">
                      {selectedStore.address}, {selectedStore.zip} {selectedStore.city}
                    </p>
                    <a
                      href={getMapsUrl(selectedStore)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-shop_light_green hover:text-shop_btn_dark_green transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>{routeLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Contact */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      {contactLabel}
                    </h4>
                    <div className="space-y-2">
                      <a
                        href={`tel:${selectedStore.phone}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-shop_light_green transition-colors active:bg-gray-100 p-1 -mx-1 rounded-lg"
                      >
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedStore.phone}</span>
                      </a>
                      <a
                        href={`mailto:${selectedStore.email}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-shop_light_green transition-colors active:bg-gray-100 p-1 -mx-1 rounded-lg"
                      >
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedStore.email}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                // No store selected - show store list
                <div className="space-y-3">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 text-sm bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-shop_light_green focus:bg-white transition-all"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    {renderStoreList()}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Footer */}
          {!showStoreList && selectedStore && (
            <div className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4 ${!isDesktop ? 'pb-6 rounded-b-3xl' : 'rounded-bl-2xl'}`}>
              <div className="flex gap-3">
                <button
                  onClick={handleChangeStore}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  {changeStoreText}
                </button>
                <Link
                  href={`/store/${selectedStore._id || selectedStore.name}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-shop_btn_dark_green rounded-xl hover:bg-shop_btn_dark_green/90 active:scale-[0.98] transition-all"
                >
                  <Store className="w-4 h-4" />
                  <span>{storePageText}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoreLocator;