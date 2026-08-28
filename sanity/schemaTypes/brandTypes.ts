// sanity/schemas/brand.ts
import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const brandType = defineType({
  name: "brand",
  title: "Brands",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        slugify: (input) => 
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .slice(0, 96),
      },
      validation: (Rule) => 
        Rule.required().custom((slug) => {
          if (!slug?.current) {
            return "Slug is required";
          }
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return "Slug can only contain lowercase letters, numbers, and hyphens";
          }
          return true;
        }),
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
      validation: (Rule) => 
        Rule.uri({
          scheme: ["http", "https"],
          allowRelative: false,
        }),
    }),
    defineField({
      name: "marketLocation",
      title: "Market / Store Location",
      type: "object",
      description: "Location information for catalogue mode",
      fields: [
        defineField({
          name: "name",
          title: "Location Name",
          type: "string",
          description: "Name of the store/market",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "address",
          title: "Address",
          type: "string",
          description: "Full address of the location",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "googleMapsUrl",
          title: "Google Maps URL",
          type: "url",
          description: "Full Google Maps URL for this location",
          validation: (Rule) => 
            Rule.uri({
              scheme: ["http", "https"],
              allowRelative: false,
            }),
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
          description: "Phone number with country code (e.g., +49 123 4567890)",
          validation: (Rule) => 
            Rule.required().regex(/^\+[1-9]\d{1,3}\s?\d{1,14}$/, {
              name: "Phone number with country code",
              invert: false,
            }),
        }),
        defineField({
          name: "openingHours",
          title: "Opening Hours",
          type: "text",
          description: "Opening hours information",
          rows: 4,
        }),
        defineField({
          name: "isMainLocation",
          title: "Is Main Location",
          type: "boolean",
          description: "Mark this as the primary location for the brand",
          initialValue: false,
        }),
        defineField({
          name: "additionalInfo",
          title: "Additional Information",
          type: "text",
          description: "Any additional location information (parking, accessibility, etc.)",
          rows: 3,
        }),
      ],
      preview: {
        select: {
          title: "name",
          subtitle: "address",
        },
      },
    }),
    defineField({
      name: "isActive",
      title: "Active Brand",
      type: "boolean",
      description: "Whether this brand is currently active",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order for display in lists (lower numbers appear first)",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured Brand",
      type: "boolean",
      description: "Whether to feature this brand prominently",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "logo",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled Brand",
        subtitle: subtitle || "No description",
        media: media || TagIcon,
      };
    },
  },
  orderings: [
    {
      title: "Brand Name (A-Z)",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});