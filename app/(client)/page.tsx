// app/(client)/page.tsx
import Container from "@/components/Container";
import HomeBannerWrapper from "@/components/HomeBannerWrapper";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import ProductMinimalSection from "@/components/ProductMinimalSection";
import { getCategories, getDealProducts } from "@/sanity/queries";

import React from "react";

const Home = async () => {
  const categories = await getCategories(6);
  const dealProducts = await getDealProducts();

  return (
    <Container className="bg-shop-light-pink">
      <HomeBannerWrapper 
        autoplay={true} 
        autoplayInterval={5000} 
      />
      <ProductGrid />
      <HomeCategories categories={categories} />
      
      {/* Just one line! */}
      <ProductMinimalSection 
        products={dealProducts} 
        title="Top Angebote" 
        subtitle="Unsere besten Deals für Sie" 
      />
      


      <ShopByBrands />
      <LatestBlog />
    </Container>
  );
};

export default Home;