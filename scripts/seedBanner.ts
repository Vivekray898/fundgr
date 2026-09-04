// scripts/seedBanner.ts
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: "2024-01-01",
});

async function seedBanner() {
  const doc = {
    _type: "banner",
    title: "Main Banner Configuration",
    isActive: true,
    bannerExpiryDays: 30,
    youtubeEnabled: true,
    youtubeChannelId: "FUNDGRUBE-p9l",
    youtubeExpiryDays: 7,
    bannerActivationDate: new Date().toISOString(),
    youtubeActivationDate: new Date().toISOString(),
  };

  try {
    const result = await client.create(doc);
    console.log("✅ Banner configuration created:", result._id);
  } catch (error) {
    console.error("❌ Error creating banner:", error);
  }
}

seedBanner();