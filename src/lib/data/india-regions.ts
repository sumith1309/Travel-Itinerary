// ============================================================
// India Sub-Regional Grouping
// Used to display Indian cities grouped by region on the country page
// ============================================================

export interface IndiaSubRegion {
  name: string;
  slug: string;
  description: string;
  citySlugs: string[];
}

export const INDIA_SUB_REGIONS: IndiaSubRegion[] = [
  {
    name: 'North India',
    slug: 'north-india',
    description: 'Mughal heritage, Himalayan adventures, and spiritual journeys',
    citySlugs: ['new-delhi', 'jaipur', 'agra', 'varanasi', 'udaipur', 'jodhpur', 'rishikesh', 'manali', 'shimla', 'leh-ladakh'],
  },
  {
    name: 'South India',
    slug: 'south-india',
    description: 'Backwaters, temples, tea plantations, and tropical coastlines',
    citySlugs: ['kochi', 'munnar', 'alleppey', 'bengaluru', 'mysuru', 'chennai', 'pondicherry', 'hampi'],
  },
  {
    name: 'West India',
    slug: 'west-india',
    description: 'Beaches, Bollywood, and vibrant street culture',
    citySlugs: ['mumbai', 'goa', 'ahmedabad'],
  },
  {
    name: 'East & Northeast India',
    slug: 'east-northeast-india',
    description: 'Living root bridges, tea gardens, and untouched natural beauty',
    citySlugs: ['kolkata', 'darjeeling', 'gangtok', 'shillong'],
  },
];

/** Get the sub-region a city belongs to */
export function getSubRegionForCity(citySlug: string): IndiaSubRegion | undefined {
  return INDIA_SUB_REGIONS.find((r) => r.citySlugs.includes(citySlug));
}

/** Get all city slugs for a sub-region */
export function getCitySlugsForSubRegion(subRegionSlug: string): string[] {
  return INDIA_SUB_REGIONS.find((r) => r.slug === subRegionSlug)?.citySlugs ?? [];
}
