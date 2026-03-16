"use client";

import Link from "next/link";

const stories = [
    {
      name: "Priya Sharma",
      location: "Varanasi",
      food: "Banarasi Kachori",
      quote: "The crispy kachoris at the ghats made my morning unforgettable!",
    },
    {
      name: "Rahul Verma",
      location: "Amritsar",
      food: "Amritsari Kulcha",
      quote: "After Golden Temple, the kulcha at local dhaba was pure heaven!",
    },
    {
      name: "Ananya Patel",
      location: "Mumbai",
      food: "Vada Pav",
      quote: "The vada pav near Marine Drive was so good, I had three in one go!",
    },
    {
      name: "Arjun Singh",
      location: "Hyderabad",
      food: "Hyderabadi Biryani",
      quote: "Paradise Biryani was worth every bit of the hype. Absolutely divine!",
    },
    {
      name: "Sneha Reddy",
      location: "Lucknow",
      food: "Tunday Kabab",
      quote: "Melt-in-mouth kababs at Tunday Kababi - a royal feast experience!",
    },
    {
      name: "Vikram Malhotra",
      location: "Jaipur",
      food: "Dal Baati Churma",
      quote: "Exploring Pink City and ending with dal baati churma was magical!",
    },
    {
      name: "Meera Kapoor",
      location: "Delhi",
      food: "Chole Bhature",
      quote: "The fluffy bhature at Sitaram's is the best breakfast in Delhi!",
    },
    {
      name: "Karan Desai",
      location: "Kolkata",
      food: "Kathi Roll",
      quote: "Nizam's kathi rolls are legendary - perfectly spiced and wrapped!",
    },
];

const loopedStories = [...stories, ...stories];

export default function TravelFoodExperience() {
  return (
    <section className="py-12 md:py-16 bg-[#FFFBF0] overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              Travel + Food Experience
            </h2>
            <p className="text-gray-600 text-base md:text-lg font-medium">
              Real stories from travelers discovering amazing food
            </p>
          </div>

          {/* View All Button - Desktop */}
          <Link href="/happy-stories" className="hidden md:block flex-shrink-0">
            <button className="bg-[#E23744] hover:bg-[#c72d38] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap flex items-center gap-2">
              <span>View All Happy Stories</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Auto-scrolling Marquee Strip */}
      <div className="relative w-full">
        {/* Left fade */}
        <div className="absolute left-0 top-0 h-full w-16 md:w-32 bg-gradient-to-r from-[#FFFBF0] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 h-full w-16 md:w-32 bg-gradient-to-l from-[#FFFBF0] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-5 marquee-track">
          {loopedStories.map((story, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] md:w-[300px] bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
            >
              {/* Visitor Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#E23744] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{story.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-800 truncate">{story.name}</h3>
                  <div className="flex items-center gap-1 text-[#E23744] text-sm font-semibold">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="truncate">{story.location}</span>
                  </div>
                </div>
              </div>

              {/* Food Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FFC107]/20 px-3 py-1.5 rounded-full mb-3">
                <span className="text-sm">🍽️</span>
                <span className="text-xs font-semibold text-gray-800">{story.food}</span>
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-base leading-relaxed">
                &quot;{story.quote}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* View All Button - Mobile */}
      <div className="mt-8 text-center md:hidden px-4">
        <Link href="/happy-stories">
          <button className="bg-[#E23744] hover:bg-[#c72d38] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2">
            <span>View All Happy Stories</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </Link>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 30s linear infinite;
          width: max-content;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
