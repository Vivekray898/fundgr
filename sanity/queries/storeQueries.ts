// sanity/queries/storeQueries.ts
import { defineQuery } from 'next-sanity';

// =============================================
// GET ALL STORES (for store locator / listing)
// =============================================
export const GET_ALL_STORES = defineQuery(`
  *[_type == 'store'] | order(name asc) {
    _id,
    name,
    slug,
    address,
    city,
    zip,
    phone,
    email,
    isDefault,
    "image": image.asset->url,
    "heroImage": heroImage.asset->url,
    coordinates,
    openingHours,
    "hasActiveProspect": defined(prospect.pdf) && prospect.isActive != false,
    "prospectPreview": prospect.previewImage.asset->url
  }
`);

// =============================================
// GET STORE BY SLUG (full store page)
// =============================================
export const GET_STORE_BY_SLUG = defineQuery(`
  *[_type == 'store' && slug.current == $slug][0] {
    _id,
    name,
    slug,
    address,
    city,
    zip,
    phone,
    email,
    openingHours,
    isDefault,
    "image": image.asset->url,
    "heroImage": heroImage.asset->url,
    description,
    
    // ========== PDF Prospekt Structure ==========
    "prospect": {
      "pdf": prospect.pdf.asset->url,
      "title": prospect.title,
      "startDate": prospect.startDate,
      "endDate": prospect.endDate,
      "previewImage": prospect.previewImage.asset->url,
      "isActive": prospect.isActive
    },
    
    // ========== OTHER CONTENT ==========
    localServices,
    services[] {
      title,
      slug,
      description,
      icon,
      isActive,
      order,
      "image": image.asset->url
    },
    additionalServices,
    googleMapsUrl,
    coordinates,
    seo
  }
`);

// =============================================
// GET STORE PROSPECT ONLY (for dedicated prospect page)
// =============================================
export const GET_STORE_PROSPECT = defineQuery(`
  *[_type == 'store' && slug.current == $slug][0] {
    name,
    slug,
    "prospect": {
      "pdf": prospect.pdf.asset->url,
      "title": prospect.title,
      "startDate": prospect.startDate,
      "endDate": prospect.endDate,
      "previewImage": prospect.previewImage.asset->url,
      "isActive": prospect.isActive
    }
  }
`);

// =============================================
// GET STORES WITH ACTIVE PROSPECTS
// =============================================
export const GET_STORES_WITH_ACTIVE_PROSPECTS = defineQuery(`
  *[_type == 'store' && defined(prospect.pdf) && prospect.isActive != false] {
    _id,
    name,
    slug,
    "prospect": {
      "pdf": prospect.pdf.asset->url,
      "title": prospect.title,
      "startDate": prospect.startDate,
      "endDate": prospect.endDate,
      "previewImage": prospect.previewImage.asset->url
    }
  }
`);