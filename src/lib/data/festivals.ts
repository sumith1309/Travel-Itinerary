// ============================================================
// India Festival Calendar
// Festivals with travel impact for Indian destinations
// ============================================================

export interface IndianFestival {
  name: string;
  month: number; // 1-12
  dateRange: string; // approximate, varies by lunar calendar
  region: string[]; // ['all'] or specific regions
  description: string;
  travelImpact: 'positive' | 'crowded' | 'neutral';
  travelTip: string;
  bestDestinations: string[]; // city slugs
}

export const INDIA_FESTIVALS: IndianFestival[] = [
  {
    name: 'Republic Day',
    month: 1,
    dateRange: 'Jan 26',
    region: ['all'],
    description: 'Grand military parade at Kartavya Path, New Delhi',
    travelImpact: 'crowded',
    travelTip: 'Book Delhi hotels 2 months in advance. Parade tickets via Ministry of Defence website.',
    bestDestinations: ['new-delhi'],
  },
  {
    name: 'Pongal / Makar Sankranti',
    month: 1,
    dateRange: 'Jan 14-17',
    region: ['south-india', 'west-india'],
    description: 'Harvest festival — kolam art, bull races in Tamil Nadu, kite festivals in Gujarat',
    travelImpact: 'positive',
    travelTip: 'Ahmedabad hosts the International Kite Festival. Chennai and surrounding areas celebrate with traditional Pongal pots.',
    bestDestinations: ['chennai', 'ahmedabad'],
  },
  {
    name: 'Holi',
    month: 3,
    dateRange: 'Mar (varies)',
    region: ['all'],
    description: 'Festival of colours — Mathura and Vrindavan celebrations are legendary',
    travelImpact: 'crowded',
    travelTip: 'Mathura Holi is unique but extremely crowded. Wear white clothes you don\'t mind losing. Varanasi Holi is intense.',
    bestDestinations: ['new-delhi', 'jaipur', 'varanasi'],
  },
  {
    name: 'Baisakhi',
    month: 4,
    dateRange: 'Apr 13-14',
    region: ['north-india'],
    description: 'Punjabi New Year and harvest festival — Bhangra, fairs, and Golden Temple celebrations',
    travelImpact: 'positive',
    travelTip: 'Visit Amritsar\'s Golden Temple for special celebrations. Great time for Punjab road trips.',
    bestDestinations: ['new-delhi'],
  },
  {
    name: 'Rath Yatra',
    month: 7,
    dateRange: 'Jul (varies)',
    region: ['east-northeast-india'],
    description: 'Massive chariot festival in Puri, Odisha — millions of devotees pull giant chariots',
    travelImpact: 'crowded',
    travelTip: 'Puri gets extremely crowded — book accommodation months ahead. A powerful cultural experience.',
    bestDestinations: ['kolkata'],
  },
  {
    name: 'Independence Day',
    month: 8,
    dateRange: 'Aug 15',
    region: ['all'],
    description: 'Flag hoisting at Red Fort by the Prime Minister. National holiday.',
    travelImpact: 'neutral',
    travelTip: 'Many sites have restricted access in Delhi. Great long weekend for short trips from metros.',
    bestDestinations: ['new-delhi'],
  },
  {
    name: 'Onam',
    month: 8,
    dateRange: 'Aug/Sep (varies)',
    region: ['south-india'],
    description: 'Kerala\'s grand harvest festival — snake boat races, Sadya feast, flower carpets',
    travelImpact: 'positive',
    travelTip: 'Attend the Nehru Trophy Boat Race in Alleppey. Enjoy the traditional Onam Sadya (vegetarian feast with 26+ dishes).',
    bestDestinations: ['kochi', 'alleppey'],
  },
  {
    name: 'Ganesh Chaturthi',
    month: 9,
    dateRange: 'Sep (varies)',
    region: ['west-india'],
    description: 'Mumbai\'s biggest festival — massive Ganesh idol processions through the streets',
    travelImpact: 'crowded',
    travelTip: 'Lalbaugcha Raja has 10+ hour queues. Experience the immersion procession on Day 10 at Girgaon Chowpatty.',
    bestDestinations: ['mumbai'],
  },
  {
    name: 'Navratri & Dandiya',
    month: 10,
    dateRange: 'Sep/Oct (varies, 9 nights)',
    region: ['west-india', 'north-india'],
    description: 'Nine nights of Garba dance across Gujarat. Kolkata celebrates as Durga Puja.',
    travelImpact: 'positive',
    travelTip: 'Ahmedabad\'s GMDC Ground hosts massive Garba events. Buy traditional chaniya choli outfits at Law Garden.',
    bestDestinations: ['ahmedabad', 'mumbai'],
  },
  {
    name: 'Durga Puja',
    month: 10,
    dateRange: 'Oct (varies, 5 days)',
    region: ['east-northeast-india'],
    description: 'Kolkata transforms into an open-air art gallery with spectacular pandals',
    travelImpact: 'crowded',
    travelTip: 'Best during Ashtami/Navami nights. Pandal-hopping is the main activity. Book hotels 3 months ahead.',
    bestDestinations: ['kolkata'],
  },
  {
    name: 'Diwali',
    month: 11,
    dateRange: 'Oct/Nov (varies)',
    region: ['all'],
    description: 'Festival of Lights — the entire country illuminates with diyas, rangoli, and fireworks',
    travelImpact: 'crowded',
    travelTip: 'Varanasi\'s Dev Diwali (15 days after Diwali) is more spectacular and less crowded. Jaipur\'s Nahargarh Fort view is magical.',
    bestDestinations: ['varanasi', 'jaipur', 'udaipur', 'new-delhi'],
  },
  {
    name: 'Pushkar Camel Fair',
    month: 11,
    dateRange: 'Nov (varies, 5 days)',
    region: ['north-india'],
    description: 'World\'s largest camel fair in the desert town of Pushkar, Rajasthan',
    travelImpact: 'positive',
    travelTip: 'Pushkar is 2.5 hrs from Jaipur. The desert camp experience is unforgettable. Book tents well in advance.',
    bestDestinations: ['jaipur'],
  },
  {
    name: 'Christmas & New Year',
    month: 12,
    dateRange: 'Dec 24 - Jan 1',
    region: ['all'],
    description: 'Goa and Kerala peak season — beach parties, church services, and festive markets',
    travelImpact: 'crowded',
    travelTip: 'Goa prices triple in late December. Book 3-4 months ahead or go mid-December for better rates.',
    bestDestinations: ['goa', 'kochi', 'munnar', 'pondicherry'],
  },
  {
    name: 'Hornbill Festival',
    month: 12,
    dateRange: 'Dec 1-10',
    region: ['east-northeast-india'],
    description: 'Nagaland\'s Festival of Festivals — tribal culture showcase with dance, music, and food',
    travelImpact: 'positive',
    travelTip: 'Held in Kohima, Nagaland. Need Inner Line Permit — apply online 2 weeks ahead. Combine with Shillong visit.',
    bestDestinations: ['shillong'],
  },
  {
    name: 'Rann Utsav',
    month: 12,
    dateRange: 'Nov-Feb',
    region: ['west-india'],
    description: 'White desert festival at the Rann of Kutch — full moon nights on the salt flats are surreal',
    travelImpact: 'positive',
    travelTip: 'Book tent city accommodation through Gujarat Tourism. Full moon nights are the most magical. Combine with Ahmedabad.',
    bestDestinations: ['ahmedabad'],
  },
];

/** Get festivals happening in a given month */
export function getFestivalsByMonth(month: number): IndianFestival[] {
  return INDIA_FESTIVALS.filter((f) => f.month === month);
}

/** Get festivals relevant to a specific city */
export function getFestivalsForCity(citySlug: string): IndianFestival[] {
  return INDIA_FESTIVALS.filter((f) => f.bestDestinations.includes(citySlug));
}

/** Get upcoming festivals from current month (wraps around year) */
export function getUpcomingFestivals(currentMonth: number, count = 3): IndianFestival[] {
  const sorted = [...INDIA_FESTIVALS].sort((a, b) => {
    const aDistance = (a.month - currentMonth + 12) % 12;
    const bDistance = (b.month - currentMonth + 12) % 12;
    return aDistance - bDistance;
  });
  return sorted.slice(0, count);
}
