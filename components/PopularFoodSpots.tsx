"use client";

import Link from "next/link";
import Image from "next/image";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cl = (id: string) => `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_800/${id}`;

const completedCities: Record<string, string> = {
  Amritsar: "/city/amritsar",
  Delhi: "/city/delhi",
  Jaipur: "/city/jaipur",
  Varanasi: "/city/varanasi",
};

const foodSpots = [
  { name: "Banarasi Kachori",      city: "Varanasi",  shop: "Kashi Chat Bhandar",   image: cl("amrit_sunny_1_sol0vt") },
  { name: "Agra Petha",            city: "Agra",      shop: "Panchhi Petha Store",  image: cl("amrit_trad_1_ebzmdy") },
  { name: "Amritsari Kulcha",      city: "Amritsar",  shop: "Chungi Kulcha Wala",   image: cl("amrit_chungi_1_rxkj7x") },
  { name: "Hyderabadi Biryani",    city: "Hyderabad", shop: "Paradise Biryani",     image: cl("amrit_kesar_1_gesei5") },
  { name: "Mumbai Vada Pav",       city: "Mumbai",    shop: "Ashok Vada Pav",       image: cl("amrit_jaan_1_ovmorm") },
  { name: "Lucknow Tunday Kabab",  city: "Lucknow",   shop: "Tunday Kababi",        image: cl("amrit_gurdas_1_bb11ui") },
  { name: "Delhi Chole Bhature",   city: "Delhi",     shop: "SitaRam Diwan Chand",  image: cl("delhi_sitaram_1_gpvt99") },
  { name: "Kolkata Kathi Roll",    city: "Kolkata",   shop: "Nizam's Restaurant",   image: cl("delhi_concept_1_cfs0jp") },
  { name: "Jaipur Dal Baati Churma", city: "Jaipur",  shop: "Natraj Restaurant",    image: cl("JAI_natraj_1_jiwlts") },
];

export default function PopularFoodSpots() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Popular Food Spots
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            Discover iconic dishes from India&apos;s most famous food destinations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {foodSpots.map((food, index) => {
            const href = completedCities[food.city];
            const card = (
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative h-[260px] sm:h-[300px] md:h-[280px] lg:h-[320px] overflow-hidden">
                  <Image
                    src={food.image}
                    alt={`${food.name} at ${food.shop}, ${food.city}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Always-visible gradient so text is readable on all devices */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 right-4 bg-[#FFC107] text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {food.city}
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{food.name}</h3>
                    <div className="flex items-center gap-2 text-white">
                      <svg className="w-5 h-5 text-[#FFC107] shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm md:text-base font-semibold">{food.shop}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
            return (
              <div key={index} className="group cursor-pointer">
                {href ? <Link href={href}>{card}</Link> : card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
