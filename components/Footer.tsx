// components/Footer.tsx
"use client";
import React, { useState, useEffect } from "react";
import Container from "./Container";
import Logo from "./Logo";
import { getFooterData, getFooterCategories } from "@/sanity/queries/footer";
import Link from "next/link";
import FloatingWhatsApp from "./FloatingWhatsApp";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MapPin,
  Phone,
  Clock,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Music2,
  Shield,
  ArrowUp,
  PhoneCall,
} from "lucide-react";

// Social media icons
const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Music2,
};

// Define interfaces for type safety
interface LinkItem {
  title: string;
  href: string;
}

interface ContactItem {
  icon: string;
  title: string;
  subtitle: string;
}

// Helper: turn a phone-looking string into a tel: link
const toTelHref = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;
const isLikelyPhone = (value: string) => /\d{3,}/.test(value);

const Footer = () => {
  // "contact" starts expanded on mobile
  const [expandedSections, setExpandedSections] = useState<string[]>(["contact"]);
  const [footerData, setFooterData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show a "back to top" button
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch footer data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [footer, cats] = await Promise.all([
          getFooterData(),
          getFooterCategories(),
        ]);
        setFooterData(footer);
        setCategories(cats || []);
      } catch (error) {
        console.error("Error loading footer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => expandedSections.includes(section);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Defaults
  const aboutDescription =
    footerData?.about?.description ||
    "Entdecken Sie kuratierte Möbelkollektionen bei FundGrube-Bestpreisyt, die Stil und Komfort vereinen, um Ihre Wohnräume zu verschönern.";

  const showSocialMedia = footerData?.about?.showSocialMedia !== false;

  const socialMediaLinks = {
    facebook: footerData?.socialMedia?.facebook,
    instagram: footerData?.socialMedia?.instagram,
    twitter: footerData?.socialMedia?.twitter,
    youtube: footerData?.socialMedia?.youtube,
    linkedin: footerData?.socialMedia?.linkedin,
    tiktok: footerData?.socialMedia?.tiktok,
  };

  // Product Categories
  const productCategoriesTitle = footerData?.productCategories?.title || "Unser Sortiment";
  const showCategories = footerData?.productCategories?.showCategories !== false;

  // Service Links
  const serviceTitle = footerData?.serviceLinks?.title || "Service";
  const serviceLinks: LinkItem[] = footerData?.serviceLinks?.links || [
    { title: "Bonus Card", href: "/bonus" },
    { title: "Maschinenvermietung", href: "/machine-rental" },
    { title: "Retouren & Reklamationen", href: "/returns" },
    { title: "Alle Services", href: "/services" },
    { title: "Newsletter", href: "/newsletter" },
  ];

  // Company Links
  const companyTitle = footerData?.companyLinks?.title || "Unternehmen";
  const companyLinks: LinkItem[] = footerData?.companyLinks?.links || [
    { title: "Über uns", href: "/about" },
    { title: "Nachhaltigkeit", href: "/sustainability" },
    { title: "Karriere", href: "/careers" },
    { title: "Presse", href: "/press" },
    { title: "Alle Märkte", href: "/markets" },
  ];

  // Contact Info
  const contactTitle = footerData?.contactInfo?.title || "Haben Sie Fragen? Rufen Sie uns an!";
  const contactItems: ContactItem[] = footerData?.contactInfo?.items || [
    { icon: "phone", title: "Rufen Sie uns an", subtitle: "+49 123 456 789" },
    { icon: "clock", title: "Öffnungszeiten", subtitle: "Mo – Sa: 09:00 – 20:00 Uhr" },
    { icon: "mapPin", title: "Besuchen Sie uns", subtitle: "123 Main Street, Berlin" },
    { icon: "mail", title: "E-Mail", subtitle: "info@fundgrube.de" },
  ];

  // Payment Methods - FIXED: Handle both string and object types
  const paymentTitle = footerData?.paymentMethods?.title || "Zahlen Sie ganz bequem!";
  
  // Helper function to extract payment method value from Sanity array items
  const getPaymentMethodValue = (item: any): string => {
    // If it's a string, return it directly
    if (typeof item === 'string') {
      return item;
    }
    // If it's an object, try to get the value
    if (item && typeof item === 'object') {
      // Check for common Sanity array item structures
      if (item.method) return item.method;
      if (item.value) return item.value;
      if (item.name) return item.name;
      // If it has a _type, try to find the actual value
      if (item._type === 'string' && item._key) {
        // This might be a string stored as an object
        return item.value || item.method || '';
      }
    }
    // Fallback: return the item as string or empty
    return String(item || '');
  };

  // Get payment methods list safely
  const rawPaymentMethods = footerData?.paymentMethods?.methods || [
    "paypal",
    "wero",
    "invoice",
    "creditCard",
    "prepayment",
    "financing",
    "instantBank",
    "directDebit",
  ];

  // Convert to strings array
  const paymentMethodsList: string[] = rawPaymentMethods.map(getPaymentMethodValue).filter(Boolean);

  // Custom methods from Sanity
  const customMethodsFromSanity = footerData?.paymentMethods?.customMethods || {};

  // Default payment method labels
  const defaultMethods: Record<string, string> = {
    paypal: "PayPal",
    wero: "Wero",
    invoice: "Rechnung",
    creditCard: "Kreditkarte",
    prepayment: "Vorkasse",
    financing: "Finanzierung",
    instantBank: "Sofortüberweisung",
    directDebit: "Lastschrift",
  };

  // Get display label for a payment method
  const getPaymentMethodLabel = (method: string): string => {
    // Check custom methods first
    if (customMethodsFromSanity[method]) {
      return customMethodsFromSanity[method];
    }
    // Check default methods
    if (defaultMethods[method]) {
      return defaultMethods[method];
    }
    // Return the method itself if no label found
    return method;
  };

  // Bottom Bar
  const copyrightText = footerData?.bottomBar?.copyrightText || "©2026 FundGrube GmbH & Co. KG";
  const bottomLinks: LinkItem[] = footerData?.bottomBar?.bottomLinks || [
    { title: "AGB", href: "/terms" },
    { title: "Widerruf", href: "/withdrawal" },
    { title: "Impressum", href: "/imprint" },
    { title: "Datenschutz", href: "/privacy" },
    { title: "Barrierefreiheit", href: "/accessibility" },
    { title: "Cookie-Einstellungen", href: "/cookies" },
  ];

  const iconMap = {
    mapPin: MapPin,
    phone: Phone,
    clock: Clock,
    mail: Mail,
  };

  // Sections for accordion
  const sections = [
    { id: "contact", title: contactTitle, show: true },
    { id: "service", title: serviceTitle, show: true },
    { id: "company", title: companyTitle, show: true },
    { id: "categories", title: productCategoriesTitle, show: showCategories },
  ];

  const renderContactItem = (item: ContactItem, big: boolean) => {
    const Icon = iconMap[item?.icon as keyof typeof iconMap] || MapPin;
    const phone = item.icon === "phone" && isLikelyPhone(item.subtitle);
    const email = item.icon === "mail" && item.subtitle?.includes("@");

    const body = (
      <>
        <div
          className={`rounded-full bg-amber-100 border-2 border-amber-300/60 flex-shrink-0 flex items-center justify-center ${
            big ? "w-14 h-14" : "w-12 h-12"
          }`}
        >
          <Icon className={big ? "w-7 h-7 text-amber-800" : "w-6 h-6 text-amber-800"} />
        </div>
        <div>
          <p className={`text-gray-900 font-bold ${big ? "text-lg md:text-xl" : "text-base"}`}>
            {item?.title}
          </p>
          <p
            className={`text-gray-700 font-medium ${big ? "text-lg md:text-xl" : "text-base"} ${
              phone || email ? "underline decoration-2 decoration-amber-400" : ""
            }`}
          >
            {item?.subtitle}
          </p>
        </div>
      </>
    );

    if (phone) {
      return (
        <a
          key={item?.title}
          href={toTelHref(item.subtitle)}
          className="flex items-center gap-4 py-2 -mx-2 px-2 rounded-xl hover:bg-amber-50 active:bg-amber-100 transition-colors"
          aria-label={`Anrufen: ${item.subtitle}`}
        >
          {body}
        </a>
      );
    }
    if (email) {
      return (
        <a
          key={item?.title}
          href={`mailto:${item.subtitle}`}
          className="flex items-center gap-4 py-2 -mx-2 px-2 rounded-xl hover:bg-amber-50 active:bg-amber-100 transition-colors"
          aria-label={`E-Mail senden: ${item.subtitle}`}
        >
          {body}
        </a>
      );
    }
    return (
      <li key={item?.title} className="flex items-center gap-4 py-2 list-none">
        {body}
      </li>
    );
  };

  return (
    <footer className="bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-white text-gray-900 border-t-2 border-amber-300/50 mt-12 md:mt-16 lg:mt-20 text-base">
      {/* Call us now strip */}
      <div className="bg-amber-700">
        <Container className="py-3 md:py-4">
          <a
            href={toTelHref(
              contactItems.find((c) => c.icon === "phone")?.subtitle || "+49 123 456 789"
            )}
            className="flex items-center justify-center gap-3 text-white font-bold text-lg md:text-xl hover:underline"
          >
            <PhoneCall className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0" />
            <span>
              Fragen? Rufen Sie uns an:{" "}
              {contactItems.find((c) => c.icon === "phone")?.subtitle || "+49 123 456 789"}
            </span>
          </a>
        </Container>
      </div>

      {/* Main Footer Content */}
      <Container className="py-8 md:py-12">
        {/* Logo + About Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <Logo logoData={footerData?.logo} />
              <p className="text-base md:text-lg text-gray-700 max-w-md mt-3 leading-relaxed">
                {aboutDescription}
              </p>
            </div>
            {/* Social Media Icons - Desktop only */}
            {showSocialMedia && (
              <div className="hidden md:flex items-center gap-4">
                {Object.entries(socialMediaLinks).map(([key, href]) => {
                  if (!href) return null;
                  const Icon = socialIcons[key as keyof typeof socialIcons];
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-amber-300/60 text-gray-700 hover:bg-amber-700 hover:text-white hover:border-amber-700 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden space-y-3">
          {sections.map((section) => {
            if (!section.show) return null;

            let content = null;
            if (section.id === "categories") {
              content = (
                <ul className="space-y-1 pt-2">
                  {categories?.slice(0, 6).map((category) => (
                    <li key={category?._id}>
                      <Link
                        href={`/category/${category?.slug?.current}`}
                        className="text-gray-800 hover:text-amber-800 text-lg flex items-center gap-2 py-3 min-h-[44px]"
                      >
                        <ChevronRight className="w-5 h-5 text-amber-700 flex-shrink-0" />
                        {category?.title}
                      </Link>
                    </li>
                  ))}
                  {categories?.length > 6 && (
                    <li className="text-base text-amber-800 font-bold pt-1">
                      +{categories.length - 6} weitere Kategorien
                    </li>
                  )}
                </ul>
              );
            } else if (section.id === "service") {
              content = (
                <ul className="space-y-1 pt-2">
                  {serviceLinks?.map((link: LinkItem) => (
                    <li key={link?.title}>
                      <Link
                        href={link?.href}
                        className="text-gray-800 hover:text-amber-800 text-lg flex items-center gap-2 py-3 min-h-[44px]"
                      >
                        <ChevronRight className="w-5 h-5 text-amber-700 flex-shrink-0" />
                        {link?.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              );
            } else if (section.id === "company") {
              content = (
                <ul className="space-y-1 pt-2">
                  {companyLinks?.map((link: LinkItem) => (
                    <li key={link?.title}>
                      <Link
                        href={link?.href}
                        className="text-gray-800 hover:text-amber-800 text-lg flex items-center gap-2 py-3 min-h-[44px]"
                      >
                        <ChevronRight className="w-5 h-5 text-amber-700 flex-shrink-0" />
                        {link?.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              );
            } else if (section.id === "contact") {
              content = <div className="space-y-1 pt-2">{contactItems?.map((item) => renderContactItem(item, true))}</div>;
            }

            return (
              <div
                key={section.id}
                className="border-2 border-amber-300/40 bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isSectionExpanded(section.id)}
                  className="w-full flex items-center justify-between py-5 px-5 text-left min-h-[56px]"
                >
                  <span className="text-lg font-bold text-gray-900">{section.title}</span>
                  {isSectionExpanded(section.id) ? (
                    <ChevronUp className="w-6 h-6 text-amber-700 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-amber-700 flex-shrink-0" />
                  )}
                </button>
                {isSectionExpanded(section.id) && <div className="pb-5 px-5">{content}</div>}
              </div>
            );
          })}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact Column */}
          <div>
            <h3 className="text-gray-900 font-extrabold mb-5 text-lg uppercase tracking-wide border-b-2 border-amber-300/60 pb-3">
              {contactTitle}
            </h3>
            <div className="space-y-1">{contactItems?.map((item) => renderContactItem(item, false))}</div>
          </div>

          {/* Service Column */}
          <div>
            <h3 className="text-gray-900 font-extrabold mb-5 text-lg uppercase tracking-wide border-b-2 border-amber-300/60 pb-3">
              {serviceTitle}
            </h3>
            <ul className="space-y-1">
              {serviceLinks?.map((link: LinkItem) => (
                <li key={link?.title}>
                  <Link
                    href={link?.href}
                    className="text-gray-700 hover:text-amber-800 text-base flex items-center gap-2 group transition-colors py-2"
                  >
                    <ChevronRight className="w-4 h-4 text-amber-700 group-hover:text-amber-800 transition-colors flex-shrink-0" />
                    {link?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-gray-900 font-extrabold mb-5 text-lg uppercase tracking-wide border-b-2 border-amber-300/60 pb-3">
              {companyTitle}
            </h3>
            <ul className="space-y-1">
              {companyLinks?.map((link: LinkItem) => (
                <li key={link?.title}>
                  <Link
                    href={link?.href}
                    className="text-gray-700 hover:text-amber-800 text-base flex items-center gap-2 group transition-colors py-2"
                  >
                    <ChevronRight className="w-4 h-4 text-amber-700 group-hover:text-amber-800 transition-colors flex-shrink-0" />
                    {link?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories Column */}
          {showCategories && (
            <div>
              <h3 className="text-gray-900 font-extrabold mb-5 text-lg uppercase tracking-wide border-b-2 border-amber-300/60 pb-3">
                {productCategoriesTitle}
              </h3>
              <ul className="space-y-1">
                {categories?.slice(0, 8).map((category) => (
                  <li key={category?._id}>
                    <Link
                      href={`/category/${category?.slug?.current}`}
                      className="text-gray-700 hover:text-amber-800 text-base flex items-center gap-2 group transition-colors py-2"
                    >
                      <ChevronRight className="w-4 h-4 text-amber-700 group-hover:text-amber-800 transition-colors flex-shrink-0" />
                      {category?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>

      {/* Mobile Social Media */}
      {showSocialMedia && (
        <div className="md:hidden border-t-2 border-amber-300/40 bg-gradient-to-r from-amber-50/40 via-orange-50/30 to-white">
          <Container className="py-5">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {Object.entries(socialMediaLinks).map(([key, href]) => {
                if (!href) return null;
                const Icon = socialIcons[key as keyof typeof socialIcons];
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-amber-300/60 text-gray-700 hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-all duration-300 shadow-sm"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </Container>
        </div>
      )}

      {/* Payment Methods - FIXED: Properly handle object/string items */}
      <div className="border-t-2 border-amber-300/40 bg-gradient-to-r from-amber-50/40 via-orange-50/30 to-white">
        <Container className="py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-800 flex-shrink-0" />
              {paymentTitle}
            </h3>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {paymentMethodsList.slice(0, isMobile ? 4 : 8).map((method: string) => {
                const displayLabel = getPaymentMethodLabel(method);
                return (
                  <span
                    key={method}
                    className="px-4 py-2 md:px-5 md:py-3 bg-white border-2 border-amber-300/60 rounded-lg text-sm md:text-base font-semibold text-gray-800 hover:border-amber-500 hover:bg-amber-50 transition-all duration-300"
                  >
                    {displayLabel}
                  </span>
                );
              })}
              {isMobile && paymentMethodsList.length > 4 && (
                <span className="px-4 py-2 text-sm text-gray-600 font-semibold">
                  +{paymentMethodsList.length - 4} weitere
                </span>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-amber-300/40 bg-gradient-to-r from-amber-50/40 via-orange-50/30 to-white">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm md:text-base text-gray-700 font-medium order-2 md:order-1">
              {copyrightText}
            </p>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 order-1 md:order-2">
              {bottomLinks?.map((link: LinkItem) => (
                <Link
                  key={link?.title}
                  href={link?.href}
                  className="text-sm md:text-base font-medium text-gray-700 hover:text-amber-800 hover:underline transition-colors py-1"
                >
                  {link?.title}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Nach oben scrollen"
          className="fixed z-40 w-14 h-14 rounded-full bg-amber-700 text-white shadow-lg hover:bg-amber-800 active:scale-95 transition-all flex items-center justify-center bottom-24 right-8 md:bottom-24 md:right-8"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <FloatingWhatsApp />
    </footer>
  );
};

export default Footer;