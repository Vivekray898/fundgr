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
  Logs, 
  Truck, 
  CheckCircle, 
  Store, 
  Shield,
  Star,
  Heart,
  User,
  ShoppingCart
} from "lucide-react";
import { getMyOrders } from "@/sanity/queries";
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
  
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }

  // Defaults
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
  const showMobileSearchRow = headerData?.mobile?.showSearchRow !== false;
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

  // Cast categoryParent to the expected type
  const categoryParent = headerData?.navigation?.categoryParent as { _id: string; title: string } | undefined;

  return (
    <>
      {/* Non-sticky Header */}
      <header className="bg-white shadow-sm">
        {/* Top Bar - Desktop only */}
        {topBarEnabled && (
          <div className="hidden lg:block bg-gradient-to-r from-rose-50 via-pink-50 to-blue-50 border-b border-rose-100">
            <Container className="flex items-center justify-between py-2 text-xs text-gray-600">
              {/* Left side - Trust badges */}
              <div className="flex items-center gap-8">
                {trustBadges.map((badge, index) => {
                  const IconComponent = iconMap[badge.icon as keyof typeof iconMap];
                  return (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      {IconComponent && <IconComponent className="w-4 h-4 text-rose-500" />}
                      <span>{badge.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Right side - Service links */}
              <nav className="flex items-center gap-6">
                {serviceLinks.map((link, index) => {
                  if (link.isStoreLocator && showStoreLocator) {
                    return <StoreLocator key={index} trigger="link" settings={storeLocatorSettings} />;
                  }
                  return (
                    <Link 
                      key={index} 
                      href={link.url} 
                      className="hover:text-rose-500 hoverEffect"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </Container>
          </div>
        )}

        {/* Main Header - Logo Left, Search Center (Desktop), Actions Right */}
        <Container className="flex items-center justify-between py-3 lg:py-4">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-3 lg:gap-4">
            <MobileMenu 
              menuItems={headerData?.mobile?.menuItems || headerData?.navigation?.items}
              searchPlaceholder={searchPlaceholder}
              storeLocatorSettings={storeLocatorSettings}
              useCategories={useCategories}
            />
            <Logo logoData={headerData?.logo} />
          </div>

          {/* Center: Search Bar (Desktop ONLY - NOT mobile) */}
          <div className="hidden lg:block flex-1 max-w-[500px] mx-8">
            <SearchBar isFullWidth />
          </div>

          {/* Right: Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Wishlist */}
            {showWishlist && (
              <Link href="/wishlist" className="flex flex-col items-center gap-1 group">
                <Heart className="w-6 h-6 text-gray-600 group-hover:text-rose-500 transition-colors" />
                <span className="text-xs text-gray-500 group-hover:text-rose-500">Einkaufsliste</span>
              </Link>
            )}
            
            {/* Cart */}
            {showCart && (
              <Link href="/cart" className="flex flex-col items-center gap-1 group">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-rose-500 transition-colors" />
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white h-4 w-4 rounded-full text-[10px] font-semibold flex items-center justify-center">0</span>
                </div>
                <span className="text-xs text-gray-500 group-hover:text-rose-500">Warenkorb</span>
              </Link>
            )}
            
            {/* Account - Using Clerk's SignInButton for popup */}
            {showLogin && (
              <ClerkLoaded>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                {!user && (
                  <SignInButton mode="modal">
                    <button className="flex flex-col items-center gap-1 group focus:outline-none">
                      <User className="w-6 h-6 text-gray-600 group-hover:text-rose-500 transition-colors" />
                      <span className="text-xs text-gray-500 group-hover:text-rose-500">Mein Konto</span>
                    </button>
                  </SignInButton>
                )}
              </ClerkLoaded>
            )}
          </div>

          {/* Right: Actions (Mobile - Icons only) */}
          <div className="flex lg:hidden items-center gap-4">
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
        </Container>

        {/* REMOVED: Mobile Search Bar from here - it was causing duplicates */}
      </header>

      {/* Sticky Bottom Navigation - Desktop Only */}
      <div className="sticky top-0 z-50 hidden lg:block bg-white border-b border-rose-100 shadow-sm">
        <Container className="flex items-center justify-between">
          {/* Left: Sortiment Hamburger + Nav Items (Desktop) */}
          <HeaderMenu 
            menuItems={headerData?.navigation?.items}
            useCategories={useCategories}
            categoryParent={categoryParent}
            storeLocatorSettings={storeLocatorSettings}
          />
          
          {/* Right: Mein Markt (Store Locator) - Desktop */}
          <div className="flex items-center">
            <StoreLocator 
              trigger="link"
              settings={storeLocatorSettings}
              className="text-rose-500 hover:text-rose-600 hoverEffect rounded-md px-4 py-3 flex items-center gap-2"
            />
          </div>
        </Container>
      </div>

      {/* Sticky Mobile Search Bar - Mobile ONLY */}
      <div className="sticky top-0 z-50 lg:hidden bg-white border-b border-rose-100 shadow-sm py-2 px-4">
        <SearchBar isMobile isFullWidth />
      </div>
    </>
  );
};

export default Header;