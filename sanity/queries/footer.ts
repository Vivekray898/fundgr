// sanity/queries/footer.ts
import { client } from "@/sanity/lib/client";

export interface FooterData {
  _id: string;
  logo: {
    image: {
      asset: {
        url: string;
      };
    };
    alt: string;
    width: number;
    height: number;
  };
  about: {
    description: string;
    showSocialMedia: boolean;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    pinterest?: string;
    tiktok?: string;
  };
  productCategories: {
    title: string;
    showCategories: boolean;
  };
  serviceLinks: {
    title: string;
    links: Array<{
      title: string;
      href: string;
    }>;
  };
  companyLinks: {
    title: string;
    links: Array<{
      title: string;
      href: string;
    }>;
  };
  contactInfo: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      subtitle: string;
    }>;
  };
  paymentMethods: {
    title: string;
    methods: string[];
  };
  bottomBar: {
    copyrightText: string;
    bottomLinks: Array<{
      title: string;
      href: string;
    }>;
  };
}

export const footerQuery = `*[_type == "footer"][0]{
  _id,
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
  about,
  socialMedia,
  productCategories,
  serviceLinks,
  companyLinks,
  contactInfo,
  paymentMethods,
  bottomBar
}`;

export async function getFooterData(): Promise<FooterData | null> {
  try {
    const data = await client.fetch(footerQuery);
    return data;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null;
  }
}

// FIXED: Only fetch TOP-LEVEL categories (no parent) for footer
export const footerCategoriesQuery = `*[_type == "category" && showInNavigation == true && !defined(parent)] | order(order asc) {
  _id,
  title,
  slug
}`;

export async function getFooterCategories() {
  try {
    const data = await client.fetch(footerCategoriesQuery);
    return data || [];
  } catch (error) {
    console.error("Error fetching footer categories:", error);
    return [];
  }
}