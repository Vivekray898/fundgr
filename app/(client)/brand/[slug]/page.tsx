// app/(client)/brand/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BrandPageProps {
  params: {
    slug: string;
  };
}

async function getBrandData(slug: string) {
  const query = `*[_type == "brand" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    logo,
    description,
    website,
    isActive
  }`;
  return await client.fetch(query, { slug });
}

async function getBrandProducts(slug: string) {
  const query = `*[_type == "product" && brand->slug.current == $slug && stock > 0] | order(_createdAt desc) {
    _id,
    name,
    slug,
    "images": images[]{
      asset->{
        _id,
        url
      }
    },
    price,
    discount,
    originalPrice,
    isDeal,
    dealEndDate,
    status,
    stock,
    "categories": categories[]->title,
    "brandName": brand->name,
    "brandSlug": brand->slug.current,
    "brand": brand->title,
    description
  }`;
  return await client.fetch(query, { slug });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandData(slug);
  
  if (!brand || !brand.isActive) {
    notFound();
  }

  const products = await getBrandProducts(slug);
  const brandName = brand.name || "Marke";

  return (
    <Container className="py-8 sm:py-12">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-700 transition-colors mb-6 sm:mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Zurück zur Startseite</span>
      </Link>

      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8 sm:mb-12 p-6 sm:p-8 bg-amber-50/60 rounded-2xl border-2 border-amber-200/50">
        {brand.logo && (
          <div className="w-32 h-32 sm:w-40 sm:h-40 relative flex-shrink-0 bg-white rounded-2xl shadow-md p-4">
            <Image
              src={urlFor(brand.logo).url()}
              alt={brand.name}
              fill
              className="object-contain p-2"
            />
          </div>
        )}
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
            {brand.name}
          </h1>
          {brand.description && (
            <p className="text-base sm:text-lg text-gray-700 mt-2 max-w-2xl">
              {brand.description}
            </p>
          )}
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-amber-700 hover:text-amber-800 font-medium underline transition-colors"
            >
              Besuchen Sie die Website →
            </a>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Alle Produkte von {brandName}
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {products.length} Produkte
        </span>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-gray-100">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Keine Produkte verfügbar
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Derzeit gibt es keine Produkte von {brandName}. 
            Schauen Sie später wieder vorbei!
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-amber-700 hover:text-amber-800 font-medium underline"
          >
            Zurück zur Startseite
          </Link>
        </div>
      )}
    </Container>
  );
}