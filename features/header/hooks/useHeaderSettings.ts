// src/features/header/hooks/useHeaderSettings.ts
import { useQuery } from '@tanstack/react-query';
import { client, urlFor } from '@/lib/sanity';

export interface SocialLink {
  platform: string;
  url: string;
  enabled: boolean;
}

export interface AnnouncementBar {
  enabled: boolean;
  backgroundColor: string;
  textColor: string;
  messages: string[];
  autoplay: boolean;
  height: string;
}

export interface CurrencySettings {
  enabled: boolean;
  currencies: string[];
  defaultCurrency: string;
  languages: string[];
  defaultLanguage: string;
}

export interface Logo {
  image?: any;
  imageUrl?: string;
  alt: string;
  href: string;
  width: number;
  height: number;
  mobileWidth: number;
  mobileHeight: number;
}

export interface Search {
  enabled: boolean;
  placeholder: string;
  placeholderMobile: string;
  backgroundColor: string;
  borderColor: string;
  borderRadius: string;
}

export interface HeaderActions {
  showAccount: boolean;
  showWishlist: boolean;
  showCompare: boolean;
  showCart: boolean;
  accountHref: string;
  wishlistHref: string;
  compareHref: string;
  iconColor: string;
  hoverColor: string;
}

export interface CategoriesButton {
  enabled: boolean;
  label: string;
  backgroundColor: string;
  textColor: string;
  hoverTextColor: string;
}

export interface CallUs {
  enabled: boolean;
  label: string;
  number: string;
  iconColor: string;
  textColor: string;
  hoverColor: string;
}

export interface NavigationChild {
  id: string;
  label: string;
  href: string;
  comingSoon?: boolean;
}

export interface MegaMenuColumn {
  heading: string;
  links: NavigationChild[];
}

export interface MegaCategoryCard {
  id: string;
  label: string;
  href: string;
  image: string;
  itemCount?: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  type: 'link' | 'dropdown' | 'megamenu';
  children?: NavigationChild[];
  megaColumns?: MegaMenuColumn[];
  categoryCards?: MegaCategoryCard[];
  order?: number;
}

export interface BottomNavItem {
  id: string;
  label: string;
  href: string;
  icon: 'home' | 'shop' | 'heart' | 'cart' | 'user' | 'search' | 'categories';
  showBadge: boolean;
  order: number;
}

export interface DesktopNav {
  enabled: boolean;
  linkColor: string;
  activeColor: string;
  fontSize: string;
  gap: string;
  items: NavigationItem[];
}

export interface BottomNav {
  enabled: boolean;
  backgroundColor: string;
  activeColor: string;
  inactiveColor: string;
  height: string;
  borderColor: string;
  items: BottomNavItem[];
}

export interface MobileNavItem extends NavigationItem {
  // Mobile-specific properties can be added here
}

export interface MobileNav {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  showCategoriesTab: boolean;
  menuTabLabel: string;
  categoriesTabLabel: string;
  wishlistLabel: string;
  accountLabel: string;
  loginLabel: string;
  registerLabel: string;
  loginHref: string;
  registerHref: string;
  items?: MobileNavItem[]; // ✅ Added mobile-specific navigation items
}

export interface Colors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderColor: string;
  backgroundColor: string;
}

export interface Sticky {
  enabled: boolean;
  shadowOnScroll: boolean;
  topOffset: string;
}

export interface HeaderSettings {
  announcementBar: AnnouncementBar;
  socialLinks: SocialLink[];
  currencySettings: CurrencySettings;
  logo: Logo;
  search: Search;
  headerActions: HeaderActions;
  categoriesButton: CategoriesButton;
  callUs: CallUs;
  desktopNav: DesktopNav;
  bottomNav: BottomNav;
  mobileNav: MobileNav;
  colors: Colors;
  sticky: Sticky;
}

// Query fragments for better maintainability
const NAVIGATION_ITEM_FRAGMENT = `
  _id,
  label,
  href,
  type,
  order,
  children[] {
    _id,
    label,
    href,
    comingSoon
  },
  megaColumns[] {
    heading,
    links[] {
      _id,
      label,
      href,
      comingSoon
    }
  },
  categoryCards[] {
    _id,
    label,
    href,
    image,
    itemCount
  }
`;

const DESKTOP_NAV_FRAGMENT = `
  enabled,
  linkColor,
  activeColor,
  fontSize,
  gap,
  items[] {
    ${NAVIGATION_ITEM_FRAGMENT}
  }
`;

const MOBILE_NAV_FRAGMENT = `
  backgroundColor,
  textColor,
  accentColor,
  showCategoriesTab,
  menuTabLabel,
  categoriesTabLabel,
  wishlistLabel,
  accountLabel,
  loginLabel,
  registerLabel,
  loginHref,
  registerHref,
  items[] {
    ${NAVIGATION_ITEM_FRAGMENT}
  }
`;

export function useHeaderSettings() {
  const query = `
    *[_type == "headerSettings"][0] {
      announcementBar,
      socialLinks,
      currencySettings,
      logo {
        image,
        imageUrl,
        alt,
        href,
        width,
        height,
        mobileWidth,
        mobileHeight
      },
      search,
      headerActions,
      categoriesButton,
      callUs,
      desktopNav {
        ${DESKTOP_NAV_FRAGMENT}
      },
      bottomNav {
        enabled,
        backgroundColor,
        activeColor,
        inactiveColor,
        height,
        borderColor,
        items[] {
          _id,
          label,
          href,
          icon,
          showBadge,
          order
        }
      },
      mobileNav {
        ${MOBILE_NAV_FRAGMENT}
      },
      colors,
      sticky
    }
  `;

  return useQuery({
    queryKey: ['headerSettings'],
    queryFn: async () => {
      try {
        const data = await client.fetch(query);
        
        if (!data) {
          return null;
        }

        // Process logo image URL if uploaded
        if (data.logo?.image) {
          data.logo.imageUrl = urlFor(data.logo.image).url();
        }

        // Process category card images in desktop nav
        if (data.desktopNav?.items) {
          data.desktopNav.items = data.desktopNav.items.map((item: NavigationItem) => {
            if (item.categoryCards) {
              item.categoryCards = item.categoryCards.map((card: MegaCategoryCard) => ({
                ...card,
                // If card has image reference, process it
                image: card.image ? urlFor(card.image).url() : card.image,
              }));
            }
            return item;
          });
        }

        // Process category card images in mobile nav
        if (data.mobileNav?.items) {
          data.mobileNav.items = data.mobileNav.items.map((item: NavigationItem) => {
            if (item.categoryCards) {
              item.categoryCards = item.categoryCards.map((card: MegaCategoryCard) => ({
                ...card,
                image: card.image ? urlFor(card.image).url() : card.image,
              }));
            }
            return item;
          });
        }

        // Ensure mobileNav has default items if not provided
        if (data.mobileNav && !data.mobileNav.items) {
          data.mobileNav.items = [];
        }

        return data as HeaderSettings;
      } catch (error) {
        console.error('Error fetching header settings:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

// Helper hook to get only mobile navigation items
export function useMobileNavItems() {
  const { data, isLoading, error } = useHeaderSettings();
  
  return {
    items: data?.mobileNav?.items || [],
    settings: data?.mobileNav || null,
    isLoading,
    error,
  };
}

// Helper hook to get only desktop navigation items
export function useDesktopNavItems() {
  const { data, isLoading, error } = useHeaderSettings();
  
  return {
    items: data?.desktopNav?.items || [],
    settings: data?.desktopNav || null,
    isLoading,
    error,
  };
}

// Helper to get navigation items based on storefront
export function useNavigationItems(storefront: 'grocery' | 'fashion' = 'grocery') {
  const { data, isLoading, error } = useHeaderSettings();
  
  // If we have specific items for this storefront, use them
  // Otherwise fall back to the main items
  const items = data?.mobileNav?.items || data?.desktopNav?.items || [];
  
  // You could also filter items by storefront if you have that data
  // For now, we're returning all items
  
  return {
    items,
    settings: data?.mobileNav || data?.desktopNav || null,
    isLoading,
    error,
  };
}

// Helper to get bottom navigation items
export function useBottomNavItems() {
  const { data, isLoading, error } = useHeaderSettings();
  
  return {
    items: data?.bottomNav?.items || [],
    settings: data?.bottomNav || null,
    isLoading,
    error,
  };
}