"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cl = (id: string) => `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_500/${id}`;

const cities = [
  {
    name: "Delhi",
    images: [
      { src: cl("delhi_sitaram_1_gpvt99"), alt: "Chole Bhature – famous street food of Delhi" },
      { src: cl("delhi_sitaram_2_c4bsbq"), alt: "Street food stall in Delhi" },
      { src: cl("delhi_concept_1_cfs0jp"), alt: "Popular food spot in Delhi" },
      { src: cl("hero_sec_nltkkk"),         alt: "Iconic food of Delhi" },
    ],
  },
  {
    name: "Mumbai",
    images: [
      { src: cl("amrit_jaan_1_ovmorm"),    alt: "Street food in Mumbai" },
      { src: cl("amrit_sunny_1_sol0vt"),   alt: "Popular dish in Mumbai" },
      { src: cl("tamatar_chat_ighe98"),     alt: "Chaat – famous Mumbai street food" },
      { src: cl("amrit_trad_1_ebzmdy"),    alt: "Traditional food of Mumbai" },
    ],
  },
  {
    name: "Varanasi",
    images: [
      { src: cl("Varansi_malaiyo_rybsus"), alt: "Malaiyo – famous winter sweet of Varanasi" },
      { src: cl("amrit_sunny_1_sol0vt"),   alt: "Street food near Dashashwamedh Ghat, Varanasi" },
      { src: cl("tamatar_chat_ighe98"),     alt: "Tamatar chaat – iconic Varanasi street food" },
      { src: cl("raj_kachori_tvfckb"),      alt: "Kachori – popular snack in Varanasi" },
    ],
  },
  {
    name: "Jaipur",
    images: [
      { src: cl("JAI_natraj_1_jiwlts"),    alt: "Dal Baati Churma at Natraj Restaurant, Jaipur" },
      { src: cl("JAI_natraj_2_dbca5l"),    alt: "Rajasthani thali in Jaipur" },
      { src: cl("jai_LMB_1_nux86g"),       alt: "Famous food at LMB Restaurant, Jaipur" },
      { src: cl("jaipur_kachori_qjnzq2"),  alt: "Kachori – popular street food of Jaipur" },
    ],
  },
  {
    name: "Agra",
    images: [
      { src: cl("amrit_trad_1_ebzmdy"),    alt: "Traditional food of Agra" },
      { src: cl("raj_kachori_tvfckb"),      alt: "Street food near Taj Mahal, Agra" },
      { src: cl("tamatar_chat_ighe98"),     alt: "Chaat – popular street food in Agra" },
      { src: cl("amrit_sunny_1_sol0vt"),   alt: "Famous food spot in Agra" },
    ],
  },
  {
    name: "Lucknow",
    images: [
      { src: cl("amrit_gurdas_1_bb11ui"),  alt: "Kebab – famous street food of Lucknow" },
      { src: cl("amrit_gurdas_2_jyxj1n"),  alt: "Traditional Awadhi food in Lucknow" },
      { src: cl("amrit_jaan_1_ovmorm"),    alt: "Popular food spot in Lucknow" },
      { src: cl("amrit_trad_1_ebzmdy"),    alt: "Authentic cuisine of Lucknow" },
    ],
  },
  {
    name: "Amritsar",
    images: [
      { src: cl("amrit_chungi_1_rxkj7x"),  alt: "Amritsari Kulcha at Chungi Kulcha Wala" },
      { src: cl("amrit_chungi_2_vziuma"),  alt: "Kulcha being prepared in Amritsar" },
      { src: cl("amrit_kesar_1_gesei5"),   alt: "Kesar Lassi – famous drink of Amritsar" },
      { src: cl("amrit_kesar_2_gc305z"),   alt: "Street food near Golden Temple, Amritsar" },
    ],
  },
  {
    name: "Hyderabad",
    images: [
      { src: cl("amrit_kesar_1_gesei5"),   alt: "Famous food of Hyderabad" },
      { src: cl("amrit_sunny_1_sol0vt"),   alt: "Street food near Charminar, Hyderabad" },
      { src: cl("amrit_jaan_1_ovmorm"),    alt: "Popular dish in Hyderabad" },
      { src: cl("delhi_concept_1_cfs0jp"), alt: "Iconic food spot in Hyderabad" },
    ],
  },
  {
    name: "Bangalore",
    images: [
      { src: cl("amrit_trad_1_ebzmdy"),    alt: "Traditional food of Bangalore" },
      { src: cl("tamatar_chat_ighe98"),     alt: "Street food in Bangalore" },
      { src: cl("amrit_gurdas_1_bb11ui"),  alt: "Famous food spot in Bangalore" },
      { src: cl("raj_kachori_tvfckb"),      alt: "Popular snack in Bangalore" },
    ],
  },
  {
    name: "Kolkata",
    images: [
      { src: cl("amrit_chungi_1_rxkj7x"),  alt: "Street food in Kolkata" },
      { src: cl("delhi_sitaram_1_gpvt99"), alt: "Famous food spot in Kolkata" },
      { src: cl("amrit_gurdas_2_jyxj1n"),  alt: "Traditional cuisine of Kolkata" },
      { src: cl("jaipur_kachori_qjnzq2"),  alt: "Popular snack in Kolkata" },
    ],
  },
];

const completedCities = ["delhi", "jaipur", "amritsar", "varanasi"];

export default function FeaturedCities() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  // Single tick counter — each card derives its image index via modulo.
  // One state update = one re-render instead of 10.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Featured Cities
          </h2>
          <p className="text-gray-600 text-lg">Explore food destinations across India</p>
        </div>

        <div className="relative group">
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#E23744] hover:text-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
          >
            {cities.map((city, cityIndex) => {
              const currentImageIndex = tick % city.images.length;
              const isCompleted = completedCities.includes(city.name.toLowerCase());
              const cardContent = (
                <div className="relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-[#E23744] to-[#FFC107]">
                  <div className="relative h-full">
                    {city.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          imgIndex === currentImageIndex ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 200px, (max-width: 1024px) 240px, 280px"
                          loading={cityIndex === 0 && imgIndex === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                      <h3 className="text-white text-xl md:text-2xl font-bold mb-2">{city.name}</h3>
                      <div className="flex gap-1.5">
                        {city.images.map((_, imgIndex) => (
                          <div
                            key={imgIndex}
                            className={`h-1.5 rounded-full transition-all ${
                              imgIndex === currentImageIndex ? "bg-[#FFC107] w-6" : "bg-white/50 w-1.5"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
              return (
                <div
                  key={cityIndex}
                  className="flex-shrink-0 w-[75vw] max-w-[260px] md:w-[240px] lg:w-[280px] cursor-pointer transform transition-transform duration-300 hover:scale-105"
                >
                  {isCompleted ? (
                    <Link href={`/city/${city.name.toLowerCase()}`}>{cardContent}</Link>
                  ) : (
                    cardContent
                  )}
                </div>
              );
            })}
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#E23744] hover:text-white rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-4 md:hidden">
          Swipe to explore more cities →
        </p>
      </div>

      </section>
  );
}
