import { products, siteConfig } from "./data";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: [
      "https://instagram.com/sois",
      "https://pinterest.com/sois",
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getProductListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Products",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.subtitle,
        image: product.img,
        offers: {
          "@type": "Offer",
          price: product.price.replace(/[^\d]/g, ""),
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}
