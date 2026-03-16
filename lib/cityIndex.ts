export interface CityMeta {
  name: string;
  slug: string;
  count: number;
}

// Static city index — add new cities here as their JSON files are created.
// count = number of foodSpots in that city's JSON file.
export const cityIndex: CityMeta[] = [
  { name: "Amritsar", slug: "amritsar", count: 15 },
  { name: "Delhi",    slug: "delhi",    count: 17 },
  { name: "Jaipur",   slug: "jaipur",   count: 10 },
  { name: "Varanasi", slug: "varanasi", count: 19 },
];
