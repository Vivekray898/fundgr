// app/(client)/page.tsx
import Container from "@/components/Container";
import styles from "./page.module.css";
import { GroceryHero } from "@/components/HomePage/GroceryHero";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import ProductMinimalSection from "@/components/ProductMinimalSection";
import { getCategories, getDealProducts } from "@/sanity/queries";
import React from "react";
import { GroceryPromoBanners } from "@/components/HomePage/GroceryPromoBanners";
import { GroceryWeeklyDeals } from "@/components/HomePage/GroceryWeeklyDeals";
import { GroceryCountdownBanner } from "@/components/HomePage/GroceryCountdownBanner";
import { GroceryFullBanner } from "@/components/HomePage/GroceryFullBanner";

const Home = async () => {
  const categories = await getCategories(6);
  const dealProducts = await getDealProducts();

  return (
    <Container className="bg-shop-light-pink">
      <div className={styles.grocerySections}>
        {/* 1. HERO - First impression */}
        <GroceryHero />
        
        {/* 2. CATEGORIES - Quick navigation */}
        <HomeCategories categories={categories} />
        
        {/* 3. PROMO BANNER - First promotional break */}
        <GroceryPromoBanners />
        
        {/* 4. WEEKLY DEALS - Product section with deals */}
        <GroceryWeeklyDeals products={dealProducts} />
        
        {/* 5. COUNTDOWN BANNER - Promotional banner with urgency */}
        <GroceryCountdownBanner />
        
        {/* 6. SALE PRODUCTS - Product section with discounted items */}
        <ProductMinimalSection 
          title="Sale Angebote" 
          subtitle="Spare jetzt bei unseren Sale-Produkten!"
          status="sale"
          limit={8}
          columns={4}
          linkHref="/angebote"
          linkText="Alle Sale-Angebote"
        />
        
        {/* 7. FULL BANNER - Large promotional banner */}
        <GroceryFullBanner />
        
        {/* 8. PRODUCT GRID - Main product showcase */}
        <ProductGrid />
        
        {/* 9. BRANDS - Brand showcase section */}
        <ShopByBrands />
        
        {/* 10. BLOG - Content at bottom */}
        <LatestBlog />
      </div>
    </Container>
  );
};

export default Home;