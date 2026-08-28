// sanity/queries/query.ts
import { defineQuery } from "next-sanity";

// ✅ Updated: Get Brands with all fields including market location
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

// ✅ Fixed: Get Deal Products - Properly filter and include image data
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

// ✅ Fixed: Get New Products with images
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

// ✅ Fixed: Get Hot Products with images
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

// ✅ Fixed: Get Featured Categories with proper image resolution and product count
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

// ✅ Fixed: Get Seasonal Categories with proper image resolution and product count
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

// ✅ Updated: Get Product by Slug with complete brand data
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

// ✅ Keep this for backward compatibility if needed
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

// ✅ Updated: Get All Blogs with excerpt and proper fields
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

// ✅ Updated: Get Single Blog with excerpt and full details
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

// ✅ NEW: Get Related Products based on categories
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
};