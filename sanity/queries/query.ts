// sanity/queries/query.ts
import { defineQuery } from "next-sanity";

// ✅ FIXED: Get category with all descendants recursively (better approach)
const CATEGORY_WITH_DESCENDANTS = defineQuery(`
  *[_type == 'category' && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    "allDescendantIds": [
      // Level 1: Direct children
      *[_type == 'category' && parent._ref == ^._id]._id,
      // Level 2: Grandchildren  
      *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id,
      // Level 3: Great-grandchildren
      *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id]._id
    ]
  }
`);

// ✅ FIXED: Get all descendant category IDs (flattened array)
const GET_DESCENDANT_IDS = defineQuery(`
  *[_type == 'category' && slug.current == $slug][0]{
    _id,
    "descendantIds": [
      // Level 1: Direct children
      *[_type == 'category' && parent._ref == ^._id]._id,
      // Level 2: Grandchildren
      *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id,
      // Level 3: Great-grandchildren
      *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id]._id
    ]
  }
`);

// ✅ FIXED: Get product count for a category including all descendants
const GET_PRODUCT_COUNT_WITH_DESCENDANTS = defineQuery(`
  *[_type == 'category' && slug.current == $slug][0]{
    _id,
    "productCount": count(
      *[_type == "product" && references(^._id)] + 
      *[_type == "product" && references(*[_type == 'category' && parent._ref == ^._id]._id)] +
      *[_type == "product" && references(*[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id)]
    )
  }
`);

// ✅ FIXED: Get products for a category including all descendants (with brand filter and sorting)
// Removed the $params conditional logic - use separate queries or handle in the component
const GET_PRODUCTS_WITH_DESCENDANTS_AND_FILTERS = defineQuery(`
  *[_type == 'category' && slug.current == $categorySlug][0]{
    _id,
    "products": *[_type == "product" 
      && (
        references(^._id) || 
        references(*[_type == 'category' && parent._ref == ^._id]._id) ||
        references(*[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id)
      )
      ${'$brandSlug' ? `&& references(*[_type == "brand" && slug.current == $brandSlug]._id)` : ''}
    ] | order($sortOrder) {
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
  }
`);

// ✅ FIXED: Get Brands with all fields including market location
const BRANDS_QUERY = defineQuery(`*[_type=='brand' && isActive == true] | order(order asc) {
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
}`);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(name asc){
      ...,
      blogcategories[]->{
      title
    }
    }`
);

// ✅ FIXED: Get Deal Products
const DEAL_PRODUCTS_QUERY = defineQuery(
  `*[_type == 'product' && (isDeal == true || discount > 0) && stock > 0] | order(_createdAt desc) [0...12] {
    _id,
    name,
    slug,
    "images": images[]{
      asset->{
        _id,
        url
      }
    },
    price,
    discount,
    originalPrice,
    isDeal,
    dealEndDate,
    status,
    "categories": categories[]->title,
    "brand": brand->title
  }`
);

// ✅ FIXED: Get New Products
const NEW_PRODUCTS_QUERY = defineQuery(
  `*[_type == 'product' && status == 'new' && stock > 0] | order(_createdAt desc) [0...12] {
    _id,
    name,
    slug,
    "images": images[]{
      asset->{
        _id,
        url
      }
    },
    price,
    discount,
    originalPrice,
    isDeal,
    dealEndDate,
    status,
    "categories": categories[]->title,
    "brand": brand->title
  }`
);

// ✅ FIXED: Get Hot Products
const HOT_PRODUCTS_QUERY = defineQuery(
  `*[_type == 'product' && (status == 'hot' || status == 'sale') && stock > 0] | order(_createdAt desc) [0...12] {
    _id,
    name,
    slug,
    "images": images[]{
      asset->{
        _id,
        url
      }
    },
    price,
    discount,
    originalPrice,
    isDeal,
    dealEndDate,
    status,
    "categories": categories[]->title,
    "brand": brand->title
  }`
);

// ✅ FIXED: Get Featured Categories
const FEATURED_CATEGORIES_QUERY = defineQuery(
  `*[_type == 'category' && defined(image) && !defined(parent)] | order(order asc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    "image": image.asset->url,
    description,
    teaserSubtitle,
    isSeasonal,
    seasonalMessage,
    seasonalIcon,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
);

// ✅ FIXED: Get Seasonal Categories
const SEASONAL_CATEGORIES_QUERY = defineQuery(
  `*[_type == 'category' && isSeasonal == true && !defined(parent)] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    "image": image.asset->url,
    description,
    teaserSubtitle,
    seasonalMessage,
    seasonalStart,
    seasonalEnd,
    seasonalIcon,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`
);

// ✅ FIXED: Get Product by Slug with complete brand data
const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]{
    _id,
    name,
    slug,
    description,
    price,
    discount,
    originalPrice,
    stock,
    status,
    isDeal,
    dealEndDate,
    "categories": categories[]->{
      _id,
      title,
      "slug": slug.current,
      isSeasonal,
      seasonalMessage,
      seasonalStart,
      seasonalEnd,
      seasonalIcon
    },
    "brand": brand->{
      _id,
      title,
      name,
      "slug": slug.current,
      marketLocation,
      logo,
      description,
      website
    },
    "images": images[]{
      asset->{
        _id,
        url
      }
    },
    characteristics,
    specifications,
    createdAt,
    updatedAt
  }`
);

// ✅ Keep for backward compatibility if needed
const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug]{
  "brandName": brand->title,
  "brandSlug": brand->slug.current
  }`);

const MY_ORDERS_QUERY =
  defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
...,products[]{
  ...,product->
}
}`);

// ✅ FIXED: Get All Blogs
const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    "blogcategories": blogcategories[]->{
      title,
      slug
    },
    author->{
      name,
      image
    }
  }`
);

// ✅ FIXED: Get Single Blog
const SINGLE_BLOG_QUERY =
  defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    body,
    author->{
      name,
      image,
      bio
    },
    "blogcategories": blogcategories[]->{
      title,
      slug,
      description
    }
  }`);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
     blogcategories[]->{
    ...
    }
  }`
);

const OTHERS_BLOG_QUERY = defineQuery(`*[
  _type == "blog"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...$quantity]{
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  excerpt,
  author->{
    name,
    image,
  },
  "blogcategories": blogcategories[]->{
    title,
    slug
  }
}`);

// ✅ FIXED: Get Related Products based on categories
const RELATED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" 
    && _id != $currentProductId 
    && count(categories[@._ref in $categoryIds]) > 0
    && stock > 0
  ] | order(_createdAt desc) [0...$limit] {
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
`);

// ✅ NEW: Get products for a specific brand
const GET_PRODUCTS_BY_BRAND = defineQuery(`
  *[_type == 'product' 
    && references(*[_type == "brand" && slug.current == $brandSlug]._id)
  ] | order($sortOrder) {
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
`);

// ✅ NEW: Get all products with sorting
const GET_ALL_PRODUCTS = defineQuery(`
  *[_type == 'product'] | order($sortOrder) {
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
`);

// ✅ NEW: Get products by category with descendants (simplified version without $params)
const GET_PRODUCTS_BY_CATEGORY_WITH_DESCENDANTS = defineQuery(`
  *[_type == 'product' 
    && (
      references(*[_type == "category" && slug.current == $categorySlug]._id) ||
      references(*[_type == "category" && parent._ref == *[_type == "category" && slug.current == $categorySlug]._id]._id) ||
      references(*[_type == "category" && parent._ref in *[_type == "category" && parent._ref == *[_type == "category" && slug.current == $categorySlug]._id]._id]._id)
    )
  ] | order($sortOrder) {
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
`);

// ✅ NEW: Get products by category and brand with descendants
const GET_PRODUCTS_BY_CATEGORY_AND_BRAND_WITH_DESCENDANTS = defineQuery(`
  *[_type == 'product' 
    && (
      references(*[_type == "category" && slug.current == $categorySlug]._id) ||
      references(*[_type == "category" && parent._ref == *[_type == "category" && slug.current == $categorySlug]._id]._id) ||
      references(*[_type == "category" && parent._ref in *[_type == "category" && parent._ref == *[_type == "category" && slug.current == $categorySlug]._id]._id]._id)
    )
    && references(*[_type == "brand" && slug.current == $brandSlug]._id)
  ] | order($sortOrder) {
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
`);

export {
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS_QUERY,
  NEW_PRODUCTS_QUERY,
  HOT_PRODUCTS_QUERY,
  FEATURED_CATEGORIES_QUERY,
  SEASONAL_CATEGORIES_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ALL_BLOG,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
  RELATED_PRODUCTS_QUERY,
  CATEGORY_WITH_DESCENDANTS,
  GET_DESCENDANT_IDS,
  GET_PRODUCT_COUNT_WITH_DESCENDANTS,
  GET_PRODUCTS_WITH_DESCENDANTS_AND_FILTERS,
  GET_PRODUCTS_BY_BRAND,
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY_WITH_DESCENDANTS,
  GET_PRODUCTS_BY_CATEGORY_AND_BRAND_WITH_DESCENDANTS,
};