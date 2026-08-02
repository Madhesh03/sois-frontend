import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import {
  getOrganizationSchema,
  getProductListSchema,
  getWebSiteSchema,
} from "@/lib/seo";

/**
 * The full storefront homepage, parked here while "/" shows the coming-soon
 * page. Kept out of the index so the pre-launch site has exactly one public
 * front door. At launch, move this back into src/app/page.tsx.
 */
export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  const structuredData = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getProductListSchema(),
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
