// components/Footer.tsx
"use client";
import React, { useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import { SubText, SubTitle } from "./ui/text";
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
  Music2 
} from "lucide-react";

// Payment methods mapping
const paymentMethods = {
  paypal: "PayPal",
  wero: "Wero",
  invoice: "The Invoice",
  creditCard: "Credit Card",
  prepayment: "Prepayment",
  financing: "Financing",
  instantBank: "Instant Bank Transfer",
  directDebit: "Direct Debit",
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

const Footer = () => {
  const [expandedColumns, setExpandedColumns] = useState<string[]>([]);
  const [footerData, setFooterData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch footer data
  React.useEffect(() => {
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

  const toggleColumn = (column: string) => {
    setExpandedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  // Defaults
  const aboutDescription = footerData?.about?.description || 
    "Discover curated furniture collections at FundGrube-Bestpreisyt, blending style and comfort to elevate your living spaces.";
  
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
  const productCategoriesTitle = footerData?.productCategories?.title || "Our Product Range";
  const showCategories = footerData?.productCategories?.showCategories !== false;

  // Service Links
  const serviceTitle = footerData?.serviceLinks?.title || "Service";
  const serviceLinks = footerData?.serviceLinks?.links || [
    { title: "Bonus Card", href: "/bonus" },
    { title: "Machine Rental", href: "/machine-rental" },
    { title: "Returns & Complaints", href: "/returns" },
    { title: "All Services", href: "/services" },
    { title: "Newsletter", href: "/newsletter" },
  ];

  // Company Links
  const companyTitle = footerData?.companyLinks?.title || "About Us";
  const companyLinks = footerData?.companyLinks?.links || [
    { title: "About Us", href: "/about" },
    { title: "Sustainability", href: "/sustainability" },
    { title: "Jobs", href: "/careers" },
    { title: "Press", href: "/press" },
    { title: "All Markets", href: "/markets" },
  ];

  // Contact Info
  const contactTitle = footerData?.contactInfo?.title || "Do You Have Questions?";
  const contactItems = footerData?.contactInfo?.items || [
    { icon: "mapPin", title: "Visit Us", subtitle: "123 Main Street, Berlin, Germany" },
    { icon: "phone", title: "Call Us", subtitle: "+49 123 456 789" },
    { icon: "clock", title: "Working Hours", subtitle: "Mon - Sat: 9:00 AM - 8:00 PM" },
    { icon: "mail", title: "Email Us", subtitle: "info@fundgrube.de" },
  ];

  // Payment Methods
  const paymentTitle = footerData?.paymentMethods?.title || "Pay Conveniently!";
  const paymentMethodsList = footerData?.paymentMethods?.methods || [
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
  const bottomLinks = footerData?.bottomBar?.bottomLinks || [
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Right of Withdrawal", href: "/withdrawal" },
    { title: "Imprint", href: "/imprint" },
    { title: "Data Protection", href: "/privacy" },
    { title: "Accessibility", href: "/accessibility" },
    { title: "Cookie Settings", href: "/cookies" },
  ];

  const iconMap = {
    mapPin: MapPin,
    phone: Phone,
    clock: Clock,
    mail: Mail,
  };

  return (
    <footer className="bg-gradient-to-br from-rose-50 via-pink-50 to-blue-50 text-gray-800 border-t border-pink-100 mt-12 md:mt-16 lg:mt-20">
      {/* Main Footer Content */}
      <Container className="py-12">
        {/* Logo + About Section */}
        <div className="mb-10">
          <div className="mb-4">
            <Logo logoData={footerData?.logo} className="text-gray-800" />
          </div>
          <p className="text-gray-600 text-sm max-w-md">
            {aboutDescription}
          </p>
          {showSocialMedia && (
            <div className="flex items-center gap-3 mt-6">
              {Object.entries(socialMediaLinks).map(([key, href]) => {
                if (!href) return null;
                const Icon = socialIcons[key as keyof typeof socialIcons];
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-pink-200 text-gray-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-lg transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Product Categories Column */}
          {showCategories && (
            <div>
              <h3 className="text-gray-800 font-semibold mb-4 text-lg bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                {productCategoriesTitle}
              </h3>
              <ul className="space-y-2">
                {categories?.map((category) => (
                  <li key={category?._id}>
                    <Link
                      href={`/category/${category?.slug?.current}`}
                      className="text-gray-600 hover:text-rose-600 hoverEffect text-sm flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 text-rose-400 group-hover:text-rose-600 transition-colors" />
                      {category?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Service Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-lg bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {serviceTitle}
            </h3>
            <ul className="space-y-2">
              {serviceLinks?.map((link) => (
                <li key={link?.title}>
                  <Link
                    href={link?.href}
                    className="text-gray-600 hover:text-rose-600 hoverEffect text-sm flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 text-rose-400 group-hover:text-rose-600 transition-colors" />
                    {link?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-lg bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {companyTitle}
            </h3>
            <ul className="space-y-2">
              {companyLinks?.map((link) => (
                <li key={link?.title}>
                  <Link
                    href={link?.href}
                    className="text-gray-600 hover:text-rose-600 hoverEffect text-sm flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 text-rose-400 group-hover:text-rose-600 transition-colors" />
                    {link?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-lg bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {contactTitle}
            </h3>
            <ul className="space-y-3">
              {contactItems?.map((item) => {
                const Icon = iconMap[item?.icon as keyof typeof iconMap] || MapPin;
                return (
                  <li key={item?.title} className="flex items-start gap-3 group">
                    <div className="p-1.5 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 group-hover:from-rose-500 group-hover:to-pink-500 transition-all duration-300">
                      <Icon className="w-4 h-4 text-rose-500 group-hover:text-white transition-colors" />
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

      {/* Payment Methods */}
      <div className="border-t border-pink-200/50">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="text-gray-800 font-semibold text-lg bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              {paymentTitle}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {paymentMethodsList?.map((method) => (
                <span
                  key={method}
                  className="px-4 py-2 bg-white/70 backdrop-blur-sm border border-pink-200 rounded-lg text-sm text-gray-700 hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {paymentMethods[method as keyof typeof paymentMethods] || method}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-pink-200/50 bg-gradient-to-r from-rose-50/50 via-pink-50/50 to-blue-50/50">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              {copyrightText}
            </p>
            <nav className="flex flex-wrap justify-center gap-4">
              {bottomLinks?.map((link) => (
                <Link
                  key={link?.title}
                  href={link?.href}
                  className="text-gray-500 hover:text-rose-600 hoverEffect text-xs"
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