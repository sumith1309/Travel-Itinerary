// ============================================================
// Weekend Getaways from Major Indian Metros
// Static data for the weekend getaways feature
// ============================================================

export interface WeekendGetaway {
  to: string;
  toSlug: string; // city slug for linking (empty string if not in DB)
  distanceKm: number;
  travelTime: string;
  transport: 'drive' | 'train' | 'flight' | 'bus';
  bestFor: string[];
  bestSeason: string;
  budgetPerPersonINR: { min: number; max: number };
  highlight: string;
}

export interface MetroGetaways {
  metro: string;
  metroSlug: string;
  getaways: WeekendGetaway[];
}

export const WEEKEND_GETAWAYS: MetroGetaways[] = [
  {
    metro: 'Delhi',
    metroSlug: 'new-delhi',
    getaways: [
      {
        to: 'Rishikesh',
        toSlug: 'rishikesh',
        distanceKm: 240,
        travelTime: '5-6 hrs by road',
        transport: 'drive',
        bestFor: ['adventure', 'yoga', 'cafes'],
        bestSeason: 'Sep-Jun',
        budgetPerPersonINR: { min: 3000, max: 8000 },
        highlight: 'Rafting, Ganga aarti, and cafe-hopping on the ghats',
      },
      {
        to: 'Jaipur',
        toSlug: 'jaipur',
        distanceKm: 280,
        travelTime: '5 hrs by road, 4.5 hrs by train',
        transport: 'train',
        bestFor: ['culture', 'food', 'shopping'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 4000, max: 12000 },
        highlight: 'Pink City forts, Rajasthani thali, and bazaar shopping',
      },
      {
        to: 'Agra',
        toSlug: 'agra',
        distanceKm: 230,
        travelTime: '1h 40m by Gatimaan Express',
        transport: 'train',
        bestFor: ['heritage', 'photography'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 2000, max: 6000 },
        highlight: 'Taj Mahal at sunrise, Agra Fort, and petha shopping',
      },
      {
        to: 'Shimla',
        toSlug: 'shimla',
        distanceKm: 350,
        travelTime: '7-8 hrs by road',
        transport: 'drive',
        bestFor: ['hills', 'colonial heritage', 'snow'],
        bestSeason: 'Mar-Jun, Dec-Jan',
        budgetPerPersonINR: { min: 4000, max: 10000 },
        highlight: 'Mall Road strolls, toy train ride, and Kufri snow (winter)',
      },
      {
        to: 'Manali',
        toSlug: 'manali',
        distanceKm: 540,
        travelTime: '12 hrs by bus, 1.5 hr flight to Kullu',
        transport: 'bus',
        bestFor: ['mountains', 'adventure', 'snow'],
        bestSeason: 'Mar-Jun, Dec-Feb',
        budgetPerPersonINR: { min: 5000, max: 15000 },
        highlight: 'Solang Valley adventures, Old Manali cafes, and Rohtang Pass',
      },
      {
        to: 'Mussoorie',
        toSlug: '',
        distanceKm: 290,
        travelTime: '6-7 hrs by road',
        transport: 'drive',
        bestFor: ['hills', 'couples', 'nature'],
        bestSeason: 'Mar-Jun, Sep-Nov',
        budgetPerPersonINR: { min: 3500, max: 10000 },
        highlight: 'Queen of Hills — Kempty Falls, Gun Hill, and Landour cafes',
      },
    ],
  },
  {
    metro: 'Mumbai',
    metroSlug: 'mumbai',
    getaways: [
      {
        to: 'Goa',
        toSlug: 'goa',
        distanceKm: 590,
        travelTime: '1 hr flight, 10 hrs by train',
        transport: 'flight',
        bestFor: ['beaches', 'nightlife', 'food'],
        bestSeason: 'Nov-Feb',
        budgetPerPersonINR: { min: 5000, max: 15000 },
        highlight: 'Beach shacks, Fontainhas walk, and Goan fish curry',
      },
      {
        to: 'Lonavala',
        toSlug: '',
        distanceKm: 83,
        travelTime: '2 hrs by road',
        transport: 'drive',
        bestFor: ['nature', 'trekking', 'monsoon'],
        bestSeason: 'Jul-Sep (monsoon), Oct-Feb',
        budgetPerPersonINR: { min: 2000, max: 6000 },
        highlight: 'Waterfalls in monsoon, Tiger Point, and chikki shopping',
      },
      {
        to: 'Alibaug',
        toSlug: '',
        distanceKm: 95,
        travelTime: '1 hr by ferry, 3 hrs by road',
        transport: 'drive',
        bestFor: ['beaches', 'forts', 'seafood'],
        bestSeason: 'Oct-May',
        budgetPerPersonINR: { min: 2500, max: 8000 },
        highlight: 'Mumbai\'s nearest beach getaway — Kolaba Fort, Kashid Beach',
      },
      {
        to: 'Mahabaleshwar',
        toSlug: '',
        distanceKm: 260,
        travelTime: '5 hrs by road',
        transport: 'drive',
        bestFor: ['hills', 'strawberries', 'nature'],
        bestSeason: 'Oct-Jun',
        budgetPerPersonINR: { min: 3000, max: 8000 },
        highlight: 'Strawberry farms, Arthur\'s Seat viewpoint, and boat rides at Venna Lake',
      },
      {
        to: 'Pondicherry',
        toSlug: 'pondicherry',
        distanceKm: 1400,
        travelTime: '2 hr flight',
        transport: 'flight',
        bestFor: ['French Quarter', 'beaches', 'cafes'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 5000, max: 12000 },
        highlight: 'French colonial charm, Auroville, and promenade sunrise walks',
      },
    ],
  },
  {
    metro: 'Bangalore',
    metroSlug: 'bengaluru',
    getaways: [
      {
        to: 'Mysuru',
        toSlug: 'mysuru',
        distanceKm: 150,
        travelTime: '3 hrs by road/train',
        transport: 'train',
        bestFor: ['palaces', 'food', 'heritage'],
        bestSeason: 'Oct-Feb',
        budgetPerPersonINR: { min: 3000, max: 8000 },
        highlight: 'Mysore Palace light show, Chamundi Hills, and Mysore pak sweets',
      },
      {
        to: 'Hampi',
        toSlug: 'hampi',
        distanceKm: 340,
        travelTime: '6 hrs by road',
        transport: 'bus',
        bestFor: ['ruins', 'history', 'bouldering'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 2000, max: 6000 },
        highlight: 'UNESCO ruins of Vijayanagara, Matanga Hill sunrise, coracle rides',
      },
      {
        to: 'Pondicherry',
        toSlug: 'pondicherry',
        distanceKm: 320,
        travelTime: '6 hrs by road',
        transport: 'drive',
        bestFor: ['French Quarter', 'Auroville', 'beaches'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 4000, max: 10000 },
        highlight: 'French Quarter cafes, Auroville meditation, and promenade cycling',
      },
      {
        to: 'Coorg',
        toSlug: '',
        distanceKm: 260,
        travelTime: '5 hrs by road',
        transport: 'drive',
        bestFor: ['coffee', 'nature', 'trekking'],
        bestSeason: 'Oct-May',
        budgetPerPersonINR: { min: 3500, max: 10000 },
        highlight: 'Coffee plantation stays, Abbey Falls, and Kodava cuisine',
      },
      {
        to: 'Chikmagalur',
        toSlug: '',
        distanceKm: 245,
        travelTime: '4 hrs by road',
        transport: 'drive',
        bestFor: ['coffee', 'trekking', 'nature'],
        bestSeason: 'Sep-Feb',
        budgetPerPersonINR: { min: 3000, max: 8000 },
        highlight: 'Mullayanagiri trek, coffee estates, and Baba Budangiri shrine',
      },
    ],
  },
  {
    metro: 'Chennai',
    metroSlug: 'chennai',
    getaways: [
      {
        to: 'Pondicherry',
        toSlug: 'pondicherry',
        distanceKm: 150,
        travelTime: '3 hrs by road',
        transport: 'drive',
        bestFor: ['French Quarter', 'beaches', 'cafes'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 3000, max: 8000 },
        highlight: 'Chennai\'s favourite weekend escape — French Quarter, Auroville, beach walks',
      },
      {
        to: 'Mahabalipuram',
        toSlug: '',
        distanceKm: 60,
        travelTime: '1.5 hrs by road',
        transport: 'drive',
        bestFor: ['heritage', 'beaches', 'art'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 2000, max: 5000 },
        highlight: 'Shore Temple at sunset, stone carvings, and beachside seafood',
      },
      {
        to: 'Munnar',
        toSlug: 'munnar',
        distanceKm: 520,
        travelTime: '10 hrs by road',
        transport: 'drive',
        bestFor: ['tea gardens', 'nature', 'trekking'],
        bestSeason: 'Sep-Mar',
        budgetPerPersonINR: { min: 4000, max: 10000 },
        highlight: 'Tea plantation walks, Eravikulam National Park, and misty mornings',
      },
      {
        to: 'Yercaud',
        toSlug: '',
        distanceKm: 230,
        travelTime: '5 hrs by road',
        transport: 'drive',
        bestFor: ['hills', 'nature', 'coffee'],
        bestSeason: 'Oct-Jun',
        budgetPerPersonINR: { min: 2500, max: 6000 },
        highlight: 'Jewel of the South — coffee plantations, boat house lake, and 32 hairpin bends',
      },
    ],
  },
  {
    metro: 'Kolkata',
    metroSlug: 'kolkata',
    getaways: [
      {
        to: 'Darjeeling',
        toSlug: 'darjeeling',
        distanceKm: 600,
        travelTime: '10 hrs by road, NJP train + car',
        transport: 'train',
        bestFor: ['tea', 'mountains', 'toy train'],
        bestSeason: 'Mar-May, Oct-Nov',
        budgetPerPersonINR: { min: 4000, max: 10000 },
        highlight: 'Tiger Hill sunrise, Darjeeling Himalayan Railway, and tea garden tours',
      },
      {
        to: 'Gangtok',
        toSlug: 'gangtok',
        distanceKm: 560,
        travelTime: '12 hrs by road',
        transport: 'drive',
        bestFor: ['monasteries', 'mountains', 'lakes'],
        bestSeason: 'Mar-May, Oct-Nov',
        budgetPerPersonINR: { min: 5000, max: 12000 },
        highlight: 'Tsomgo Lake, Nathula Pass (India-China border), and MG Marg promenade',
      },
      {
        to: 'Sundarbans',
        toSlug: '',
        distanceKm: 100,
        travelTime: '3 hrs by road + boat',
        transport: 'drive',
        bestFor: ['wildlife', 'nature', 'mangroves'],
        bestSeason: 'Nov-Mar',
        budgetPerPersonINR: { min: 3000, max: 8000 },
        highlight: 'Royal Bengal Tiger territory — mangrove boat safaris and bird watching',
      },
      {
        to: 'Shantiniketan',
        toSlug: '',
        distanceKm: 160,
        travelTime: '3.5 hrs by road/train',
        transport: 'train',
        bestFor: ['art', 'culture', 'Tagore'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 2000, max: 5000 },
        highlight: 'Rabindranath Tagore\'s university town — Poush Mela (Dec), Baul music, and rural art',
      },
    ],
  },
  {
    metro: 'Hyderabad',
    metroSlug: '',
    getaways: [
      {
        to: 'Hampi',
        toSlug: 'hampi',
        distanceKm: 370,
        travelTime: '6 hrs by road',
        transport: 'drive',
        bestFor: ['ruins', 'history', 'bouldering'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 3000, max: 7000 },
        highlight: 'UNESCO Vijayanagara ruins, Matanga Hill sunrise, and Hippie Island vibes',
      },
      {
        to: 'Srisailam',
        toSlug: '',
        distanceKm: 210,
        travelTime: '4 hrs by road',
        transport: 'drive',
        bestFor: ['temples', 'nature', 'wildlife'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 2000, max: 5000 },
        highlight: 'Mallikarjuna Jyotirlinga temple, Srisailam Dam, and forest treks',
      },
      {
        to: 'Bidar',
        toSlug: '',
        distanceKm: 140,
        travelTime: '3 hrs by road',
        transport: 'drive',
        bestFor: ['heritage', 'forts', 'off-beat'],
        bestSeason: 'Oct-Feb',
        budgetPerPersonINR: { min: 2000, max: 5000 },
        highlight: 'Bidar Fort, Guru Nanak Jhira Sahib, and Bidri metalwork shopping',
      },
      {
        to: 'Araku Valley',
        toSlug: '',
        distanceKm: 680,
        travelTime: '1 hr flight to Vizag + 3 hrs',
        transport: 'flight',
        bestFor: ['nature', 'tribal culture', 'coffee'],
        bestSeason: 'Oct-Mar',
        budgetPerPersonINR: { min: 4000, max: 10000 },
        highlight: 'India\'s most scenic train ride (Vizag to Araku), Borra Caves, and tribal villages',
      },
    ],
  },
];

/** Get getaways for a specific metro city */
export function getGetawaysForMetro(metroSlug: string): WeekendGetaway[] {
  return WEEKEND_GETAWAYS.find((m) => m.metroSlug === metroSlug)?.getaways ?? [];
}

/** Get all metro options */
export function getMetroOptions(): { name: string; slug: string }[] {
  return WEEKEND_GETAWAYS.map((m) => ({ name: m.metro, slug: m.metroSlug }));
}
