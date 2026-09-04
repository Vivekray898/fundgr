// sanity/schemas/bannerType.ts
import { defineField, defineType } from "sanity";

export const bannerType = defineType({
  name: "banner",
  title: "Banner & YouTube Management",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal title for management purposes",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      description: "Enable/disable this banner configuration",
      initialValue: true,
    }),
    defineField({
      name: "desktopImage",
      title: "Desktop Banner Image",
      type: "image",
      description: "Banner image for desktop (recommended: 1920x600)",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Alternative text for accessibility",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mobileImage",
      title: "Mobile Banner Image",
      type: "image",
      description: "Banner image for mobile (recommended: 768x400)",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
    }),
    defineField({
      name: "bannerLink",
      title: "Banner Link",
      type: "string",
      description: "Optional link for the banner (e.g., /shop, /angebote)",
      placeholder: "/shop",
    }),
    defineField({
      name: "bannerExpiryDays",
      title: "Banner Expiry (Days)",
      type: "number",
      description: "Number of days until this banner expires",
      initialValue: 30,
      validation: (Rule) => Rule.required().min(1).max(365),
    }),
    defineField({
      name: "bannerActivationDate",
      title: "Banner Activation Date",
      type: "datetime",
      description: "When this banner was activated (auto-set)",
      readOnly: true,
    }),
    defineField({
      name: "bannerExpiryDate",
      title: "Banner Expiry Date",
      type: "datetime",
      description: "Auto-calculated expiry date",
      readOnly: true,
    }),
    defineField({
      name: "youtubeEnabled",
      title: "Enable YouTube Video",
      type: "boolean",
      description: "Show YouTube video alongside the banner",
      initialValue: true,
    }),
    defineField({
      name: "youtubeChannelId",
      title: "YouTube Channel ID",
      type: "string",
      description: "YouTube channel ID (e.g., FUNDGRUBE-p9l)",
      placeholder: "FUNDGRUBE-p9l",
    }),
    defineField({
      name: "youtubeVideoId",
      title: "YouTube Video ID (Override)",
      type: "string",
      description: "Override with a specific video ID. Leave empty to auto-fetch latest.",
      placeholder: "e.g., abc123xyz",
    }),
    defineField({
      name: "youtubeExpiryDays",
      title: "YouTube Video Expiry (Days)",
      type: "number",
      description: "Number of days until the YouTube video expires",
      initialValue: 7,
      validation: (Rule) => Rule.required().min(1).max(365),
    }),
    defineField({
      name: "youtubeActivationDate",
      title: "YouTube Activation Date",
      type: "datetime",
      description: "When the current YouTube video was activated (auto-set)",
      readOnly: true,
    }),
    defineField({
      name: "youtubeExpiryDate",
      title: "YouTube Expiry Date",
      type: "datetime",
      description: "Auto-calculated expiry date for the YouTube video",
      readOnly: true,
    }),
    defineField({
      name: "fallbackBanner",
      title: "Fallback Banner Image",
      type: "image",
      description: "Generic fallback banner when main banner expires",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fallbackBannerLink",
      title: "Fallback Banner Link",
      type: "string",
      placeholder: "/",
      description: "Link for the fallback banner",
    }),
  ],
  preview: {
    select: {
      title: "title",
      isActive: "isActive",
      image: "desktopImage",
    },
    prepare({ title, isActive, image }) {
      return {
        title: title || "Banner Configuration",
        subtitle: `${isActive ? "✅ Active" : "❌ Inactive"}`,
        media: image,
      };
    },
  },
});