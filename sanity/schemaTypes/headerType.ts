import { defineField, defineType } from "sanity";

export const headerType = defineType({
  name: "header",
  title: "Header Configuration",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Header Configuration",
      readOnly: true,
    }),
    defineField({
      name: "topBar",
      title: "Top Bar",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Enable Top Bar",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "trustBadges",
          title: "Trust Badges",
          type: "array",
          of: [
            defineField({
              name: "badge",
              title: "Badge",
              type: "object",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: {
                    list: [
                      { title: "Truck", value: "truck" },
                      { title: "Check Circle", value: "checkCircle" },
                      { title: "Store", value: "store" },
                      { title: "Shield", value: "shield" },
                      { title: "Star", value: "star" },
                      { title: "Heart", value: "heart" },
                    ],
                  },
                }),
                defineField({
                  name: "text",
                  title: "Text",
                  type: "string",
                }),
                defineField({
                  name: "link",
                  title: "Link (optional)",
                  type: "string",
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "serviceLinks",
          title: "Service Links",
          type: "array",
          of: [
            defineField({
              name: "link",
              title: "Link",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                }),
                defineField({
                  name: "url",
                  title: "URL",
                  type: "string",
                }),
                defineField({
                  name: "isStoreLocator",
                  title: "Is Store Locator?",
                  type: "boolean",
                  initialValue: false,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
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
    defineField({
      name: "navigation",
      title: "Navigation Menu",
      type: "object",
      fields: [
        defineField({
          name: "items",
          title: "Menu Items",
          type: "array",
          of: [
            defineField({
              name: "menuItem",
              title: "Menu Item",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                }),
                defineField({
                  name: "url",
                  title: "URL",
                  type: "string",
                }),
                defineField({
                  name: "type",
                  title: "Type",
                  type: "string",
                  options: {
                    list: [
                      { title: "Custom Link", value: "custom" },
                      { title: "Category", value: "category" },
                    ],
                  },
                  initialValue: "custom",
                }),
                defineField({
                  name: "category",
                  title: "Category Reference",
                  type: "reference",
                  to: [{ type: "category" }],
                  hidden: ({ parent }) => parent?.type !== "category",
                }),
                defineField({
                  name: "children",
                  title: "Dropdown Items",
                  type: "array",
                  of: [
                    defineField({
                      name: "childItem",
                      title: "Child Item",
                      type: "object",
                      fields: [
                        defineField({
                          name: "label",
                          title: "Label",
                          type: "string",
                        }),
                        defineField({
                          name: "url",
                          title: "URL",
                          type: "string",
                        }),
                        defineField({
                          name: "type",
                          title: "Type",
                          type: "string",
                          options: {
                            list: [
                              { title: "Custom Link", value: "custom" },
                              { title: "Category", value: "category" },
                            ],
                          },
                          initialValue: "custom",
                        }),
                        defineField({
                          name: "category",
                          title: "Category Reference",
                          type: "reference",
                          to: [{ type: "category" }],
                          hidden: ({ parent }) => parent?.type !== "category",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "useCategories",
          title: "Auto-generate from Categories",
          type: "boolean",
          initialValue: false,
          description: "Automatically generate navigation from categories",
        }),
        defineField({
          name: "categoryParent",
          title: "Parent Category for Navigation",
          type: "reference",
          to: [{ type: "category" }],
          hidden: ({ parent }) => !parent?.useCategories,
          description: "Select a parent category to show its subcategories",
        }),
      ],
    }),
    defineField({
      name: "actions",
      title: "Header Actions",
      type: "object",
      fields: [
        defineField({
          name: "showWishlist",
          title: "Show Wishlist",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "showCart",
          title: "Show Cart",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "showLogin",
          title: "Show Login/SignIn",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "showStoreLocator",
          title: "Show Store Locator",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "searchBar",
      title: "Search Bar",
      type: "object",
      fields: [
        defineField({
          name: "placeholder",
          title: "Placeholder Text",
          type: "string",
          initialValue: "Wonach suchen Sie?",
        }),
        defineField({
          name: "suggestions",
          title: "Search Suggestions",
          type: "array",
          of: [{ type: "string" }],
          initialValue: ["Garten", "Werkzeug", "Holz", "Farben", "Sanitär", "Elektro"],
        }),
      ],
    }),
    defineField({
      name: "mobile",
      title: "Mobile Settings",
      type: "object",
      fields: [
        defineField({
          name: "showSearchRow",
          title: "Show Search in Second Row",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "menuItems",
          title: "Mobile Menu Items",
          type: "array",
          of: [
            defineField({
              name: "menuItem",
              title: "Menu Item",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                }),
                defineField({
                  name: "url",
                  title: "URL",
                  type: "string",
                }),
                defineField({
                  name: "children",
                  title: "Dropdown Items",
                  type: "array",
                  of: [
                    defineField({
                      name: "childItem",
                      title: "Child Item",
                      type: "object",
                      fields: [
                        defineField({
                          name: "label",
                          title: "Label",
                          type: "string",
                        }),
                        defineField({
                          name: "url",
                          title: "URL",
                          type: "string",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Store Locator Settings with Stores Array
    defineField({
      name: "storeLocator",
      title: "Store Locator Settings",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Mein Markt",
        }),
        defineField({
          name: "placeholder",
          title: "Search Placeholder",
          type: "string",
          initialValue: "Markt suchen...",
        }),
        defineField({
          name: "changeStoreText",
          title: "Change Store Button Text",
          type: "string",
          initialValue: "Markt ändern",
        }),
        defineField({
          name: "storePageText",
          title: "Store Page Button Text",
          type: "string",
          initialValue: "Zum Markt",
        }),
        defineField({
          name: "addressLabel",
          title: "Address Label",
          type: "string",
          initialValue: "Adresse",
        }),
        defineField({
          name: "contactLabel",
          title: "Contact Label",
          type: "string",
          initialValue: "Kontakt",
        }),
        defineField({
          name: "openingHoursLabel",
          title: "Opening Hours Label",
          type: "string",
          initialValue: "Öffnungszeiten",
        }),
        defineField({
          name: "distanceLabel",
          title: "Distance Label",
          type: "string",
          initialValue: "Entfernung",
        }),
        defineField({
          name: "routeLabel",
          title: "Route Label",
          type: "string",
          initialValue: "Route planen",
        }),
        defineField({
          name: "noStoresFound",
          title: "No Stores Found Message",
          type: "string",
          initialValue: "Keine Märkte gefunden",
        }),
        defineField({
          name: "backLabel",
          title: "Back Label",
          type: "string",
          initialValue: "Zurück",
        }),
        // NEW: Stores array
        defineField({
          name: "stores",
          title: "Stores",
          type: "array",
          of: [
            defineField({
              name: "store",
              title: "Store",
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  title: "Store Name",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "address",
                  title: "Address",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "city",
                  title: "City",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "zip",
                  title: "ZIP Code",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "phone",
                  title: "Phone Number",
                  type: "string",
                }),
                defineField({
                  name: "email",
                  title: "Email",
                  type: "string",
                }),
                defineField({
                  name: "openingHours",
                  title: "Opening Hours",
                  type: "string",
                  initialValue: "Mo. - Sa.: 09:00 - 20:00 Uhr",
                }),
                defineField({
                  name: "image",
                  title: "Store Image",
                  type: "image",
                  options: {
                    hotspot: true,
                  },
                }),
                defineField({
                  name: "latitude",
                  title: "Latitude",
                  type: "number",
                  description: "Latitude for Google Maps",
                }),
                defineField({
                  name: "longitude",
                  title: "Longitude",
                  type: "number",
                  description: "Longitude for Google Maps",
                }),
                defineField({
                  name: "isDefault",
                  title: "Default Store",
                  type: "boolean",
                  initialValue: false,
                  description: "Set as the default selected store",
                }),
                defineField({
                  name: "distance",
                  title: "Distance (Display Only)",
                  type: "string",
                  description: "e.g., '2.3 km' - this is for display purposes",
                }),
              ],
              preview: {
                select: {
                  title: "name",
                  subtitle: "address",
                },
              },
            }),
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
        title: "Header Configuration",
      };
    },
  },
});