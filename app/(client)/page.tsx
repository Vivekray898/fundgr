// app/(client)/page.tsx
import styles from "./page.module.css";
import { GroceryHero } from "@/components/HomePage/GroceryHero";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGridFundgrube from "@/components/ProductGridFundgrube";
import ProductGridBestpreis from "@/components/ProductGridBestpreis";
import ShopByBrands from "@/components/ShopByBrands";
import ProductMinimalSection from "@/components/ProductMinimalSection";
import HomeCategoriesSimple from "@/components/HomePage/HomeCategoriesSimple";
import { getCategories, getDealProducts } from "@/sanity/queries";
import React from "react";
import { GroceryPromoBanners } from "@/components/HomePage/GroceryPromoBanners";
import { GroceryWeeklyDeals } from "@/components/HomePage/GroceryWeeklyDeals";
import { GroceryCountdownBanner } from "@/components/HomePage/GroceryCountdownBanner";
import { GroceryFullBanner } from "@/components/HomePage/GroceryFullBanner";
import HeroBannerSlider from "@/components/HomePage/HeroBannerSlider";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import HotProducts from "@/components/HomePage/HotProducts";

// Fetch hero banner slides from Sanity
async function getHeroSlides() {
  const query = `*[_type == "banner" && isActive == true && placement == "hero"] | order(order asc) {
    _id,
    title,
    subtitle,
    cta,
    href,
    image,
    tagline
  }`;
  
  const banners = await client.fetch(query);
  
  return banners.map((banner: any) => ({
    id: banner._id,
    image: urlFor(banner.image).url(),
    imageMobile: urlFor(banner.image).url(),
    badgeLabel: banner.tagline || '',
    title: banner.title,
    subtitle: banner.subtitle || '',
    ctaText: banner.cta || 'Mehr erfahren',
    ctaHref: banner.href || '/shop',
  }));
}

const Home = async () => {
  const categories = await getCategories(6);
  const dealProducts = await getDealProducts();
  const allCategories = await getCategories();
  const heroSlides = await getHeroSlides();

  return (
    <div className={styles.grocerySections}>
      {/* 1. HERO - First impression */}
      <HeroBannerSlider slides={heroSlides} autoplayMs={6000} />

      {/* 2. FUNDGRUBE BRAND - New in Fundgrube */}
      <ProductGridFundgrube />

      {/* 3. BESTPREIS BRAND - New at Bestpreis */}
      <ProductGridBestpreis />

      {/* 4. PRODUCT GRID - Main product showcase */}
      {/* <ProductGrid /> */}
      
      {/* 5. PROMO BANNER - First promotional break */}
      <GroceryPromoBanners />

      {/* 6. HOT PRODUCTS - Trending products */}
      <HotProducts />
      
      {/* 7. WEEKLY DEALS - Product section with deals */}
      <GroceryWeeklyDeals products={dealProducts} />

      {/* 8. CATEGORIES - Quick navigation */}
      <HomeCategories categories={categories} />
      
      {/* 9. COUNTDOWN BANNER - Promotional banner with urgency */}
      <GroceryCountdownBanner />

      {/* 10. SALE PRODUCTS - Product section with discounted items */}
      <ProductMinimalSection 
        title="Sale Angebote" 
        subtitle="Spare jetzt bei unseren Sale-Produkten!"
        status="sale"
        limit={8}
        columns={4}
        linkHref="/angebote"
        linkText="Alle Sale-Angebote"
      />
      
      {/* 11. FULL BANNER - Large promotional banner */}
      <GroceryFullBanner />
      
      {/* 12. BRANDS - Brand showcase section */}
      <ShopByBrands />
      
      {/* 13. BLOG - Content at bottom */}
      <LatestBlog />

      {/* 14. SIMPLE CATEGORIES - All categories at the bottom */}
      <HomeCategoriesSimple 
        categories={allCategories} 
        title="Alle Kategorien entdecken"
        limit={15}
      />
    </div>
  );
};

export default Home;