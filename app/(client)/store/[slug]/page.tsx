// app/(client)/store/[slug]/page.tsx
import StorePage from "@/components/store/StorePage";
import { client } from "@/sanity/lib/client";
import { GET_STORE_BY_SLUG } from "@/sanity/queries/storeQueries";
import { notFound } from "next/navigation";

interface StorePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StoreDetailPage({ params }: StorePageProps) {
  const resolvedParams = await params;
  const store = await client.fetch(GET_STORE_BY_SLUG, { slug: resolvedParams.slug });

  if (!store) {
    notFound();
  }

  return <StorePage store={store} />;
}

// Generate static paths for all stores
export async function generateStaticParams() {
  const stores = await client.fetch(`*[_type == 'store']{ "slug": slug.current }`);
  return stores.map((store: any) => ({
    slug: store.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: StorePageProps) {
  const resolvedParams = await params;
  const store = await client.fetch(GET_STORE_BY_SLUG, { slug: resolvedParams.slug });

  if (!store) {
    return {
      title: "Store nicht gefunden",
    };
  }

  return {
    title: store.seo?.title || `${store.name} - Ihr Baumarkt`,
    description: store.seo?.description || store.description || `${store.name} in ${store.city}`,
    keywords: store.seo?.keywords || `${store.name}, Baumarkt, ${store.city}, Bauen, Renovieren`,
  };
}