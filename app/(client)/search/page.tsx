// app/(client)/search/page.tsx
import SearchResults from "@/components/SearchResults";
import { client } from "@/sanity/lib/client";
import React from "react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { q } = await searchParams;
  const query = q || "";

  // Fetch products matching the search query
  const products = await client.fetch(
    `*[_type == 'product' && (name match $searchTerm || description match $searchTerm || categories[]->title match $searchTerm)] | order(name asc) {
      ...,
      "categories": categories[]->title
    }`,
    { searchTerm: `${query}*` }
  );

  return (
    <div className="bg-white min-h-screen">
      <SearchResults products={products} searchTerm={query} />
    </div>
  );
};

export default SearchPage;