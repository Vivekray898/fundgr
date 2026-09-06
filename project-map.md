# nextjs Project Map

Generated: 9/6/2026, 5:47:57 PM

## Statistics

- **Folders:** 0
- **Files:** 0
- **Size:** 3.69 MB

---

## Folder Structure

```
fundgr
├── actions
│   └── createCheckoutSession.ts
├── app
│   ├── (client)
│   │   ├── angebote
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   └── webhook
│   │   │       └── route.ts
│   │   ├── brand
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── cart
│   │   │   └── page.tsx
│   │   ├── category
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── datenschutz
│   │   │   └── page.tsx
│   │   ├── deal
│   │   │   └── page.tsx
│   │   ├── impressum
│   │   │   └── page.tsx
│   │   ├── orders
│   │   │   └── page.tsx
│   │   ├── product
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── riff-raff
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── search
│   │   │   └── page.tsx
│   │   ├── shop
│   │   │   └── page.tsx
│   │   ├── sortiment
│   │   │   └── page.tsx
│   │   ├── store
│   │   │   ├── [slug]
│   │   │   │   ├── prospekt
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── success
│   │   │   └── page.tsx
│   │   ├── videos
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── wishlist
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api
│   │   └── header
│   │       └── route.ts
│   ├── studio
│   │   └── [[...tool]]
│   │       └── page.tsx
│   ├── apple-icon.png
│   ├── favicon.ico
│   ├── globals.css
│   ├── icon0.svg
│   ├── icon1.png
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components
│   ├── deals
│   │   ├── DealsHero.tsx
│   │   ├── DealsNavigation.tsx
│   │   ├── DealsProductCard.tsx
│   │   ├── DealsSection.tsx
│   │   └── ThemesSection.tsx
│   ├── HomePage
│   │   ├── GroceryBlog.tsx
│   │   ├── GroceryCategories.tsx
│   │   ├── GroceryCollectionsPageContent.tsx
│   │   ├── GroceryCountdownBanner.tsx
│   │   ├── GroceryFeaturedCollection.tsx
│   │   ├── GroceryFeaturedProducts.tsx
│   │   ├── GroceryFeaturedSlider.tsx
│   │   ├── GroceryFeatures.tsx
│   │   ├── GroceryFullBanner.tsx
│   │   ├── GroceryHero.tsx
│   │   ├── GroceryInstagram.tsx
│   │   ├── GroceryPopularProducts.tsx
│   │   ├── GroceryProductCard.tsx
│   │   ├── GroceryPromoBanners.tsx
│   │   ├── GroceryShopFAQ.tsx
│   │   └── GroceryWeeklyDeals.tsx
│   ├── hooks
│   │   ├── useBanners.ts
│   │   ├── useCategories.ts
│   │   ├── useCountdownBanner.ts
│   │   ├── useFeaturedCollection.ts
│   │   └── useFullBanner.ts
│   ├── providers
│   │   └── CatalogueSettingsProvider.tsx
│   ├── shop
│   │   ├── BrandList.tsx
│   │   ├── CategoryList.tsx
│   │   ├── PriceList.tsx
│   │   └── SortList.tsx
│   ├── sortiment
│   │   ├── CategoryCard.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── PopularCategories.tsx
│   │   └── SortimentHero.tsx
│   ├── store
│   │   ├── PDFFlipbook.tsx
│   │   └── StorePage.tsx
│   ├── ui
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── radio-group.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── table.tsx
│   │   ├── text.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   ├── AddToCartButton.tsx
│   ├── CartIcon.tsx
│   ├── CatalogueButton.tsx
│   ├── CategoryProducts.tsx
│   ├── Container.tsx
│   ├── DealsPage.tsx
│   ├── EmptyCart.tsx
│   ├── FavoriteButton.tsx
│   ├── FloatingWhatsApp.tsx
│   ├── Footer.tsx
│   ├── FooterTop.tsx
│   ├── Header.tsx
│   ├── HeaderClient.tsx
│   ├── HeaderMenu.tsx
│   ├── HeaderWrapper.tsx
│   ├── HomeBannerClient.tsx
│   ├── HomeBannerWrapper.tsx
│   ├── HomeCategories.tsx
│   ├── HomeTabbar.tsx
│   ├── ImageView.tsx
│   ├── LatestBlog.tsx
│   ├── Logo.tsx
│   ├── MarketLocatorButton.tsx
│   ├── MobileMenu.tsx
│   ├── NoAccess.tsx
│   ├── NoProductAvailable.tsx
│   ├── OptimonkScript.tsx
│   ├── OrderDetailDialog.tsx
│   ├── OrdersComponent.tsx
│   ├── PriceFormatter.tsx
│   ├── PriceView.tsx
│   ├── ProductCard.tsx
│   ├── ProductCharacteristics.tsx
│   ├── ProductGrid.tsx
│   ├── ProductMinimalCard.tsx
│   ├── ProductMinimalSection.tsx
│   ├── ProductSideMenu.tsx
│   ├── QuantityButtons.tsx
│   ├── RecentlyViewed.tsx
│   ├── RelatedProducts.tsx
│   ├── SearchBar.tsx
│   ├── SearchResults.tsx
│   ├── SeasonalNoProductAvailable.tsx
│   ├── SeasonalNotice.tsx
│   ├── SeasonalProductNotice.tsx
│   ├── Shop.tsx
│   ├── ShopByBrands.tsx
│   ├── SideMenu.tsx
│   ├── SignIn.tsx
│   ├── SocialMedia.tsx
│   ├── SortimentPage.tsx
│   ├── StoreLocator.tsx
│   ├── Title.tsx
│   └── WishListProducts.tsx
├── constants
│   └── data.ts
├── contexts
│   └── CatalogueContext.tsx
├── hooks
│   ├── index.ts
│   └── useCatalogueMode.ts
├── images
│   ├── banner
│   │   └── banner_1.png
│   ├── brands
│   │   ├── brand_1.webp
│   │   └── brand_7.png
│   ├── products
│   │   ├── product_1.png
│   │   ├── product_10.png
│   │   ├── product_11.png
│   │   ├── product_12.png
│   │   ├── product_13.png
│   │   ├── product_14.png
│   │   ├── product_15.png
│   │   ├── product_16.png
│   │   ├── product_17.png
│   │   ├── product_18.png
│   │   ├── product_19.png
│   │   ├── product_2.jpg
│   │   ├── product_20.png
│   │   ├── product_21.png
│   │   ├── product_22.png
│   │   ├── product_23.png
│   │   ├── product_3.png
│   │   ├── product_4.png
│   │   ├── product_5.png
│   │   ├── product_6.png
│   │   ├── product_7.png
│   │   ├── product_8.png
│   │   └── product_9.png
│   ├── demo.jpg
│   ├── emptyCart.png
│   ├── index.ts
│   ├── payment.png
│   └── paypalLogo.png
├── lib
│   ├── banner.server.ts
│   ├── stripe.ts
│   ├── utils.ts
│   ├── youtube.server.ts
│   └── youtube.ts
├── sanity
│   ├── lib
│   │   ├── backendClient.ts
│   │   ├── client.ts
│   │   ├── image.ts
│   │   └── live.ts
│   ├── queries
│   │   ├── bannerQuery.ts
│   │   ├── categories.ts
│   │   ├── footer.ts
│   │   ├── header.ts
│   │   ├── index.ts
│   │   ├── query.ts
│   │   ├── settings.ts
│   │   └── storeQueries.ts
│   ├── schemaTypes
│   │   ├── addressType.ts
│   │   ├── authorType.ts
│   │   ├── banner.ts
│   │   ├── bannerType.ts
│   │   ├── blockContentType.ts
│   │   ├── blogCategoryType.ts
│   │   ├── blogType.ts
│   │   ├── brandTypes.ts
│   │   ├── categoryType.ts
│   │   ├── footerType.ts
│   │   ├── headerType.ts
│   │   ├── index.ts
│   │   ├── orderType.ts
│   │   ├── productType.ts
│   │   ├── settings.ts
│   │   └── store.ts
│   ├── env.ts
│   └── structure.ts
├── scripts
│   ├── import-categories.js
│   ├── merge-duplicate-categories.js
│   ├── merge-garten-pflanzen.js
│   ├── migrate-from-backup.js
│   ├── migrate-products.js
│   ├── seedBanner.ts
│   └── update-product-stock.js
├── .gitignore
├── components.json
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── pro-map.js
├── README.md
├── sanity.cli.ts
├── sanity.config.ts
├── store.ts
└── tsconfig.json

```
