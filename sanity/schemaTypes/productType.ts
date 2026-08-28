// sanity/schemas/product.ts
import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    // ✅ Simple deal flag
    defineField({
      name: "isDeal",
      title: "Is Deal?",
      type: "boolean",
      initialValue: false,
      description: "Show this product in the deals page",
    }),
    defineField({
      name: "dealEndDate",
      title: "Deal End Date",
      type: "datetime",
      description: "When does this deal end? (Optional)",
    }),
    defineField({
      name: "originalPrice",
      title: "Original Price (UVP)",
      type: "number",
      description: "The original price before discount",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: { type: "brand" },
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Product Type / Category",
      type: "string",
      description: "The main product category for filtering and display",
      options: {
        list: [
          { title: "📱 Handy-Zubehör", value: "handy-zubehoer" },
          { title: "⚡ Elektronikartikel", value: "elektronikartikel" },
          { title: "🔋 Batterien", value: "batterien" },
          { title: "🧴 Plastikartikel", value: "plastikartikel" },
          { title: "🎨 Malerzubehör", value: "malerzubehoer" },
          { title: "🌈 Farben", value: "farben" },
          { title: "🔩 Schrauben & Befestigung", value: "schrauben-befestigung" },
          { title: "🔧 Werkzeuge", value: "werkzeuge" },
          { title: "🚲 Fahrradzubehör", value: "fahrradzubehoer" },
          { title: "🚗 Autozubehör", value: "autozubehoer" },
          { title: "🌸 Saisonale Artikel", value: "saisonale-artikel" },
          { title: "🧳 Reisebedarf", value: "reisebedarf" },
          { title: "🍎 Lebensmittel & Getränke", value: "lebensmittel-getraenke" },
          { title: "🧸 Spielzeug", value: "spielzeug" },
          { title: "✏️ Schreibwaren & Geschenke", value: "schreibwaren-geschenke" },
          { title: "🏠 Wohnen & Haushalt", value: "wohnen-haushalt" },
          { title: "👗 Mode & Accessoires", value: "mode-accessoires" },
          { title: "💊 Gesundheit & Drogerie", value: "gesundheit-drogerie" },
          { title: "💻 Elektronik", value: "elektronik" },
          { title: "🏗️ Baumarkt & Werkzeuge", value: "baumarkt-werkzeuge" },
          { title: "🛻 Automotive", value: "automotive" },
          { title: "🪨 Ziersteine", value: "ziersteine" },
          { title: "🌲 Rindenmulch", value: "rindenmulch" },
          { title: "🌿 Gartenwerkzeuge", value: "gartenwerkzeuge" },
          { title: "🏺 Blumentöpfe", value: "blumentoepfe" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `$${subtitle}`,
        media: image,
      };
    },
  },
});