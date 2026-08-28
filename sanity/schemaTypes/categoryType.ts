// sanity/schemas/category.ts
import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    // 🔥 NEW: Teaser subtitle for sortiment page
    defineField({
      name: "teaserSubtitle",
      title: "Teaser Subtitle",
      type: "string",
      description: "Short description shown on the Sortiment page",
    }),
    defineField({
      name: "range",
      type: "number",
      description: "Starting from",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
      description: "Show this category on the Sortiment page",
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    // Parent category for subcategories
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Select a parent category if this is a subcategory",
    }),
    // Order for sorting
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
      description: "Order in which categories appear",
    }),
    // Show in navigation
    defineField({
      name: "showInNavigation",
      title: "Show in Navigation",
      type: "boolean",
      initialValue: true,
      description: "Show this category in the main navigation",
    }),
    // 🔥 NEW: Category Icon for sortiment cards
    defineField({
      name: "categoryIcon",
      title: "Category Icon",
      type: "string",
      options: {
        list: [
          { title: "🌿 Garden", value: "garden" },
          { title: "🔧 Tools", value: "tools" },
          { title: "🪵 Wood", value: "wood" },
          { title: "🚗 Auto", value: "auto" },
          { title: "🎨 Paint", value: "paint" },
          { title: "🚿 Plumbing", value: "plumbing" },
          { title: "🧱 Tiles", value: "tiles" },
          { title: "💡 Lighting", value: "lighting" },
          { title: "🐾 Pets", value: "pets" },
          { title: "🍳 Kitchen", value: "kitchen" },
          { title: "🎁 Gift", value: "gift" },
        ],
      },
    }),
    // Existing icon field (for navigation)
    defineField({
      name: "icon",
      title: "Icon (Navigation)",
      type: "string",
      options: {
        list: [
          { title: "Garden", value: "garden" },
          { title: "Tools", value: "tools" },
          { title: "Wood", value: "wood" },
          { title: "Auto", value: "auto" },
          { title: "Paint", value: "paint" },
          { title: "Plumbing", value: "plumbing" },
          { title: "Tiles", value: "tiles" },
          { title: "Lighting", value: "lighting" },
          { title: "Pets", value: "pets" },
          { title: "Kitchen", value: "kitchen" },
          { title: "Gift", value: "gift" },
        ],
      },
    }),
    // 🔥 NEW: Seasonal Fields
    defineField({
      name: "isSeasonal",
      title: "Is Seasonal?",
      type: "boolean",
      initialValue: false,
      description: "Mark this category as seasonal (e.g., spring flowers, Christmas items)",
    }),
    defineField({
      name: "seasonalMessage",
      title: "Seasonal Message",
      type: "string",
      description: "Custom message to show for this seasonal category",
      hidden: ({ parent }) => !parent?.isSeasonal,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context?.parent?.isSeasonal && !value) {
            return "Seasonal message is required when 'Is Seasonal?' is enabled";
          }
          return true;
        }),
    }),
    defineField({
      name: "seasonalStart",
      title: "Season Start Date",
      type: "date",
      description: "When does the season start? (Optional)",
      hidden: ({ parent }) => !parent?.isSeasonal,
    }),
    defineField({
      name: "seasonalEnd",
      title: "Season End Date",
      type: "date",
      description: "When does the season end? (Optional)",
      hidden: ({ parent }) => !parent?.isSeasonal,
    }),
    defineField({
      name: "seasonalIcon",
      title: "Seasonal Icon",
      type: "string",
      options: {
        list: [
          { title: "🌸 Flower", value: "flower" },
          { title: "☀️ Sun", value: "sun" },
          { title: "🍂 Autumn Leaf", value: "autumn" },
          { title: "❄️ Snowflake", value: "snowflake" },
          { title: "🎄 Christmas Tree", value: "christmas" },
          { title: "🎃 Pumpkin", value: "pumpkin" },
          { title: "🌧️ Rain", value: "rain" },
          { title: "🌱 Spring", value: "spring" },
          { title: "🌻 Summer", value: "summer" },
        ],
      },
      hidden: ({ parent }) => !parent?.isSeasonal,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});