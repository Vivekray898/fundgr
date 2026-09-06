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
  ChevronUp
} from "lucide-react";

// Payment methods mapping with icons
const paymentMethods = {
  paypal: "PayPal",
  wero: "Wero",
  invoice: "Rechnung",
  creditCard: "Kreditkarte",
  prepayment: "Vorkasse",
  financing: "Finanzierung",
  instantBank: "Sofortüberweisung",
  directDebit: "Lastschrift",
};

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

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [footerData, setFooterData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch footer data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [footer, cats] = await Promise.all([
          getFooterData(),
          getFooterCategories()
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
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => expandedSections.includes(section);

  // Defaults
  const aboutDescription = footerData?.about?.description || 
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
  const productCategoriesTitle = footerData?.productCategories?.title || "Produkte";
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
  const companyTitle = footerData?.companyLinks?.title || "Über uns";
  const companyLinks: LinkItem[] = footerData?.companyLinks?.links || [
    { title: "Über uns", href: "/about" },
    { title: "Nachhaltigkeit", href: "/sustainability" },
    { title: "Karriere", href: "/careers" },
    { title: "Presse", href: "/press" },
    { title: "Alle Märkte", href: "/markets" },
  ];

  // Contact Info
  const contactTitle = footerData?.contactInfo?.title || "Kontakt";
  const contactItems: ContactItem[] = footerData?.contactInfo?.items || [
    { icon: "mapPin", title: "Besuchen Sie uns", subtitle: "123 Main Street, Berlin" },
    { icon: "phone", title: "Rufen Sie uns an", subtitle: "+49 123 456 789" },
    { icon: "clock", title: "Öffnungszeiten", subtitle: "Mo - Sa: 09:00 - 20:00" },
    { icon: "mail", title: "E-Mail", subtitle: "info@fundgrube.de" },
  ];

  // Payment Methods
  const paymentTitle = footerData?.paymentMethods?.title || "Zahlungsmethoden";
  const paymentMethodsList: string[] = footerData?.paymentMethods?.methods || [
    "paypal",
    "wero",
    "invoice",
    "creditCard",
    "prepayment",
    "financing",
    "instantBank",
    "directDebit",
  ];

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
    { id: 'categories', title: productCategoriesTitle, show: showCategories },
    { id: 'service', title: serviceTitle, show: true },
    { id: 'company', title: companyTitle, show: true },
    { id: 'contact', title: contactTitle, show: true },
  ];

  return (
    <footer className="bg-gradient-to-br from-amber-50/40 via-orange-50/30 to-white text-gray-800 border-t border-amber-200/40 mt-12 md:mt-16 lg:mt-20">
      {/* Main Footer Content */}
      <Container className="py-6 md:py-12">
        {/* Logo + About Section - Compact on mobile */}
        <div className="mb-6 md:mb-10">
          <div className="flex items-center justify-between">
            <div className="mb-3 md:mb-4">
              <Logo logoData={footerData?.logo} />
            </div>
            {/* Social Media Icons - Row on mobile */}
            {showSocialMedia && (
              <div className="flex items-center gap-2 md:gap-3">
                {Object.entries(socialMediaLinks).map(([key, href]) => {
                  if (!href) return null;
                  const Icon = socialIcons[key as keyof typeof socialIcons];
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 border border-amber-200/50 text-gray-600 hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-all duration-300"
                    >
                      <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          <p className="text-xs md:text-sm text-gray-600 max-w-md hidden md:block">
            {aboutDescription}
          </p>
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden space-y-1">
          {sections.map((section) => {
            if (!section.show) return null;
            
            let content = null;
            if (section.id === 'categories') {
              content = (
                <ul className="space-y-2 pt-2">
                  {categories?.slice(0, 6).map((category) => (
                    <li key={category?._id}>
                      <Link
                        href={`/category/${category?.slug?.current}`}
                        className="text-gray-600 hover:text-amber-700 text-sm flex items-center gap-2 py-1"
                      >
                        <ChevronRight className="w-3 h-3 text-amber-600" />
                        {category?.title}
                      </Link>
                    </li>
                  ))}
                  {categories?.length > 6 && (
                    <li className="text-xs text-amber-700 font-medium pt-1">
                      +{categories.length - 6} weitere Kategorien
                    </li>
                  )}
                </ul>
              );
            } else if (section.id === 'service') {
              content = (
                <ul className="space-y-2 pt-2">
                  {serviceLinks?.map((link: LinkItem) => (
                    <li key={link?.title}>
                      <Link
                        href={link?.href}
                        className="text-gray-600 hover:text-amber-700 text-sm flex items-center gap-2 py-1"
                      >
                        <ChevronRight className="w-3 h-3 text-amber-600" />
                        {link?.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              );
            } else if (section.id === 'company') {
              content = (
                <ul className="space-y-2 pt-2">
                  {companyLinks?.map((link: LinkItem) => (
                    <li key={link?.title}>
                      <Link
                        href={link?.href}
                        className="text-gray-600 hover:text-amber-700 text-sm flex items-center gap-2 py-1"
                      >
                        <ChevronRight className="w-3 h-3 text-amber-600" />
                        {link?.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              );
            } else if (section.id === 'contact') {
              content = (
                <ul className="space-y-3 pt-2">
                  {contactItems?.map((item: ContactItem) => {
                    const Icon = iconMap[item?.icon as keyof typeof iconMap] || MapPin;
                    return (
                      <li key={item?.title} className="flex items-start gap-3">
                        <div className="p-1.5 rounded-full bg-white/80 border border-amber-200/50 flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-gray-800 text-sm font-medium">{item?.title}</p>
                          <p className="text-gray-500 text-xs">{item?.subtitle}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            }

            return (
              <div key={section.id} className="border-b border-amber-200/30 bg-white/50 backdrop-blur-sm rounded-lg mb-1 overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-3 px-3 text-left"
                >
                  <span className="text-sm font-semibold text-gray-800">
                    {section.title}
                  </span>
                  {isSectionExpanded(section.id) ? (
                    <ChevronUp className="w-4 h-4 text-amber-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-amber-600" />
                  )}
                </button>
                {isSectionExpanded(section.id) && (
                  <div className="pb-3 px-3">
                    {content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Product Categories Column */}
          {showCategories && (
            <div>
              <h3 className="text-gray-800 font-semibold mb-4 text-sm uppercase tracking-wider">
                {productCategoriesTitle}
              </h3>
              <ul className="space-y-2">
                {categories?.slice(0, 8).map((category) => (
                  <li key={category?._id}>
                    <Link
                      href={`/category/${category?.slug?.current}`}
                      className="text-gray-600 hover:text-amber-700 text-sm flex items-center gap-2 group transition-colors"
                    >
                      <ChevronRight className="w-3 h-3 text-amber-600 group-hover:text-amber-700 transition-colors" />
                      {category?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Service Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-sm uppercase tracking-wider">
              {serviceTitle}
            </h3>
            <ul className="space-y-2">
              {serviceLinks?.map((link: LinkItem) => (
                <li key={link?.title}>
                  <Link
                    href={link?.href}
                    className="text-gray-600 hover:text-amber-700 text-sm flex items-center gap-2 group transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-amber-600 group-hover:text-amber-700 transition-colors" />
                    {link?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-sm uppercase tracking-wider">
              {companyTitle}
            </h3>
            <ul className="space-y-2">
              {companyLinks?.map((link: LinkItem) => (
                <li key={link?.title}>
                  <Link
                    href={link?.href}
                    className="text-gray-600 hover:text-amber-700 text-sm flex items-center gap-2 group transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-amber-600 group-hover:text-amber-700 transition-colors" />
                    {link?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-sm uppercase tracking-wider">
              {contactTitle}
            </h3>
            <ul className="space-y-3">
              {contactItems?.map((item: ContactItem) => {
                const Icon = iconMap[item?.icon as keyof typeof iconMap] || MapPin;
                return (
                  <li key={item?.title} className="flex items-start gap-3 group">
                    <div className="p-1.5 rounded-full bg-amber-100/60 group-hover:bg-amber-700 transition-all duration-300 flex-shrink-0">
                      <Icon className="w-4 h-4 text-amber-700 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-gray-800 text-sm font-medium">{item?.title}</p>
                      <p className="text-gray-500 text-xs">{item?.subtitle}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>

      {/* Payment Methods - Mobile Optimized */}
      <div className="border-t border-amber-200/30 bg-gradient-to-r from-amber-50/40 via-orange-50/30 to-white">
        <Container className="py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <h3 className="text-xs md:text-sm font-semibold text-gray-800">
              {paymentTitle}
            </h3>
            <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
              {paymentMethodsList?.slice(0, isMobile ? 4 : 8).map((method: string) => (
                <span
                  key={method}
                  className="px-2.5 py-1 md:px-4 md:py-2 bg-white/80 backdrop-blur-sm border border-amber-200/50 rounded-lg text-[10px] md:text-sm text-gray-600 hover:border-amber-300 hover:bg-amber-50/60 transition-all duration-300"
                >
                  {paymentMethods[method as keyof typeof paymentMethods] || method}
                </span>
              ))}
              {isMobile && paymentMethodsList.length > 4 && (
                <span className="px-2.5 py-1 text-[10px] text-gray-400">
                  +{paymentMethodsList.length - 4}
                </span>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar - Mobile Optimized */}
      <div className="border-t border-amber-200/30 bg-gradient-to-r from-amber-50/40 via-orange-50/30 to-white">
        <Container className="py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-[10px] md:text-sm text-gray-500 order-2 md:order-1">
              {copyrightText}
            </p>
            <nav className="flex flex-wrap justify-center gap-2 md:gap-4 order-1 md:order-2">
              {bottomLinks?.slice(0, isMobile ? 3 : 6).map((link: LinkItem) => (
                <Link
                  key={link?.title}
                  href={link?.href}
                  className="text-[9px] md:text-xs text-gray-400 hover:text-amber-700 transition-colors"
                >
                  {link?.title}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </div>
      <FloatingWhatsApp />
    </footer>
  );
};

export default Footer;