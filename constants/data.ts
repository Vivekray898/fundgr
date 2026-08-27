// constants/data.ts
import { getTopLevelCategories, getAllCategories } from "@/sanity/queries/categories";

// Static exports for client components
export const headerData = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/shop" },
  { title: "Blog", href: "/blog" },
  { title: "Hot Deal", href: "/deal" },
];

export const quickLinksData = [
  { title: "About us", href: "/about" },
  { title: "Contact us", href: "/contact" },
  { title: "Terms & Conditions", href: "/terms" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "FAQs", href: "/faqs" },
  { title: "Help", href: "/help" },
];

// Static fallback for product type (used in client components)
export const productType = [
  { title: "All", value: "all" },
];

// Server-side functions to fetch from Sanity
export async function getHeaderData() {
  const categories = await getTopLevelCategories();
  
  return [
    ...headerData,
    ...categories.map((cat) => ({
      title: cat.title,
      href: `/category/${cat.slug?.current}`,
      category: cat,
    })),
  ];
}

export async function getQuickLinks() {
  return quickLinksData;
}

export async function getCategoriesData() {
  const categories = await getTopLevelCategories();
  
  return categories.map((cat) => ({
    title: cat.title,
    href: cat.slug?.current,
  }));
}

// Server-side function for product types
export async function getProductTypesFromSanity() {
  const categories = await getAllCategories();
  
  return categories.map((cat) => ({
    title: cat.title,
    value: cat.slug?.current,
  }));
}