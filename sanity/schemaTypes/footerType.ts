// sanity/schemas/footer.ts
import { defineField, defineType } from "sanity";

export const footerType = defineType({
  name: "footer",
  title: "Footer Configuration",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Footer Configuration",
      readOnly: true,
    }),
    // Logo Section
    defineField({
      name: "logo",
      title: "Logo",
      type: "object",
      fields: [
        defineField({
          name: "image",
          title: "Logo Image",
          type: "image",
        }),
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          initialValue: "Logo",
        }),
        defineField({
          name: "width",
          title: "Width",
          type: "number",
          initialValue: 180,
        }),
        defineField({
          name: "height",
          title: "Height",
          type: "number",
          initialValue: 50,
        }),
      ],
    }),
    // About Section
    defineField({
      name: "about",
      title: "About Section",
      type: "object",
      fields: [
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          initialValue: "Discover curated furniture collections at FundGrube-Bestpreisyt, blending style and comfort to elevate your living spaces.",
        }),
        defineField({
          name: "showSocialMedia",
          title: "Show Social Media",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
    // Social Media Links
    defineField({
      name: "socialMedia",
      title: "Social Media Links",
      type: "object",
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook URL",
          type: "url",
          initialValue: "https://facebook.com",
        }),
        defineField({
          name: "instagram",
          title: "Instagram URL",
          type: "url",
          initialValue: "https://instagram.com",
        }),
        defineField({
          name: "twitter",
          title: "Twitter/X URL",
          type: "url",
          initialValue: "https://twitter.com",
        }),
        defineField({
          name: "youtube",
          title: "YouTube URL",
          type: "url",
          initialValue: "https://youtube.com",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn URL",
          type: "url",
          initialValue: "https://linkedin.com",
        }),
        defineField({
          name: "pinterest",
          title: "Pinterest URL",
          type: "url",
          initialValue: "https://pinterest.com",
        }),
        defineField({
          name: "tiktok",
          title: "TikTok URL",
          type: "url",
          initialValue: "https://tiktok.com",
        }),
      ],
    }),
    // Product Categories Column
    defineField({
      name: "productCategories",
      title: "Product Categories Column",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Our Product Range",
        }),
        defineField({
          name: "showCategories",
          title: "Show Categories",
          type: "boolean",
          initialValue: true,
          description: "Automatically show categories from Sanity",
        }),
      ],
    }),
    // Service Column
    defineField({
      name: "serviceLinks",
      title: "Service Column",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Service",
        }),
        defineField({
          name: "links",
          title: "Links",
          type: "array",
          of: [
            defineField({
              name: "link",
              title: "Link",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                }),
                defineField({
                  name: "href",
                  title: "URL",
                  type: "string",
                }),
              ],
            }),
          ],
          initialValue: [
            { title: "Bonus Card", href: "/bonus" },
            { title: "Machine Rental", href: "/machine-rental" },
            { title: "Returns & Complaints", href: "/returns" },
            { title: "All Services", href: "/services" },
            { title: "Newsletter", href: "/newsletter" },
          ],
        }),
      ],
    }),
    // Company Column
    defineField({
      name: "companyLinks",
      title: "Company Column",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "About Us",
        }),
        defineField({
          name: "links",
          title: "Links",
          type: "array",
          of: [
            defineField({
              name: "link",
              title: "Link",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                }),
                defineField({
                  name: "href",
                  title: "URL",
                  type: "string",
                }),
              ],
            }),
          ],
          initialValue: [
            { title: "About Us", href: "/about" },
            { title: "Sustainability", href: "/sustainability" },
            { title: "Jobs", href: "/careers" },
            { title: "Press", href: "/press" },
            { title: "All Markets", href: "/markets" },
          ],
        }),
      ],
    }),
    // Contact Column
    defineField({
      name: "contactInfo",
      title: "Contact Column",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Do You Have Questions?",
        }),
        defineField({
          name: "items",
          title: "Contact Items",
          type: "array",
          of: [
            defineField({
              name: "item",
              title: "Contact Item",
              type: "object",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: {
                    list: [
                      { title: "Map Pin", value: "mapPin" },
                      { title: "Phone", value: "phone" },
                      { title: "Clock", value: "clock" },
                      { title: "Mail", value: "mail" },
                    ],
                  },
                }),
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                }),
                defineField({
                  name: "subtitle",
                  title: "Subtitle",
                  type: "string",
                }),
              ],
            }),
          ],
          initialValue: [
            { icon: "mapPin", title: "Visit Us", subtitle: "123 Main Street, Berlin, Germany" },
            { icon: "phone", title: "Call Us", subtitle: "+49 123 456 789" },
            { icon: "clock", title: "Working Hours", subtitle: "Mon - Sat: 9:00 AM - 8:00 PM" },
            { icon: "mail", title: "Email Us", subtitle: "info@fundgrube.de" },
          ],
        }),
      ],
    }),
    // Payment Methods
    defineField({
      name: "paymentMethods",
      title: "Payment Methods",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Pay Conveniently!",
        }),
        defineField({
          name: "methods",
          title: "Payment Methods",
          type: "array",
          of: [
            defineField({
              name: "method",
              title: "Payment Method",
              type: "string",
              options: {
                list: [
                  { title: "PayPal", value: "paypal" },
                  { title: "Wero", value: "wero" },
                  { title: "Invoice", value: "invoice" },
                  { title: "Credit Card", value: "creditCard" },
                  { title: "Prepayment", value: "prepayment" },
                  { title: "Financing", value: "financing" },
                  { title: "Instant Bank Transfer", value: "instantBank" },
                  { title: "Direct Debit", value: "directDebit" },
                ],
              },
            }),
          ],
          initialValue: [
            "paypal",
            "wero",
            "invoice",
            "creditCard",
            "prepayment",
            "financing",
            "instantBank",
            "directDebit",
          ],
        }),
      ],
    }),
    // Bottom Bar
    defineField({
      name: "bottomBar",
      title: "Footer Bottom Section",
      type: "object",
      fields: [
        defineField({
          name: "copyrightText",
          title: "Copyright Text",
          type: "string",
          initialValue: "©2026 FundGrube GmbH & Co. KG",
        }),
        defineField({
          name: "bottomLinks",
          title: "Bottom Links",
          type: "array",
          of: [
            defineField({
              name: "link",
              title: "Link",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                }),
                defineField({
                  name: "href",
                  title: "URL",
                  type: "string",
                }),
              ],
            }),
          ],
          initialValue: [
            { title: "Terms & Conditions", href: "/terms" },
            { title: "Right of Withdrawal", href: "/withdrawal" },
            { title: "Imprint", href: "/imprint" },
            { title: "Data Protection", href: "/privacy" },
            { title: "Accessibility", href: "/accessibility" },
            { title: "Cookie Settings", href: "/cookies" },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare() {
      return {
        title: "Footer Configuration",
      };
    },
  },
});