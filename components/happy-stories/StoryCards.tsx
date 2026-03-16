import Image from "next/image";
import { MapPin, User } from "lucide-react";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cl = (id: string) => `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_1600/${id}`;

const stories = [
  {
    name: "Rahul Sharma",
    city: "Varanasi",
    food: "Banarasi Kachori",
    quote: "Tried Banarasi Kachori near Dashashwamedh Ghat. The food was incredibly authentic and the route guidance made it super easy to find the place.",

    foodImg: cl("amrit_sunny_1_sol0vt"),
    gradient: "from-black/80 via-black/40 to-transparent",
    accent: "#E23744",
    align: "items-end",
    textSide: "text-left",
  },
  {
    name: "Ananya Mehta",
    city: "Amritsar",
    food: "Amritsari Kulcha",
    quote: "Found the best Kulcha near the Golden Temple through this website. It saved us so much time and the experience was truly unforgettable.",

    foodImg: cl("amrit_chungi_1_rxkj7x"),
    gradient: "from-black/80 via-black/40 to-transparent",
    accent: "#E23744",
    align: "items-start",
    textSide: "text-right",
  },
  {
    name: "Priya Nair",
    city: "Hyderabad",
    food: "Hyderabadi Biryani",
    quote: "SwaadYatra led me to a tiny biryani shop near Charminar that locals swear by. Best biryani I've ever had — no tourist trap!",

    foodImg: cl("amrit_kesar_2_gc305z"),
    gradient: "from-black/80 via-black/40 to-transparent",
    accent: "#E23744",
    align: "items-end",
    textSide: "text-left",
  },
  {
    name: "Arjun Kapoor",
    city: "Delhi",
    food: "Chole Bhature",
    quote: "Discovered a legendary Chole Bhature stall in Chandni Chowk that's been running for 60 years. The app's directions were spot on.",

    foodImg: cl("delhi_sitaram_1_gpvt99"),
    gradient: "from-black/80 via-black/40 to-transparent",
    accent: "#E23744",
    align: "items-start",
    textSide: "text-right",
  },
  {
    name: "Sneha Joshi",
    city: "Jaipur",
    food: "Dal Baati Churma",
    quote: "Had the most authentic Dal Baati Churma near Hawa Mahal. The food map on SwaadYatra is a game-changer for every food lover.",

    foodImg: cl("JAI_natraj_2_dbca5l"),
    gradient: "from-black/80 via-black/40 to-transparent",
    accent: "#E23744",
    align: "items-end",
    textSide: "text-left",
  },
  {
    name: "Vikram Singh",
    city: "Lucknow",
    food: "Galouti Kebab",
    quote: "The Galouti Kebabs near Bara Imambara were melt-in-your-mouth perfection. I would never have found this place without SwaadYatra.",

    foodImg: cl("amrit_gurdas_1_bb11ui"),
    gradient: "from-black/80 via-black/40 to-transparent",
    accent: "#E23744",
    align: "items-start",
    textSide: "text-right",
  },
];

export default function StoryCards() {
  return (
    <section id="stories">
      {/* Section header */}
      <div className="bg-[#FFF8F0] text-center py-20 px-4">
        <span className="text-[#E23744] font-semibold uppercase tracking-widest text-sm">
          Featured Experiences
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mt-3">
          Stories That Inspire Every Bite
        </h2>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
          Hand-picked journeys from travelers who explored India's food soul.
        </p>
      </div>

      {/* Full-page story panels */}
      {stories.map((s, i) => (
        <div key={s.name} className="relative w-full h-[100dvh] min-h-[600px] flex flex-col justify-end">

          {/* Full-bleed background photo */}
          <Image
            src={s.foodImg}
            alt={s.food}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />

          {/* Gradient overlay — bottom-heavy so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

          {/* Subtle side vignette */}
          <div className={`absolute inset-0 bg-gradient-to-r ${i % 2 === 0 ? "from-black/60 to-transparent" : "from-transparent to-black/60"}`} />

          {/* Story number watermark */}
          <span className="absolute top-10 right-10 text-white/10 font-extrabold text-[120px] md:text-[180px] leading-none select-none pointer-events-none">
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* Floating story panel */}
          <div className={`relative z-10 w-full flex flex-col ${s.align} px-6 md:px-16 lg:px-24 pb-16 md:pb-20`}>
            <div className={`max-w-xl ${s.textSide}`}>

              {/* Food badge */}
              <span
                className="inline-block text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: s.accent }}
              >
                {s.food} · {s.city}
              </span>

              {/* Quote */}
              <p className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-snug mb-8 drop-shadow-lg">
                <span className="opacity-50 text-5xl leading-none font-serif">"</span>
                {s.quote}
                <span className="opacity-50 text-5xl leading-none font-serif">"</span>
              </p>

              {/* Divider */}
              <div
                className={`h-0.5 w-16 rounded-full mb-6 ${s.textSide === "text-right" ? "ml-auto" : ""}`}
                style={{ backgroundColor: s.accent }}
              />

              {/* Author row */}
              <div className={`flex items-center gap-3 ${s.textSide === "text-right" ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: s.accent }}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className={s.textSide}>
                  <p className="text-white font-bold text-base">{s.name}</p>
                  <p className="text-white/60 text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" style={{ color: s.accent }} />
                    {s.city}, India
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Scroll hint — only on first story */}
          {i === 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs animate-bounce">
              <span>scroll</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}

        </div>
      ))}
    </section>
  );
}
