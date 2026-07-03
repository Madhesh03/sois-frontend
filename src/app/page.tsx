import { HomePage } from "@/components/home/HomePage";
import { getOrganizationSchema, getProductListSchema, getWebSiteSchema } from "@/lib/seo";

export default function Page() {
  const structuredData = [getOrganizationSchema(), getWebSiteSchema(), getProductListSchema()];

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
