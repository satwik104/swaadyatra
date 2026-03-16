import { MapPin, IndianRupee, Navigation, Lightbulb, Route } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import ExpandableDescription from "./ExpandableDescription";

export interface FoodSpot {
  shopName: string;
  images: string[];
  dishName: string;
  avgPrice: string;
  touristPlaceNearby: string;
  distanceFromTouristPlace: string;
  description: string;
  tips: string;
  fullAddress: string;
  routeDetails: string;
  mapLink: string;
}

export default function FoodSpotCard({ spot, index }: { spot: FoodSpot; index: number }) {
  const isFirst = index === 0;
  return (
    <article className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image carousel — left on desktop, top on mobile */}
        <div className="md:self-start">
          <ImageCarousel images={spot.images} shopName={spot.shopName} isFirst={isFirst} />
        </div>

        {/* Content — right on desktop, bottom on mobile */}
        <div className="p-5 md:p-6 flex flex-col gap-3">
          {/* Shop name */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            <span className="text-[#E23744]">#{index + 1}</span> {spot.shopName}
          </h3>

          {/* Dish name */}
          <p className="text-sm font-semibold text-[#E23744] uppercase tracking-wide">
            {spot.dishName}
          </p>

          {/* Avg price */}
          <div className="flex items-center gap-1.5 text-gray-700 text-sm">
            <IndianRupee className="w-4 h-4 text-green-600 shrink-0" />
            <span className="font-medium">Avg Price:</span>
            <span className="text-green-700 font-semibold">{spot.avgPrice}</span>
          </div>

          {/* Tourist place nearby + distance */}
          <div className="flex items-start gap-1.5 text-gray-700 text-sm">
            <MapPin className="w-4 h-4 text-[#E23744] shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">Near:</span>{" "}
              <span>{spot.touristPlaceNearby}</span>
              <span className="text-gray-500"> · {spot.distanceFromTouristPlace}</span>
            </div>
          </div>

          {/* Description */}
          <ExpandableDescription text={spot.description} />

          {/* Tips — highlighted traveler tip */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wide block mb-0.5">
                Traveler Tip
              </span>
              <p className="text-amber-800 text-base leading-relaxed">{spot.tips}</p>
            </div>
          </div>

          {/* Full address */}
          <div className="flex items-start gap-1.5 text-gray-600 text-base">
            <Navigation className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
            <span>{spot.fullAddress}</span>
          </div>

          {/* Route details */}
          <div className="flex items-start gap-1.5 text-gray-600 text-base">
            <Route className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
            <span>{spot.routeDetails}</span>
          </div>

          {/* Map button */}
          <a
            href={spot.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center justify-center gap-2 bg-[#E23744] hover:bg-[#c72d38] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors w-full md:w-auto"
          >
            <MapPin className="w-4 h-4" />
            Open on Map
          </a>
        </div>
      </div>
    </article>
  );
}
