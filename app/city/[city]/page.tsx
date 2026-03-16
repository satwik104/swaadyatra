import { notFound } from "next/navigation";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoodSpotCard, { FoodSpot } from "@/components/city/FoodSpotCard";
import FloatingReviews from "@/components/city/FloatingReviews";
import { cityPageSchema } from "@/lib/jsonld";
import { cityIndex } from "@/lib/cityIndex";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cl = (id: string) => `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_600/${id}`;

interface CityHero {
  tagline: string;
  highlights: string[];
}

interface CityData {
  city: string;
  hero?: CityHero;
  foodSpots: FoodSpot[];
}

function getCityData(citySlug: string): CityData | null {
  try {
    const filePath = path.join(process.cwd(), "public", "city_pages_json", `${citySlug}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as CityData;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  const dir = path.join(process.cwd(), "public", "city_pages_json");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ city: f.replace(".json", "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const data = getCityData(citySlug);
  if (!data) return { title: "City Not Found" };

  const { city } = data;
  const ogImage = `https://res.cloudinary.com/dinzfa92w/image/upload/f_auto,q_auto,w_1200/${data.foodSpots[0]?.images[0]}`;
  return {
    title: `Best Food in ${city} | Famous Street Food & Restaurants Near Tourist Places – SwaadYatra`,
    description: `Discover the best food spots in ${city}. Explore famous street food, iconic restaurants, and must-try dishes near top tourist places in ${city}. Your complete ${city} food guide by SwaadYatra.`,
    keywords: `best food in ${city}, famous food spots ${city}, street food near tourist places ${city}, ${city} restaurants, ${city} food guide`,
    alternates: {
      canonical: `https://www.swaadyatra.com/city/${citySlug}`,
    },
    openGraph: {
      title: `Best Food in ${city} | Famous Street Food & Restaurants – SwaadYatra`,
      description: `Explore famous street food, iconic restaurants, and must-try dishes near top tourist places in ${city}.`,
      url: `https://www.swaadyatra.com/city/${citySlug}`,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Best food spots in ${city} – SwaadYatra`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Best Food in ${city} | Famous Street Food – SwaadYatra`,
      description: `Explore famous street food and must-try dishes near top tourist places in ${city}.`,
      images: [ogImage],
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const data = getCityData(citySlug);
  if (!data) notFound();

  const { city, hero, foodSpots } = data;

  // Other cities for the suggestions section — exclude current city
  const otherCities = cityIndex.filter((c) => c.slug !== citySlug);
  // Read first image of each other city at build time
  const suggestions = otherCities.map((c) => {
    const d = getCityData(c.slug);
    return { ...c, firstImage: d?.foodSpots[0]?.images[0] ?? null };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityPageSchema(city, citySlug, foodSpots)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.swaadyatra.com" },
              { "@type": "ListItem", position: 2, name: "Cities", item: "https://www.swaadyatra.com" },
              { "@type": "ListItem", position: 3, name: city, item: `https://www.swaadyatra.com/city/${citySlug}` },
            ],
          }),
        }}
      />
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
          <div className="container mx-auto max-w-5xl px-4 py-2.5">
            <ol className="flex items-center gap-1.5 text-sm text-gray-500">
              <li><a href="/" className="hover:text-[#E23744] transition-colors">Home</a></li>
              <li className="select-none">›</li>
              <li><span className="hover:text-[#E23744] transition-colors">Cities</span></li>
              <li className="select-none">›</li>
              <li className="text-[#E23744] font-medium" aria-current="page">{city}</li>
            </ol>
          </div>
        </nav>

        {/* Hero heading section */}
        <header className="bg-gradient-to-br from-[#E23744] to-[#c72d38] text-white py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Best Food in {city}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-4">
              {hero?.tagline ?? `Discover the most famous food spots, iconic street food, and must-try dishes near top tourist places in ${city}.`}
            </p>
            {hero?.highlights && (
              <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 mt-2">
                {hero.highlights.map((h) => (
                  <li key={h} className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium">
                    <span className="text-[#FFC107]">✦</span> {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        {/* Food spots */}
        <section
          aria-label={`Food spots in ${city}`}
          className="container mx-auto max-w-5xl px-4 py-10 md:py-14 flex flex-col gap-8"
        >
          {foodSpots.map((spot, i) => (
            <FoodSpotCard key={spot.shopName} spot={spot} index={i} />
          ))}
        </section>

        <FloatingReviews />

        {/* Explore other cities */}
        {suggestions.length > 0 && (
          <section className="bg-orange-50 border-t border-orange-100 py-10 md:py-14 px-4">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Explore More Food Cities</h2>
              <p className="text-gray-500 text-base mb-6">Discover iconic street food in other Indian cities</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {suggestions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/city/${s.slug}`}
                    className="group flex items-center gap-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-4 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      {s.firstImage && (
                        <Image
                          src={cl(s.firstImage)}
                          alt={`Food in ${s.name}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 group-hover:text-[#E23744] transition-colors truncate">{s.name}</p>
                      <p className="text-sm text-gray-500">{s.count} food spots</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-[#E23744] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
