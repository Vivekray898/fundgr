// sanity/queries/query.ts
import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

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

const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
  ...,  
     blogcategories[]->{
    title
}
    }
  `
);

const SINGLE_BLOG_QUERY =
  defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
  ..., 
    author->{
    name,
    image,
  },
  blogcategories[]->{
    title,
    "slug": slug.current,
  },
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
...
  publishedAt,
  title,
  mainImage,
  slug,
  author->{
    name,
    image,
  },
  categories[]->{
    title,
    "slug": slug.current,
  }
}`);

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
};