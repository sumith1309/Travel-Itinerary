// ============================================================
// Curated Unsplash image URLs for Trails and Miles
// All images are high-quality, free-to-use Unsplash photos
// ============================================================

const UNSPLASH_BASE = 'https://images.unsplash.com';

// ── DESTINATION HERO + CARD IMAGES ──────────────────────────

export const DESTINATION_IMAGES: Record<string, { hero: string; card: string; gallery: string[] }> = {
  vietnam: {
    hero: `${UNSPLASH_BASE}/photo-1528360983277-13d401cdc186?w=1920&q=80`,
    card: `${UNSPLASH_BASE}/photo-1528360983277-13d401cdc186?w=800&q=75`,
    gallery: [
      `${UNSPLASH_BASE}/photo-1528360983277-13d401cdc186?w=1200`,
      `${UNSPLASH_BASE}/photo-1509030450996-dd1a26dda07a?w=1200`,
      `${UNSPLASH_BASE}/photo-1583417267826-aebc4d1537e4?w=1200`,
      `${UNSPLASH_BASE}/photo-1559592413-7cec4d0cae2b?w=1200`,
    ],
  },
  thailand: {
    hero: `${UNSPLASH_BASE}/photo-1528181304800-259b08848526?w=1920&q=80`,
    card: `${UNSPLASH_BASE}/photo-1528181304800-259b08848526?w=800&q=75`,
    gallery: [
      `${UNSPLASH_BASE}/photo-1528181304800-259b08848526?w=1200`,
      `${UNSPLASH_BASE}/photo-1508009603885-50cf7c579365?w=1200`,
      `${UNSPLASH_BASE}/photo-1552465011-b4e21bf6e79a?w=1200`,
      `${UNSPLASH_BASE}/photo-1520250497591-112f2f40a3f4?w=1200`,
    ],
  },
  indonesia: {
    hero: `${UNSPLASH_BASE}/photo-1537996194471-e657df975ab4?w=1920&q=80`,
    card: `${UNSPLASH_BASE}/photo-1537996194471-e657df975ab4?w=800&q=75`,
    gallery: [
      `${UNSPLASH_BASE}/photo-1537996194471-e657df975ab4?w=1200`,
      `${UNSPLASH_BASE}/photo-1555899434-94d1368aa7af?w=1200`,
      `${UNSPLASH_BASE}/photo-1518548419970-58e3b4079ab2?w=1200`,
      `${UNSPLASH_BASE}/photo-1573790387438-4da905039392?w=1200`,
    ],
  },
  singapore: {
    hero: `${UNSPLASH_BASE}/photo-1525625293386-3f8f99389edd?w=1920&q=80`,
    card: `${UNSPLASH_BASE}/photo-1525625293386-3f8f99389edd?w=800&q=75`,
    gallery: [
      `${UNSPLASH_BASE}/photo-1525625293386-3f8f99389edd?w=1200`,
      `${UNSPLASH_BASE}/photo-1508964942454-1a56651d54ac?w=1200`,
      `${UNSPLASH_BASE}/photo-1496939376851-89342e90adcd?w=1200`,
      `${UNSPLASH_BASE}/photo-1565967511849-76a60a516170?w=1200`,
    ],
  },
  maldives: {
    hero: `${UNSPLASH_BASE}/photo-1573843981267-be1999ff37cd?w=1920&q=80`,
    card: `${UNSPLASH_BASE}/photo-1573843981267-be1999ff37cd?w=800&q=75`,
    gallery: [
      `${UNSPLASH_BASE}/photo-1573843981267-be1999ff37cd?w=1200`,
      `${UNSPLASH_BASE}/photo-1514282401047-d79a71a590e8?w=1200`,
      `${UNSPLASH_BASE}/photo-1544550581-5f7ceaf7f992?w=1200`,
      `${UNSPLASH_BASE}/photo-1590523741831-ab7e8b8f9c7f?w=1200`,
    ],
  },
  india: {
    hero: `${UNSPLASH_BASE}/photo-1524492412937-b28074a5d7da?w=1920&q=80`,
    card: `${UNSPLASH_BASE}/photo-1524492412937-b28074a5d7da?w=800&q=75`,
    gallery: [
      `${UNSPLASH_BASE}/photo-1524492412937-b28074a5d7da?w=1200`,
      `${UNSPLASH_BASE}/photo-1477587458883-47145ed94245?w=1200`,
      `${UNSPLASH_BASE}/photo-1602216056096-3b40cc0c9944?w=1200`,
      `${UNSPLASH_BASE}/photo-1561361513-2d000a50f0dc?w=1200`,
    ],
  },
};

// ── CITY IMAGES ─────────────────────────────────────────────

export const CITY_IMAGES: Record<string, string> = {
  hanoi: `${UNSPLASH_BASE}/photo-1509030450996-dd1a26dda07a?w=800&q=75`,
  'ho-chi-minh-city': `${UNSPLASH_BASE}/photo-1583417267826-aebc4d1537e4?w=800&q=75`,
  'da-nang': `${UNSPLASH_BASE}/photo-1589394815804-964ed0be2eb5?w=800&q=75`,
  'hoi-an': `${UNSPLASH_BASE}/photo-1559592413-7cec4d0cae2b?w=800&q=75`,
  'ha-long-bay': `${UNSPLASH_BASE}/photo-1573615565957-3e2f9e9e68cf?w=800&q=75`,
  bangkok: `${UNSPLASH_BASE}/photo-1508009603885-50cf7c579365?w=800&q=75`,
  phuket: `${UNSPLASH_BASE}/photo-1589394815804-964ed0be2eb5?w=800&q=75`,
  bali: `${UNSPLASH_BASE}/photo-1537996194471-e657df975ab4?w=800&q=75`,
  jakarta: `${UNSPLASH_BASE}/photo-1555899434-94d1368aa7af?w=800&q=75`,
  'singapore-city': `${UNSPLASH_BASE}/photo-1525625293386-3f8f99389edd?w=800&q=75`,
  male: `${UNSPLASH_BASE}/photo-1514282401047-d79a71a590e8?w=800&q=75`,
  // India cities
  'new-delhi': `${UNSPLASH_BASE}/photo-1587474260584-136574528ed5?w=800&q=75`,
  jaipur: `${UNSPLASH_BASE}/photo-1599661046289-e31897846e41?w=800&q=75`,
  agra: `${UNSPLASH_BASE}/photo-1564507592333-c60657eea523?w=800&q=75`,
  varanasi: `${UNSPLASH_BASE}/photo-1477587458883-47145ed94245?w=800&q=75`,
  udaipur: `${UNSPLASH_BASE}/photo-1595658658481-d53d3f999875?w=800&q=75`,
  jodhpur: `${UNSPLASH_BASE}/photo-1570462722484-33e35f18c947?w=800&q=75`,
  rishikesh: `${UNSPLASH_BASE}/photo-1582510003544-4d00b7f74220?w=800&q=75`,
  manali: `${UNSPLASH_BASE}/photo-1626621341517-bbf3d9990a23?w=800&q=75`,
  shimla: `${UNSPLASH_BASE}/photo-1597074866923-dc0589150358?w=800&q=75`,
  'leh-ladakh': `${UNSPLASH_BASE}/photo-1506461883276-594a12b11cf3?w=800&q=75`,
  mumbai: `${UNSPLASH_BASE}/photo-1570168007204-dfb528c6958f?w=800&q=75`,
  goa: `${UNSPLASH_BASE}/photo-1512343879784-a960bf40e7f2?w=800&q=75`,
  kochi: `${UNSPLASH_BASE}/photo-1602158123103-d2c0a42e7b7e?w=800&q=75`,
  munnar: `${UNSPLASH_BASE}/photo-1597074866923-dc0589150358?w=800&q=75`,
  alleppey: `${UNSPLASH_BASE}/photo-1602216056096-3b40cc0c9944?w=800&q=75`,
  bengaluru: `${UNSPLASH_BASE}/photo-1596176530529-78163a4f7af2?w=800&q=75`,
  mysuru: `${UNSPLASH_BASE}/photo-1600100397608-b3e8d1f5dfee?w=800&q=75`,
  hampi: `${UNSPLASH_BASE}/photo-1590050318573-4c8f0d19cd5f?w=800&q=75`,
  chennai: `${UNSPLASH_BASE}/photo-1582510003544-4d00b7f74220?w=800&q=75`,
  pondicherry: `${UNSPLASH_BASE}/photo-1580282240219-045ceed20d73?w=800&q=75`,
  kolkata: `${UNSPLASH_BASE}/photo-1558431382-27e303142255?w=800&q=75`,
  darjeeling: `${UNSPLASH_BASE}/photo-1622308644420-b20142dc993c?w=800&q=75`,
  gangtok: `${UNSPLASH_BASE}/photo-1626621341517-bbf3d9990a23?w=800&q=75`,
  shillong: `${UNSPLASH_BASE}/photo-1588083949404-c4f1ed1323b3?w=800&q=75`,
  ahmedabad: `${UNSPLASH_BASE}/photo-1572459262130-f2dfa4485024?w=800&q=75`,
};

// ── CATEGORY IMAGES (for POI cards) ─────────────────────────

export const CATEGORY_IMAGES: Record<string, string> = {
  CULTURE_HISTORY: `${UNSPLASH_BASE}/photo-1508009603885-50cf7c579365?w=600&q=75`,
  NATURE_LANDSCAPES: `${UNSPLASH_BASE}/photo-1537996194471-e657df975ab4?w=600&q=75`,
  FOOD_MARKETS: `${UNSPLASH_BASE}/photo-1559056199-641a0ac8b55e?w=600&q=75`,
  ADVENTURE_ACTIVITIES: `${UNSPLASH_BASE}/photo-1558383409-6807a60bcf5e?w=600&q=75`,
  LUXURY_STAYS: `${UNSPLASH_BASE}/photo-1573843981267-be1999ff37cd?w=600&q=75`,
  ISLAND_BEACH: `${UNSPLASH_BASE}/photo-1539367628448-4bc5c9d171c8?w=600&q=75`,
};

// ── EXPERIENCE IMAGES ───────────────────────────────────────

export const EXPERIENCE_IMAGES: Record<string, string> = {
  'street-food-adventures': `${UNSPLASH_BASE}/photo-1559056199-641a0ac8b55e?w=800&q=75`,
  'island-hopping': `${UNSPLASH_BASE}/photo-1539367628448-4bc5c9d171c8?w=800&q=75`,
  'temple-heritage-trails': `${UNSPLASH_BASE}/photo-1508009603885-50cf7c579365?w=800&q=75`,
  'luxury-overwater-experience': `${UNSPLASH_BASE}/photo-1573843981267-be1999ff37cd?w=800&q=75`,
  'motorbike-adventure': `${UNSPLASH_BASE}/photo-1558383409-6807a60bcf5e?w=800&q=75`,
  'urban-skyline-nightlife': `${UNSPLASH_BASE}/photo-1525625293386-3f8f99389edd?w=800&q=75`,
  // India experiences
  'rajasthan-heritage-trail': `${UNSPLASH_BASE}/photo-1599661046289-e31897846e41?w=800&q=75`,
  'kerala-backwater-cruise': `${UNSPLASH_BASE}/photo-1602216056096-3b40cc0c9944?w=800&q=75`,
  'goa-beach-hopping': `${UNSPLASH_BASE}/photo-1512343879784-a960bf40e7f2?w=800&q=75`,
  'himalayan-trekking': `${UNSPLASH_BASE}/photo-1506461883276-594a12b11cf3?w=800&q=75`,
  'south-indian-temple-trail': `${UNSPLASH_BASE}/photo-1548013146-72479768bada?w=800&q=75`,
  'indian-street-food-odyssey': `${UNSPLASH_BASE}/photo-1606491956689-2ea866880049?w=800&q=75`,
  'golden-triangle-tour': `${UNSPLASH_BASE}/photo-1524492412937-b28074a5d7da?w=800&q=75`,
  'ladakh-road-trip': `${UNSPLASH_BASE}/photo-1506461883276-594a12b11cf3?w=800&q=75`,
  'kerala-ayurveda-retreat': `${UNSPLASH_BASE}/photo-1602158123103-d2c0a42e7b7e?w=800&q=75`,
  'wildlife-safari-india': `${UNSPLASH_BASE}/photo-1537996194471-e657df975ab4?w=800&q=75`,
  'northeast-explorer': `${UNSPLASH_BASE}/photo-1626621341517-bbf3d9990a23?w=800&q=75`,
  'varanasi-spiritual-journey': `${UNSPLASH_BASE}/photo-1477587458883-47145ed94245?w=800&q=75`,
  'andaman-island-escape': `${UNSPLASH_BASE}/photo-1539367628448-4bc5c9d171c8?w=800&q=75`,
  'darjeeling-tea-trail': `${UNSPLASH_BASE}/photo-1622308644420-b20142dc993c?w=800&q=75`,
  'rajasthan-desert-safari': `${UNSPLASH_BASE}/photo-1493246507139-91e8fad9978e?w=800&q=75`,
};

// ── HERO / HOMEPAGE IMAGES ──────────────────────────────────

export const HERO_IMAGES = {
  homepage: `${UNSPLASH_BASE}/photo-1507525428034-b723cf961d3e?w=1920&q=85`,
  destinations: `${UNSPLASH_BASE}/photo-1528181304800-259b08848526?w=1920&q=80`,
  visa: `${UNSPLASH_BASE}/photo-1436491865332-7a61a109db05?w=1920&q=80`,
  blog: `${UNSPLASH_BASE}/photo-1501785888041-af3ef285b470?w=1920&q=80`,
  experiences: `${UNSPLASH_BASE}/photo-1539367628448-4bc5c9d171c8?w=1920&q=80`,
  weekendGetaways: `${UNSPLASH_BASE}/photo-1506461883276-594a12b11cf3?w=1920&q=80`,
};

// ── HELPER FUNCTIONS ────────────────────────────────────────

export function getDestinationImage(slug: string, type: 'hero' | 'card' = 'card'): string {
  const images = DESTINATION_IMAGES[slug];
  if (!images) return DESTINATION_IMAGES.vietnam[type];
  return images[type];
}

export function getCityImage(slug: string): string {
  return CITY_IMAGES[slug] ?? CITY_IMAGES.hanoi;
}

export function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.CULTURE_HISTORY;
}

export function getExperienceImage(slug: string): string {
  return EXPERIENCE_IMAGES[slug] ?? EXPERIENCE_IMAGES['street-food-adventures'];
}

/**
 * Resolve image: use DB image if it's a full URL, otherwise fall back to Unsplash
 */
export function resolveImage(dbImage: string | null | undefined, fallback: string): string {
  if (!dbImage) return fallback;
  if (dbImage.startsWith('http')) return dbImage;
  return fallback;
}
