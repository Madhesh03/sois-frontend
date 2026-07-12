import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";

export const metadata: Metadata = {
  title: "About SOIS — Be Yourself. Own Your Shine.",
  description:
    "SOIS was founded by two sisters who believe jewellery should celebrate the person wearing it. Discover our story, our mission, and why we exist.",
};

export default function AboutPage() {
  return (
    <StoreShell>
      <section className="sois-page-hero">
        <nav className="sois-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <span aria-current="page">About Us</span>
        </nav>
        <div className="sois-page-hero-eyebrow">ABOUT SOIS</div>
        <h1 className="sois-page-hero-title">Be Yourself. Own Your Shine.</h1>
        <p className="sois-page-hero-sub">
          Wear Luxury. Create Memories. Tell Your Story.
        </p>
      </section>

      <article className="sois-about">
        <p className="sois-about-lead">
          SOIS was founded by two sisters with a shared dream, who believe that
          jewellery should do more than complete an outfit—it should celebrate
          the person wearing it.
        </p>

        <div className="sois-about-block">
          <p className="sois-about-eyebrow">Why Our Brand Exists</p>
          <h2>To inspire everyone to be themselves and own their shine.</h2>
          <p>
            We believe true luxury comes from confidence, authenticity, and
            embracing your unique story. Every piece of SOIS sterling silver
            jewellery is thoughtfully designed to reflect timeless beauty,
            exceptional craftsmanship, and meaningful moments.
          </p>
          <p>
            Whether it&apos;s a gift to yourself or someone you love, each design
            is created to become part of your life&apos;s journey—a symbol of
            love, strength, milestones, and unforgettable memories.
          </p>
        </div>

        <div className="sois-about-block">
          <h2>More than something you wear.</h2>
          <p>
            We believe jewellery is more than something you wear. It becomes part
            of your story. It reminds you of where you&apos;ve been, celebrates
            where you are today, and inspires where you&apos;re going tomorrow.
          </p>
          <p>
            More than a jewellery brand, SOIS is a community that celebrates
            individuality. We want every person who wears our jewellery to feel
            empowered, beautiful, and confident enough to shine in their own
            unique way. Because the most beautiful thing you can wear is your
            true self.
          </p>
        </div>

        <div className="sois-about-mission">
          <p className="sois-about-eyebrow">Brand Mission</p>
          <h2>
            To create timeless sterling silver jewellery that empowers you to
            shine.
          </h2>
          <p>
            We design jewellery that empowers people to express their
            individuality, celebrate life&apos;s meaningful moments, and wear
            every piece with confidence, authenticity, and pride. Our customers
            aren&apos;t just buying sterling silver—they&apos;re buying into a
            philosophy: Be Yourself. Own Your Shine.
          </p>
        </div>

        <div className="sois-about-block">
          <p>
            SOIS is more than a jewellery brand. It&apos;s a celebration of
            stories, emotions, and the people who wear them. Thank you for
            allowing us to be part of your journey.
          </p>
        </div>

        <div className="sois-about-tagline">
          <div className="sois-about-tagline-rule" />
          <span>Wear Luxury. Create Memories. Tell Your Story.</span>
        </div>
      </article>
    </StoreShell>
  );
}
