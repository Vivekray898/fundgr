// sanity/queries/categories.ts
import { client } from "@/sanity/lib/client";

export interface CategoryData {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  icon?: string;
  description?: string;
  parent?: {
    _ref: string;
  };
  children?: CategoryData[];
}

// Get all top-level categories for navigation/footer
export const topLevelCategoriesQuery = `*[_type == "category" && showInNavigation == true && !defined(parent)] | order(order asc) {
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

export async function getTopLevelCategories(): Promise<CategoryData[]> {
  try {
    const data = await client.fetch(topLevelCategoriesQuery);
    return data || [];
  } catch (error) {
    console.error("Error fetching top-level categories:", error);
    return [];
  }
}

// Get all categories (flat list for filtering/selecting)
export const allCategoriesQuery = `*[_type == "category"] | order(order asc) {
  _id,
  title,
  slug,
  icon,
  description,
  parent
}`;

export async function getAllCategories(): Promise<CategoryData[]> {
  try {
    const data = await client.fetch(allCategoriesQuery);
    return data || [];
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
}