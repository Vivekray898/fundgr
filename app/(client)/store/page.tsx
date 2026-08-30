// app/(client)/stores/page.tsx
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, Store } from "lucide-react";

export default async function StoresPage() {
  const stores = await client.fetch(`
    *[_type == 'store'] | order(name asc) {
      _id,
      name,
      slug,
      address,
      city,
      zip,
      phone,
      "image": image.asset->url,
      openingHours
    }
  `);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Unsere Märkte</h1>
      <p className="text-gray-600 mb-8">Finden Sie den nächstgelegenen Globus Baumarkt</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store: any) => (
          <Link
            key={store._id}
            href={`/store/${store.slug.current}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
          >
            <div className="relative h-48 bg-gray-100">
              {store.image ? (
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
                  <Store className="w-16 h-16 text-rose-300" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-rose-500 transition-colors">
                {store.name}
              </h2>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {store.address}, {store.zip} {store.city}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {store.phone}
                </p>
                {store.openingHours && store.openingHours.length > 0 && (
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {store.openingHours[0].hours}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}