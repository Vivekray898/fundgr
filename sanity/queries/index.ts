// sanity/queries/index.ts
import { sanityFetch } from "../lib/live";
import {
  BLOG_CATEGORIES,
  BRAND_QUERY,
  BRANDS_QUERY,
  DEAL_PRODUCTS_QUERY,
  FEATURED_CATEGORIES_QUERY,
  GET_ALL_BLOG,
  HOT_PRODUCTS_QUERY,
  LATEST_BLOG_QUERY,
  MY_ORDERS_QUERY,
  NEW_PRODUCTS_QUERY,
  OTHERS_BLOG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SEASONAL_CATEGORIES_QUERY,
  SINGLE_BLOG_QUERY,
  RELATED_PRODUCTS_QUERY,
  CATEGORY_WITH_DESCENDANTS,
  GET_DESCENDANT_IDS,
} from "./query";

// ✅ NEW: Get products for a category including all descendants
const getProductsByCategoryWithDescendants = async (slug: string) => {
  try {
    // First get the category and all descendant IDs
    const { data: categoryData } = await sanityFetch({
      query: GET_DESCENDANT_IDS,
      params: { slug },
    });

    if (!categoryData) return [];

    const { _id, descendantIds } = categoryData;
    const allCategoryIds = [_id, ...(descendantIds || [])].filter(Boolean);

    // Then fetch all products that reference any of these categories
    const query = `
      *[_type == "product" && count(categories[@._ref in $categoryIds]) > 0] | order(name asc) {
        _id,
        name,
        slug,
        price,
        discount,
        originalPrice,
        stock,
        status,
        isDeal,
        dealEndDate,
        "images": images[]{
          asset->{
            _id,
            url
          }
        },
        "categories": categories[]->title,
        "brand": brand->{
          _id,
          title,
          name,
          "slug": slug.current
        }
      }
    `;

    const { data } = await sanityFetch({
      query,
      params: { categoryIds: allCategoryIds },
    });

    return data || [];
  } catch (error) {
    console.error("Error fetching products with descendants:", error);
    return [];
  }
};

// ✅ NEW: Get product count for a category including descendants
const getProductCountWithDescendants = async (slug: string) => {
  try {
    const { data: categoryData } = await sanityFetch({
      query: GET_DESCENDANT_IDS,
      params: { slug },
    });

    if (!categoryData) return 0;

    const { _id, descendantIds } = categoryData;
    const allCategoryIds = [_id, ...(descendantIds || [])].filter(Boolean);

    const query = `
      count(*[_type == "product" && count(categories[@._ref in $categoryIds]) > 0])
    `;

    const { data } = await sanityFetch({
      query,
      params: { categoryIds: allCategoryIds },
    });

    return data || 0;
  } catch (error) {
    console.error("Error fetching product count with descendants:", error);
    return 0;
  }
};

// ✅ Updated: Get Categories with nested children directly from Sanity
const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == 'category' && !defined(parent)] | order(order asc) [0...$quantity] {
          _id,
          title,
          "slug": slug.current,
          description,
          teaserSubtitle,
          range,
          featured,
          "image": image.asset->url,
          parent,
          order,
          showInNavigation,
          icon,
          categoryIcon,
          isSeasonal,
          seasonalMessage,
          seasonalStart,
          seasonalEnd,
          seasonalIcon,
          "productCount": count(*[_type == "product" && references(^._id)]),
          "children": *[_type == "category" && parent._ref == ^._id] | order(order asc) {
            _id,
            title,
            "slug": slug.current,
            description,
            teaserSubtitle,
            range,
            featured,
            "image": image.asset->url,
            parent,
            order,
            showInNavigation,
            icon,
            categoryIcon,
            isSeasonal,
            seasonalMessage,
            seasonalStart,
            seasonalEnd,
            seasonalIcon,
            "productCount": count(*[_type == "product" && references(^._id)]),
            "children": *[_type == "category" && parent._ref == ^._id] | order(order asc) {
              _id,
              title,
              "slug": slug.current,
              description,
              teaserSubtitle,
              range,
              featured,
              "image": image.asset->url,
              parent,
              order,
              showInNavigation,
              icon,
              categoryIcon,
              isSeasonal,
              seasonalMessage,
              seasonalStart,
              seasonalEnd,
              seasonalIcon,
              "productCount": count(*[_type == "product" && references(^._id)])
            }
          }
        }`
      : `*[_type == 'category' && !defined(parent)] | order(order asc) {
          _id,
          title,
          "slug": slug.current,
          description,
          teaserSubtitle,
          range,
          featured,
          "image": image.asset->url,
          parent,
          order,
          showInNavigation,
          icon,
          categoryIcon,
          isSeasonal,
          seasonalMessage,
          seasonalStart,
          seasonalEnd,
          seasonalIcon,
          "productCount": count(*[_type == "product" && references(^._id)]),
          "children": *[_type == "category" && parent._ref == ^._id] | order(order asc) {
            _id,
            title,
            "slug": slug.current,
            description,
            teaserSubtitle,
            range,
            featured,
            "image": image.asset->url,
            parent,
            order,
            showInNavigation,
            icon,
            categoryIcon,
            isSeasonal,
            seasonalMessage,
            seasonalStart,
            seasonalEnd,
            seasonalIcon,
            "productCount": count(*[_type == "product" && references(^._id)]),
            "children": *[_type == "category" && parent._ref == ^._id] | order(order asc) {
              _id,
              title,
              "slug": slug.current,
              description,
              teaserSubtitle,
              range,
              featured,
              "image": image.asset->url,
              parent,
              order,
              showInNavigation,
              icon,
              categoryIcon,
              isSeasonal,
              seasonalMessage,
              seasonalStart,
              seasonalEnd,
              seasonalIcon,
              "productCount": count(*[_type == "product" && references(^._id)])
            }
          }
        }`;
    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// ✅ Updated: Get All Brands with complete data including market location
const getAllBrands = async () => {
  try {
    const { data } = await sanityFetch({ query: BRANDS_QUERY });
    return data || [];
  } catch (error) {
    console.error("Error fetching all brands:", error);
    return [];
  }
};

// ✅ Updated: Get Featured Brands (returns only featured brands)
const getFeaturedBrands = async () => {
  try {
    const { data } = await sanityFetch({ 
      query: `*[_type=='brand' && isActive == true && featured == true] | order(order asc) {
        _id,
        title,
        name,
        "slug": slug.current,
        "logo": logo.asset->url,
        description,
        website,
        isActive,
        order,
        featured,
        marketLocation {
          name,
          address,
          googleMapsUrl,
          phone,
          openingHours,
          isMainLocation,
          additionalInfo
        }
      }`
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching featured brands:", error);
    return [];
  }
};

// ✅ Updated: Get Brand by Slug with complete data
const getBrandBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: `*[_type == 'brand' && slug.current == $slug && isActive == true][0]{
        _id,
        title,
        name,
        "slug": slug.current,
        "logo": logo.asset->url,
        description,
        website,
        isActive,
        order,
        featured,
        marketLocation {
          name,
          address,
          googleMapsUrl,
          phone,
          openingHours,
          isMainLocation,
          additionalInfo
        }
      }`,
      params: { slug },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching brand by slug:", error);
    return null;
  }
};

const getLatestBlogs = async () => {
  try {
    const { data } = await sanityFetch({ query: LATEST_BLOG_QUERY });
    return data || [];
  } catch (error) {
    console.error("Error fetching latest Blogs:", error);
    return [];
  }
};

// ✅ Fixed: Get Deal Products with proper error handling
const getDealProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: DEAL_PRODUCTS_QUERY });
    return data || [];
  } catch (error) {
    console.error("Error fetching deal products:", error);
    return [];
  }
};

// ✅ Fixed: Get New Products with proper error handling
const getNewProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: NEW_PRODUCTS_QUERY });
    return data || [];
  } catch (error) {
    console.error("Error fetching new products:", error);
    return [];
  }
};

// ✅ Fixed: Get Hot/Sale Products with proper error handling
const getHotProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: HOT_PRODUCTS_QUERY });
    return data || [];
  } catch (error) {
    console.error("Error fetching hot products:", error);
    return [];
  }
};

// ✅ Fixed: Get Featured Categories with proper error handling
const getFeaturedCategories = async () => {
  try {
    const { data } = await sanityFetch({ query: FEATURED_CATEGORIES_QUERY });
    return data || [];
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    return [];
  }
};

// ✅ Fixed: Get Seasonal Categories with proper error handling
const getSeasonalCategories = async () => {
  try {
    const { data } = await sanityFetch({ query: SEASONAL_CATEGORIES_QUERY });
    return data || [];
  } catch (error) {
    console.error("Error fetching seasonal categories:", error);
    return [];
  }
};

// ✅ Fixed: Get Product by Slug with proper error handling
const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

// ✅ Get Related Products
const getRelatedProducts = async ({
  currentProductId,
  categoryIds,
  limit = 8,
}: {
  currentProductId: string;
  categoryIds: string[];
  limit?: number;
}) => {
  try {
    if (!categoryIds || categoryIds.length === 0) {
      return [];
    }
    
    const { data } = await sanityFetch({
      query: RELATED_PRODUCTS_QUERY,
      params: {
        currentProductId,
        categoryIds,
        limit,
      },
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

// ✅ Fixed: Get Brand with proper error handling (legacy - kept for backward compatibility)
const getBrand = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: BRAND_QUERY,
      params: { slug },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
};

// ✅ Fixed: Get My Orders with proper error handling
const getMyOrders = async (userId: string) => {
  try {
    const { data } = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
};

// ✅ Fixed: Get All Blogs with proper error handling
const getAllBlogs = async (quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: GET_ALL_BLOG,
      params: { quantity },
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return [];
  }
};

// ✅ Fixed: Get Single Blog with proper error handling
const getSingleBlog = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: SINGLE_BLOG_QUERY,
      params: { slug },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching single blog:", error);
    return null;
  }
};

// ✅ Fixed: Get Blog Categories with proper error handling
const getBlogCategories = async () => {
  try {
    const { data } = await sanityFetch({
      query: BLOG_CATEGORIES,
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
};

// ✅ Fixed: Get Other Blogs with proper error handling
const getOthersBlog = async (slug: string, quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: OTHERS_BLOG_QUERY,
      params: { slug, quantity },
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching other blogs:", error);
    return [];
  }
};

// ✅ Export all functions for use throughout the application
export {
  getCategories,
  getAllBrands,
  getFeaturedBrands,
  getBrandBySlug,
  getLatestBlogs,
  getDealProducts,
  getNewProducts,
  getHotProducts,
  getFeaturedCategories,
  getSeasonalCategories,
  getProductBySlug,
  getRelatedProducts,
  getBrand,
  getMyOrders,
  getAllBlogs,
  getSingleBlog,
  getBlogCategories,
  getOthersBlog,
  getProductsByCategoryWithDescendants,
  getProductCountWithDescendants,
};