// sanity/schemaTypes/banner.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (e.g., "SALE UP TO 30% OFF")',
      type: 'string',
      description: 'Small text above the title - appears as a badge or highlight',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Secondary text below the title',
    }),
    defineField({
      name: 'titleLine2',
      title: 'Title Line 2 (for hero slides)',
      type: 'string',
      description: 'If left empty, title will be auto-split into 2 lines',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Detailed description text for the banner',
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'href',
      title: 'Link URL',
      type: 'string',
      initialValue: '/shop',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Thumbnail Images (for countdown banner)',
      type: 'array',
      of: [{ type: 'image' }],
      description: 'Add up to 3 thumbnail images for the countdown banner',
    }),
    defineField({
      name: 'countdownEnd',
      title: 'Countdown End Date',
      type: 'datetime',
      description: 'When the countdown should end (e.g., 2026-12-31T23:59:59)',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Background color for the banner (e.g., #fff3e6)',
      initialValue: '#fff3e6',
    }),
    defineField({
      name: 'placement',
      title: 'Placement Type',
      type: 'string',
      options: {
        list: [
          { title: 'Hero Slider', value: 'hero' },
          { title: 'Side Banner', value: 'side' },
          { title: 'Promo Banner', value: 'promo' },
          { title: 'Weekly Deals', value: 'weekly' },
          { title: 'Featured Collection', value: 'featured-collection' },
          { title: 'Full Banner', value: 'full-banner' },
          { title: 'Countdown Banner', value: 'countdown' }, // ✅ Add this
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color (for side banners)',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (#222)', value: '#222' },
          { title: 'White (#fff)', value: '#fff' },
        ],
      },
      initialValue: '#222',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Inactive banners will not appear on the frontend',
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'placement',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      const placementLabels: Record<string, string> = {
        hero: 'Hero',
        side: 'Side',
        promo: 'Promo',
        weekly: 'Weekly Deals',
        'featured-collection': 'Featured Collection',
        'full-banner': 'Full Banner',
        countdown: 'Countdown Banner',
      };
      return {
        title: title || 'Untitled Banner',
        subtitle: `Placement: ${placementLabels[subtitle || ''] || subtitle || 'N/A'}`,
        media,
      };
    },
  },
});