// sanity/schemas/store.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'store',
  title: 'Store',
  type: 'document',
  groups: [
    { name: 'general', title: 'General' },
    { name: 'contact', title: 'Contact & Location' },
    { name: 'content', title: 'Content' },
    { name: 'services', title: 'Services' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // General Information
    defineField({
      name: 'name',
      title: 'Store Name',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'general',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Store',
      type: 'boolean',
      group: 'general',
      initialValue: false,
      description: 'Set as the default store for the store locator',
    }),
    defineField({
      name: 'image',
      title: 'Store Image',
      type: 'image',
      group: 'general',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'general',
      description: 'Large hero image for the store page',
      options: {
        hotspot: true,
      },
    }),

    // Contact & Location
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'zip',
      title: 'ZIP Code',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'day', title: 'Day', type: 'string' },
            { name: 'hours', title: 'Hours', type: 'string' },
            { name: 'isClosed', title: 'Closed', type: 'boolean' },
          ],
        },
      ],
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
      group: 'contact',
      description: 'Google Maps embed URL or place ID',
    }),

    // Content
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'gastronomy',
      title: 'Gastronomy',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'name', title: 'Restaurant Name', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'image', title: 'Image', type: 'image' },
        { name: 'menuLink', title: 'Menu Link', type: 'url' },
      ],
    }),
    defineField({
      name: 'prospectImage',
      title: 'Current Prospekt Image',
      type: 'image',
      group: 'content',
      description: 'Image of the current weekly flyer',
    }),
    defineField({
      name: 'prospectUrl',
      title: 'Prospekt URL',
      type: 'url',
      group: 'content',
      description: 'Link to the interactive prospect or PDF',
    }),
    defineField({
      name: 'prospectStartDate',
      title: 'Prospekt Start Date',
      type: 'date',
      group: 'content',
    }),
    defineField({
      name: 'prospectEndDate',
      title: 'Prospekt End Date',
      type: 'date',
      group: 'content',
    }),
    defineField({
      name: 'localServices',
      title: 'Local Services',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'Services available on-site (e.g., "Gastronomie Trefferia")',
    }),

    // Services
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'services',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'slug', title: 'Slug', type: 'slug' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'icon', title: 'Icon Name', type: 'string' },
            { name: 'image', title: 'Icon Image', type: 'image' },
            { name: 'isActive', title: 'Active', type: 'boolean' },
            { name: 'order', title: 'Order', type: 'number' },
          ],
        },
      ],
    }),
    defineField({
      name: 'additionalServices',
      title: 'Additional Services',
      type: 'array',
      group: 'services',
      of: [{ type: 'string' }],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        { name: 'title', title: 'Meta Title', type: 'string' },
        { name: 'description', title: 'Meta Description', type: 'text' },
        { name: 'keywords', title: 'Keywords', type: 'string' },
      ],
    }),
  ],
});