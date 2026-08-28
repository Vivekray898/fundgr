// app/(client)/angebote/page.tsx
import DealsPage from "@/components/DealsPage";
import { 
  getDealProducts, 
  getNewProducts, 
  getHotProducts, 
  getFeaturedCategories, 
  getSeasonalCategories 
} from "@/sanity/queries";

export const revalidate = 60;

const AngebotePage = async () => {
  const [dealProducts, newProducts, hotProducts, featuredCategories, seasonalCategories] = await Promise.all([
    getDealProducts(),
    getNewProducts(),
    getHotProducts(),
    getFeaturedCategories(),
    getSeasonalCategories(),
  ]);

  return (
    <DealsPage 
      dealProducts={dealProducts} 
      newProducts={newProducts} 
      hotProducts={hotProducts} 
      featuredCategories={featuredCategories} 
      seasonalCategories={seasonalCategories} 
    />
  );
};

export default AngebotePage;