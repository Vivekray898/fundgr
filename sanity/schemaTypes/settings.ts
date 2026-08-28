// sanity/schemas/settings.ts
import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const settingsType = defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "catalogueMode",
      title: "Catalogue Mode",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Enable Catalogue Mode",
          type: "boolean",
          description: "When enabled, prices are hidden and add-to-cart is replaced with catalogue CTAs",
          initialValue: false,
        }),
        defineField({
          name: "pricePlaceholder",
          title: "Price Placeholder Text",
          type: "string",
          description: "Text shown instead of price when catalogue mode is enabled",
          initialValue: "Preis im Markt erhältlich",
        }),
        defineField({
          name: "productCardCta",
          title: "Product Card CTA Text",
          type: "string",
          description: "Button text on product cards in catalogue mode",
          initialValue: "Details ansehen",
        }),
        defineField({
          name: "productPageCta",
          title: "Product Page CTA Text",
          type: "string",
          description: "Button text on product detail page in catalogue mode",
          initialValue: "Bezugsquelle finden",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "catalogueMode.enabled",
    },
    prepare({ title }) {
      return {
        title: `Catalogue Mode: ${title ? "ON" : "OFF"}`,
        subtitle: "Global Settings",
      };
    },
  },
});