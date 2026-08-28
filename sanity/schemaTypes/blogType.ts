// sanity/schemas/blog.ts
import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const blogType = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      title: "Hauptbild",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "blogcategories",
      title: "Blog-Kategorien",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: { type: "blogcategory" } }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Veröffentlicht am",
      type: "datetime",
    }),
    defineField({
      name: "isLatest",
      title: "Neuester Blog",
      type: "boolean",
      description: "Als neuesten Blog markieren",
      initialValue: false,
    }),
    defineField({
      name: "excerpt",
      title: "Kurzbeschreibung",
      type: "text",
      description: "Eine kurze Zusammenfassung des Blog-Artikels",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Inhalt",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      isLatest: "isLatest",
    },
    prepare(selection) {
      const { author, isLatest } = selection;
      return {
        ...selection,
        subtitle: author ? `${isLatest ? "⭐ Neuest | " : ""}Von ${author}` : "Kein Autor",
      };
    },
  },
});