import { HomePage } from "@/components/home/HomePage";
import { getOrganizationSchema, getProductListSchema, getWebSiteSchema } from "@/lib/seo";
import { getTopProducts } from "@/lib/catalog";

export default async function Page() {
  const topProducts = await getTopProducts(8);
  const structuredData = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getProductListSchema(topProducts),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage />
    </>
  );
}
