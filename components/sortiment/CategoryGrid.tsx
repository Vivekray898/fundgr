// components/sortiment/CategoryGrid.tsx
import CategoryCard from "./CategoryCard";

// Define interface for category with flexible slug
interface Category {
  _id: string;
  title: string;
  slug?: {
    current: string;
  } | string;
  image?: string;
  teaserSubtitle?: string;
  description?: string;
  categoryIcon?: string;
  isSeasonal?: boolean;
  productCount?: number;
}

const CategoryGrid = ({ categories }: { categories: Category[] }) => {
  // Filter to only categories with images
  const categoriesWithImages = categories?.filter(
    (category) => category.image
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {categoriesWithImages?.map((category, index) => (
        <CategoryCard key={category._id} category={category} index={index} />
      ))}
    </div>
  );
};

export default CategoryGrid;