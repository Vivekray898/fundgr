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
  googleMapsLink?: string;
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

// Pure CSS placeholder with rose/pink colors
const StorePlaceholder = ({ name }: { name: string }) => (
  <div className="w-full h-full bg-gradient-to-br from-rose-100/50 to-pink-100/50 flex items-center justify-center">
    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
      <Store className="w-5 h-5 text-rose-400" />
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

  const stores = settings?.stores || [];

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

  useEffect(() => {
    if (stores.length > 0 && !selectedStore) {
      const defaultStore = stores.find(s => s.isDefault) || stores[0];
      setSelectedStore(defaultStore);
    }
  }, [stores, selectedStore]);

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
    if (store.googleMapsLink) {
      return store.googleMapsLink;
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
          className={`flex items-center gap-1.5 text-rose-500 hover:text-rose-600 hoverEffect ${className}`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{title}</span>
          <CheckCircle className="w-3 h-3 text-rose-500" />
        </button>
      );
    }

    return (
      <button
        onClick={handleOpen}
        className={`flex items-center gap-1.5 text-sm text-gray-600 hover:text-rose-500 active:bg-rose-50 rounded-full transition-colors px-2.5 py-1.5 ${className}`}
      >
        <MapPin className="w-4 h-4" />
        <span>{title}</span>
        <CheckCircle className="w-3.5 h-3.5 text-rose-500" />
      </button>
    );
  };

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
            ? "border-rose-400 bg-rose-50"
            : "border-gray-200 hover:border-rose-300 active:bg-rose-50"
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
            <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          )}
        </div>
      </button>
    ));
  };

  return (
    <>
      {renderTrigger()}

      <div
        className={`fixed inset-0 z-[200] transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        <div
          ref={offcanvasRef}
          className={`
            absolute bg-white shadow-2xl transition-all duration-300 ease-in-out
            ${isDesktop 
              ? `top-0 right-0 h-full w-full max-w-[480px] rounded-l-2xl ${
                  isOpen ? "translate-x-0" : "translate-x-full"
                }`
              : `bottom-0 left-0 right-0 max-h-[92vh] rounded-t-3xl ${
                  isOpen ? "translate-y-0" : "translate-y-full"
                }`
            }
          `}
          style={isDesktop ? {} : { maxHeight: "92vh" }}
        >
          {isDesktop && (
            <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-rose-100 flex items-center justify-between rounded-tl-2xl">
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
                className="p-2 -mr-2 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors"
                aria-label="Schließen"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}

          {!isDesktop && (
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
          )}

          {!isDesktop && (
            <div className="sticky top-0 bg-white z-10 px-4 pb-3 border-b border-rose-100">
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
                  className="p-2 -mr-2 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          <div 
            className={`overflow-y-auto p-4 ${!isDesktop ? 'pb-28' : 'pb-6'}`}
            style={!isDesktop ? { maxHeight: "calc(92vh - 120px)" } : { maxHeight: "calc(100vh - 80px)" }}
          >
            {showStoreList ? (
              <div className="space-y-3">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 text-sm bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
                    autoFocus
                  />
                </div>

                <button
                  onClick={() => setShowStoreList(false)}
                  className="flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors mb-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{backLabel}</span>
                </button>

                <div className="space-y-2">
                  {renderStoreList()}
                </div>
              </div>
            ) : (
              selectedStore ? (
                <div className="space-y-4">
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100/50 to-pink-100/50">
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
                          <Store className="w-16 h-16 text-rose-300/50 mx-auto mb-2" />
                          <p className="text-rose-400 font-semibold text-lg">{selectedStore.name}</p>
                          <p className="text-rose-400/70 text-sm">{selectedStore.city}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-rose-50 rounded-xl p-3">
                      <Clock className="w-4 h-4 text-rose-500 mb-1" />
                      <p className="text-xs text-gray-600 font-medium">{openingHoursLabel}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedStore.openingHours}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <Navigation className="w-4 h-4 text-blue-500 mb-1" />
                      <p className="text-xs text-gray-600 font-medium">{distanceLabel}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedStore.distance || "~2 km"}</p>
                    </div>
                  </div>

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
                      className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>{routeLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      {contactLabel}
                    </h4>
                    <div className="space-y-2">
                      <a
                        href={`tel:${selectedStore.phone}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-rose-500 transition-colors active:bg-rose-50 p-1 -mx-1 rounded-lg"
                      >
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedStore.phone}</span>
                      </a>
                      <a
                        href={`mailto:${selectedStore.email}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-rose-500 transition-colors active:bg-rose-50 p-1 -mx-1 rounded-lg"
                      >
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedStore.email}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 text-sm bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
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

          {!showStoreList && selectedStore && (
            <div className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-rose-100 p-4 ${!isDesktop ? 'pb-6 rounded-b-3xl' : 'rounded-bl-2xl'}`}>
              <div className="flex gap-3">
                <button
                  onClick={handleChangeStore}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-rose-50 active:bg-rose-100 transition-colors"
                >
                  {changeStoreText}
                </button>
                <Link
                  href={`/store/${selectedStore._id || selectedStore.name}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-rose-500 rounded-xl hover:bg-rose-600 active:scale-[0.98] transition-all"
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