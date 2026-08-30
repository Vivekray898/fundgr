// app/(client)/stores/page.tsx
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, Store, FileText, ChevronRight, Navigation } from "lucide-react";

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
      openingHours,
      "hasActiveProspect": defined(prospect.pdf) && prospect.isActive != false,
      "prospectPreview": prospect.previewImage.asset->url,
      coordinates
    }
  `);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Unsere Märkte</h1>
              <p className="text-sm text-gray-500 mt-0.5">{stores.length} Märkte in Ihrer Nähe</p>
            </div>
            <button className="p-2.5 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors">
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-4 md:mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Markt suchen..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Store Cards - Grid/List View */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {stores.map((store: any) => (
            <Link
              key={store._id}
              href={`/store/${store.slug.current}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] md:active:scale-[0.99] transition-transform hover:shadow-md"
            >
              <div className="flex md:flex-col">
                {/* Store Image */}
                <div className="relative w-28 h-28 md:w-full md:h-48 flex-shrink-0 bg-gray-100">
                  {store.image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={store.image}
                        alt={store.name}
                        fill
                        className="object-contain md:object-contain"
                        sizes="(max-width: 768px) 112px, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
                      <Store className="w-10 h-10 md:w-16 md:h-16 text-rose-300" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {store.hasActiveProspect && (
                      <span className="bg-rose-500 text-white text-[8px] md:text-[10px] font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex items-center gap-0.5 md:gap-1 shadow-lg">
                        <FileText className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        Prospekt
                      </span>
                    )}
                  </div>
                </div>

                {/* Store Info */}
                <div className="flex-1 p-3 md:p-4 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                        {store.name}
                      </h2>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-300 flex-shrink-0 mt-1" />
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 flex-shrink-0" />
                    <p className="text-[11px] md:text-sm text-gray-600 truncate">
                      {store.address}, {store.zip} {store.city}
                    </p>
                  </div>

                  {/* Phone & Hours */}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
                      <span className="text-[10px] md:text-xs text-gray-500">{store.phone}</span>
                    </div>
                    {store.openingHours && store.openingHours.length > 0 && store.openingHours[0].hours && (
                      <>
                        <span className="w-px h-3 bg-gray-200" />
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
                          <span className="text-[10px] md:text-xs text-gray-500 truncate max-w-[100px] md:max-w-[150px]">
                            {store.openingHours[0].hours}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {stores.length === 0 && (
          <div className="text-center py-16">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Keine Märkte gefunden</h3>
            <p className="text-sm text-gray-400 mt-1">Bitte versuchen Sie es später erneut.</p>
          </div>
        )}
      </div>
    </div>
  );
}