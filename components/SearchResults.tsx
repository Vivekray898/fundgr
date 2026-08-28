// components/SearchResults.tsx
"use client";
import React from "react";
import Container from "./Container";
import ProductCard from "./ProductCard";
import { Search, X } from "lucide-react";
import Link from "next/link";

interface SearchResultsProps {
  products: any[];
  searchTerm: string;
}

const SearchResults = ({ products, searchTerm }: SearchResultsProps) => {
  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Suchergebnisse für <span className="text-rose-500">"{searchTerm}"</span>
        </h1>
        <p className="text-gray-500 mt-1">
          {products.length} Produkt{products.length !== 1 ? 'e' : ''} gefunden
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Keine Produkte gefunden
          </h2>
          <p className="text-gray-500 mb-6">
            Versuchen Sie einen anderen Suchbegriff oder stöbern Sie in unseren Kategorien.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/sortiment"
              className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Alle Kategorien
            </Link>
            <Link
              href="/shop"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Alle Produkte
            </Link>
          </div>
        </div>
      )}
    </Container>
  );
};

export default SearchResults;