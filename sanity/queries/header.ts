// sanity/queries/header.ts
import { client } from "@/sanity/lib/client";

export interface CategoryData {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  icon?: string;
  description?: string;
  children?: CategoryData[];
}

export interface HeaderData {
  _id: string;
  topBar: {
    enabled: boolean;
    trustBadges: Array<{
      icon: string;
      text: string;
      link?: string;
    }>;
    serviceLinks: Array<{
      label: string;
      url: string;
      isStoreLocator?: boolean;
    }>;
  };
  logo: {
    image: any;
    alt: string;
    width: number;
    height: number;
  };
  navigation: {
    items: Array<{
      label: string;
      url: string;
      type?: string;
      category?: {
        _ref: string;
      };
      children?: Array<{
        label: string;
        url: string;
        type?: string;
        category?: {
          _ref: string;
        };
      }>;
    }>;
    useCategories?: boolean;
    categoryParent?: {
      _ref: string;
    };
  };
  actions: {
    showWishlist: boolean;
    showCart: boolean;
    showLogin: boolean;
    showStoreLocator: boolean;
  };
  searchBar: {
    placeholder: string;
    suggestions: string[];
  };
  mobile: {
    showSearchRow: boolean;
    menuItems: Array<{
      label: string;
      url: string;
      children?: Array<{
        label: string;
        url: string;
      }>;
    }>;
  };
  storeLocator?: {
    title: string;
    placeholder: string;
    changeStoreText: string;
    storePageText: string;
    addressLabel: string;
    contactLabel: string;
    openingHoursLabel: string;
    distanceLabel: string;
    routeLabel: string;
    noStoresFound: string;
    backLabel: string;
    stores?: Array<{
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
    }>;
  };
}

export const headerQuery = `*[_type == "header"][0]{
  _id,
  topBar,
  logo {
    image {
      asset->{
        _id,
        url
      }
    },
    alt,
    width,
    height
  },
  navigation {
    items[] {
      label,
      url,
      type,
      category->{
        _id,
        title,
        slug,
        icon
      },
      children[] {
        label,
        url,
        type,
        category->{
          _id,
          title,
          slug,
          icon
        }
      }
    },
    useCategories,
    categoryParent->{
      _id,
      title
    }
  },
  actions,
  searchBar,
  mobile,
  storeLocator {
    title,
    placeholder,
    changeStoreText,
    storePageText,
    addressLabel,
    contactLabel,
    openingHoursLabel,
    distanceLabel,
    routeLabel,
    noStoresFound,
    backLabel,
    stores[] {
      name,
      address,
      city,
      zip,
      phone,
      email,
      openingHours,
      "image": image.asset->url,
      latitude,
      longitude,
      distance,
      isDefault
    }
  }
}`;

export async function getHeaderData(): Promise<HeaderData | null> {
  try {
    const data = await client.fetch(headerQuery);
    return data;
  } catch (error) {
    console.error("Error fetching header data:", error);
    return null;
  }
}

// FIXED: Only fetch TOP-LEVEL categories (no parent) and include children
export const categoriesForNavQuery = `*[_type == "category" && showInNavigation == true && !defined(parent)] | order(order asc) {
  _id,
  title,
  slug,
  icon,
  description,
  "children": *[_type == "category" && parent._ref == ^._id && showInNavigation == true] | order(order asc) {
    _id,
    title,
    slug,
    icon,
    description
  }
}`;

export async function getCategoriesForNav(): Promise<CategoryData[]> {
  try {
    const data = await client.fetch(categoriesForNavQuery);
    return data || [];
  } catch (error) {
    console.error("Error fetching categories for nav:", error);
    return [];
  }
}