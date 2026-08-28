// components/WishListProducts.tsx
"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart, X, Eye } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";
import CatalogueButton from "./CatalogueButton";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  const { enabled, pricePlaceholder } = useCatalogueMode();
  
  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  const handleResetWishlist = () => {
    const confirmReset = window.confirm(
      "Möchten Sie Ihre Wunschliste wirklich zurücksetzen?"
    );
    if (confirmReset) {
      resetFavorite();
      toast.success("Wunschliste erfolgreich zurückgesetzt");
    }
  };

  // Helper function to get category names from product categories
  const getCategoryNames = (categories: any[] | undefined) => {
    if (!categories || categories.length === 0) return null;
    
    return categories.map((cat) => {
      // If category is a string, return it directly
      if (typeof cat === 'string') return cat;
      // If category is an object with a title property
      if (typeof cat === 'object' && cat !== null) {
        return cat.title || cat.name || null;
      }
      return null;
    }).filter(Boolean).join(", ");
  };

  // Get category display name from variant
  const getCategoryDisplay = (variant: string | undefined) => {
    const categoryMap: Record<string, string> = {
      "handy-zubehoer": "Handy-Zubehör",
      "elektronikartikel": "Elektronikartikel",
      "batterien": "Batterien",
      "plastikartikel": "Plastikartikel",
      "malerzubehoer": "Malerzubehör",
      "farben": "Farben",
      "schrauben-befestigung": "Schrauben & Befestigung",
      "werkzeuge": "Werkzeuge",
      "fahrradzubehoer": "Fahrradzubehör",
      "autozubehoer": "Autozubehör",
      "saisonale-artikel": "Saisonale Artikel",
      "reisebedarf": "Reisebedarf",
      "lebensmittel-getraenke": "Lebensmittel & Getränke",
      "spielzeug": "Spielzeug",
      "schreibwaren-geschenke": "Schreibwaren & Geschenke",
      "wohnen-haushalt": "Wohnen & Haushalt",
      "mode-accessoires": "Mode & Accessoires",
      "gesundheit-drogerie": "Gesundheit & Drogerie",
      "elektronik": "Elektronik",
      "baumarkt-werkzeuge": "Baumarkt & Werkzeuge",
      "automotive": "Automotive",
      "ziersteine": "Ziersteine",
      "rindenmulch": "Rindenmulch",
      "gartenwerkzeuge": "Gartenwerkzeuge",
      "blumentoepfe": "Blumentöpfe",
    };
    return variant ? categoryMap[variant] || variant : "Standard";
  };

  return (
    <Container>
      {favoriteProduct?.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="bg-gradient-to-r from-rose-50/50 to-pink-50/50">
                  <th className="p-2 text-left">Bild</th>
                  <th className="p-2 text-left hidden md:table-cell">
                    Kategorie
                  </th>
                  <th className="p-2 text-left hidden md:table-cell">Typ</th>
                  <th className="p-2 text-left hidden md:table-cell">Status</th>
                  <th className="p-2 text-left">{enabled ? "Verfügbarkeit" : "Preis"}</th>
                  <th className="p-2 text-center md:text-left">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct
                  ?.slice(0, visibleProducts)
                  ?.map((product: Product) => {
                    const categoryNames = getCategoryNames(product?.categories);
                    
                    return (
                    <tr key={product?._id} className="border-b hover:bg-rose-50/30 transition-colors">
                      <td className="px-2 py-4 flex items-center gap-2 min-w-[200px]">
                        <button
                          onClick={() => {
                            removeFromFavorite(product?._id);
                            toast.success("Produkt aus Wunschliste entfernt");
                          }}
                          className="hover:text-red-600 hover:cursor-pointer hoverEffect p-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <X size={18} />
                        </button>
                        {product?.images && (
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="border border-rose-100 rounded-md group overflow-hidden flex-shrink-0"
                          >
                            <Image
                              src={urlFor(product?.images[0]).url()}
                              alt={"product image"}
                              width={80}
                              height={80}
                              className="rounded-md group-hover:scale-105 hoverEffect h-16 w-16 sm:h-20 sm:w-20 object-contain bg-gradient-to-br from-rose-50/30 to-pink-50/30"
                            />
                          </Link>
                        )}
                        <p className="line-clamp-2 text-sm font-medium text-gray-800 flex-1">
                          {product?.name}
                        </p>
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {categoryNames ? (
                          <span className="inline-flex px-2 py-1 bg-rose-50 text-rose-600 text-xs font-medium rounded-full">
                            {categoryNames}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        <span className="text-sm text-gray-600">
                          {getCategoryDisplay(product?.variant)}
                        </span>
                      </td>
                      <td
                        className={`p-2 w-24 hidden md:table-cell ${
                          (product?.stock as number) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-medium text-sm`}
                      >
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                          (product?.stock as number) > 0
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {(product?.stock as number) > 0
                            ? "Auf Lager"
                            : "Nicht verfügbar"}
                        </span>
                      </td>
                      <td className="p-2">
                        {!enabled ? (
                          <PriceFormatter amount={product?.price} className="font-semibold text-rose-500" />
                        ) : (
                          <span className="text-sm text-gray-500 font-medium">
                            {pricePlaceholder}
                          </span>
                        )}
                      </td>
                      <td className="p-2 min-w-[120px]">
                        {!enabled ? (
                          <AddToCartButton product={product} className="w-full sm:w-auto" />
                        ) : (
                          <CatalogueButton 
                            productSlug={product?.slug?.current || ""} 
                            variant="card"
                            className="w-full sm:w-auto text-xs"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {visibleProducts < favoriteProduct?.length && (
              <Button 
                onClick={loadMore}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
              >
                Mehr laden
              </Button>
            )}
            {visibleProducts > 10 && (
              <Button
                onClick={() => setVisibleProducts(10)}
                variant="outline"
                className="border-rose-200 hover:bg-rose-50"
              >
                Weniger anzeigen
              </Button>
            )}
            <Button
              onClick={handleResetWishlist}
              className="ml-auto bg-red-500 hover:bg-red-600 text-white"
            >
              Wunschliste zurücksetzen
            </Button>
          </div>
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-rose-400/20" />
            <Heart
              className="h-12 w-12 text-rose-300"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-800">
              Ihre Wunschliste ist leer
            </h2>
            <p className="text-sm text-gray-500">
              Fügen Sie Ihre Lieblingsprodukte zur Wunschliste hinzu
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600">
            <Link href="/shop">Weiter einkaufen</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;