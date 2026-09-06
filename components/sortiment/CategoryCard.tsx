// components/sortiment/CategoryCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Flower2, 
  Wrench, 
  TreePine, 
  Car, 
  Paintbrush, 
  Droplets, 
  LayoutGrid, 
  Lightbulb, 
  PawPrint, 
  CookingPot, 
  Gift, 
  Star,
  Sparkles
} from "lucide-react";

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

// Helper function to safely get slug string
const getSlugString = (slug: any): string => {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
};

const iconMap: Record<string, any> = {
  garden: Flower2,
  tools: Wrench,
  wood: TreePine,
  auto: Car,
  paint: Paintbrush,
  plumbing: Droplets,
  tiles: LayoutGrid,
  lighting: Lightbulb,
  pets: PawPrint,
  kitchen: CookingPot,
  gift: Gift,
  default: Star,
};

const CategoryCard = ({ category, index = 0 }: { category: Category; index?: number }) => {
  const slug = getSlugString(category.slug);
  const Icon = iconMap[category.categoryIcon || "default"] || iconMap.default;

  const getGradient = (idx: number) => {
    const gradients = [
      "from-[#F8F6F2] to-[#F5F0E8]",
      "from-[#F5F0E8] to-[#F8F6F2]",
      "from-[#F8F6F2] to-[#F0EDE5]",
      "from-[#F5F0E8] to-[#F0EDE5]",
    ];
    return gradients[idx % gradients.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="h-full"
    >
      <Link
        href={`/category/${slug}`}
        className="group block h-full overflow-hidden rounded-xl border border-[#E8E3D8] bg-white hover:shadow-lg hover:shadow-[#E8E3D8]/50 active:scale-[0.97] transition-all duration-200"
      >
        {/* Image - Smaller height */}
        <div className={`relative h-24 sm:h-28 md:h-32 overflow-hidden bg-gradient-to-br ${getGradient(index)}`}>
          {category.image ? (
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-[#D4A853]/30 group-hover:text-[#D4A853] transition-colors" />
            </div>
          )}

          {/* Seasonal Badge - Smaller */}
          {category.isSeasonal && (
            <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-[#D4A853] text-white text-[6px] sm:text-[8px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg shadow-[#D4A853]/30 flex items-center gap-0.5">
              <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5" />
              <span className="hidden xs:inline">Saisonal</span>
            </div>
          )}

          {/* Product Count - Smaller */}
          {category.productCount && (
            <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 bg-white/90 backdrop-blur-sm text-[#1a1a1a] text-[6px] sm:text-[8px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-md border border-[#E8E3D8]">
              {category.productCount}
            </div>
          )}
        </div>

        {/* Content - Compact */}
        <div className="p-2.5 sm:p-3 md:p-3.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-lg bg-[#F5F0E8] flex items-center justify-center group-hover:bg-[#D4A853] transition-all duration-300 flex-shrink-0">
              <Icon className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-[#B8923A] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#1a1a1a] group-hover:text-[#B8923A] transition-colors line-clamp-1 flex-1">
              {category.title}
            </h3>
          </div>

          <p className="text-[10px] sm:text-xs text-[#8A7A6A] mt-1 sm:mt-1.5 line-clamp-1">
            {category.teaserSubtitle || category.description || `${category.productCount || 0} Produkte`}
          </p>

          <div className="flex items-center gap-0.5 mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-medium text-[#B8923A] group-hover:text-[#9A7A2A] group-hover:gap-1 transition-all">
            <span>Entdecken</span>
            <ArrowRight className="w-2.5 sm:w-3 h-2.5 sm:h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;