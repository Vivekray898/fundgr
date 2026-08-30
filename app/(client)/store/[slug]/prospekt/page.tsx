// app/(client)/store/[slug]/prospekt/page.tsx
import PDFFlipbook from "@/components/store/PDFFlipbook";
import { client } from "@/sanity/lib/client";
import { GET_STORE_PROSPECT } from "@/sanity/queries/storeQueries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProspektPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProspektPage({ params }: ProspektPageProps) {
  const resolvedParams = await params;
  
  // Use the dedicated prospect query
  const store = await client.fetch(GET_STORE_PROSPECT, { 
    slug: resolvedParams.slug 
  });

  if (!store) {
    notFound();
  }

  const { prospect } = store;

  // Debug: Log the prospect data (server-side)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Store prospect data:', JSON.stringify(prospect, null, 2));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          href={`/store/${store.slug.current}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-rose-500 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zu {store.name}
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {store.name} - Prospekt
        </h1>
        {prospect?.title && (
          <p className="text-gray-600 mb-4">{prospect.title}</p>
        )}
        
        <PDFFlipbook
          prospect={prospect}
          storeName={store.name}
          height="calc(100vh - 200px)"
        />
      </div>
    </div>
  );
}

// Generate static paths
export async function generateStaticParams() {
  const stores = await client.fetch(
    `*[_type == 'store' && defined(prospect.pdf)]{ "slug": slug.current }`
  );
  return stores.map((store: any) => ({
    slug: store.slug,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: ProspektPageProps) {
  const resolvedParams = await params;
  const store = await client.fetch(GET_STORE_PROSPECT, { 
    slug: resolvedParams.slug 
  });

  if (!store) {
    return {
      title: "Prospekt nicht gefunden",
    };
  }

  return {
    title: `${store.name} - Prospekt | FundGrube BestPreis`,
    description: `Aktueller Prospekt von ${store.name} mit allen Angeboten und Aktionen.`,
  };
}