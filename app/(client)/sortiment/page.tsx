// app/(client)/sortiment/page.tsx
import SortimentPage from "@/components/SortimentPage";
import { getCategories } from "@/sanity/queries";
import React from "react";

const Sortiment = async () => {
  const categories = await getCategories();

  return (
    <div className="bg-white min-h-screen">
      <SortimentPage categories={categories} />
    </div>
  );
};

export default Sortiment;