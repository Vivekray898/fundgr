// app/(client)/aktionen-angebote/page.tsx
import DealsPage from "@/components/DealsPage";
import { client } from "@/sanity/lib/client";

export const revalidate = 60;

// Fetch products by brand and status
async function getProductsByBrandAndStatus(brandName: string, status?: string) {
  const statusFilter = status ? `&& status == "${status}"` : '';
  const query = `*[_type == "product" && stock > 0 && brand->name == "${brandName}" ${statusFilter}] | order(_createdAt desc) {
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
  return await client.fetch(query);
}

async function getBrandData(brandName: string) {
  const query = `*[_type == "brand" && name == "${brandName}"][0] {
    _id,
    name,
    slug,
    logo,
    description
  }`;
  return await client.fetch(query);
}

const AngebotePage = async () => {
  // Fetch Fundgrube products
  const [fundgrubeNew, fundgrubeSale, fundgrubeAll, fundgrubeBrand] = await Promise.all([
    getProductsByBrandAndStatus("Fundgrube", "new"),
    getProductsByBrandAndStatus("Fundgrube", "sale"),
    getProductsByBrandAndStatus("Fundgrube"),
    getBrandData("Fundgrube"),
  ]);

  // Fetch Bestpreis products
  const [bestpreisNew, bestpreisSale, bestpreisAll, bestpreisBrand] = await Promise.all([
    getProductsByBrandAndStatus("Bestpreis", "new"),
    getProductsByBrandAndStatus("Bestpreis", "sale"),
    getProductsByBrandAndStatus("Bestpreis"),
    getBrandData("Bestpreis"),
  ]);

  return (
    <DealsPage 
      fundgrube={{
        brand: fundgrubeBrand,
        new: fundgrubeNew,
        sale: fundgrubeSale,
        all: fundgrubeAll,
      }}
      bestpreis={{
        brand: bestpreisBrand,
        new: bestpreisNew,
        sale: bestpreisSale,
        all: bestpreisAll,
      }}
    />
  );
};

export default AngebotePage;