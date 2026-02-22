// ============================================================
// Popular Indian Railway Routes
// Real train data with approximate fares (2024-25 prices)
// ============================================================

export interface TrainRoute {
  name: string;
  from: string;
  fromSlug: string;
  to: string;
  toSlug: string;
  trainNames: string[];
  trainNumbers: string[];
  durationHours: number;
  fareINR: { sleeper: number; ac3: number; ac2: number };
  frequency: string;
  highlight: string;
  bookingTip: string;
}

export const POPULAR_TRAIN_ROUTES: TrainRoute[] = [
  {
    name: 'Delhi to Jaipur',
    from: 'New Delhi',
    fromSlug: 'new-delhi',
    to: 'Jaipur',
    toSlug: 'jaipur',
    trainNames: ['Shatabdi Express', 'Ajmer Shatabdi'],
    trainNumbers: ['12015', '12016'],
    durationHours: 4.5,
    fareINR: { sleeper: 400, ac3: 800, ac2: 1300 },
    frequency: 'daily',
    highlight: 'Quick and comfortable. Shatabdi includes meals.',
    bookingTip: 'Book on IRCTC 120 days in advance. Morning Shatabdi arrives by 10:30am.',
  },
  {
    name: 'Delhi to Agra',
    from: 'New Delhi',
    fromSlug: 'new-delhi',
    to: 'Agra',
    toSlug: 'agra',
    trainNames: ['Gatimaan Express'],
    trainNumbers: ['12049'],
    durationHours: 1.7,
    fareINR: { sleeper: 0, ac3: 1000, ac2: 1500 },
    frequency: 'daily',
    highlight: 'India\'s fastest train. Leaves 8:10am, returns 5:50pm — ideal day trip.',
    bookingTip: 'No sleeper class. Executive chair car available. Book at least 1 week ahead.',
  },
  {
    name: 'Delhi to Varanasi',
    from: 'New Delhi',
    fromSlug: 'new-delhi',
    to: 'Varanasi',
    toSlug: 'varanasi',
    trainNames: ['Vande Bharat Express', 'Rajdhani Express'],
    trainNumbers: ['22436', '12560'],
    durationHours: 8,
    fareINR: { sleeper: 700, ac3: 1500, ac2: 2500 },
    frequency: 'daily',
    highlight: 'Vande Bharat is semi-high-speed with airline-like service. Meal included.',
    bookingTip: 'Vande Bharat sells out fast. Book 30+ days ahead. Rajdhani is a good overnight alternative.',
  },
  {
    name: 'Mumbai to Goa',
    from: 'Mumbai',
    fromSlug: 'mumbai',
    to: 'Goa',
    toSlug: 'goa',
    trainNames: ['Konkan Kanya Express', 'Jan Shatabdi'],
    trainNumbers: ['10111', '12051'],
    durationHours: 12,
    fareINR: { sleeper: 600, ac3: 1200, ac2: 1800 },
    frequency: 'daily',
    highlight: 'The Konkan Railway route is one of India\'s most scenic — book a window seat.',
    bookingTip: 'Peak season (Nov-Feb) trains sell out weeks ahead. Book early or consider flight (1hr, from Rs 2000).',
  },
  {
    name: 'Kolkata to Darjeeling',
    from: 'Kolkata',
    fromSlug: 'kolkata',
    to: 'Darjeeling',
    toSlug: 'darjeeling',
    trainNames: ['Rajdhani to NJP + Toy Train'],
    trainNumbers: ['12343', '52541'],
    durationHours: 17,
    fareINR: { sleeper: 700, ac3: 1500, ac2: 2200 },
    frequency: 'daily',
    highlight: 'Take Rajdhani to NJP, then the UNESCO Toy Train. The toy train is the experience itself.',
    bookingTip: 'Book Vistadome coach on the Toy Train (Rs 800) for panoramic glass roof views.',
  },
  {
    name: 'Delhi to Shimla',
    from: 'New Delhi',
    fromSlug: 'new-delhi',
    to: 'Shimla',
    toSlug: 'shimla',
    trainNames: ['Shatabdi to Kalka + Kalka-Shimla Toy Train'],
    trainNumbers: ['12011', '52455'],
    durationHours: 10,
    fareINR: { sleeper: 350, ac3: 700, ac2: 1100 },
    frequency: 'daily',
    highlight: 'UNESCO Heritage Railway through 102 tunnels and 800+ bridges. Spectacular mountain views.',
    bookingTip: 'Book the Vistadome coach (Rs 800) for glass ceiling views. Morning departure recommended.',
  },
  {
    name: 'Chennai to Pondicherry',
    from: 'Chennai',
    fromSlug: 'chennai',
    to: 'Pondicherry',
    toSlug: 'pondicherry',
    trainNames: ['Chennai-Puducherry Express'],
    trainNumbers: ['16115'],
    durationHours: 3.5,
    fareINR: { sleeper: 200, ac3: 350, ac2: 500 },
    frequency: 'daily',
    highlight: 'Budget-friendly coastal route. Bus is faster (2.5 hrs) but the train is more scenic.',
    bookingTip: 'Buses run every 30 min from Chennai CMBT. ECR (East Coast Road) drive is also beautiful.',
  },
  {
    name: 'Bangalore to Mysore',
    from: 'Bengaluru',
    fromSlug: 'bengaluru',
    to: 'Mysuru',
    toSlug: 'mysuru',
    trainNames: ['Shatabdi Express', 'Tippu Express'],
    trainNumbers: ['12007', '12613'],
    durationHours: 2,
    fareINR: { sleeper: 200, ac3: 400, ac2: 600 },
    frequency: 'daily',
    highlight: 'One of India\'s most popular day trips. Leave at 6am, return by 8pm.',
    bookingTip: 'Shatabdi includes breakfast. KSRTC Airavat buses are equally good (3 hrs, Rs 400).',
  },
  {
    name: 'Delhi to Rishikesh',
    from: 'New Delhi',
    fromSlug: 'new-delhi',
    to: 'Rishikesh',
    toSlug: 'rishikesh',
    trainNames: ['Jan Shatabdi to Haridwar + Auto/Bus'],
    trainNumbers: ['12017'],
    durationHours: 5.5,
    fareINR: { sleeper: 300, ac3: 600, ac2: 900 },
    frequency: 'daily',
    highlight: 'Train to Haridwar (4.5 hrs) + 30 min auto/bus to Rishikesh. ISBT Kashmere Gate bus is direct (6 hrs).',
    bookingTip: 'Volvo AC buses from ISBT are the most comfortable direct option (Rs 600-800).',
  },
  {
    name: 'Delhi to Manali',
    from: 'New Delhi',
    fromSlug: 'new-delhi',
    to: 'Manali',
    toSlug: 'manali',
    trainNames: ['No direct train — bus or flight to Kullu'],
    trainNumbers: [],
    durationHours: 14,
    fareINR: { sleeper: 0, ac3: 0, ac2: 0 },
    frequency: 'daily (bus)',
    highlight: 'HRTC Volvo buses from ISBT (Rs 1200-1500, 14 hrs). Flight to Bhuntar/Kullu airport (1.5 hrs).',
    bookingTip: 'Book HRTC Volvo online at hrtchp.com. Overnight bus saves a hotel night. Flights from Rs 3000.',
  },
  {
    name: 'Mumbai to Pune',
    from: 'Mumbai',
    fromSlug: 'mumbai',
    to: 'Pune',
    toSlug: 'new-delhi', // Pune not in seeded cities — link to nearest
    trainNames: ['Deccan Express', 'Pragati Express', 'Shatabdi'],
    trainNumbers: ['11007', '12125', '12027'],
    durationHours: 3.5,
    fareINR: { sleeper: 200, ac3: 450, ac2: 700 },
    frequency: 'daily (15+ trains)',
    highlight: 'One of India\'s busiest routes. The expressway drive (3 hrs) through the Western Ghats is stunning.',
    bookingTip: '15+ daily trains — availability is rarely an issue. Shatabdi is the premium option.',
  },
  {
    name: 'Kochi to Alleppey',
    from: 'Kochi',
    fromSlug: 'kochi',
    to: 'Alleppey',
    toSlug: 'alleppey',
    trainNames: ['Multiple daily trains'],
    trainNumbers: [],
    durationHours: 1.5,
    fareINR: { sleeper: 100, ac3: 250, ac2: 400 },
    frequency: 'daily (10+ trains)',
    highlight: 'Short hop to the backwater capital. Bus (1.5 hrs, Rs 80) is equally convenient.',
    bookingTip: 'No need to book ahead — plenty of trains. Or take a state bus from Ernakulam KSRTC.',
  },
  {
    name: 'Jaipur to Jodhpur',
    from: 'Jaipur',
    fromSlug: 'jaipur',
    to: 'Jodhpur',
    toSlug: 'jodhpur',
    trainNames: ['Mandore Express', 'Intercity Express'],
    trainNumbers: ['12461', '14801'],
    durationHours: 5.5,
    fareINR: { sleeper: 350, ac3: 700, ac2: 1100 },
    frequency: 'daily',
    highlight: 'The Rajasthan desert landscape unfolds as you travel west. Window seat recommended.',
    bookingTip: 'Mandore Express (overnight) is convenient. RSRTC Volvo buses are a good daytime option (5.5 hrs, Rs 600).',
  },
  {
    name: 'Jodhpur to Udaipur',
    from: 'Jodhpur',
    fromSlug: 'jodhpur',
    to: 'Udaipur',
    toSlug: 'udaipur',
    trainNames: ['Intercity Express'],
    trainNumbers: ['14801'],
    durationHours: 6,
    fareINR: { sleeper: 300, ac3: 650, ac2: 1000 },
    frequency: 'daily',
    highlight: 'Through the Aravalli hills. The drive (5 hrs) through Ranakpur and Kumbhalgarh is more scenic.',
    bookingTip: 'Consider driving — stop at Ranakpur Jain Temple and Kumbhalgarh Fort en route.',
  },
];

/** Get train routes departing from a city */
export function getTrainRoutesFrom(citySlug: string): TrainRoute[] {
  return POPULAR_TRAIN_ROUTES.filter((r) => r.fromSlug === citySlug);
}

/** Get a route between two cities (checks both directions) */
export function getTrainRoute(from: string, to: string): TrainRoute | undefined {
  return POPULAR_TRAIN_ROUTES.find(
    (r) => (r.fromSlug === from && r.toSlug === to) || (r.fromSlug === to && r.toSlug === from)
  );
}

/** Get all routes involving a city (either from or to) */
export function getTrainRoutesForCity(citySlug: string): TrainRoute[] {
  return POPULAR_TRAIN_ROUTES.filter((r) => r.fromSlug === citySlug || r.toSlug === citySlug);
}
