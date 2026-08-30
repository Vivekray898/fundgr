// components/Header.tsx
import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import StoreLocator from "./StoreLocator";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Truck, 
  CheckCircle, 
  Store, 
  Shield,
  Star,
  Heart,
  User,
  ShoppingCart
} from "lucide-react";
import { getHeaderData } from "@/sanity/queries/header";

// Icon mapping
const iconMap = {
  truck: Truck,
  checkCircle: CheckCircle,
  store: Store,
  shield: Shield,
  star: Star,
  heart: Heart,
};

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  const headerData = await getHeaderData();

  // Defaults with memoized values
  const topBarEnabled = headerData?.topBar?.enabled !== false;
  const trustBadges = headerData?.topBar?.trustBadges || [
    { icon: "truck", text: "Kostenlose Rücksendung" },
    { icon: "checkCircle", text: "Verfügbarkeit im Markt prüfen" },
    { icon: "store", text: "Reservieren & abholen" },
  ];
  const serviceLinks = headerData?.topBar?.serviceLinks || [
    { label: "Bonuskarte", url: "/bonus" },
    { label: "Service", url: "/service" },
    { label: "Hilfe & Kontakt", url: "/help" },
    { label: "Jobs", url: "/careers" },
    { label: "Mein Markt", url: "#", isStoreLocator: true },
  ];
  const showWishlist = headerData?.actions?.showWishlist !== false;
  const showCart = headerData?.actions?.showCart !== false;
  const showLogin = headerData?.actions?.showLogin !== false;
  const showStoreLocator = headerData?.actions?.showStoreLocator !== false;
  const searchPlaceholder = headerData?.searchBar?.placeholder || "Wonach suchen Sie?";
  const useCategories = headerData?.navigation?.useCategories || false;

  // Store locator settings
  const storeLocatorSettings = {
    title: headerData?.storeLocator?.title || "Mein Markt",
    placeholder: headerData?.storeLocator?.placeholder || "Markt suchen...",
    changeStoreText: headerData?.storeLocator?.changeStoreText || "Markt ändern",
    storePageText: headerData?.storeLocator?.storePageText || "Zum Markt",
    addressLabel: headerData?.storeLocator?.addressLabel || "Adresse",
    contactLabel: headerData?.storeLocator?.contactLabel || "Kontakt",
    openingHoursLabel: headerData?.storeLocator?.openingHoursLabel || "Öffnungszeiten",
    distanceLabel: headerData?.storeLocator?.distanceLabel || "Entfernung",
    routeLabel: headerData?.storeLocator?.routeLabel || "Route planen",
    noStoresFound: headerData?.storeLocator?.noStoresFound || "Keine Märkte gefunden",
    backLabel: headerData?.storeLocator?.backLabel || "Zurück",
    stores: headerData?.storeLocator?.stores || [],
  };

  const categoryParent = headerData?.navigation?.categoryParent as { _id: string; title: string } | undefined;

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm">
        {/* Top Bar - Desktop only */}
        {topBarEnabled && (
          <div className="hidden lg:block bg-gradient-to-r from-rose-50 via-pink-50 to-blue-50 border-b border-rose-100">
            <Container className="flex items-center justify-between py-1.5 text-xs text-gray-600">
              {/* Trust badges - Compact */}
              <div className="flex items-center gap-6">
                {trustBadges.map((badge, index) => {
                  const IconComponent = iconMap[badge.icon as keyof typeof iconMap];
                  return (
                    <div key={index} className="flex items-center gap-1.5 text-gray-600">
                      {IconComponent && <IconComponent className="w-3.5 h-3.5 text-rose-500" />}
                      <span>{badge.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Service links */}
              <nav className="flex items-center gap-5">
                {serviceLinks.map((link, index) => {
                  if (link.isStoreLocator && showStoreLocator) {
                    return <StoreLocator key={index} trigger="link" settings={storeLocatorSettings} />;
                  }
                  return (
                    <Link 
                      key={index} 
                      href={link.url} 
                      className="hover:text-rose-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </Container>
          </div>
        )}

        {/* Main Header - Mobile optimized */}
        <Container className="flex items-center justify-between py-2 lg:py-3">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-2 lg:gap-4">
            <MobileMenu 
              menuItems={headerData?.mobile?.menuItems || headerData?.navigation?.items}
              searchPlaceholder={searchPlaceholder}
              storeLocatorSettings={storeLocatorSettings}
              useCategories={useCategories}
            />
            <Logo logoData={headerData?.logo} />
          </div>

          {/* Center: Search Bar (Desktop only) */}
          <div className="hidden lg:block flex-1 max-w-[500px] mx-6">
            <SearchBar isFullWidth />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-5">
              {showWishlist && (
                <div className="flex flex-col items-center gap-0.5 group">
                  <FavoriteButton showProduct={false} />
                  <span className="text-[10px] text-gray-500 group-hover:text-rose-500">Merkliste</span>
                </div>
              )}
              
              {showCart && (
                <Link href="/cart" className="flex flex-col items-center gap-0.5 group">
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-rose-500 transition-colors" />
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white h-4 w-4 rounded-full text-[9px] font-semibold flex items-center justify-center">0</span>
                  </div>
                  <span className="text-[10px] text-gray-500 group-hover:text-rose-500">Warenkorb</span>
                </Link>
              )}
              
              {showLogin && (
                <ClerkLoaded>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  {!user && (
                    <SignInButton mode="modal">
                      <button className="flex flex-col items-center gap-0.5 group focus:outline-none">
                        <User className="w-5 h-5 text-gray-600 group-hover:text-rose-500 transition-colors" />
                        <span className="text-[10px] text-gray-500 group-hover:text-rose-500">Konto</span>
                      </button>
                    </SignInButton>
                  )}
                </ClerkLoaded>
              )}
            </div>

            {/* Mobile Actions - Icons only */}
            <div className="flex lg:hidden items-center gap-2">
              {showWishlist && <FavoriteButton />}
              {showCart && <CartIcon />}
              {showLogin && (
                <ClerkLoaded>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  {!user && <SignIn />}
                </ClerkLoaded>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* Sticky Navigation - Desktop */}
      <div className="sticky top-0 z-40 hidden lg:block bg-white border-b border-rose-100 shadow-sm">
        <Container className="flex items-center justify-between">
          <HeaderMenu 
            menuItems={headerData?.navigation?.items}
            useCategories={useCategories}
            categoryParent={categoryParent}
            storeLocatorSettings={storeLocatorSettings}
          />
          <StoreLocator 
            trigger="link"
            settings={storeLocatorSettings}
            className="text-rose-500 hover:text-rose-600 px-3 py-2.5 flex items-center gap-1.5 text-sm font-medium"
          />
        </Container>
      </div>

      {/* Mobile Search Bar - Sticky */}
      <div className="sticky top-0 z-40 lg:hidden bg-white border-b border-rose-100 py-2 px-4">
        <SearchBar isMobile isFullWidth />
      </div>
    </>
  );
};

export default Header;