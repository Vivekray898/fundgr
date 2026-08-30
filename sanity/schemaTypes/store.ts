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
    // =============================================
    // GENERAL INFORMATION
    // =============================================
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

    // =============================================
    // CONTACT & LOCATION
    // =============================================
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

    // =============================================
    // CONTENT
    // =============================================
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
    }),
    
    // --- Prospekt (PDF Flipbook) ---
    defineField({
      name: 'prospect',
      title: 'Prospekt (PDF Flipbook)',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'pdf',
          title: 'PDF File',
          type: 'file',
          description: 'Upload the PDF file for the interactive flipbook',
          options: {
            accept: '.pdf',
          },
        },
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Title of the prospect (e.g., "KW 36 2026")',
        },
        {
          name: 'startDate',
          title: 'Start Date',
          type: 'date',
        },
        {
          name: 'endDate',
          title: 'End Date',
          type: 'date',
        },
        {
          name: 'previewImage',
          title: 'Preview Image',
          type: 'image',
          description: 'Cover image shown before the PDF loads',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'isActive',
          title: 'Active',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),
    
    // --- Other Content Fields ---
    defineField({
      name: 'localServices',
      title: 'Local Services',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'Services available on-site (e.g., "Gastronomie Trefferia")',
    }),

    // =============================================
    // SERVICES
    // =============================================
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

    // =============================================
    // SEO
    // =============================================
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