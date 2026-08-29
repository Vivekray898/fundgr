import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";
import React, { Suspense } from "react";

const ShopPage = async () => {
  const categories = await getCategories();
  const brands = await getAllBrands();
  return (
    <div className="bg-white">
      <Suspense fallback={<div className="p-8 text-center">Shop wird geladen …</div>}>
        <Shop categories={categories} brands={brands} />
      </Suspense>
    </div>
  );
};

export default ShopPage;