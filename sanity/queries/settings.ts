// sanity/queries/settings.ts
import { defineQuery } from "next-sanity";
import { client } from "../lib/client";

// Use the regular client instead of sanityFetch for server-side only
export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings"][0] {
    catalogueMode {
      enabled,
      pricePlaceholder,
      productCardCta,
      productPageCta
    }
  }
`);

export const BRAND_WITH_LOCATION_QUERY = defineQuery(`
  *[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    marketLocation {
      name,
      address,
      googleMapsUrl,
      phone,
      openingHours
    }
  }
`);

// Server-side only functions using the client directly
export const getSettings = async () => {
  try {
    const data = await client.fetch(SETTINGS_QUERY);
    return data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};

export const getBrandWithLocation = async (slug: string) => {
  try {
    const data = await client.fetch(BRAND_WITH_LOCATION_QUERY, { slug });
    return data;
  } catch (error) {
    console.error("Error fetching brand location:", error);
    return null;
  }
};