// src/features/grocery-shop/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import { client, urlFor } from '@/lib/sanity';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  icon?: string;
  itemCount: number;
  href: string;
  order: number;
  isActive: boolean;
  featured: boolean;
  description?: string;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  subCategories?: Category[];
  navigationSettings?: {
    showInCategoriesButton?: boolean;
    highlight?: boolean;
    badgeText?: string;
    badgeColor?: string;
  };
  storefronts?: string[];
}

export interface UseCategoriesOptions {
  storefront?: string;
  includeInactive?: boolean;
  includeSubCategories?: boolean;
  featuredOnly?: boolean;
  limit?: number;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const {
    storefront = 'grocery',
    includeInactive = false,
    includeSubCategories = true,
    featuredOnly = false,
    limit,
  } = options;

  // Build the query with proper filtering
  const buildQuery = () => {
    let conditions = ['_type == "category"'];

    // Filter by storefront
    if (storefront) {
      conditions.push(`"${storefront}" in storefronts`);
    }

    // Filter by active status
    if (!includeInactive) {
      conditions.push('isActive == true');
    }

    // Filter by featured
    if (featuredOnly) {
      conditions.push('featured == true');
    }

    const where = conditions.join(' && ');
    const orderBy = 'order asc, name asc';
    const limitClause = limit ? `[0...${limit}]` : '';

    return `
      *[${where}] | order(${orderBy}) ${limitClause} {
        _id,
        name,
        slug,
        image,
        icon,
        itemCount,
        href,
        order,
        isActive,
        featured,
        description,
        storefronts,
        navigationSettings,
        "parentCategory": parentCategory->{
          _id,
          name,
          "slug": slug.current
        }
      }
    `;
  };

  // Query for subcategories if needed
  const buildSubCategoriesQuery = (parentId: string) => {
    return `
      *[_type == "category" && isActive == true && parentCategory._ref == "${parentId}"] | order(order asc, name asc) {
        _id,
        name,
        slug,
        image,
        icon,
        itemCount,
        href,
        order,
        isActive,
        featured,
        navigationSettings
      }
    `;
  };

  return useQuery({
    queryKey: ['categories', storefront, includeInactive, includeSubCategories, featuredOnly, limit],
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
            name: cat.name,
            slug: cat.slug?.current || cat.slug || '',
            image: cat.image ? urlFor(cat.image).url() : '',
            icon: cat.icon ? urlFor(cat.icon).url() : undefined,
            itemCount: cat.itemCount || 0,
            href: cat.href || `/grocery/shop?category=${cat.slug?.current || cat.slug || ''}`,
            order: cat.order || 0,
            isActive: cat.isActive ?? true,
            featured: cat.featured || false,
            description: cat.description || '',
            storefronts: cat.storefronts || ['grocery'],
            navigationSettings: cat.navigationSettings || {},
            parentCategory: cat.parentCategory || undefined,
          };

          return category;
        });

        // If we need to include subcategories, fetch them
        if (includeSubCategories) {
          // Get all categories that have a parent
          const categoriesWithSubs = processedCategories.filter(
            (cat) => cat.parentCategory
          );

          // Group subcategories by parent ID
          const subCategoriesMap: Record<string, Category[]> = {};
          
          for (const cat of categoriesWithSubs) {
            const parentId = cat.parentCategory?._id;
            if (parentId) {
              if (!subCategoriesMap[parentId]) {
                subCategoriesMap[parentId] = [];
              }
              subCategoriesMap[parentId].push(cat);
            }
          }

          // Attach subcategories to their parents
          return processedCategories.map((cat) => {
            if (subCategoriesMap[cat._id]) {
              return {
                ...cat,
                subCategories: subCategoriesMap[cat._id],
              };
            }
            return cat;
          });
        }

        return processedCategories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

// Helper hook to get only top-level categories
export function useTopLevelCategories(options: Omit<UseCategoriesOptions, 'includeSubCategories'> = {}) {
  return useCategories({
    ...options,
    includeSubCategories: false,
  });
}

// Helper hook to get subcategories for a specific parent
export function useSubCategories(parentId: string, options: Omit<UseCategoriesOptions, 'includeSubCategories'> = {}) {
  const { storefront = 'grocery', includeInactive = false } = options;

  const query = `
    *[_type == "category" && isActive == true && parentCategory._ref == "${parentId}"] | order(order asc, name asc) {
      _id,
      name,
      slug,
      image,
      icon,
      itemCount,
      href,
      order,
      isActive,
      featured,
      description,
      navigationSettings,
      storefronts
    }
  `;

  return useQuery({
    queryKey: ['subcategories', parentId, storefront, includeInactive],
    queryFn: async () => {
      try {
        const data = await client.fetch(query);
        
        if (!data || data.length === 0) {
          return [];
        }

        return data.map((cat: any) => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug?.current || cat.slug || '',
          image: cat.image ? urlFor(cat.image).url() : '',
          icon: cat.icon ? urlFor(cat.icon).url() : undefined,
          itemCount: cat.itemCount || 0,
          href: cat.href || `/grocery/shop?category=${cat.slug?.current || cat.slug || ''}`,
          order: cat.order || 0,
          isActive: cat.isActive ?? true,
          featured: cat.featured || false,
          description: cat.description || '',
          storefronts: cat.storefronts || ['grocery'],
          navigationSettings: cat.navigationSettings || {},
        })) as Category[];
      } catch (error) {
        console.error(`Error fetching subcategories for parent ${parentId}:`, error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!parentId,
  });
}

// Helper hook to get featured categories
export function useFeaturedCategories(storefront: string = 'grocery', limit?: number) {
  return useCategories({
    storefront,
    featuredOnly: true,
    limit,
    includeSubCategories: false,
  });
}

// Helper hook to get categories with full hierarchy (including subcategories)
export function useCategoryHierarchy(storefront: string = 'grocery') {
  const { data: categories, isLoading, error } = useCategories({
    storefront,
    includeSubCategories: true,
  });

  // Filter to only top-level categories (no parent)
  const topLevelCategories = categories?.filter(
    (cat) => !cat.parentCategory
  ) || [];

  return {
    categories: topLevelCategories,
    allCategories: categories || [],
    isLoading,
    error,
  };
}

// Helper function to build a category tree
export function buildCategoryTree(categories: Category[]): Category[] {
  if (!categories || categories.length === 0) return [];

  // Create a map of all categories by ID
  const categoryMap: Record<string, Category> = {};
  categories.forEach((cat) => {
    categoryMap[cat._id] = { ...cat, subCategories: [] };
  });

  // Build the tree
  const tree: Category[] = [];

  categories.forEach((cat) => {
    const category = categoryMap[cat._id];
    if (cat.parentCategory) {
      const parent = categoryMap[cat.parentCategory._id];
      if (parent) {
        if (!parent.subCategories) {
          parent.subCategories = [];
        }
        parent.subCategories.push(category);
      }
    } else {
      tree.push(category);
    }
  });

  // Sort children by order
  tree.forEach((cat) => {
    if (cat.subCategories) {
      cat.subCategories.sort((a, b) => (a.order || 0) - (b.order || 0));
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
      if (cat.subCategories && cat.subCategories.length > 0) {
        traverse(cat.subCategories);
      }
    });
  };

  traverse(categories);
  return result;
}