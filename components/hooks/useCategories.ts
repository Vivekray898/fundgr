// components/hooks/useCategories.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

// Updated interface to match your category schema
export interface Category {
  _id: string;
  title: string;
  slug: { current: string } | string;
  description?: string;
  teaserSubtitle?: string;
  range?: number;
  image?: string;
  icon?: string;
  categoryIcon?: string;
  parent?: {
    _id: string;
    title: string;
    slug: { current: string } | string;
  } | null;
  order: number;
  isActive?: boolean;
  featured: boolean;
  showInNavigation: boolean;
  isSeasonal: boolean;
  seasonalMessage?: string;
  seasonalStart?: string;
  seasonalEnd?: string;
  seasonalIcon?: string;
  children?: Category[];
}

export interface UseCategoriesOptions {
  includeInactive?: boolean;
  includeSubCategories?: boolean;
  featuredOnly?: boolean;
  showInNavigationOnly?: boolean;
  limit?: number;
  parentId?: string | null;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const {
    includeInactive = false,
    includeSubCategories = true,
    featuredOnly = false,
    showInNavigationOnly = true,
    limit,
    parentId,
  } = options;

  // Build the query based on options
  const buildQuery = () => {
    let conditions = ['_type == "category"'];

    // Filter by parent
    if (parentId === null) {
      conditions.push('!defined(parent)');
    } else if (parentId) {
      conditions.push(`parent._ref == "${parentId}"`);
    }

    // Filter by active status - using the field from your schema
    // Note: Your schema doesn't have an explicit 'isActive' field
    // Using 'showInNavigation' as a proxy for active status
    if (!includeInactive) {
      conditions.push('showInNavigation == true');
    }

    // Filter by featured
    if (featuredOnly) {
      conditions.push('featured == true');
    }

    // Filter by navigation visibility
    if (showInNavigationOnly) {
      conditions.push('showInNavigation == true');
    }

    const where = conditions.join(' && ');
    const orderBy = 'order asc, title asc';
    const limitClause = limit ? `[0...${limit}]` : '';

    return `
      *[${where}] | order(${orderBy}) ${limitClause} {
        _id,
        title,
        slug,
        description,
        teaserSubtitle,
        range,
        image,
        icon,
        categoryIcon,
        "parent": parent->{
          _id,
          title,
          slug
        },
        order,
        featured,
        showInNavigation,
        isSeasonal,
        seasonalMessage,
        seasonalStart,
        seasonalEnd,
        seasonalIcon
      }
    `;
  };

  return useQuery({
    queryKey: ['categories', { includeInactive, includeSubCategories, featuredOnly, showInNavigationOnly, limit, parentId }],
    queryFn: async () => {
      try {
        const query = buildQuery();
        const data = await client.fetch(query);

        if (!data || data.length === 0) {
          return [];
        }

        // Process categories
        const processedCategories = data.map((cat: any) => {
          const category: Category = {
            _id: cat._id,
            title: cat.title,
            slug: cat.slug?.current || cat.slug || '',
            description: cat.description || '',
            teaserSubtitle: cat.teaserSubtitle || '',
            range: cat.range || 0,
            image: cat.image ? urlFor(cat.image).url() : undefined,
            icon: cat.icon || '',
            categoryIcon: cat.categoryIcon || '',
            parent: cat.parent || null,
            order: cat.order || 0,
            featured: cat.featured || false,
            showInNavigation: cat.showInNavigation ?? true,
            isSeasonal: cat.isSeasonal || false,
            seasonalMessage: cat.seasonalMessage || '',
            seasonalStart: cat.seasonalStart || '',
            seasonalEnd: cat.seasonalEnd || '',
            seasonalIcon: cat.seasonalIcon || '',
            children: [],
          };

          return category;
        });

        // If we need to include subcategories, build the tree
        if (includeSubCategories) {
          return buildCategoryTree(processedCategories);
        }

        return processedCategories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Helper hook to get top-level categories (no parent)
export function useTopLevelCategories(options: Omit<UseCategoriesOptions, 'parentId'> = {}) {
  return useCategories({
    ...options,
    parentId: null,
  });
}

// Helper hook to get subcategories for a specific parent
export function useSubCategories(parentId: string, options: Omit<UseCategoriesOptions, 'parentId'> = {}) {
  return useCategories({
    ...options,
    parentId,
  });
}

// Helper hook to get featured categories
export function useFeaturedCategories(options: Omit<UseCategoriesOptions, 'featuredOnly'> = {}) {
  return useCategories({
    ...options,
    featuredOnly: true,
  });
}

// Helper hook to get seasonal categories
export function useSeasonalCategories(options: Omit<UseCategoriesOptions, 'parentId'> = {}) {
  const { data: allCategories, ...rest } = useCategories(options);
  
  // Filter for seasonal categories
  const seasonalCategories = allCategories?.filter((cat) => cat.isSeasonal) || [];
  
  return {
    ...rest,
    data: seasonalCategories,
    allData: allCategories || [],
  };
}

// Helper function to build a category tree
export function buildCategoryTree(categories: Category[]): Category[] {
  if (!categories || categories.length === 0) return [];

  // Create a map of all categories by ID
  const categoryMap: Record<string, Category> = {};
  categories.forEach((cat) => {
    categoryMap[cat._id] = { ...cat, children: [] };
  });

  // Build the tree
  const tree: Category[] = [];

  categories.forEach((cat) => {
    const category = categoryMap[cat._id];
    if (cat.parent) {
      const parent = categoryMap[cat.parent._id];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(category);
      }
    } else {
      tree.push(category);
    }
  });

  // Sort children by order
  tree.forEach((cat) => {
    if (cat.children) {
      cat.children.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  });

  return tree.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Helper function to flatten a category tree
export function flattenCategoryTree(categories: Category[]): Category[] {
  const result: Category[] = [];

  const traverse = (cats: Category[]) => {
    cats.forEach((cat) => {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children);
      }
    });
  };

  traverse(categories);
  return result;
}