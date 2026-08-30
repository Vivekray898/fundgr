// components/store/StorePage.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Store,
  ChevronDown,
  ChevronRight,
  Navigation,
  ExternalLink,
  Calendar,
  Wrench,
  CreditCard,
  Car,
  Paintbrush,
  DollarSign,
  Wifi,
  Truck,
  Scissors,
  Key,
  Gift,
  Fuel,
  Sparkles,
  Utensils,
  FileText,
  Users,
  MessageSquare,
  Briefcase,
  Home
} from "lucide-react";

// Types
interface StoreService {
  title: string;
  slug?: { current: string };
  description: string;
  icon: string;
  image?: string;
  isActive?: boolean;
  order?: number;
}

interface StoreData {
  _id: string;
  name: string;
  slug: { current: string };
  address: string;
  city: string;
  zip: string;
  phone: string;
  email: string;
  openingHours: Array<{ day: string; hours: string; isClosed?: boolean }>;
  isDefault?: boolean;
  image?: string;
  heroImage?: string;
  description?: string;
  gastronomy?: {
    name: string;
    description: string;
    image?: { asset: { url: string } };
    menuLink?: string;
  };
  prospectImage?: string;
  prospectUrl?: string;
  prospectStartDate?: string;
  prospectEndDate?: string;
  localServices?: string[];
  services?: StoreService[];
  additionalServices?: string[];
  googleMapsUrl?: string;
  coordinates?: { lat: number; lng: number };
  seo?: { title: string; description: string; keywords: string };
  timezone?: string;
}

interface StorePageProps {
  store: StoreData;
}

// Service icon mapping
const serviceIcons: Record<string, any> = {
  gasflaschenautomat: Fuel,
  anhaengerverleih: Truck,
  bargeldlos: CreditCard,
  bargeldservice: DollarSign,
  eauto: Car,
  farbmischanlage: Paintbrush,
  finanzkauf: DollarSign,
  geschenkgutschein: Gift,
  wlan: Wifi,
  lieferservice: Truck,
  maschinenvermietung: Wrench,
  rechnungskauf: CreditCard,
  reservieren: Calendar,
  schluesseldienst: Key,
  zuschnitt: Scissors,
  default: Sparkles,
};

// Helper: Get current time in a specific timezone
const getCurrentTimeInTimezone = (timezone: string = 'Europe/Berlin'): Date | null => {
  try {
    const now = new Date();
    // Use Intl.DateTimeFormat to get time in the specified timezone
    const formatter = new Intl.DateTimeFormat('de-DE', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Parse the formatted string back to a Date object
    const parts = formatter.formatToParts(now);
    const dateObj: any = {};
    parts.forEach(part => {
      if (part.type !== 'literal') {
        dateObj[part.type] = part.value;
      }
    });
    
    // Create a date object with the timezone-adjusted time
    const adjustedDate = new Date(
      parseInt(dateObj.year),
      parseInt(dateObj.month) - 1,
      parseInt(dateObj.day),
      parseInt(dateObj.hour),
      parseInt(dateObj.minute),
      parseInt(dateObj.second) || 0
    );
    
    return adjustedDate;
  } catch (error) {
    console.warn('Failed to get time in timezone, using local time:', error);
    return new Date();
  }
};

// Helper: Format time for display
const formatTimeDisplay = (date: Date | null): string => {
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  try {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    return '';
  }
};

// Helper: Get German weekday name
const getGermanWeekday = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  return weekdays[date.getDay()];
};

const StorePage = ({ store }: StorePageProps) => {
  const [openServices, setOpenServices] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState<string>('Europe/Berlin');

  useEffect(() => {
    // Set the timezone from store data or use default
    const tz = store?.timezone || 'Europe/Berlin';
    setTimezone(tz);
    
    // Initial time fetch
    setCurrentTime(getCurrentTimeInTimezone(tz));

    // Update every minute
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeInTimezone(tz));
    }, 60000);

    return () => clearInterval(interval);
  }, [store?.timezone]);

  const toggleService = (serviceId: string) => {
    setOpenServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const isServiceOpen = (serviceId: string) => openServices.includes(serviceId);

  // Check if store is currently open
  const getStoreStatus = () => {
    // If time isn't initialized yet, default to closed
    if (!currentTime || isNaN(currentTime.getTime())) {
      return { isOpen: false, closingTime: null, openingTime: null };
    }

    const now = currentTime;
    const day = getGermanWeekday(now);
    
    // Find opening hours for today
    const hours = store.openingHours?.find(h => h.day === day);
    
    if (!hours || hours.isClosed) {
      return { isOpen: false, closingTime: null, openingTime: null };
    }
    
    // Parse opening hours (e.g., "08:00 - 20:00")
    const [openTime, closeTime] = hours.hours.split(' - ').map(t => t.trim());
    if (!openTime || !closeTime) return { isOpen: false, closingTime: null, openingTime: null };
    
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    
    // Create date objects for opening and closing times
    const open = new Date(now);
    open.setHours(openHour, openMinute, 0, 0);
    
    const close = new Date(now);
    close.setHours(closeHour, closeMinute, 0, 0);
    
    // Handle cases where closing time is past midnight
    if (closeHour < openHour) {
      close.setDate(close.getDate() + 1);
    }
    
    const isOpen = now >= open && now <= close;
    
    return { 
      isOpen, 
      closingTime: closeTime,
      openingTime: openTime,
    };
  };

  const { isOpen, closingTime, openingTime } = getStoreStatus();

  // Get service icon
  const getServiceIcon = (iconName: string) => {
    return serviceIcons[iconName] || serviceIcons.default;
  };

  // Format opening hours for display
  const getOpeningHoursDisplay = () => {
    if (!store.openingHours || store.openingHours.length === 0) {
      return <p className="text-sm text-gray-600">Keine Öffnungszeiten angegeben</p>;
    }
    
    // If time isn't initialized yet, show without highlighting
    if (!currentTime || isNaN(currentTime.getTime())) {
      return store.openingHours.map((entry, index) => (
        <div key={index} className="flex justify-between text-sm py-0.5">
          <span className="text-gray-600">{entry.day}</span>
          <span className={entry.isClosed ? 'text-red-500' : 'text-gray-800'}>
            {entry.isClosed ? 'Geschlossen' : entry.hours}
          </span>
        </div>
      ));
    }
    
    const now = currentTime;
    const today = getGermanWeekday(now);
    
    return store.openingHours.map((entry, index) => {
      const isToday = entry.day === today;
      
      return (
        <div key={index} className={`flex justify-between text-sm py-0.5 ${isToday ? 'font-medium' : ''}`}>
          <span className={`${isToday ? 'text-gray-800' : 'text-gray-600'}`}>
            {entry.day} {isToday && <span className="text-rose-500 text-xs">(heute)</span>}
          </span>
          <span className={entry.isClosed ? 'text-red-500' : isToday ? 'text-rose-600 font-semibold' : 'text-gray-800'}>
            {entry.isClosed ? 'Geschlossen' : entry.hours}
          </span>
        </div>
      );
    });
  };

  // Format date range for prospect
  const formatDateRange = () => {
    if (!store.prospectStartDate || !store.prospectEndDate) return '';
    try {
      const start = new Date(store.prospectStartDate);
      const end = new Date(store.prospectEndDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
      return `${start.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${end.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    } catch {
      return '';
    }
  };

  // Get formatted current time for display - FIXED: returns only if valid
  const getFormattedCurrentTime = (): string => {
    if (!currentTime || isNaN(currentTime.getTime())) {
      return '';
    }
    return formatTimeDisplay(currentTime);
  };

  const formattedTime = getFormattedCurrentTime();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image */}
      {store.heroImage && (
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[460px] overflow-hidden">
          <Image
            src={store.heroImage}
            alt={store.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              {store.name}
            </h1>
            <p className="text-white/90 text-sm md:text-base drop-shadow-lg flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" />
              {store.address}, {store.zip} {store.city}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Left (1/4) - Store Menu */}
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
                <strong className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Ihr Markt
                </strong>
              </div>
              <ul className="p-2 space-y-1">
                <li>
                  <Link
                    href={`/store/${store.slug.current}`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-rose-50 text-rose-600 font-medium text-sm transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Marktübersicht
                  </Link>
                </li>
                {store.prospectUrl && (
                  <li>
                    <Link
                      href={`/store/${store.slug.current}/prospekt`}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Werbeprospekt
                    </Link>
                  </li>
                )}
                {store.gastronomy && (
                  <li>
                    <Link
                      href={`/store/${store.slug.current}/gastronomie`}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors"
                    >
                      <Utensils className="w-4 h-4" />
                      Gastronomie
                    </Link>
                  </li>
                )}
                {store.services?.some(s => s.title.toLowerCase().includes('maschinenvermietung')) && (
                  <li>
                    <Link
                      href={`/store/${store.slug.current}/maschinenvermietung`}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors"
                    >
                      <Wrench className="w-4 h-4" />
                      Maschinenvermietung
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href={`/store/${store.slug.current}/jobs`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors"
                  >
                    <Briefcase className="w-4 h-4" />
                    Offene Stellen
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/store/${store.slug.current}/kontakt`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Kontaktformular
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content - Right (3/4) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Store Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Store Info */}
                <div>
                  {/* Opening Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                        {isOpen ? (
                          <span className="text-green-600">Geöffnet</span>
                        ) : (
                          <span className="text-red-600">Geschlossen</span>
                        )}
                        {formattedTime && (
                          <span className="text-xs text-gray-400 font-normal">
                            ({formattedTime} Uhr)
                          </span>
                        )}
                      </p>
                      {isOpen && closingTime && (
                        <span className="text-xs text-gray-600">
                          bis {closingTime} Uhr
                        </span>
                      )}
                    </div>
                    {!isOpen && openingTime && (
                      <p className="text-xs text-gray-500 mt-1">
                        Heute ab {openingTime} Uhr geöffnet
                      </p>
                    )}
                  </div>

                  {/* Opening Hours */}
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Öffnungszeiten
                    </h3>
                    {getOpeningHoursDisplay()}
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Kontakt
                    </h3>
                    <p className="text-sm text-gray-800">
                      {store.address}
                      <br />
                      {store.zip} {store.city}
                    </p>
                    <div className="mt-2 space-y-1">
                      <a
                        href={`tel:${store.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-rose-500 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-gray-400" />
                        {store.phone}
                      </a>
                      {store.email && (
                        <a
                          href={`mailto:${store.email}`}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-rose-500 transition-colors"
                        >
                          <Mail className="w-4 h-4 text-gray-400" />
                          {store.email}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Quick Links to Accordions */}
                  {store.localServices && store.localServices.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <a href="#vor-ort" className="flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                        Für Sie vor Ort
                      </a>
                    </div>
                  )}
                  {store.services && store.services.length > 0 && (
                    <div className="mt-2">
                      <a href="#services" className="flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                        Service
                      </a>
                    </div>
                  )}
                </div>

                {/* Right Column - Map */}
                <div>
                  <div className="rounded-xl overflow-hidden border border-gray-200 h-[300px] relative">
                    {store.googleMapsUrl ? (
                      <iframe
                        className="w-full h-full"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={store.googleMapsUrl}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : store.coordinates ? (
                      <iframe
                        className="w-full h-full"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${store.coordinates.lat},${store.coordinates.lng}`}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <p className="text-gray-500 text-sm">Karte nicht verfügbar</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}, ${store.zip} ${store.city}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      Route planen
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Prospekt & Gastronomie Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prospekt Card */}
              {store.prospectImage && (
                <Link
                  href={store.prospectUrl || `/store/${store.slug.current}/prospekt`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Prospekt</h3>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={store.prospectImage}
                        alt={`${store.name} Prospekt`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {store.prospectStartDate && store.prospectEndDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Gültig von {formatDateRange()}
                      </p>
                    )}
                  </div>
                </Link>
              )}

              {/* Gastronomie Card */}
              {store.gastronomy && (
                <Link
                  href={store.gastronomy.menuLink || `/store/${store.slug.current}/gastronomie`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Speiseplan</h3>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                      {store.gastronomy.image ? (
                        <Image
                          src={store.gastronomy.image.asset.url}
                          alt={store.gastronomy.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
                          <Utensils className="w-12 h-12 text-rose-300" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {store.gastronomy.name}
                    </p>
                  </div>
                </Link>
              )}
            </div>

            {/* Service Icons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Service
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                <Link
                  href={`/store/${store.slug.current}/kontakt`}
                  className="text-center group"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 group-hover:bg-rose-100 transition-colors flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-rose-500" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Kontaktformular</p>
                </Link>
                <Link
                  href={`/store/${store.slug.current}/jobs`}
                  className="text-center group"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 group-hover:bg-rose-100 transition-colors flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-rose-500" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Offene Stellen</p>
                </Link>
              </div>
            </div>

            {/* Local Services Section */}
            {store.localServices && store.localServices.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" id="vor-ort">
                <button
                  onClick={() => toggleService('vor-ort')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-base font-semibold text-gray-800">
                    Für Sie vor Ort
                  </h3>
                  {isServiceOpen('vor-ort') ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {isServiceOpen('vor-ort') && (
                  <div className="px-4 pb-4">
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      {store.localServices.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Services Accordion */}
            {store.services && store.services.filter(s => s.isActive !== false).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" id="services">
                <button
                  onClick={() => toggleService('services')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <h3 className="text-base font-semibold text-gray-800">Service</h3>
                  {isServiceOpen('services') ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {isServiceOpen('services') && (
                  <div className="divide-y divide-gray-100">
                    {store.services
                      .filter(s => s.isActive !== false)
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((service, index) => {
                        const Icon = getServiceIcon(service.icon);
                        const isServiceOpen = openServices.includes(`service-${index}`);
                        
                        return (
                          <div key={index}>
                            <button
                              onClick={() => toggleService(`service-${index}`)}
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-5 h-5 text-rose-500" />
                                </div>
                                <span className="font-medium text-gray-800 text-sm">
                                  {service.title}
                                </span>
                              </div>
                              {isServiceOpen ? (
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                            </button>
                            {isServiceOpen && (
                              <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-50">
                                <div className="prose prose-sm max-w-none">
                                  <p>{service.description}</p>
                                </div>
                                {service.image && (
                                  <div className="mt-3 max-w-xs mx-auto">
                                    <Image
                                      src={service.image}
                                      alt={service.title}
                                      width={220}
                                      height={120}
                                      className="w-full h-auto rounded-lg"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Additional Services */}
            {store.additionalServices && store.additionalServices.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Weitere Services
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {store.additionalServices.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;