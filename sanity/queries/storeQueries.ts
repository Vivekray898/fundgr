// sanity/queries/storeQueries.ts
import { defineQuery } from 'next-sanity';

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
    openingHours
  }
`);

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
    gastronomy,
    "prospectImage": prospectImage.asset->url,
    prospectUrl,
    prospectStartDate,
    prospectEndDate,
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

export const GET_DEFAULT_STORE = defineQuery(`
  *[_type == 'store' && isDefault == true][0] {
    _id,
    name,
    slug,
    address,
    city,
    zip,
    phone,
    email,
    openingHours,
    "image": image.asset->url,
    "heroImage": heroImage.asset->url,
    coordinates,
    googleMapsUrl
  }
`);