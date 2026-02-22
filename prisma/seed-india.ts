// ============================================================
// TRAILS AND MILES — India Seed Script (Part 1)
// Domestic travel data: India country, visa, and first 13 cities
// Run: npx tsx prisma/seed-india.ts
// ============================================================

import 'dotenv/config';
import { PrismaClient, ContentStatus, VisaType, ExperienceCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting India seed...');

  // ── REGION ──────────────────────────────────────────────
  console.log('📍 Upserting South Asia region...');

  const southAsia = await prisma.region.upsert({
    where: { slug: 'south-asia' },
    update: {},
    create: {
      name: 'South Asia',
      slug: 'south-asia',
      description: 'Exotic island paradises and rich cultural neighbours — visa-friendly destinations within easy reach of India.',
      sortOrder: 2,
    },
  });

  // ── COUNTRY: INDIA ────────────────────────────────────────
  console.log('🇮🇳 Seeding India...');

  const india = await prisma.country.upsert({
    where: { slug: 'india' },
    update: {},
    create: {
      regionId: southAsia.id,
      name: 'India',
      slug: 'india',
      description: 'A subcontinent of staggering diversity — from the snow-capped Himalayas and golden Thar Desert to tropical backwaters and pristine Andaman beaches. India is home to 40+ UNESCO World Heritage Sites, thousands of years of living culture, and arguably the most varied cuisine on earth. For domestic Indian travellers, every state feels like a different country with its own language, food, and traditions.',
      heroImageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600',
      currencyCode: 'INR',
      currencyName: 'Indian Rupee',
      timezone: 'Asia/Kolkata',
      language: 'Hindi, English, and 21 other official languages',
      capitalCity: 'New Delhi',
      budgetTier: 'budget',
      safetyRating: 3,
      status: ContentStatus.PUBLISHED,
      tags: ['heritage', 'culture', 'temples', 'food', 'mountains', 'beaches', 'wildlife', 'spirituality', 'adventure', 'budget-friendly', 'family-friendly', 'backpacking', 'road-trips', 'festivals'],
      bestSeasons: {
        months: [10, 11, 12, 1, 2, 3],
        description: 'Oct–Mar is the ideal window for most of India — pleasant weather across the plains and south. Summers (Apr–Jun) are best for the Himalayas. Monsoon (Jul–Sep) brings lush green landscapes but heavy rain.',
        peak: [12, 1, 2],
        shoulder: [10, 11, 3],
        avoid: [5, 6],
      },
      quickFacts: {
        population: '1.44 billion',
        capital: 'New Delhi',
        language: 'Hindi, English (+ 21 scheduled languages)',
        currency: 'Indian Rupee (INR). ₹1 = ₹1',
        electricalPlug: 'Type C/D/M (230V) — standard Indian 3-pin',
        emergencyNumber: '112 (unified), 100 (police), 108 (ambulance)',
        indianFoodAvailability: 'everywhere',
        simCardCost: '₹200–500 for 1.5GB/day plans (Jio/Airtel/Vi)',
        upiAccepted: true,
        drivingSide: 'left',
        tipExpected: true,
      },
    },
  });

  // ── VISA INFO ─────────────────────────────────────────────
  console.log('📋 Seeding India visa info (domestic travel)...');

  await prisma.visaInfo.upsert({
    where: { countryId_visaType: { countryId: india.id, visaType: VisaType.VISA_FREE } },
    update: {},
    create: {
      countryId: india.id,
      visaType: VisaType.VISA_FREE,
      description: 'Indian citizens do not require any visa for domestic travel. However, certain restricted and protected areas in border states require special permits — Inner Line Permit (ILP) for parts of the Northeast, and Protected Area Permit (PAP) for areas near international borders in Ladakh, Sikkim, and the Andaman Islands.',
      documentsRequired: [
        { name: 'Government-issued photo ID', description: 'Aadhaar Card, Voter ID, Passport, or Driving License accepted at airports, hotels, and checkpoints.', mandatory: true },
        { name: 'Inner Line Permit (ILP)', description: 'Required for Indian citizens visiting Arunachal Pradesh, Nagaland, Mizoram, and Manipur. Apply online or at state entry points.', mandatory: false },
        { name: 'Protected Area Permit (PAP)', description: 'Required for certain areas in Ladakh (Nubra Valley, Pangong Lake, Tso Moriri), Sikkim (North Sikkim), and Andaman (tribal areas).', mandatory: false },
        { name: 'Hotel/hostel booking confirmation', description: 'Recommended for smooth check-in and ILP/PAP verification at checkpoints.', mandatory: false },
      ],
      processingTimeDays: { min: 0, max: 0 },
      fees: { currency: 'INR', amount: 0, inrApprox: 0 },
      commonMistakes: [
        'Not carrying a valid photo ID — required at airports, many hotels, and interstate checkpoints',
        'Forgetting to apply for ILP before visiting Northeast states — can be denied entry',
        'Not obtaining PAP for restricted areas in Ladakh — fines and forced return at checkpoints',
        'Assuming all areas in border states are freely accessible without permits',
      ],
      tips: [
        'Aadhaar Card is the most universally accepted ID across India',
        'ILP can be applied online for Arunachal Pradesh and Nagaland — process takes 1-2 days',
        'For Ladakh PAP, your hotel or tour operator can arrange permits in Leh within a few hours',
        'Carry both digital and physical copies of all permits — mobile networks are unreliable in remote areas',
        'IRCTC train bookings, RedBus, and MakeMyTrip are the standard domestic booking platforms',
      ],
      status: ContentStatus.PUBLISHED,
      lastVerifiedAt: new Date('2026-01-15'),
    },
  });

  // ── CITIES ────────────────────────────────────────────────
  console.log('🏙️  Seeding Indian cities (Part 1: North + South/West)...');

  // ── NORTH INDIA ───────────────────────────────────────────

  const newDelhi = await prisma.city.upsert({
    where: { slug: 'new-delhi' },
    update: {},
    create: {
      countryId: india.id,
      name: 'New Delhi',
      slug: 'new-delhi',
      description: 'India\'s sprawling capital is a city of layered history — Mughal monuments, colonial-era boulevards, ancient Sufi shrines, and cutting-edge contemporary culture coexist in magnificent chaos. From the red sandstone ramparts of the Red Fort to the tree-lined avenues of Lutyens\' Delhi, this city rewards the curious traveller with world-class street food, vibrant bazaars, and some of the finest museums on the subcontinent.',
      heroImageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600',
      latitude: 28.6139,
      longitude: 77.2090,
      isCapital: true,
      avgDailyBudgetINR: 3000,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'capital', 'heritage', 'mughal', 'food', 'shopping', 'museums', 'metro-city', 'street-food', 'nightlife'],
      safetyTips: [
        'Use Delhi Metro for safe and affordable travel — covers most tourist areas',
        'Avoid auto-rickshaws without meters; use Ola/Uber or Delhi Metro instead',
        'Be cautious of touts near New Delhi Railway Station offering "official" tourism offices',
        'Keep bags secure in crowded areas like Chandni Chowk and Connaught Place',
        'Women travellers should avoid isolated areas after dark; stick to well-lit, busy streets',
      ],
      foodHighlights: {
        mustTry: ['Chole Bhature (Sita Ram Diwan Chand)', 'Butter Chicken (Moti Mahal, Daryaganj)', 'Paranthe Wali Gali paranthas', 'Daulat ki Chaat (winter only)', 'Nihari at Jama Masjid'],
        vegetarianOptions: ['Karim\'s veg section', 'Saravana Bhavan (South Indian)', 'Haldiram\'s', 'Paranthe Wali Gali (all vegetarian)', 'Bengali Sweet House (Connaught Place)'],
        indianFoodAvailable: true,
        topRestaurants: ['Indian Accent (fine dining)', 'Bukhara (ITC Maurya)', 'Karim\'s (Old Delhi)', 'Sita Ram Diwan Chand (Paharganj)'],
      },
      localTransport: {
        metro: 'Delhi Metro — extensive network covering all major areas (₹10–60 per ride, smart card recommended)',
        ola_uber: 'Ola and Uber widely available and affordable',
        auto: 'Auto-rickshaws — insist on meter or use Ola Auto',
        bus: 'DTC and cluster buses — cheap but crowded during rush hours',
        erickshaw: 'E-rickshaws for short distances in Old Delhi and residential areas (₹10–30)',
      },
      bestSeasons: {
        months: [10, 11, 2, 3],
        description: 'Oct–Nov and Feb–Mar offer pleasant weather. Winters (Dec–Jan) are foggy and cold. Summers (Apr–Jun) are extremely hot (45°C+). Monsoon (Jul–Sep) brings humid relief.',
        peak: [10, 11, 2],
        shoulder: [3, 12],
        avoid: [5, 6],
      },
      sortOrder: 1,
    },
  });

  const jaipur = await prisma.city.upsert({
    where: { slug: 'jaipur' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Jaipur',
      slug: 'jaipur',
      description: 'The Pink City lives up to its name with terracotta-hued bazaars, majestic hilltop forts, and ornate palaces that transport you to the era of Rajput kings. As one corner of India\'s Golden Triangle (with Delhi and Agra), Jaipur combines regal heritage with a vibrant artisan culture — from block-printed textiles and gemstone workshops to the legendary Dal Baati Churma.',
      heroImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600',
      latitude: 26.9124,
      longitude: 75.7873,
      isCapital: false,
      avgDailyBudgetINR: 2500,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'rajasthan', 'heritage', 'forts', 'palaces', 'pink-city', 'shopping', 'golden-triangle', 'textiles', 'handicrafts'],
      safetyTips: [
        'Beware of gem scams — do not buy expensive stones from street vendors or touts',
        'Negotiate auto-rickshaw fares before boarding or use Ola/Uber',
        'Carry water and sunscreen — Rajasthan sun is intense even in winter',
        'Watch for pickpockets in crowded bazaars like Johari Bazaar and Bapu Bazaar',
        'Verify fixed prices at government emporiums before shopping in private stores',
      ],
      foodHighlights: {
        mustTry: ['Dal Baati Churma', 'Laal Maas (spicy mutton curry)', 'Pyaaz Kachori (Rawat Mishthan Bhandar)', 'Ghewar (seasonal sweet)', 'Kulfi Faluda'],
        vegetarianOptions: ['Rawat Mishthan Bhandar (iconic kachori)', 'LMB (Laxmi Mishthan Bhandar) on Johari Bazaar', 'Santosh Bhojnalaya (authentic Rajasthani thali)', 'Annapurna Restaurant'],
        indianFoodAvailable: true,
        topRestaurants: ['1135 AD (inside Amber Fort)', 'Rawat Mishthan Bhandar', 'LMB', 'Suvarna Mahal (Rambagh Palace)'],
      },
      localTransport: {
        ola_uber: 'Ola and Uber available across the city',
        auto: 'Auto-rickshaws — negotiate or use Ola Auto',
        bus: 'RSRTC city buses connect major attractions',
        metro: 'Jaipur Metro (limited but covers some areas)',
        cycle_rickshaw: 'Cycle rickshaws ideal for Old City bazaar exploration (₹20–50)',
      },
      bestSeasons: {
        months: [10, 11, 12, 1, 2, 3],
        description: 'Oct–Mar is the perfect window — warm days, cool nights, and clear skies ideal for fort visits. Summers (Apr–Jun) are scorching (45°C+). Monsoon brings moderate rain and green landscapes.',
        peak: [11, 12, 1, 2],
        shoulder: [10, 3],
        avoid: [5, 6],
      },
      sortOrder: 2,
    },
  });

  const agra = await prisma.city.upsert({
    where: { slug: 'agra' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Agra',
      slug: 'agra',
      description: 'Home to the Taj Mahal — the world\'s most iconic monument to love — Agra is a city that every traveller must visit at least once. Beyond the Taj, Agra Fort and the abandoned Mughal city of Fatehpur Sikri reveal centuries of imperial grandeur. The Petha sweets and leather goods are local specialties that have thrived for generations.',
      heroImageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600',
      latitude: 27.1767,
      longitude: 78.0081,
      isCapital: false,
      avgDailyBudgetINR: 1800,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'uttar-pradesh', 'taj-mahal', 'mughal', 'heritage', 'UNESCO', 'golden-triangle', 'history', 'architecture', 'romantic'],
      safetyTips: [
        'Only hire guides from the official ASI (Archaeological Survey of India) counter at the Taj Mahal',
        'Avoid touts who offer "free" tours — they will take you to commission shops',
        'Pre-book train tickets (Gatimaan Express from Delhi is fastest — 1 hr 40 min)',
        'Keep your belongings secure in crowded areas around the Taj Mahal entrance',
      ],
      foodHighlights: {
        mustTry: ['Agra ka Petha (sweet gourd candy)', 'Mughlai Parantha', 'Bedai with Jalebi (breakfast)', 'Dalmoth (savoury snack mix)', 'Mughlai cuisine at Pinch of Spice'],
        vegetarianOptions: ['Mama Chicken (despite name, has veg options)', 'Dasaprakash (South Indian)', 'Joney\'s Place (backpacker favourite)', 'Shankara Vegis'],
        indianFoodAvailable: true,
        topRestaurants: ['Pinch of Spice', 'Peshawri (ITC Mughal)', 'Bon Barbecue', 'Mama Chicken'],
      },
      localTransport: {
        ola_uber: 'Ola and Uber available but coverage can be patchy',
        auto: 'Auto-rickshaws and e-rickshaws — negotiate fare upfront',
        prepaid_auto: 'Prepaid auto counter at Agra Cantt station — use it',
        cycle_rickshaw: 'Cycle rickshaws near Taj Mahal area (₹20–50)',
        train: 'Gatimaan Express from Delhi (1hr 40min, ₹750–1500)',
      },
      bestSeasons: {
        months: [10, 11, 2, 3],
        description: 'Oct–Mar is ideal for visiting the Taj Mahal — clear skies and comfortable temperatures. The Taj looks ethereal at sunrise in winter morning mist. Summers are unbearably hot (47°C+).',
        peak: [11, 12, 2],
        shoulder: [10, 1, 3],
        avoid: [5, 6],
      },
      sortOrder: 3,
    },
  });

  const varanasi = await prisma.city.upsert({
    where: { slug: 'varanasi' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Varanasi',
      slug: 'varanasi',
      description: 'The oldest continuously inhabited city in the world, Varanasi is India\'s spiritual heart — a place where life and death dance along the ghats of the sacred Ganges. The evening Ganga Aarti at Dashashwamedh Ghat is one of the most powerful ceremonies you will ever witness. Narrow lanes hide ancient temples, silk-weaving workshops, and some of the finest street food in North India.',
      heroImageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600',
      latitude: 25.3176,
      longitude: 83.0068,
      isCapital: false,
      avgDailyBudgetINR: 1500,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'uttar-pradesh', 'spiritual', 'ghats', 'ganges', 'temples', 'heritage', 'silk', 'food', 'ancient', 'pilgrimage'],
      safetyTips: [
        'Hire a local guide for ghat walks — the narrow lanes are a genuine maze',
        'Beware of boat operators overcharging — agree on a fixed price before boarding',
        'Remove shoes before entering temples; dress modestly at religious sites',
        'Avoid eating from street stalls with visibly stale food — stick to busy, popular vendors',
        'Watch your step on the ghats, especially near the river edge — they can be slippery',
      ],
      foodHighlights: {
        mustTry: ['Banarasi Paan', 'Kachori Sabzi (breakfast at Ram Bhandar)', 'Thandai (with or without bhang)', 'Tamatar Chaat', 'Malaiyo (winter-only milk froth)'],
        vegetarianOptions: ['Ram Bhandar (Kachori)', 'Kashi Chat Bhandar (chaat)', 'Blue Lassi (iconic lassi shop)', 'Deena Chaat Bhandar', 'Most food in Varanasi is vegetarian'],
        indianFoodAvailable: true,
        topRestaurants: ['Blue Lassi Shop', 'Ram Bhandar', 'Kashi Chat Bhandar', 'Brown Bread Bakery (rooftop café)'],
      },
      localTransport: {
        auto: 'Auto-rickshaws and e-rickshaws — negotiate or use shared autos',
        ola_uber: 'Ola available but coverage is limited in old city areas',
        boat: 'Boat rides on the Ganges — ₹150–500 depending on duration and time',
        walking: 'The ghats and old city are best explored on foot — no vehicles in the narrow lanes',
        cycle_rickshaw: 'Cycle rickshaws near the main ghats and Godaulia crossing (₹20–50)',
      },
      bestSeasons: {
        months: [10, 11, 2, 3],
        description: 'Oct–Mar is ideal — pleasant weather for ghat walks and boat rides. Dev Deepawali (Nov) transforms the ghats into a sea of diyas. Summers are extremely hot and humid.',
        peak: [11, 12, 1],
        shoulder: [10, 2, 3],
        avoid: [5, 6, 7],
      },
      sortOrder: 4,
    },
  });

  const udaipur = await prisma.city.upsert({
    where: { slug: 'udaipur' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Udaipur',
      slug: 'udaipur',
      description: 'The City of Lakes is Rajasthan\'s most romantic destination — whitewashed havelis reflecting in the still waters of Lake Pichola, the ethereal Lake Palace seemingly floating on the surface, and narrow lanes alive with miniature paintings, silver jewellery, and Mewari cuisine. Udaipur is the perfect city for slow travel, rooftop dinners, and regal heritage walks.',
      heroImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600',
      latitude: 24.5854,
      longitude: 73.7125,
      isCapital: false,
      avgDailyBudgetINR: 2800,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'rajasthan', 'lakes', 'palaces', 'romantic', 'heritage', 'art', 'havelis', 'miniature-painting', 'rooftop-dining'],
      safetyTips: [
        'Be careful with boat operators on Lake Pichola — use official City Palace boat service',
        'Carry cash for smaller shops and restaurants — card acceptance is limited in the old city',
        'Beware of commission-based art gallery tours — visit independently',
        'Stay hydrated — Rajasthan heat can be deceptive even in pleasant months',
        'Verify hotel locations before booking — some "lake view" claims are exaggerated',
      ],
      foodHighlights: {
        mustTry: ['Dal Baati Churma', 'Gatte ki Sabzi', 'Laal Maas', 'Mirchi Vada', 'Malpua'],
        vegetarianOptions: ['Savage Garden (rooftop)', 'Millets of Mewar (healthy Rajasthani)', 'Jagat Niwas Palace rooftop (lake view)', 'Natraj Dining Hall (unlimited thali)'],
        indianFoodAvailable: true,
        topRestaurants: ['Ambrai (lake-facing fine dining)', 'Upre by 1559 AD (rooftop)', 'Natraj Dining Hall', 'Savage Garden'],
      },
      localTransport: {
        ola_uber: 'Ola and Uber available but limited coverage',
        auto: 'Auto-rickshaws — negotiate fares; typical ₹30–100 within city',
        boat: 'Lake Pichola boat ride — ₹400–800 per person (sunset recommended)',
        walking: 'Old city is compact and best explored on foot',
        scooter: 'Scooter/bike rental available from shops near Lake Pichola (₹300–500/day)',
      },
      bestSeasons: {
        months: [10, 11, 12, 1, 2, 3],
        description: 'Oct–Mar is perfect — cool nights, warm days, and the lakes are full after monsoon. The monsoon (Jul–Sep) makes the city lush green and romantic, though some attractions may be affected.',
        peak: [11, 12, 1, 2],
        shoulder: [10, 3],
        avoid: [5, 6],
      },
      sortOrder: 5,
    },
  });

  const jodhpur = await prisma.city.upsert({
    where: { slug: 'jodhpur' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Jodhpur',
      slug: 'jodhpur',
      description: 'The Blue City earns its name from the thousands of indigo-painted houses clustered around the colossal Mehrangarh Fort — one of India\'s most impressive citadels. Standing atop its ramparts and gazing over the sea of blue homes below is a defining Rajasthan moment. Jodhpur is also the gateway to the Thar Desert and a city of exceptional Marwari cuisine.',
      heroImageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600',
      latitude: 26.2389,
      longitude: 73.0243,
      isCapital: false,
      avgDailyBudgetINR: 2000,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'rajasthan', 'blue-city', 'forts', 'desert', 'heritage', 'food', 'photography', 'thar-desert', 'handicrafts'],
      safetyTips: [
        'Carry water when exploring Mehrangarh Fort — the climb is long and exposed to sun',
        'Negotiate camel safari prices carefully — get details of duration and meals in writing',
        'Watch for monkeys at Mehrangarh Fort — they can be aggressive around food',
        'Avoid walking alone in the blue city lanes after dark — stick to main streets',
      ],
      foodHighlights: {
        mustTry: ['Mirchi Vada (Shahi Samosa)', 'Pyaaz Kachori', 'Mawa Kachori (sweet)', 'Ker Sangri (desert bean dish)', 'Makhaniya Lassi'],
        vegetarianOptions: ['Jhankar Choti Haveli (rooftop thali)', 'Shahi Samosa (iconic Mirchi Vada shop)', 'Gypsy Restaurant', 'Omelette Shop near Clock Tower (veg omelettes too)'],
        indianFoodAvailable: true,
        topRestaurants: ['Shahi Samosa', 'Jhankar Choti Haveli', 'Indique (Pal Haveli rooftop)', 'Stepwell Café'],
      },
      localTransport: {
        ola_uber: 'Ola available; Uber coverage is limited',
        auto: 'Auto-rickshaws — negotiate fares or use shared autos',
        walking: 'Old city around the Clock Tower is best explored on foot',
        taxi: 'Hire a taxi for Mehrangarh Fort and outskirts (₹500–1000/half-day)',
        camel: 'Camel safaris to Thar Desert available from ₹1500/person for overnight',
      },
      bestSeasons: {
        months: [10, 11, 12, 1, 2],
        description: 'Oct–Feb is ideal — clear desert skies, comfortable temperatures, and perfect for fort exploration. Summers are brutal (48°C+). Monsoon is brief but brings the desert alive.',
        peak: [11, 12, 1],
        shoulder: [10, 2, 3],
        avoid: [5, 6],
      },
      sortOrder: 6,
    },
  });

  const rishikesh = await prisma.city.upsert({
    where: { slug: 'rishikesh' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Rishikesh',
      slug: 'rishikesh',
      description: 'The Yoga Capital of the World sits where the Ganges emerges from the Himalayas into the plains — and the energy here is palpable. From The Beatles Ashram to world-class river rafting, bungee jumping to silent meditation retreats, Rishikesh uniquely blends adventure with spirituality. The evening Ganga Aarti at Triveni Ghat and the suspension bridges of Lakshman Jhula define this sacred town.',
      heroImageUrl: 'https://images.unsplash.com/photo-1600697395543-23b0e3d5bb09?w=1600',
      latitude: 30.0869,
      longitude: 78.2676,
      isCapital: false,
      avgDailyBudgetINR: 1500,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'uttarakhand', 'yoga', 'adventure', 'rafting', 'spiritual', 'ganges', 'mountains', 'backpacking', 'wellness', 'bungee'],
      safetyTips: [
        'Only book rafting and adventure activities through ATOAI-certified operators',
        'The Ganges current is strong — do not swim in unmarked areas',
        'Rishikesh is a dry city (no alcohol) and a strictly vegetarian town',
        'Be careful on the suspension bridges — they can be crowded and sway significantly',
        'Carry warm layers in winter — nights are cold near the river',
      ],
      foodHighlights: {
        mustTry: ['Chotiwala Restaurant thali (iconic Rishikesh)', 'Aloo Puri at roadside dhabas', 'Fresh fruit smoothie bowls at cafés', 'German Bakery bread and cakes', 'Ganga view chai'],
        vegetarianOptions: ['All food in Rishikesh is vegetarian — the entire city is meat-free and alcohol-free', 'Little Buddha Café', 'Chotiwala Restaurant', 'Beatles Café', 'Freedom Café (Israeli-Indian fusion)'],
        indianFoodAvailable: true,
        topRestaurants: ['Chotiwala (two competing branches)', 'Little Buddha Café', 'Bistro Nirvana', 'Freedom Café'],
      },
      localTransport: {
        auto: 'Shared autos between Tapovan, Lakshman Jhula, and Ram Jhula (₹10–30)',
        walking: 'Most attractions are walkable along the riverbank',
        scooter: 'Scooter rental available in Tapovan (₹300–500/day)',
        taxi: 'Taxis for Neelkanth Temple and waterfalls (₹500–1000)',
        bus: 'Local buses to Haridwar (30 min, ₹30) and Dehradun',
      },
      bestSeasons: {
        months: [9, 10, 11, 2, 3, 4],
        description: 'Sep–Nov and Feb–Apr are ideal — rafting season peaks Sep–Nov with exciting rapids. Winters are cold but serene. Monsoon (Jul–Aug) closes rafting due to high water levels.',
        peak: [10, 3, 4],
        shoulder: [9, 11, 2],
        avoid: [7, 8],
      },
      sortOrder: 7,
    },
  });

  const manali = await prisma.city.upsert({
    where: { slug: 'manali' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Manali',
      slug: 'manali',
      description: 'Nestled in the Kullu Valley at 2,050 metres, Manali is the quintessential Himalayan hill station — snow-capped peaks, apple orchards, gushing rivers, and the legendary Rohtang Pass. It\'s a gateway to Ladakh via one of the world\'s most spectacular road trips, and a paradise for backpackers, honeymooners, and adventure seekers alike. Old Manali\'s cafés and guesthouses have a laid-back Himalayan charm.',
      heroImageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600',
      latitude: 32.2396,
      longitude: 77.1887,
      isCapital: false,
      avgDailyBudgetINR: 2500,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'himachal-pradesh', 'mountains', 'snow', 'adventure', 'trekking', 'honeymoon', 'backpacking', 'rohtang-pass', 'solang-valley', 'old-manali'],
      safetyTips: [
        'Check road conditions before heading to Rohtang Pass — it closes frequently due to snow and landslides',
        'Altitude can cause mild headaches — stay hydrated and acclimatize on arrival day',
        'Avoid unlicensed paragliding and adventure operators — check for ATOAI certification',
        'Carry warm layers year-round — temperatures drop significantly at night',
        'Road trips to Leh via Manali-Leh Highway require proper planning and a buffer day for weather delays',
      ],
      foodHighlights: {
        mustTry: ['Siddu (steamed bread with filling)', 'Trout fish (locally farmed)', 'Dham (traditional Himachali feast)', 'Tibetan Momos', 'Apple cider (local brew)'],
        vegetarianOptions: ['Lazy Dog Lounge (Old Manali)', 'Johnson\'s Café', 'Drifters\' Café (organic)', 'People (café and bakery)', 'Renaissance (Italian-Indian)'],
        indianFoodAvailable: true,
        topRestaurants: ['Johnson\'s Café', 'Lazy Dog Lounge', 'Drifters\' Café', 'Il Forno (wood-fired pizza)'],
      },
      localTransport: {
        taxi: 'Local taxis for Rohtang Pass, Solang Valley (₹1000–3000 depending on distance)',
        auto: 'Auto-rickshaws within town (₹20–100)',
        bus: 'HRTC buses to Kullu, Shimla, Delhi, and Leh (seasonal)',
        walking: 'Old Manali and Mall Road are walkable',
        bike: 'Royal Enfield rentals for Manali-Leh Highway (₹1200–2000/day)',
      },
      bestSeasons: {
        months: [3, 4, 5, 6, 10, 11],
        description: 'Mar–Jun for pleasant weather and snow at Rohtang. Oct–Nov for clear skies and autumn colours. Dec–Feb for snowfall and winter sports at Solang Valley. Jul–Sep is monsoon season with landslide risks.',
        peak: [5, 6, 12],
        shoulder: [3, 4, 10, 11],
        avoid: [7, 8, 9],
      },
      sortOrder: 8,
    },
  });

  const shimla = await prisma.city.upsert({
    where: { slug: 'shimla' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Shimla',
      slug: 'shimla',
      description: 'The former summer capital of British India retains its colonial charm with Tudor-style buildings, the iconic Mall Road promenade, and Christ Church — one of the most photographed landmarks in the Himalayas. The UNESCO-listed Kalka-Shimla toy train journey through 102 tunnels and over 800 bridges is one of India\'s most enchanting rail experiences. Shimla is both a gateway to adventure and a city for nostalgic walks.',
      heroImageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150889?w=1600',
      latitude: 31.1048,
      longitude: 77.1734,
      isCapital: false,
      avgDailyBudgetINR: 2500,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'himachal-pradesh', 'hill-station', 'colonial', 'toy-train', 'UNESCO', 'mountains', 'family-friendly', 'mall-road', 'winter', 'snow'],
      safetyTips: [
        'Mall Road is pedestrian-only — safe and enjoyable for evening walks',
        'Book the Kalka-Shimla toy train well in advance — popular tourist seats fill up quickly',
        'Winter roads can be icy and dangerous — carry chains if driving',
        'Watch for monkeys on the Ridge and near Jakhoo Temple — they snatch food and bags',
        'Traffic congestion is severe — walk or use local shuttle services where possible',
      ],
      foodHighlights: {
        mustTry: ['Shimla Mirch Pakoda', 'Sidu (stuffed bread)', 'Tudkiya Bhath (Himachali spiced rice)', 'Chana Madra (chickpeas in yogurt)', 'Hot chocolate at Indian Coffee House'],
        vegetarianOptions: ['Indian Coffee House (iconic, on Mall Road)', 'Baljees (since 1930s)', 'Ashiana Restaurant (The Ridge)', 'Wake & Bake Café'],
        indianFoodAvailable: true,
        topRestaurants: ['Indian Coffee House', 'Baljees', 'Cecil (Oberoi)', 'Cafe Simla Times'],
      },
      localTransport: {
        walking: 'Mall Road and The Ridge are pedestrian-only zones — walk everywhere in the centre',
        taxi: 'Local taxis for Kufri, Mashobra, and Naldehra (₹500–1500)',
        bus: 'HRTC buses connect to Kullu, Manali, Delhi, and Chandigarh',
        toy_train: 'UNESCO Kalka-Shimla Railway — ₹30 (ordinary) to ₹800 (executive chair car)',
        lift: 'Public lift connects Cart Road to Mall Road (₹10)',
      },
      bestSeasons: {
        months: [3, 4, 5, 6, 10, 11],
        description: 'Mar–Jun for pleasant walking weather and clear views. Oct–Nov for autumn foliage. Dec–Feb for snowfall — magical but cold. Monsoon (Jul–Sep) brings landslides and road closures.',
        peak: [5, 6, 12],
        shoulder: [3, 4, 10, 11],
        avoid: [7, 8, 9],
      },
      sortOrder: 9,
    },
  });

  const lehLadakh = await prisma.city.upsert({
    where: { slug: 'leh-ladakh' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Leh-Ladakh',
      slug: 'leh-ladakh',
      description: 'The Land of High Passes is India\'s ultimate frontier destination — a high-altitude cold desert where ancient Buddhist monasteries perch on dramatic cliff faces, turquoise lakes shimmer at 14,000+ feet, and some of the world\'s highest motorable passes test the limits of both road and rider. Pangong Lake, Nubra Valley, and the Khardung La pass are bucket-list experiences that will forever change your definition of landscape.',
      heroImageUrl: 'https://images.unsplash.com/photo-1626015365107-7da41af2e6c5?w=1600',
      latitude: 34.1526,
      longitude: 77.5771,
      isCapital: false,
      avgDailyBudgetINR: 3500,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['north-india', 'ladakh', 'mountains', 'high-altitude', 'buddhist-monasteries', 'road-trip', 'adventure', 'lakes', 'biking', 'photography', 'pangong', 'nubra-valley'],
      safetyTips: [
        'Acclimatize in Leh for at least 2 full days before heading to higher altitudes — AMS (Acute Mountain Sickness) is a real risk',
        'Carry Diamox tablets (consult a doctor) and keep hydrated at all times',
        'Protected Area Permits (PAP) are required for Pangong Lake, Nubra Valley, and Tso Moriri — arrange through a hotel or tour operator in Leh',
        'Mobile network is limited to Leh town — BSNL has the best coverage in remote areas',
        'Fuel stations are few — always fill up in Leh before heading to Nubra or Pangong',
      ],
      foodHighlights: {
        mustTry: ['Thukpa (Tibetan noodle soup)', 'Momos (steamed/fried dumplings)', 'Skyu (Ladakhi pasta stew)', 'Butter Tea (Po Cha)', 'Apricot jam and juice (local specialty)'],
        vegetarianOptions: ['Bon Appetit (Main Bazaar)', 'Lamayuru Restaurant', 'Tibetan Kitchen', 'The Tibetan World Café', 'Most Ladakhi restaurants serve veg thukpa and momos'],
        indianFoodAvailable: true,
        topRestaurants: ['Bon Appetit', 'Lamayuru Restaurant', 'Alchi Kitchen', 'The Tibetan World Café'],
      },
      localTransport: {
        taxi: 'Shared and private taxis — Leh Taxi Union sets rates (Pangong day trip ~₹6000, Nubra 2-day ~₹10,000)',
        bike: 'Royal Enfield rental (₹1500–2500/day) — the iconic Ladakh experience',
        bus: 'JKSRTC buses to Kargil, Manali, and Srinagar (seasonal, limited)',
        walking: 'Leh Main Bazaar and Old Town are walkable',
        flight: 'Flights from Delhi to Leh (1.5 hrs) — book early, limited seats',
      },
      bestSeasons: {
        months: [6, 7, 8, 9],
        description: 'Jun–Sep is the only reliable window — Manali-Leh and Srinagar-Leh highways open mid-Jun and close by Oct. Jul–Aug is peak with warmest weather. Flights operate year-round but winter (-30°C) is extreme.',
        peak: [7, 8],
        shoulder: [6, 9],
        avoid: [12, 1, 2, 3, 4, 11],
      },
      sortOrder: 10,
    },
  });

  // ── SOUTH / WEST INDIA ────────────────────────────────────

  const mumbai = await prisma.city.upsert({
    where: { slug: 'mumbai' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Mumbai',
      slug: 'mumbai',
      description: 'India\'s Maximum City pulses with an energy found nowhere else on earth — Bollywood glamour, Art Deco architecture along Marine Drive, the iconic Gateway of India, chaotic yet magical local trains, and street food that rivals any city in Asia. From the dabbawala lunch delivery system to the vibrant nightlife of Bandra, Mumbai is a city of dreamers, hustlers, and endless stories.',
      heroImageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600',
      latitude: 19.0760,
      longitude: 72.8777,
      isCapital: false,
      avgDailyBudgetINR: 4000,
      budgetTier: 'luxury',
      status: ContentStatus.PUBLISHED,
      tags: ['west-india', 'maharashtra', 'metro-city', 'bollywood', 'street-food', 'nightlife', 'art-deco', 'gateway-of-india', 'marine-drive', 'shopping', 'beaches'],
      safetyTips: [
        'Mumbai local trains are the lifeline of the city — avoid peak hours (8–10am, 5–8pm) if unfamiliar',
        'Use Ola/Uber or prepaid taxis from the airport — avoid unlicensed cabs',
        'Keep bags secure on local trains and in crowded areas like Dadar and CST',
        'Marine Drive is safe for evening walks but avoid deserted stretches late at night',
        'Beach areas (Juhu, Versova) can have strong currents — swimming is not recommended',
      ],
      foodHighlights: {
        mustTry: ['Vada Pav (Anand Stall, Vile Parle)', 'Pav Bhaji (Sardar, Tardeo)', 'Bombay Sandwich', 'Keema Pav (Olympia)', 'Cutting Chai at any tapri'],
        vegetarianOptions: ['Swati Snacks (iconic Gujarati snacks)', 'Shree Thaker Bhojanalay (Gujarati thali)', 'Ram Ashraya (South Indian, Matunga)', 'Soam (Nepean Sea Road)', 'Sukh Sagar (chaat and dosa)'],
        indianFoodAvailable: true,
        topRestaurants: ['Trishna (seafood)', 'Swati Snacks', 'Britannia & Co. (Parsi)', 'Masala Library (modern Indian)'],
      },
      localTransport: {
        local_train: 'Mumbai Suburban Railway — fastest way to get around (₹5–15 per ride). Western, Central, and Harbour lines cover the city.',
        ola_uber: 'Ola and Uber widely available — reliable across the city',
        auto: 'Auto-rickshaws in suburbs (not South Mumbai) — metered fares',
        taxi: 'Black-and-yellow kaali-peeli taxis in South Mumbai (₹25 minimum, metered)',
        bus: 'BEST buses cover the entire city — ₹5–15',
        metro: 'Mumbai Metro expanding — Line 1 (Versova-Ghatkopar) operational',
      },
      bestSeasons: {
        months: [10, 11, 12, 1, 2],
        description: 'Oct–Feb is ideal — cool, dry weather perfect for exploring. The monsoon (Jun–Sep) brings dramatic rains and a magical green city, but flooding and transport disruptions are common. Mar–May is hot and humid.',
        peak: [11, 12, 1],
        shoulder: [10, 2],
        avoid: [5, 6],
      },
      sortOrder: 11,
    },
  });

  const goa = await prisma.city.upsert({
    where: { slug: 'goa' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Goa',
      slug: 'goa',
      description: 'India\'s smallest state packs an outsized punch — Portuguese colonial churches, palm-fringed beaches stretching for miles, legendary beach shacks, trance parties, and a relaxed Susegad philosophy that infects every visitor. North Goa (Baga, Anjuna, Vagator) is the party and backpacker hub, while South Goa (Palolem, Agonda, Colva) offers serenity, luxury resorts, and pristine coastline. The Goan-Portuguese fusion cuisine is unlike anything else in India.',
      heroImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600',
      latitude: 15.2993,
      longitude: 74.1240,
      isCapital: false,
      avgDailyBudgetINR: 3000,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['west-india', 'beaches', 'nightlife', 'portuguese-heritage', 'parties', 'food', 'backpacking', 'luxury-resorts', 'churches', 'water-sports', 'susegad'],
      safetyTips: [
        'Rent a scooter/bike for maximum freedom — carry your license and wear a helmet (fines are strict)',
        'Avoid swimming at unguarded beaches or after dark — rip currents are a real danger',
        'Do not leave valuables unattended on the beach — petty theft occurs',
        'Negotiate taxi fares before boarding — Goan taxis do not use meters and can be expensive',
        'Be cautious with drinks at parties — do not accept drinks from strangers',
      ],
      foodHighlights: {
        mustTry: ['Fish Curry Rice (Goan staple)', 'Prawn Balchao', 'Pork Vindaloo', 'Bebinca (layered Goan dessert)', 'Feni (cashew/coconut spirit)'],
        vegetarianOptions: ['Bean Me Up (vegan, Vagator)', 'Artjuna (organic café, Anjuna)', 'Vinayak Family Restaurant (local veg)', 'Ritz Classic (Panaji — Goan vegetarian)', 'Purple Mart Café'],
        indianFoodAvailable: true,
        topRestaurants: ['Gunpowder (Assagao)', 'Bomras (Burmese-Goan fusion)', 'Fisherman\'s Wharf', 'Martin\'s Corner (Betalbatim)'],
      },
      localTransport: {
        scooter: 'Scooter/Activa rental — ₹300–500/day, the essential Goa transport',
        taxi: 'Goan taxis are expensive and unmetered — always negotiate upfront',
        bus: 'Kadamba and private buses between towns (₹10–50)',
        ferry: 'River ferries across the Mandovi (some free, some ₹10)',
        ola_uber: 'Ola available in urban areas; Uber coverage is limited',
        bike: 'Royal Enfield rental available (₹800–1500/day)',
      },
      bestSeasons: {
        months: [10, 11, 12, 1, 2],
        description: 'Nov–Feb is peak season — dry weather, cool breeze, and all beach shacks are open. Oct and Mar are pleasant shoulder months. Monsoon (Jun–Sep) is dramatic and beautiful, but many beach shacks close.',
        peak: [12, 1],
        shoulder: [10, 11, 2, 3],
        avoid: [5, 6],
      },
      sortOrder: 12,
    },
  });

  const kochi = await prisma.city.upsert({
    where: { slug: 'kochi' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Kochi',
      slug: 'kochi',
      description: 'Kerala\'s port city is a living museum of India\'s maritime history — Chinese fishing nets silhouetted against Arabian Sea sunsets, spice warehouses in Jew Town, the oldest European church in India (St. Francis Church), and a thriving contemporary art scene at the Kochi-Muziris Biennale. Fort Kochi\'s tree-lined streets, colonial bungalows, and café culture make it one of India\'s most walkable and photogenic neighbourhoods.',
      heroImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600',
      latitude: 9.9312,
      longitude: 76.2673,
      isCapital: false,
      avgDailyBudgetINR: 2500,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['south-india', 'kerala', 'backwaters', 'spices', 'heritage', 'art', 'chinese-fishing-nets', 'fort-kochi', 'seafood', 'colonial', 'biennale'],
      safetyTips: [
        'Fort Kochi is safe to walk around at all hours — one of India\'s safest tourist areas',
        'Negotiate boat and ferry prices beforehand, or use KSINC (government) ferry services',
        'Beware of overpriced spices at tourist shops in Jew Town — compare prices first',
        'Carry an umbrella year-round — Kerala\'s weather is unpredictable',
        'Mosquito repellent is essential, especially near the backwaters',
      ],
      foodHighlights: {
        mustTry: ['Kerala Fish Curry (Karimeen/Pearl Spot)', 'Appam with Stew', 'Kerala Parotta with Chicken Curry', 'Puttu and Kadala Curry (breakfast)', 'Banana Chips (fresh from oil)'],
        vegetarianOptions: ['Dal Roti (Fort Kochi)', 'Kayees Rahmathulla Hotel (biryani has veg version)', 'Pai Brothers (fast food, veg options)', 'Fusion Bay (veg Kerala meals)', 'Kerala thali at most restaurants includes vegetarian options'],
        indianFoodAvailable: true,
        topRestaurants: ['Fort House Restaurant (harbour view)', 'Kayees Rahmathulla Hotel (oldest biryani)', 'Kashi Art Café (Fort Kochi)', 'Oceanos (seafood at Harbour)'],
      },
      localTransport: {
        ferry: 'KSINC government ferries between Fort Kochi, Ernakulam, and islands (₹5–20) — scenic and cheap',
        auto: 'Auto-rickshaws — insist on meter or use Ola Auto',
        ola_uber: 'Ola and Uber available across Kochi',
        metro: 'Kochi Metro connects Aluva to Pettah via Ernakulam (₹10–40)',
        bus: 'KSRTC and private buses — Ernakulam is the main bus hub',
        walking: 'Fort Kochi is compact and best explored on foot or bicycle',
        bicycle: 'Bicycle rental available in Fort Kochi (₹100–200/day)',
      },
      bestSeasons: {
        months: [10, 11, 12, 1, 2, 3],
        description: 'Oct–Mar is ideal — post-monsoon freshness, pleasant temperatures, and the Kochi-Muziris Biennale (Dec–Mar, every alternate year). Monsoon (Jun–Sep) brings heavy rain but also Ayurvedic treatment season.',
        peak: [12, 1, 2],
        shoulder: [10, 11, 3],
        avoid: [4, 5],
      },
      sortOrder: 13,
    },
  });

  // ── SOUTH INDIA (continued) ──────────────────────────────

  const munnar = await prisma.city.upsert({
    where: { slug: 'munnar' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Munnar',
      slug: 'munnar',
      description: 'Tea-blanketed hills in the Western Ghats of Kerala. Emerald plantations, misty mornings, and the aroma of fresh cardamom define this cool-climate hill station that offers a perfect escape from the coastal heat.',
      heroImageUrl: 'https://images.unsplash.com/photo-1598586124540-21a15e71e012?w=1600',
      latitude: 10.0889,
      longitude: 77.0595,
      isCapital: false,
      avgDailyBudgetINR: 2000,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['south-india', 'hill-station', 'nature', 'tea', 'trekking'],
      safetyTips: [
        'Carry warm clothing — mornings can be cold even in summer',
        'Leeches common during monsoon treks',
        'Roads can be foggy — avoid late night driving',
        'Book accommodation in advance during peak season (Sep-Mar)',
      ],
      foodHighlights: {
        mustTry: ['Kerala Parotta with Beef/Chicken Curry', 'Puttu with Kadala Curry', 'Fresh cardamom tea', 'Appam with Vegetable Stew', 'Local honey'],
        vegetarianOptions: ['Appam with vegetable stew', 'Puttu with banana', 'Dosa varieties', 'Fresh fruit juices'],
        indianFoodAvailable: true,
      },
      localTransport: {
        bus: 'KSRTC buses connect to Kochi (4hrs, ₹200)',
        auto: 'Auto-rickshaws within town ₹50-150',
        taxi: 'Taxi/jeep for sightseeing ₹1500-2500/day',
        tip: 'Renting a bike is great for tea plantation roads',
      },
      sortOrder: 14,
    },
  });

  const alleppey = await prisma.city.upsert({
    where: { slug: 'alleppey' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Alleppey (Alappuzha)',
      slug: 'alleppey',
      description: 'The backwater capital of Kerala where palm-fringed canals, floating markets, and traditional houseboats create one of India\'s most tranquil travel experiences. An overnight houseboat stay on Vembanad Lake is a bucket-list essential.',
      heroImageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1600',
      latitude: 9.4981,
      longitude: 76.3388,
      isCapital: false,
      avgDailyBudgetINR: 3000,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['south-india', 'backwaters', 'houseboat', 'nature', 'romantic'],
      safetyTips: [
        'Book houseboats through verified operators',
        'Mosquito repellent essential near backwaters',
        'Avoid swimming in canals',
        'Check houseboat safety equipment before boarding',
      ],
      foodHighlights: {
        mustTry: ['Kerala Fish Curry with red rice', 'Karimeen (pearl spot fish) fry', 'Appam with Egg Curry', 'Tapioca with fish', 'Toddy shop meals'],
        vegetarianOptions: ['Avial', 'Sambar rice', 'Thoran varieties', 'Banana chips'],
        indianFoodAvailable: true,
      },
      sortOrder: 15,
    },
  });

  const bengaluru = await prisma.city.upsert({
    where: { slug: 'bengaluru' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Bengaluru',
      slug: 'bengaluru',
      description: 'India\'s tech capital surprises with its leafy boulevards, craft beer scene, and proximity to stunning weekend getaways. A cosmopolitan city where filter coffee meets craft cocktails, and MG Road meets ancient temples.',
      heroImageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1600',
      latitude: 12.9716,
      longitude: 77.5946,
      isCapital: false,
      avgDailyBudgetINR: 3000,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['south-india', 'tech', 'food', 'nightlife', 'nature'],
      safetyTips: [
        'Bengaluru is generally safe — one of India\'s safest metros',
        'Traffic is notorious — use Namma Metro wherever possible',
        'Auto-rickshaws should use meter — insist on it or use Ola/Uber',
        'Carry an umbrella — weather can change quickly',
      ],
      foodHighlights: {
        mustTry: ['Masala Dosa at CTR/Vidyarthi Bhavan', 'Filter Coffee', 'Bisi Bele Bath', 'Mangalore Buns', 'Craft beer at Toit/Arbor'],
        vegetarianOptions: ['MTR (Mavalli Tiffin Rooms)', 'Vidyarthi Bhavan', 'CTR (Central Tiffin Room)', 'Brahmin\'s Coffee Bar'],
        indianFoodAvailable: true,
        topRestaurants: ['Vidyarthi Bhavan', 'MTR', 'Toit Brewpub', 'Meghana Foods', 'Karavalli at Taj'],
      },
      localTransport: {
        metro: 'Namma Metro (₹10-60)',
        bus: 'BMTC buses (₹15-50)',
        auto: 'Auto-rickshaws by meter (₹30+)',
        cab: 'Uber/Ola (₹100-400)',
        tip: 'Metro is fastest for key routes. Autos should use meter — insist on it.',
      },
      sortOrder: 16,
    },
  });

  const mysuru = await prisma.city.upsert({
    where: { slug: 'mysuru' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Mysuru',
      slug: 'mysuru',
      description: 'A regal city of illuminated palaces, sandalwood, and silk. Mysuru retains old-world charm with its grand Dasara celebrations, Chamundi Hills temple, and a food scene that gave the world the Mysore Pak.',
      heroImageUrl: 'https://images.unsplash.com/photo-1600112356190-4cf24e16b4b8?w=1600',
      latitude: 12.2958,
      longitude: 76.6394,
      isCapital: false,
      avgDailyBudgetINR: 1800,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['south-india', 'palaces', 'heritage', 'food', 'art'],
      safetyTips: [
        'Very safe city for tourists',
        'Rickshaw drivers may overcharge — use meter or negotiate beforehand',
        'Chamundi Hills road has sharp turns',
        'Watch for monkeys around Chamundi Temple',
      ],
      foodHighlights: {
        mustTry: ['Mysore Pak', 'Mysore Masala Dosa', 'Bisi Bele Bath', 'Filter Coffee', 'Chiroti'],
        vegetarianOptions: ['Hotel RRR', 'Mylari Dosa', 'Guru Sweet Mart', 'Vinayaka Mylari'],
        indianFoodAvailable: true,
      },
      sortOrder: 17,
    },
  });

  const chennai = await prisma.city.upsert({
    where: { slug: 'chennai' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Chennai',
      slug: 'chennai',
      description: 'The cultural capital of South India where ancient Dravidian temples meet colonial architecture, and the filter coffee is a religion. Chennai rewards those who look beyond its busy surface with a rich arts scene, Marina Beach sunrises, and some of India\'s best vegetarian food.',
      heroImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600',
      latitude: 13.0827,
      longitude: 80.2707,
      isCapital: false,
      avgDailyBudgetINR: 2500,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['south-india', 'temples', 'culture', 'food', 'beach'],
      safetyTips: [
        'Chennai is generally safe for travellers',
        'Auto-rickshaws notoriously don\'t use meters — agree fare first or use Ola/Uber',
        'Carry water and sunscreen — the heat and humidity are intense',
        'Marina Beach has strong currents — avoid swimming',
      ],
      foodHighlights: {
        mustTry: ['Filter Coffee', 'Idli at Murugan Idli Shop', 'Chettinad Chicken', 'Kothu Parotta', 'Jigarthanda (Madurai specialty)'],
        vegetarianOptions: ['Saravana Bhavan', 'Murugan Idli Shop', 'Ratna Cafe', 'Hot Chips'],
        indianFoodAvailable: true,
        topRestaurants: ['Saravana Bhavan', 'Murugan Idli Shop', 'Ponnusamy', 'Dakshin at ITC Grand Chola'],
      },
      localTransport: {
        metro: 'Chennai Metro (₹10-50)',
        local: 'Suburban trains (₹5-15)',
        bus: 'MTC buses (₹10-30)',
        auto: 'Auto-rickshaws (₹30+, meter rarely used)',
        cab: 'Uber/Ola (₹100-300)',
        tip: 'MRTS suburban rail is great for the coast. Autos notoriously don\'t use meters — agree fare first.',
      },
      sortOrder: 18,
    },
  });

  const pondicherry = await prisma.city.upsert({
    where: { slug: 'pondicherry' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Pondicherry',
      slug: 'pondicherry',
      description: 'A unique Indo-French coastal town where mustard-yellow colonial buildings line quiet boulevards, bougainvillea spills over walls, and café culture thrives alongside Tamil temples. Auroville, the experimental township, adds a spiritual dimension.',
      heroImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600',
      latitude: 11.9416,
      longitude: 79.8083,
      isCapital: false,
      avgDailyBudgetINR: 2500,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['south-india', 'french-quarter', 'beaches', 'cafes', 'spiritual'],
      safetyTips: [
        'Very safe for solo and women travellers',
        'Rent a bicycle for the French Quarter',
        'Rock Beach has strong currents — don\'t swim',
        'Carry ID to enter Auroville Matrimandir',
      ],
      foodHighlights: {
        mustTry: ['French croissants at Baker Street', 'Crepes at Café des Arts', 'Tamil fish curry', 'Tandoori at Le Club', 'Fresh seafood at Le Dupleix'],
        vegetarianOptions: ['Surguru', 'Auroville bakeries', 'Café des Arts (has veg options)', 'Sri Aurobindo Ashram dining hall (free meals!)'],
        indianFoodAvailable: true,
      },
      sortOrder: 19,
    },
  });

  const hampi = await prisma.city.upsert({
    where: { slug: 'hampi' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Hampi',
      slug: 'hampi',
      description: 'A surreal boulder-strewn landscape hiding the magnificent ruins of the Vijayanagara Empire — one of the richest cities in the medieval world. Hampi is where 14th-century temples meet hippie culture, and sunrise from Matanga Hill is unforgettable.',
      heroImageUrl: 'https://images.unsplash.com/photo-1590050751718-5346f21bcc0f?w=1600',
      latitude: 15.3350,
      longitude: 76.4601,
      isCapital: false,
      avgDailyBudgetINR: 1200,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['south-india', 'ruins', 'heritage', 'UNESCO', 'bouldering', 'offbeat'],
      safetyTips: [
        'Carry water — it gets extremely hot',
        'Wear sun protection and sturdy shoes',
        'Don\'t climb on fragile ruins',
        'Hippie Island (Virupapur Gaddi) accessed by coracle — avoid during monsoon',
      ],
      foodHighlights: {
        mustTry: ['Banana pancakes at Mango Tree', 'Thali meals', 'Fresh fruit shakes', 'Coconut water', 'Israeli food on Hippie Island'],
        vegetarianOptions: ['Most restaurants are vegetarian', 'Mango Tree', 'Tarana', 'Gopi Guesthouse'],
        indianFoodAvailable: true,
      },
      sortOrder: 20,
    },
  });

  // ── EAST / NORTHEAST INDIA ──────────────────────────────

  const kolkata = await prisma.city.upsert({
    where: { slug: 'kolkata' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Kolkata',
      slug: 'kolkata',
      description: 'India\'s cultural and intellectual capital — a city of grand colonial architecture, Nobel laureates, revolutionary art, and the finest street food in the country. From the flower markets of Howrah to the literary cafés of College Street, Kolkata wears its heart on its sleeve.',
      heroImageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1600',
      latitude: 22.5726,
      longitude: 88.3639,
      isCapital: false,
      avgDailyBudgetINR: 2000,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['east-northeast-india', 'culture', 'food', 'art', 'literature', 'colonial'],
      safetyTips: [
        'Kolkata is one of India\'s safest metros — friendly and welcoming',
        'Yellow taxis should use meter — insist on it',
        'Carry cash for street food — most vendors don\'t accept cards',
        'Avoid the crowded Howrah Bridge on foot during rush hour',
      ],
      foodHighlights: {
        mustTry: ['Kathi Roll at Nizam\'s', 'Mishti Doi', 'Rasgulla at KC Das', 'Fish Curry Rice', 'Puchka (phuchka)', 'Kosha Mangsho'],
        vegetarianOptions: ['Bhojohori Manna', 'Kookie Jar', 'Balaram Mullick sweets', 'Flurys on Park Street'],
        indianFoodAvailable: true,
        topRestaurants: ['Peter Cat (Chelo Kebab)', 'Oh! Calcutta', 'Bhojohori Manna', '6 Ballygunge Place'],
      },
      localTransport: {
        metro: 'Kolkata Metro — India\'s first metro (₹5-25)',
        tram: 'Heritage trams (₹10)',
        bus: 'CSTC/private buses (₹10-30)',
        auto: 'Auto-rickshaws (₹20+)',
        cab: 'Uber/Ola or Yellow Ambassador taxis',
        hand: 'Hand-pulled rickshaws in North Kolkata (unique to Kolkata)',
        tip: 'Metro is the fastest. Yellow taxis should use meter — insist on it.',
      },
      sortOrder: 21,
    },
  });

  const darjeeling = await prisma.city.upsert({
    where: { slug: 'darjeeling' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Darjeeling',
      slug: 'darjeeling',
      description: 'A colonial-era hill station perched at 2,000m with jaw-dropping views of Kanchenjunga, the world\'s third-highest peak. Famous for its UNESCO toy train, premium tea gardens, and a vibe that blends British nostalgia with Tibetan-Nepali culture.',
      heroImageUrl: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?w=1600',
      latitude: 27.0360,
      longitude: 88.2627,
      isCapital: false,
      avgDailyBudgetINR: 1800,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['east-northeast-india', 'tea', 'mountains', 'toy-train', 'colonial', 'nature'],
      safetyTips: [
        'Carry warm layers year-round',
        'Altitude 2000m — light acclimatization recommended',
        'Toy train books out fast — reserve early',
        'Roads can be foggy — avoid night driving',
      ],
      foodHighlights: {
        mustTry: ['Darjeeling tea at a garden', 'Momos (steamed and fried)', 'Thukpa (Tibetan noodle soup)', 'Churpi (yak cheese)', 'Keventers milkshake'],
        vegetarianOptions: ['Kunga Restaurant', 'Glenary\'s Bakery', 'Sonam\'s Kitchen', 'Gatty\'s Cafe'],
        indianFoodAvailable: true,
      },
      sortOrder: 22,
    },
  });

  const gangtok = await prisma.city.upsert({
    where: { slug: 'gangtok' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Gangtok',
      slug: 'gangtok',
      description: 'The capital of Sikkim, perched on a misty ridge with views of Kanchenjunga. A clean, well-organized town that serves as the gateway to Tsomgo Lake, Nathula Pass (India-China border), and some of India\'s most pristine mountain landscapes.',
      heroImageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600',
      latitude: 27.3389,
      longitude: 88.6065,
      isCapital: false,
      avgDailyBudgetINR: 2500,
      budgetTier: 'moderate',
      status: ContentStatus.PUBLISHED,
      tags: ['east-northeast-india', 'mountains', 'monasteries', 'lakes', 'nature', 'adventure'],
      safetyTips: [
        'Protected Area Permit needed for Nathula, Tsomgo — arrange through hotel/tour operator',
        'Altitude up to 4300m at Nathula — carry AMS medication',
        'Carry cash — ATMs unreliable in remote areas',
        'Road conditions can deteriorate rapidly in monsoon',
      ],
      foodHighlights: {
        mustTry: ['Momos (every variety)', 'Thukpa', 'Gundruk (fermented leafy greens)', 'Sael Roti', 'Tongba (millet beer)'],
        vegetarianOptions: ['The Coffee Shop', 'Taste of Tibet', 'Roll House', 'Baker\'s Cafe'],
        indianFoodAvailable: true,
      },
      sortOrder: 23,
    },
  });

  const shillong = await prisma.city.upsert({
    where: { slug: 'shillong' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Shillong',
      slug: 'shillong',
      description: 'The rock music capital of India set in misty pine-clad hills. Shillong is the gateway to Meghalaya\'s spectacular living root bridges, the cleanest village in Asia (Mawlynnong), and Dawki\'s crystal-clear river. A perfect blend of nature, Khasi culture, and indie music.',
      heroImageUrl: 'https://images.unsplash.com/photo-1598586124540-21a15e71e012?w=1600',
      latitude: 25.5788,
      longitude: 91.8933,
      isCapital: false,
      avgDailyBudgetINR: 2000,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['east-northeast-india', 'nature', 'waterfalls', 'living-root-bridges', 'offbeat', 'music'],
      safetyTips: [
        'Carry rain gear — Cherrapunji nearby is the wettest place on earth',
        'Living root bridges require moderate fitness and good shoes',
        'ILP not needed for Meghalaya but needed for Nagaland side trips',
        'Roads to Dawki can be slippery in monsoon',
      ],
      foodHighlights: {
        mustTry: ['Jadoh (red rice with pork)', 'Doh Khlieh (pork salad)', 'Tungrymbai (fermented soybean)', 'Momos', 'Black sesame sweets'],
        vegetarianOptions: ['City Hut Dhaba', 'Lamee Restaurant', 'Delhi Mistan Bhandar', 'Café Shillong'],
        indianFoodAvailable: true,
      },
      sortOrder: 24,
    },
  });

  // ── WEST INDIA (continued) ─────────────────────────────

  const ahmedabad = await prisma.city.upsert({
    where: { slug: 'ahmedabad' },
    update: {},
    create: {
      countryId: india.id,
      name: 'Ahmedabad',
      slug: 'ahmedabad',
      description: 'India\'s first UNESCO World Heritage City — a living museum of Indo-Islamic architecture, intricately carved pols (traditional houses), Mahatma Gandhi\'s Sabarmati Ashram, and what may be the best vegetarian street food scene in the world. The city where food is a way of life.',
      heroImageUrl: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1600',
      latitude: 23.0225,
      longitude: 72.5714,
      isCapital: false,
      avgDailyBudgetINR: 1800,
      budgetTier: 'budget',
      status: ContentStatus.PUBLISHED,
      tags: ['west-india', 'heritage', 'food', 'UNESCO', 'vegetarian', 'textile'],
      safetyTips: [
        'Ahmedabad is a dry city — alcohol is prohibited',
        'Traffic can be chaotic — use BRTS or Ola/Uber',
        'Summers are extremely hot (45°C+) — avoid midday outdoor activities',
        'Carry cash for street food — most vendors don\'t accept cards',
      ],
      foodHighlights: {
        mustTry: ['Dhokla', 'Fafda-Jalebi (Sunday breakfast tradition)', 'Undhiyu (winter specialty)', 'Dabeli', 'Khaman', 'Handvo'],
        vegetarianOptions: ['Almost EVERYTHING — Ahmedabad is 90%+ vegetarian!', 'Manek Chowk night market', 'Lucky Restaurant', 'Vishalla (traditional thali)', 'Das Khaman'],
        indianFoodAvailable: true,
        topRestaurants: ['Vishalla', 'Agashiye at House of MG', 'Manek Chowk night market', 'Lucky Restaurant'],
      },
      localTransport: {
        bus: 'AMTS and BRTS (₹10-30) — BRTS is excellent',
        auto: 'Auto-rickshaws (₹20-100, shared autos common)',
        cab: 'Uber/Ola (₹80-250)',
        bike: 'Cycle sharing stations at BRTS stops',
        tip: 'BRTS (Bus Rapid Transit) is modern and efficient. Shared autos are the local way.',
      },
      sortOrder: 25,
    },
  });

  console.log('✅ All 25 Indian cities seeded successfully!');

  // ── POIs: DELHI ──────────────────────────────────────────
  console.log('📍 Seeding Delhi POIs...');

  const delhiPois = [
    {
      slug: 'red-fort-delhi',
      name: 'Red Fort',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monument',
      description: 'The Red Fort (Lal Qila) is a UNESCO World Heritage Site and the crowning achievement of Mughal architecture in Delhi. Built in 1639–48 by Shah Jahan, this massive red sandstone citadel served as the residence of Mughal emperors for nearly 200 years. The Lahore Gate, Diwan-i-Am (Hall of Public Audiences), Diwan-i-Khas (Hall of Private Audiences), and the elegant Rang Mahal are must-sees. Every 15th August, the Prime Minister hoists the national flag here.',
      shortDescription: 'UNESCO Mughal citadel where India\'s PM hoists the flag every Independence Day',
      latitude: 28.6562,
      longitude: 77.2410,
      avgDurationMins: 120,
      avgCostINR: 35,
      bestTimeToVisit: 'Morning or late afternoon for pleasant light and fewer crowds',
      tags: ['UNESCO', 'Mughal', 'monument', 'must-visit', 'history', 'photography'],
      tips: ['Enter from Lahore Gate — it is the main entrance', 'Light & Sound show at 7pm in winter, 7:30pm in summer', 'Closed on Mondays', 'Audio guide available for ₹100'],
    },
    {
      slug: 'qutub-minar-delhi',
      name: 'Qutub Minar',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monument',
      description: 'At 72.5 metres, Qutub Minar is the tallest brick minaret in the world and a UNESCO World Heritage Site. Built in 1193 by Qutb-ud-din Aibak to celebrate the beginning of Muslim rule in India, the tower features intricate carvings of Quranic verses and decorative motifs. The surrounding Qutub Complex includes the mysterious Iron Pillar (1,600+ years old and rust-free) and the ruins of India\'s first mosque, Quwwat-ul-Islam.',
      shortDescription: 'UNESCO site — world\'s tallest brick minaret with a 1,600-year-old rust-free Iron Pillar',
      latitude: 28.5245,
      longitude: 77.1855,
      avgDurationMins: 90,
      avgCostINR: 35,
      bestTimeToVisit: 'Morning for best light and comfortable temperatures',
      tags: ['UNESCO', 'monument', 'must-visit', 'history', 'architecture', 'photography'],
      tips: ['Entry to climb the tower is no longer permitted', 'Do not miss the Iron Pillar — it has not rusted in over 1,600 years', 'Combine with Mehrauli Archaeological Park nearby', 'Metro: Qutub Minar station on Yellow Line'],
    },
    {
      slug: 'humayuns-tomb-delhi',
      name: 'Humayun\'s Tomb',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monument',
      description: 'Built in 1570, Humayun\'s Tomb is the first garden-tomb on the Indian subcontinent and a direct precursor to the Taj Mahal. This UNESCO World Heritage Site features stunning Persian-influenced architecture — a grand double dome, charbagh (four-quartered) garden, and intricate lattice work. The complex also houses the tombs of several other Mughal rulers. Recently restored by the Aga Khan Trust, the gardens and monument are in immaculate condition.',
      shortDescription: 'UNESCO garden-tomb that inspired the Taj Mahal — pristine Mughal architecture',
      latitude: 28.5933,
      longitude: 77.2507,
      avgDurationMins: 90,
      avgCostINR: 35,
      bestTimeToVisit: 'Late afternoon for golden light on the sandstone',
      tags: ['UNESCO', 'Mughal', 'monument', 'garden', 'architecture', 'photography', 'must-visit'],
      tips: ['The restoration by Aga Khan Trust is world-class — the gardens are beautiful', 'Visit nearby Nizamuddin Dargah and Hazrat Nizamuddin Basti for qawwali in the evening', 'Metro: JLN Stadium station on Violet Line'],
    },
    {
      slug: 'chandni-chowk-delhi',
      name: 'Chandni Chowk',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Market/Street Food',
      description: 'Asia\'s oldest and busiest market, Chandni Chowk is the pulsating heart of Old Delhi. This 17th-century bazaar built by Shah Jahan is a sensory overload of narrow lanes, spice shops, jewellery stores, and legendary street food. Paranthe Wali Gali (paratha alley), Natraj Dahi Bhalle, Kuremal Mohan Lal (kulfi), and Old Famous Jalebi Wala are iconic institutions. The lane specialisation (one lane for wedding cards, another for electronics, another for spices) is quintessential Delhi.',
      shortDescription: 'Old Delhi\'s legendary 17th-century bazaar — India\'s ultimate street food destination',
      latitude: 28.6506,
      longitude: 77.2304,
      avgDurationMins: 180,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning (10am–1pm) for food and shopping; evenings for atmospheric walks',
      tags: ['street-food', 'market', 'shopping', 'Old-Delhi', 'must-visit', 'spices', 'heritage'],
      tips: ['Start from Red Fort end and walk towards Fatehpuri Mosque', 'Try Paranthe Wali Gali for stuffed paranthas (₹80–150)', 'Wear comfortable shoes — expect crowds and uneven surfaces', 'Shops close on Sundays'],
    },
    {
      slug: 'india-gate-delhi',
      name: 'India Gate',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Landmark',
      description: 'India\'s most iconic war memorial, India Gate is a 42-metre-high stone arch on Rajpath (now Kartavya Path), commemorating 70,000 Indian soldiers who died in World War I and the Afghan Wars. The Amar Jawan Jyoti (eternal flame) burns at its base. The surrounding Kartavya Path lawns are a beloved gathering spot for Delhi families, especially on pleasant evenings. The newly inaugurated National War Memorial adjacent adds to the experience.',
      shortDescription: 'India\'s iconic 42-metre war memorial arch — Delhi\'s most beloved gathering spot',
      latitude: 28.6129,
      longitude: 77.2295,
      avgDurationMins: 45,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening for illumination and pleasant weather; early morning for peaceful walks',
      tags: ['landmark', 'free', 'evening', 'family-friendly', 'iconic', 'photography'],
      tips: ['Beautifully illuminated at night', 'Visit the adjacent National War Memorial (free entry, carry ID)', 'Ice cream and snack vendors around — try the matka kulfi', 'Best accessed via Central Secretariat Metro station'],
    },
  ];

  for (const poi of delhiPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: newDelhi.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: JAIPUR ────────────────────────────────────────────
  console.log('📍 Seeding Jaipur POIs...');

  const jaipurPois = [
    {
      slug: 'amber-fort-jaipur',
      name: 'Amber Fort',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Fort',
      description: 'Perched on a hilltop overlooking Maota Lake, Amber Fort (Amer Fort) is the grandest of Jaipur\'s royal forts and a UNESCO World Heritage Site. Built in 1592 by Raja Man Singh I, the fort is a stunning fusion of Rajput and Mughal architecture — the Sheesh Mahal (Hall of Mirrors), Ganesh Pol gate, and Sukh Niwas (pleasure palace with a natural air-cooling system) are extraordinary. The views from the ramparts over the Aravalli hills are breathtaking.',
      shortDescription: 'UNESCO hilltop fort with the dazzling Sheesh Mahal (Hall of Mirrors)',
      latitude: 26.9855,
      longitude: 75.8513,
      avgDurationMins: 180,
      avgCostINR: 200,
      bestTimeToVisit: 'Morning to avoid afternoon heat; evening Light & Sound show is excellent',
      tags: ['UNESCO', 'fort', 'must-visit', 'Rajput', 'photography', 'history', 'architecture'],
      tips: ['Walk up the cobbled path or take a jeep (₹500) — skip the elephant rides (animal welfare concern)', 'Sheesh Mahal is stunning — light a match and watch thousands of reflections', 'Combine with Jaigarh Fort (connected by a tunnel walk)', 'Light & Sound show in the evening (₹200)'],
    },
    {
      slug: 'hawa-mahal-jaipur',
      name: 'Hawa Mahal',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monument',
      description: 'The Palace of Winds is Jaipur\'s most iconic landmark — a five-storey pink sandstone facade with 953 small windows (jharokhas) designed in 1799 so that royal women could observe street festivals without being seen. The honeycomb-like structure creates a natural breeze (hawa) through the windows. The view from the top floors overlooking Johari Bazaar and the City Palace is quintessential Jaipur.',
      shortDescription: 'Jaipur\'s iconic five-storey Palace of Winds with 953 latticed windows',
      latitude: 26.9239,
      longitude: 75.8267,
      avgDurationMins: 60,
      avgCostINR: 200,
      bestTimeToVisit: 'Early morning when the sun illuminates the facade in golden light',
      tags: ['iconic', 'monument', 'must-visit', 'photography', 'architecture', 'pink-city'],
      tips: ['Best photos from across the street at the Wind View Café', 'The inside is smaller than it looks — 30-60 minutes is enough', 'Combine with City Palace and Jantar Mantar (walking distance)', 'Included in Jaipur composite ticket (₹500 for 7 monuments)'],
    },
    {
      slug: 'city-palace-jaipur',
      name: 'City Palace',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Palace',
      description: 'The City Palace is a magnificent complex of courtyards, gardens, and buildings that blends Rajasthani and Mughal architecture. Part of the palace is still the residence of the Jaipur royal family — making it one of the few "living palaces" in India. The Mubarak Mahal, Diwan-i-Khas, Pitam Niwas Chowk (with its four stunning painted gates representing four seasons), and the textile and arms museum are highlights.',
      shortDescription: 'Living royal palace with stunning courtyard gates and a world-class museum',
      latitude: 26.9260,
      longitude: 75.8235,
      avgDurationMins: 120,
      avgCostINR: 500,
      bestTimeToVisit: 'Morning or late afternoon for comfortable temperatures',
      tags: ['palace', 'must-visit', 'museum', 'Rajput', 'royal', 'architecture', 'photography'],
      tips: ['The ₹500 entry includes the museum — worth every rupee', 'The four gates of Pitam Niwas Chowk (Peacock Gate is most famous) are incredibly photogenic', 'Guided tours available (₹200–500)', 'Audio guide available for ₹150'],
    },
    {
      slug: 'nahargarh-fort-jaipur',
      name: 'Nahargarh Fort',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Fort',
      description: 'Perched on the edge of the Aravalli Hills overlooking the entire city of Jaipur, Nahargarh Fort is the city\'s best sunset viewpoint. Built in 1734 as a retreat for the Maharaja, the fort features a unique set of suites (Madhavendra Bhawan) — each identically designed for the king\'s queens. The Padao restaurant at the fort serves Rajasthani cuisine with panoramic city views. The drive up to the fort through the hills is scenic.',
      shortDescription: 'Aravalli hilltop fort with Jaipur\'s best panoramic sunset views',
      latitude: 26.9387,
      longitude: 75.8150,
      avgDurationMins: 120,
      avgCostINR: 200,
      bestTimeToVisit: 'Late afternoon for sunset — the city lights up beautifully as the sun sets',
      tags: ['fort', 'sunset', 'views', 'photography', 'romantic', 'panoramic'],
      tips: ['Go for sunset — the views over Jaipur are spectacular', 'Padao restaurant at the fort is great for chai and snacks with a view', 'You can walk up from Jaipur (steep 2km path from Nahargarh Road) or drive/taxi', 'Combine with Jaigarh Fort (adjacent hilltop)'],
    },
    {
      slug: 'johari-bazaar-jaipur',
      name: 'Johari Bazaar',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Market',
      description: 'Jaipur\'s most famous jewellery and textile market, Johari Bazaar is a vibrant stretch of pink-painted shops selling everything from precious gemstones (Jaipur is India\'s gem-cutting capital) to Kundan jewellery, Bandhani textiles, lac bangles, and traditional Rajasthani sweets. The street food — pyaaz kachori, ghewar, and lassi — is legendary. The bazaar has been a trading hub for over 200 years.',
      shortDescription: 'Jaipur\'s iconic gemstone and jewellery bazaar with legendary Rajasthani street food',
      latitude: 26.9189,
      longitude: 75.8234,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'Late morning or evening when the bazaar is bustling',
      tags: ['market', 'shopping', 'jewellery', 'street-food', 'textiles', 'gems', 'bazaar'],
      tips: ['Bargain hard — start at 40% of the quoted price for non-fixed shops', 'LMB (Laxmi Mishthan Bhandar) is a legendary sweet and snack institution on this street', 'Do not buy expensive gemstones without verification — ask for a certificate', 'Closed on Sundays'],
    },
  ];

  for (const poi of jaipurPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: jaipur.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: AGRA ──────────────────────────────────────────────
  console.log('📍 Seeding Agra POIs...');

  const agraPois = [
    {
      slug: 'taj-mahal-agra',
      name: 'Taj Mahal',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monument',
      description: 'The Taj Mahal needs no introduction — it is the world\'s most iconic monument to love, a UNESCO World Heritage Site, and one of the New Seven Wonders of the World. Built by Mughal Emperor Shah Jahan between 1631–1648 in memory of his wife Mumtaz Mahal, the white marble mausoleum changes colour with the light — pink at dawn, white at noon, and golden at sunset. The symmetry, pietra dura inlay work, and the surrounding Mughal gardens are architectural perfection.',
      shortDescription: 'The world\'s most iconic monument to love — UNESCO and New Seven Wonders',
      latitude: 27.1751,
      longitude: 78.0421,
      avgDurationMins: 180,
      avgCostINR: 50,
      bestTimeToVisit: 'Sunrise for the most magical experience — the Taj glows pink, then turns white',
      tags: ['UNESCO', 'must-visit', 'Mughal', 'wonder-of-the-world', 'photography', 'romantic', 'iconic'],
      tips: ['Arrive before sunrise at the East Gate for the shortest queue', 'Closed on Fridays (open only for prayers)', 'No tripods, food, or tobacco allowed inside', 'Shoe covers provided — or leave shoes at the entrance', 'Full moon nights offer ticketed visits (book on ASI website)'],
    },
    {
      slug: 'agra-fort-agra',
      name: 'Agra Fort',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Fort',
      description: 'This massive UNESCO World Heritage Site — a 94-acre red sandstone and white marble fortress — was the seat of the Mughal Empire for generations. Emperor Akbar began construction in 1565, and Shah Jahan later added the exquisite marble palaces. Tragically, Shah Jahan spent his last eight years imprisoned here by his son Aurangzeb, gazing at the Taj Mahal from the octagonal Musamman Burj tower. That poignant view of the Taj from the fort is one of India\'s most moving sights.',
      shortDescription: 'UNESCO Mughal fortress where Shah Jahan gazed at the Taj from captivity',
      latitude: 27.1795,
      longitude: 78.0211,
      avgDurationMins: 120,
      avgCostINR: 50,
      bestTimeToVisit: 'Morning or late afternoon for comfortable temperatures and good light',
      tags: ['UNESCO', 'fort', 'must-visit', 'Mughal', 'history', 'architecture', 'photography'],
      tips: ['The view of the Taj Mahal from Musamman Burj is extraordinary', 'Only about a third of the fort is open to visitors — the rest is an army base', 'Combine with the Taj Mahal in the same day — they are 2.5 km apart', 'Audio guide available for ₹100'],
    },
    {
      slug: 'mehtab-bagh-agra',
      name: 'Mehtab Bagh',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Garden',
      description: 'Mehtab Bagh (Moonlight Garden) sits directly across the Yamuna River from the Taj Mahal and offers the best sunset view of the Taj — the white marble glowing golden-orange against the sky is unforgettable. This 25-acre charbagh garden was originally built by Emperor Babur and is aligned perfectly with the Taj Mahal. It is believed that Shah Jahan intended to build a black marble twin of the Taj here.',
      shortDescription: 'Garden with the best sunset view of the Taj Mahal across the Yamuna River',
      latitude: 27.1820,
      longitude: 78.0395,
      avgDurationMins: 60,
      avgCostINR: 30,
      bestTimeToVisit: 'Sunset — the Taj turns golden-orange and reflects in the Yamuna',
      tags: ['garden', 'sunset', 'Taj-view', 'photography', 'romantic', 'peaceful'],
      tips: ['This is THE spot for sunset Taj Mahal photos', 'Much less crowded than the Taj itself', 'Bring a good zoom lens for photography', 'Combined ticket with the Taj Mahal gives a discount'],
    },
    {
      slug: 'fatehpur-sikri-agra',
      name: 'Fatehpur Sikri',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monument',
      description: 'The abandoned Mughal city of Fatehpur Sikri, 37 km from Agra, is one of the best-preserved examples of Mughal town planning. Built by Emperor Akbar in 1571 as his new capital, it was mysteriously abandoned after just 14 years — possibly due to water scarcity. The Buland Darwaza (Victory Gate) at 54 metres is the highest gateway in the world. The Panch Mahal, Jodha Bai\'s Palace, and the Tomb of Salim Chishti (with exquisite marble lattice screens) are highlights.',
      shortDescription: 'Abandoned Mughal ghost city with the world\'s highest gateway — Buland Darwaza',
      latitude: 27.0940,
      longitude: 77.6608,
      avgDurationMins: 150,
      avgCostINR: 50,
      bestTimeToVisit: 'Morning for cooler temperatures — the site is largely exposed to the sun',
      tags: ['UNESCO', 'Mughal', 'monument', 'history', 'architecture', 'ghost-city', 'photography'],
      tips: ['37 km from Agra — hire a taxi (₹800–1200 round trip) or take a bus from Agra Fort bus stand', 'The Tomb of Salim Chishti has stunning marble jali (lattice) work — tie a thread for wish fulfilment', 'Hire an ASI-certified guide at the entrance (₹200–500)', 'Carry water and sun protection — limited shade'],
    },
  ];

  for (const poi of agraPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: agra.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.6,
        ratingCount: Math.floor(Math.random() * 300) + 100,
      },
    });
  }

  // ── POIs: VARANASI ──────────────────────────────────────────
  console.log('📍 Seeding Varanasi POIs...');

  const varanasiPois = [
    {
      slug: 'dashashwamedh-ghat-varanasi',
      name: 'Dashashwamedh Ghat (Ganga Aarti)',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Religious/Cultural',
      description: 'The most famous ghat in Varanasi and the site of the spectacular Ganga Aarti — a choreographed fire ceremony performed every evening at sunset by a group of priests wielding large brass lamps, camphor flames, and incense. The ceremony, accompanied by chanting and bells, attracts thousands of devotees and travellers. Watching the Aarti from a boat on the Ganges as flames reflect on the water is one of India\'s most powerful spiritual experiences.',
      shortDescription: 'Varanasi\'s iconic evening fire ceremony on the Ganges — India\'s most powerful ritual',
      latitude: 25.3046,
      longitude: 83.0108,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening — Ganga Aarti starts at 6:45pm (winter) or 7pm (summer)',
      tags: ['spiritual', 'must-visit', 'ceremony', 'Ganga', 'free', 'photography', 'iconic'],
      tips: ['Arrive 30–45 minutes early to secure a good viewing spot', 'Best view is from a boat on the river (₹150–300 per person)', 'The ghat steps also offer a good view — sit on the upper levels', 'Photography is welcome — the ceremony is incredibly photogenic'],
    },
    {
      slug: 'sunrise-boat-ride-varanasi',
      name: 'Sunrise Boat Ride on the Ganges',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      subcategory: 'Experience',
      description: 'A sunrise boat ride on the Ganges is the quintessential Varanasi experience. As the first light breaks over the eastern bank, the entire ghats come alive — pilgrims bathing in the sacred waters, sadhus performing yoga, dhobi wallahs washing clothes, and the smoke from the cremation ghats drifting over the river. The row along 84 ghats stretching 6 km reveals the extraordinary spectrum of life and death that defines this ancient city.',
      shortDescription: 'Dawn boat ride along 84 ghats — the quintessential Varanasi spiritual experience',
      latitude: 25.3100,
      longitude: 83.0100,
      avgDurationMins: 120,
      avgCostINR: 250,
      bestTimeToVisit: 'Pre-dawn — boats leave around 5:30am (winter) or 5am (summer)',
      tags: ['sunrise', 'boat', 'must-do', 'spiritual', 'Ganga', 'photography', 'ghats'],
      tips: ['Negotiate boat price before boarding — ₹200–300 per person for a shared boat, ₹500–800 for private', 'The ride covers Assi Ghat to Manikarnika Ghat — about 90 minutes', 'Bring a camera — the light is extraordinary', 'Dress warmly in winter — mornings on the river are cold'],
    },
    {
      slug: 'kashi-vishwanath-temple-varanasi',
      name: 'Kashi Vishwanath Temple',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Temple',
      description: 'One of the twelve Jyotirlingas and the most sacred Shiva temple in India, Kashi Vishwanath has been the spiritual heart of Varanasi for millennia. The current structure was built in 1780 by Ahilyabai Holkar, and the gold plating on the spire (800 kg of gold donated by Maharaja Ranjit Singh) gives it the name "Golden Temple." The newly inaugurated Kashi Vishwanath Corridor has transformed the temple surroundings with a grand approach corridor, ghats, and gardens.',
      shortDescription: 'India\'s holiest Shiva temple with the grand new Kashi Vishwanath Corridor',
      latitude: 25.3109,
      longitude: 83.0107,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning (4–6am) for mangala aarti; avoid peak afternoon hours',
      tags: ['temple', 'spiritual', 'Shiva', 'must-visit', 'pilgrimage', 'free', 'Jyotirlinga'],
      tips: ['Carry only your phone and wallet — bags, electronics, and shoes must be deposited at counters', 'The new Kashi Vishwanath Corridor has modern facilities and a clean approach path', 'Queues can be 1–3 hours during festivals — plan accordingly', 'Dress modestly and be respectful of worshippers'],
    },
    {
      slug: 'sarnath-varanasi',
      name: 'Sarnath',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Archaeological',
      description: 'Sarnath, 10 km from Varanasi, is where Lord Buddha delivered his first sermon after attaining enlightenment — making it one of the four holiest Buddhist pilgrimage sites in the world. The Dhamek Stupa (34 metres high, 5th century), the Ashoka Pillar (whose lion capital is India\'s national emblem), the Mulagandhakuti Vihara (with stunning Japanese-painted frescoes), and the excellent Archaeological Museum create a peaceful, profoundly historical experience.',
      shortDescription: 'Where Buddha gave his first sermon — Dhamek Stupa and India\'s national emblem origin',
      latitude: 25.3812,
      longitude: 83.0228,
      avgDurationMins: 120,
      avgCostINR: 25,
      bestTimeToVisit: 'Morning for a peaceful experience; the gardens and ruins are lovely in soft light',
      tags: ['Buddhist', 'archaeological', 'history', 'museum', 'peaceful', 'UNESCO-tentative', 'spiritual'],
      tips: ['The Archaeological Museum has the original Ashoka Lion Capital (India\'s national emblem) — do not miss it', 'Hire an auto from Varanasi (₹200–300 one way) or take a shared auto from Varanasi Junction', 'The Mulagandhakuti Vihara has beautiful frescoes painted by a Japanese artist', 'Plan 2–3 hours to see everything properly'],
    },
    {
      slug: 'assi-ghat-varanasi',
      name: 'Assi Ghat',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Cultural',
      description: 'The southernmost of Varanasi\'s main ghats, Assi Ghat is where the Assi River meets the Ganges and is considered one of the five ghats essential for a sacred Varanasi pilgrimage (Panchganga). Unlike the busier ghats to the north, Assi has a more relaxed, bohemian vibe — it is popular with musicians, writers, and university students from the nearby BHU campus. The morning subah-e-banaras cultural program and the small evening aarti are beautiful.',
      shortDescription: 'Varanasi\'s bohemian southern ghat — live music, cafes, and intimate evening aarti',
      latitude: 25.2876,
      longitude: 83.0037,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning for the subah-e-banaras program; evening for the intimate aarti',
      tags: ['ghat', 'cultural', 'relaxed', 'free', 'morning', 'music', 'local-experience'],
      tips: ['Many of the best guesthouses and cafés in Varanasi are near Assi Ghat', 'The morning subah-e-banaras program features classical music and yoga', 'Great starting point for a ghat walk northward', 'Brown Bread Bakery nearby has excellent rooftop views'],
    },
  ];

  for (const poi of varanasiPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: varanasi.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 200) + 60,
      },
    });
  }

  // ── POIs: UDAIPUR ───────────────────────────────────────────
  console.log('📍 Seeding Udaipur POIs...');

  const udaipurPois = [
    {
      slug: 'city-palace-udaipur',
      name: 'City Palace',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Palace',
      description: 'Udaipur\'s City Palace is Rajasthan\'s largest palace complex — a magnificent fusion of Rajasthani and Mughal architecture built over 400 years by 22 successive Maharanas. Overlooking Lake Pichola, the palace features ornate balconies, towers, cupolas, and courtyards adorned with colourful mosaics, mirrors, and miniature paintings. The museum inside houses a stunning collection of royal artefacts, vintage cars, and crystal gallery items.',
      shortDescription: 'Rajasthan\'s largest palace complex overlooking Lake Pichola — 400 years of royal history',
      latitude: 24.5764,
      longitude: 73.6915,
      avgDurationMins: 150,
      avgCostINR: 300,
      bestTimeToVisit: 'Morning for cooler temperatures; evening Light & Sound show is excellent',
      tags: ['palace', 'must-visit', 'museum', 'royal', 'lake-view', 'architecture', 'photography'],
      tips: ['The Crystal Gallery (separate ₹700 ticket) houses one of the world\'s largest private crystal collections', 'The views of Lake Pichola from the upper terraces are stunning', 'Allow 2–3 hours to explore the museum thoroughly', 'Evening Light & Sound show (₹250) tells the history of the Mewar dynasty'],
    },
    {
      slug: 'lake-pichola-boat-ride-udaipur',
      name: 'Lake Pichola Boat Ride',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Experience',
      description: 'A boat ride on Lake Pichola is the defining Udaipur experience. The serene artificial lake, created in 1362, is flanked by palaces, temples, havelis, and the Aravalli hills. The ride takes you past Jag Niwas (now the Taj Lake Palace hotel — one of the world\'s most romantic hotels) and Jag Mandir (island palace). At sunset, the reflections of the City Palace and the surrounding ghats on the still water are truly magical.',
      shortDescription: 'Sunset boat ride past floating palaces on Rajasthan\'s most romantic lake',
      latitude: 24.5726,
      longitude: 73.6816,
      avgDurationMins: 90,
      avgCostINR: 400,
      bestTimeToVisit: 'Late afternoon — the sunset over the Aravalli hills is unforgettable',
      tags: ['lake', 'boat', 'sunset', 'romantic', 'must-do', 'photography', 'scenic'],
      tips: ['Government boat service from Bansi Ghat or City Palace jetty — ₹400–800 per person', 'The sunset ride is most popular — book early or arrive 30 minutes before', 'Jag Mandir island has a café where you can stop and explore', 'Private boats available for couples (₹2000–3000 for 1 hour)'],
    },
    {
      slug: 'jagdish-temple-udaipur',
      name: 'Jagdish Temple',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Temple',
      description: 'Built in 1651 by Maharana Jagat Singh I, Jagdish Temple is the largest and most beautiful temple in Udaipur. Dedicated to Lord Vishnu (as Jagannath), the Indo-Aryan style temple features an intricately carved exterior with elephants, horsemen, and celestial musicians. The 24-metre-high shikhara (spire) dominates the old city skyline. The temple is still an active place of worship with daily aarti ceremonies.',
      shortDescription: 'Udaipur\'s largest temple — exquisitely carved Indo-Aryan architecture since 1651',
      latitude: 24.5777,
      longitude: 73.6906,
      avgDurationMins: 45,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning or evening aarti for an authentic experience',
      tags: ['temple', 'free', 'architecture', 'spiritual', 'heritage', 'carved'],
      tips: ['Located steps away from City Palace — combine both visits', 'Evening aarti is atmospheric with chanting and bells', 'The carvings on the exterior walls are extremely detailed — take your time', 'Remove shoes before entering; dress modestly'],
    },
    {
      slug: 'saheliyon-ki-bari-udaipur',
      name: 'Saheliyon Ki Bari',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Garden',
      description: 'The Garden of the Maidens is a charming ornamental garden built by Maharana Sangram Singh II in the 18th century for the 48 women attendants who came as part of a royal dowry. The garden features elegant fountains (including lotus-pool fountains imported from England), marble elephants, kiosks, and a delicate rain fountain that creates a cooling mist — a marvel of Rajasthani garden engineering. A peaceful escape from the city.',
      shortDescription: '18th-century royal pleasure garden with elegant fountains and marble elephants',
      latitude: 24.5913,
      longitude: 73.6918,
      avgDurationMins: 60,
      avgCostINR: 50,
      bestTimeToVisit: 'Morning when the fountains are running and the garden is peaceful',
      tags: ['garden', 'peaceful', 'fountains', 'royal', 'photography', 'heritage'],
      tips: ['The rain fountain pavilion is the highlight — water sprays from the ceiling like rain', 'Small but beautiful — 45–60 minutes is enough', 'Good for a morning walk before visiting the main attractions', 'The adjacent museum has a small but interesting collection'],
    },
  ];

  for (const poi of udaipurPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: udaipur.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 180) + 60,
      },
    });
  }

  // ── POIs: JODHPUR ───────────────────────────────────────────
  console.log('📍 Seeding Jodhpur POIs...');

  const jodhpurPois = [
    {
      slug: 'mehrangarh-fort-jodhpur',
      name: 'Mehrangarh Fort',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Fort',
      description: 'One of the largest and most magnificently preserved forts in India, Mehrangarh rises 125 metres above the Blue City on a sheer cliff face. Built in 1459 by Rao Jodha, the fort is a stunning achievement of Rajput military architecture. The interiors are surprisingly delicate — ornate carved sandstone windows, mirror-work palaces, and an outstanding museum of royal palanquins, howdahs, weapons, and paintings. The view from the ramparts over the sea of blue houses below is the defining image of Jodhpur.',
      shortDescription: 'One of India\'s greatest forts — towering 125m above the Blue City',
      latitude: 26.2988,
      longitude: 73.0183,
      avgDurationMins: 180,
      avgCostINR: 200,
      bestTimeToVisit: 'Morning for comfortable temperatures; late afternoon for golden light on the blue city',
      tags: ['fort', 'must-visit', 'museum', 'Rajput', 'blue-city', 'views', 'photography', 'architecture'],
      tips: ['The museum audio guide (included with ₹200 ticket) is excellent — narrated by a descendant of the royal family', 'Walk the battlements for incredible views of the Blue City', 'The zip-lining across the fort walls (Flying Fox) is thrilling (₹1,200)', 'Chamunda Mataji Temple at the fort has panoramic views'],
    },
    {
      slug: 'jaswant-thada-jodhpur',
      name: 'Jaswant Thada',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monument',
      description: 'Often called the Taj Mahal of Marwar, Jaswant Thada is an elegant marble cenotaph built in 1899 in memory of Maharaja Jaswant Singh II. The thin, polished marble sheets used in the construction emit a warm glow when illuminated by sunlight. Surrounded by a small lake and beautifully manicured gardens, it offers a serene contrast to the massive Mehrangarh Fort looming above. The carved marble lattice screens (jali work) are exceptionally fine.',
      shortDescription: 'Gleaming marble cenotaph at the foot of Mehrangarh — the "Taj Mahal of Marwar"',
      latitude: 26.2972,
      longitude: 73.0213,
      avgDurationMins: 60,
      avgCostINR: 50,
      bestTimeToVisit: 'Late afternoon — the marble glows golden in the setting sun',
      tags: ['monument', 'marble', 'peaceful', 'photography', 'architecture', 'royal'],
      tips: ['Just a 5-minute walk downhill from Mehrangarh Fort — combine both visits', 'The marble sheets are so thin they appear translucent in sunlight', 'The gardens overlooking the lake are a peaceful spot for rest', 'Fewer crowds than Mehrangarh — a hidden gem for photography'],
    },
    {
      slug: 'toorji-ka-jhalra-jodhpur',
      name: 'Toorji Ka Jhalra Stepwell',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Architecture',
      description: 'Recently restored to its former glory, Toorji Ka Jhalra is a beautiful 18th-century stepwell in the heart of Jodhpur\'s old city. Built by Maharaja Abhay Singh\'s queen, the stepwell descends several storeys into the earth with a geometric pattern of steps leading to the water. The surrounding Jhalra neighbourhood has been revitalised with cafés and boutique shops, making it a perfect place to experience the blend of old and new Jodhpur.',
      shortDescription: 'Beautifully restored 18th-century stepwell in the heart of the Blue City',
      latitude: 26.2925,
      longitude: 73.0268,
      avgDurationMins: 30,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning or late afternoon for best light and fewer crowds',
      tags: ['stepwell', 'architecture', 'free', 'heritage', 'photography', 'old-city'],
      tips: ['Free to visit — one of Jodhpur\'s best kept secrets', 'The Stepwell Café adjacent serves excellent coffee with a view', 'Great for Instagram photos — the geometric steps create stunning symmetry', 'Combine with Clock Tower and Sardar Market (2-minute walk)'],
    },
    {
      slug: 'clock-tower-sardar-market-jodhpur',
      name: 'Clock Tower & Sardar Market',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Market',
      description: 'The Clock Tower (Ghanta Ghar), built by Maharaja Sardar Singh, is the focal point of Jodhpur\'s bustling old city market. Sardar Market radiates outward from the tower in a web of narrow lanes, each specialising in different wares — spices, textiles, bangles, handicrafts, vegetables, and street food. The aroma of roasting spices fills the air, and the Mirchi Vada and Mawa Kachori from the stalls here are legendary Jodhpur street food experiences.',
      shortDescription: 'Jodhpur\'s vibrant market hub — spice lanes, handicrafts, and legendary Mirchi Vada',
      latitude: 26.2919,
      longitude: 73.0260,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for produce market; evening for bazaar atmosphere and street food',
      tags: ['market', 'street-food', 'shopping', 'spices', 'handicrafts', 'local-experience', 'free'],
      tips: ['Try the Mirchi Vada at Shahi Samosa shop — it is a Jodhpur institution', 'The spice market is excellent for buying masalas and saffron (verify quality)', 'Bargain confidently — start at 40% of quoted price', 'The lanes around the tower are narrow and crowded — watch your belongings'],
    },
  ];

  for (const poi of jodhpurPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: jodhpur.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 180) + 60,
      },
    });
  }

  // ── POIs: RISHIKESH ─────────────────────────────────────────
  console.log('📍 Seeding Rishikesh POIs...');

  const rishikeshPois = [
    {
      slug: 'laxman-jhula-rishikesh',
      name: 'Laxman Jhula',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Landmark',
      description: 'The iconic iron suspension bridge spanning the Ganges has been Rishikesh\'s most recognisable landmark since 1929. Named after the Hindu god Rama\'s brother Laxman, who is believed to have crossed the river here on a jute rope, the 450-foot bridge offers stunning views of the river, the 13-storey Trimbakeshwar Temple, and the surrounding Himalayan foothills. The bridge area is the heart of Rishikesh\'s ashram and café culture.',
      shortDescription: 'Rishikesh\'s iconic suspension bridge over the Ganges with Himalayan views',
      latitude: 30.1266,
      longitude: 78.3209,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning or evening for pleasant light and temple bells; avoid peak afternoon heat',
      tags: ['landmark', 'iconic', 'free', 'bridge', 'views', 'photography', 'Ganges'],
      tips: ['The bridge sways when crowded — hold the railings if you are nervous', 'Monkeys are common on the bridge — do not carry food openly', 'Visit the 13-storey Trimbakeshwar Temple adjacent for panoramic rooftop views', 'The surrounding cafés and yoga centres are the heart of Rishikesh\'s traveller culture'],
    },
    {
      slug: 'river-rafting-rishikesh',
      name: 'River Rafting on the Ganges',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      subcategory: 'Adventure',
      description: 'Rishikesh is the river rafting capital of India, offering Grade III and IV rapids on the Ganges. The most popular 16 km stretch from Shivpuri to Laxman Jhula takes about 3–4 hours and includes rapids with names like Roller Coaster, Golf Course, and Club House. The experience combines adrenaline-pumping rapids with calm stretches where you can float, swim, and take in the Himalayan valley scenery. Cliff jumping at certain stops adds to the thrill.',
      shortDescription: 'India\'s best white-water rafting — Grade III-IV rapids through a Himalayan valley',
      latitude: 30.1164,
      longitude: 78.3173,
      avgDurationMins: 180,
      avgCostINR: 1000,
      bestTimeToVisit: 'September–November for the best rapids; February–May for comfortable weather',
      tags: ['adventure', 'rafting', 'must-do', 'adrenaline', 'Ganges', 'nature', 'group-activity'],
      tips: ['Book only with ATOAI-certified operators — safety standards vary widely', 'The Shivpuri to Laxman Jhula stretch (16 km, 3–4 hours) is the most popular — includes rapids and cliff jumping', 'Waterproof phone pouches provided — ask your operator', 'Monsoon season (Jul–Aug) closes rafting due to dangerous water levels'],
    },
    {
      slug: 'beatles-ashram-rishikesh',
      name: 'Beatles Ashram (Chaurasi Kutia)',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Cultural',
      description: 'Officially known as Chaurasi Kutia, this abandoned ashram of Maharishi Mahesh Yogi is where The Beatles stayed in 1968 to learn Transcendental Meditation — and where they wrote most of the White Album. The meditation cells, lecture halls, and kitchens are now covered in stunning street art and graffiti celebrating The Beatles and Indian spirituality. Walking through the jungle-reclaimed ruins with Beatles lyrics on the walls is a surreal, magical experience.',
      shortDescription: 'Where The Beatles wrote the White Album — abandoned ashram turned art gallery',
      latitude: 30.1080,
      longitude: 78.3190,
      avgDurationMins: 90,
      avgCostINR: 150,
      bestTimeToVisit: 'Morning for the best light on the graffiti and a peaceful atmosphere',
      tags: ['Beatles', 'cultural', 'art', 'photography', 'ashram', 'music', 'spiritual', 'unique'],
      tips: ['Entry: ₹150 for Indians, ₹600 for foreigners', 'The meditation domes (igloo-shaped structures) are the most photographed spots', 'Allow 60–90 minutes to explore the sprawling site', 'Located inside Rajaji Tiger Reserve — enter from the Ram Jhula end gate'],
    },
    {
      slug: 'triveni-ghat-aarti-rishikesh',
      name: 'Triveni Ghat Aarti',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Religious',
      description: 'Triveni Ghat is the most sacred bathing ghat in Rishikesh, located at the confluence (triveni) of three sacred rivers — the Ganges, Yamuna, and Saraswati. The evening Ganga Aarti here is Rishikesh\'s version of Varanasi\'s famous ceremony — smaller and more intimate but equally moving. Priests perform the fire ceremony with large brass lamps as devotees float flower diyas on the river. The setting, with the Himalayan foothills as a backdrop, adds to the spiritual ambience.',
      shortDescription: 'Intimate evening Ganga Aarti at Rishikesh\'s holiest ghat — three rivers converge',
      latitude: 30.1044,
      longitude: 78.2896,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening — aarti starts at 6pm (winter) or 6:30pm (summer)',
      tags: ['spiritual', 'free', 'aarti', 'Ganga', 'evening', 'ceremony', 'peaceful'],
      tips: ['Arrive 15–20 minutes early for a good spot on the steps', 'Buy a flower diya (₹10–20) to float on the river during the ceremony', 'The ghat is also excellent for morning meditation and yoga', 'Located in the Rishikesh town area, separate from the Laxman Jhula backpacker zone'],
    },
  ];

  for (const poi of rishikeshPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: rishikesh.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 180) + 60,
      },
    });
  }

  // ── POIs: MANALI ────────────────────────────────────────────
  console.log('📍 Seeding Manali POIs...');

  const manaliPois = [
    {
      slug: 'rohtang-pass-manali',
      name: 'Rohtang Pass',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Mountain Pass',
      description: 'At 3,978 metres (13,051 feet), Rohtang Pass is the gateway between the Kullu Valley and the Lahaul-Spiti Valley — and one of the most dramatic mountain passes accessible by road in India. The pass offers jaw-dropping views of snow-capped peaks, glaciers, and the vast Himalayan landscape. Snow activities (skiing, snowboarding, snowmobiling) are available most of the year. The 51 km drive from Manali through the Solang Valley is an adventure in itself.',
      shortDescription: 'Dramatic Himalayan pass at 13,051 feet — gateway to Lahaul-Spiti with snow year-round',
      latitude: 32.3722,
      longitude: 77.2478,
      avgDurationMins: 240,
      avgCostINR: 550,
      bestTimeToVisit: 'May–June and September–October for clear skies; snow activities year-round except monsoon',
      tags: ['mountain-pass', 'snow', 'adventure', 'views', 'photography', 'Himalayas', 'must-visit'],
      tips: ['Permit required — ₹550 per person (apply online at rohtangpermit.com or through hotel)', 'Only 1,200 vehicles allowed per day — book permit in advance', 'Altitude sickness possible — carry medication and stay hydrated', 'The Atal Tunnel (9.02 km, world\'s longest above 10,000 ft) now bypasses Rohtang for Lahaul traffic'],
    },
    {
      slug: 'solang-valley-manali',
      name: 'Solang Valley',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      subcategory: 'Adventure',
      description: 'Solang Valley (Solang Nullah), 14 km from Manali, is the adventure sports capital of Himachal Pradesh. In summer, it offers paragliding, zorbing, quad biking, and the famous Solang ropeway (gondola) that takes you to 3,000+ metres for stunning views. In winter (December–February), it transforms into a ski resort with skiing, snowboarding, and snow tubing. The amphitheatre of snow-covered peaks surrounding the valley is spectacular.',
      shortDescription: 'Himachal\'s adventure hub — paragliding in summer, skiing in winter',
      latitude: 32.3150,
      longitude: 77.1548,
      avgDurationMins: 180,
      avgCostINR: 500,
      bestTimeToVisit: 'December–February for snow sports; May–June for paragliding and summer activities',
      tags: ['adventure', 'paragliding', 'skiing', 'snow', 'family-friendly', 'nature', 'valley'],
      tips: ['Ropeway/gondola ride: ₹500 for stunning high-altitude views', 'Paragliding: ₹1,500–3,000 depending on duration (10–30 minutes)', 'Negotiate adventure activity prices — competition is high', 'Winter skiing lessons available from HPTDC for beginners'],
    },
    {
      slug: 'hadimba-temple-manali',
      name: 'Hadimba Temple',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Temple',
      description: 'Nestled in a dense deodar cedar forest, the Hadimba Temple (Dhungri Temple) is a unique 1553 wooden temple dedicated to Hidimbi Devi — the wife of Bhima from the Mahabharata. The pagoda-style architecture with intricately carved wooden doorways and walls is unlike any other temple in India. The surrounding forest of towering deodar trees creates a mystical, fairy-tale atmosphere. The temple is one of the most photographed sites in Manali.',
      shortDescription: '1553 wooden pagoda temple in a mystical deodar forest — unique Mahabharata heritage',
      latitude: 32.2430,
      longitude: 77.1890,
      avgDurationMins: 45,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for peaceful atmosphere; the forest is beautiful in all seasons',
      tags: ['temple', 'free', 'forest', 'heritage', 'unique', 'photography', 'spiritual', 'Mahabharata'],
      tips: ['The carved wooden doorway is the finest feature — look for the animal and nature motifs', 'The surrounding deodar forest is perfect for a short walk', 'Yak rides and traditional Himachali dress photos available outside (₹50–200)', 'Free entry — the temple is an active place of worship'],
    },
    {
      slug: 'old-manali-manali',
      name: 'Old Manali',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Cafe Culture',
      description: 'Old Manali is a laid-back village about 3 km from Manali\'s Mall Road, and it is the heart of the town\'s backpacker and café culture. Narrow lanes wind past stone-and-wood Himachali houses, quirky cafés, rooftop restaurants, yoga studios, and shops selling Kullu shawls and handmade jewellery. The vibe is distinctly bohemian — think Bob Marley murals, Israeli hummus joints, Italian wood-fired pizza, and Himalayan mountain views from every rooftop. The Manu Temple and the bridge over the Manalsu River are landmarks.',
      shortDescription: 'Manali\'s bohemian backpacker village — rooftop cafes, mountain views, and Himalayan vibes',
      latitude: 32.2500,
      longitude: 77.1850,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening for the café atmosphere; mornings for peaceful walks through the village',
      tags: ['cafes', 'backpacker', 'village', 'relaxed', 'food', 'free', 'mountain-views', 'shopping'],
      tips: ['Walk up from Mall Road or take an auto (₹50–100)', 'Lazy Dog Lounge and Drifters\' Café are local legends', 'The Manu Temple at the top of Old Manali is worth the climb', 'Many cafés have rooftop seating with mountain views — perfect for an afternoon'],
    },
  ];

  for (const poi of manaliPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: manali.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 180) + 60,
      },
    });
  }

  // ── POIs: SHIMLA ────────────────────────────────────────────
  console.log('📍 Seeding Shimla POIs...');

  const shimlaPois = [
    {
      slug: 'mall-road-shimla',
      name: 'Mall Road',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Promenade',
      description: 'Shimla\'s Mall Road is the social and cultural heart of the town — a pedestrian-only promenade lined with colonial-era buildings, shops, restaurants, and the iconic Gaiety Theatre (1887). The road connects the Ridge to the Scandal Point (where the Maharaja of Patiala reportedly eloped with the British Viceroy\'s daughter). Evening walks on Mall Road, with the mountain views and the buzz of tourists and locals, are a quintessential Shimla experience.',
      shortDescription: 'Shimla\'s iconic pedestrian promenade — colonial architecture, shops, and mountain views',
      latitude: 31.1042,
      longitude: 77.1710,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening for the bustling promenade atmosphere; morning for peaceful walks',
      tags: ['promenade', 'free', 'shopping', 'colonial', 'walking', 'evening', 'food', 'iconic'],
      tips: ['Vehicles are banned — the entire stretch is pedestrian-friendly', 'Indian Coffee House on Mall Road is an iconic spot for coffee and conversation', 'The Ridge at the end of Mall Road offers panoramic mountain views', 'Street performers and photo opportunities with Himachali dress are common'],
    },
    {
      slug: 'christ-church-shimla',
      name: 'Christ Church',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Colonial',
      description: 'The second oldest church in North India (built 1844–57), Christ Church is Shimla\'s most recognisable landmark with its striking yellow exterior and neo-Gothic stained glass windows. Perched on The Ridge, the church was designed by Colonel J.T. Boileau and features five stained glass windows representing faith, hope, charity, fortitude, patience, and humility. The church and The Ridge offer commanding views of the surrounding Himalayan peaks. The building is beautifully illuminated at night.',
      shortDescription: 'Shimla\'s iconic 1844 neo-Gothic church with stunning stained glass windows',
      latitude: 31.1052,
      longitude: 77.1706,
      avgDurationMins: 30,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for interior light through stained glass; evening for illuminated exterior',
      tags: ['church', 'colonial', 'free', 'landmark', 'architecture', 'photography', 'heritage'],
      tips: ['Free entry — the stained glass windows are remarkable', 'The church is beautifully lit at night — great for evening photography', 'Located at The Ridge — combine with Mall Road walk', 'Sunday morning services are open to visitors'],
    },
    {
      slug: 'jakhoo-temple-shimla',
      name: 'Jakhoo Temple',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Temple',
      description: 'Perched at 2,455 metres on the highest peak in Shimla, Jakhoo Temple is dedicated to Lord Hanuman and features a massive 33-metre (108-foot) statue of Hanuman visible from across the town. According to legend, Lord Hanuman stopped here to rest while carrying the Sanjeevani mountain to save Laxman. The trek up through pine forests offers stunning panoramic views of Shimla and the surrounding Himalayan ranges. On clear days, you can see snow-capped peaks.',
      shortDescription: 'Shimla\'s highest point with a 108-foot Hanuman statue and panoramic mountain views',
      latitude: 31.1135,
      longitude: 77.1783,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for clear views and a pleasant climb',
      tags: ['temple', 'free', 'views', 'trek', 'spiritual', 'photography', 'panoramic', 'nature'],
      tips: ['The climb from The Ridge is about 2 km — moderate steep walk through pine forest', 'A ropeway is available from The Ridge to near the temple (₹250 return)', 'Beware of aggressive monkeys — do not carry food or bags openly', 'Carry a stick (available near the entrance) to ward off monkeys'],
    },
    {
      slug: 'kalka-shimla-toy-train',
      name: 'Kalka-Shimla Toy Train',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      subcategory: 'Heritage Railway',
      description: 'The UNESCO World Heritage Kalka-Shimla Railway is one of the most enchanting train journeys in the world. Built in 1898 by the British, the narrow-gauge railway covers 96 km through 102 tunnels, over 800 bridges, and around 919 curves — climbing from 656 metres at Kalka to 2,076 metres at Shimla. The 5.5-hour journey passes through pine forests, misty valleys, and charming hill stations. The rail car and executive chair car offer the best views.',
      shortDescription: 'UNESCO heritage railway — 102 tunnels, 800 bridges, and 96 km of Himalayan beauty',
      latitude: 31.1048,
      longitude: 77.1734,
      avgDurationMins: 330,
      avgCostINR: 350,
      bestTimeToVisit: 'Morning departure for daylight views; October–March for clear mountain scenery',
      tags: ['UNESCO', 'heritage', 'railway', 'must-do', 'scenic', 'family-friendly', 'train', 'photography'],
      tips: ['Book rail car (₹350) or executive chair car (₹800) for best views — general class (₹30) is crowded', 'Book tickets on IRCTC at least 2 weeks in advance — hugely popular', 'Sit on the right side for the best valley views going up to Shimla', 'The Barog station and tunnel (longest on the route at 1.14 km) are highlights'],
    },
  ];

  for (const poi of shimlaPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: shimla.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 180) + 60,
      },
    });
  }

  // ── POIs: LEH-LADAKH ────────────────────────────────────────
  console.log('📍 Seeding Leh-Ladakh POIs...');

  const lehLadakhPois = [
    {
      slug: 'pangong-tso-lake-ladakh',
      name: 'Pangong Tso Lake',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Lake',
      description: 'Pangong Tso is one of the most breathtaking lakes on earth — a 134 km long, high-altitude endorheic lake at 4,350 metres (14,270 feet) that straddles the India-China border. The lake changes colour from azure to deep blue to turquoise to green depending on the time of day and the light. Made famous by the Bollywood film 3 Idiots, the first sight of Pangong\'s impossibly blue water against the barren brown mountains is a moment that stays with you forever.',
      shortDescription: 'Mesmerising colour-changing lake at 14,270 feet — the "3 Idiots" lake',
      latitude: 33.7590,
      longitude: 78.6600,
      avgDurationMins: 240,
      avgCostINR: 600,
      bestTimeToVisit: 'June–September; morning light creates the most vivid blue colours',
      tags: ['lake', 'must-visit', 'photography', 'high-altitude', 'nature', 'Bollywood', 'iconic', 'breathtaking'],
      tips: ['Protected Area Permit (PAP) required — ₹600 per person (arrange through hotel in Leh)', '160 km from Leh via Chang La pass (17,590 ft) — 5-hour drive one way', 'Overnight camping at the lake is possible (basic tented camps ₹1,500–3,000/night)', 'Altitude can cause headaches — carry Diamox and stay well hydrated', 'The lake freezes completely in winter — a surreal sight'],
    },
    {
      slug: 'thiksey-monastery-ladakh',
      name: 'Thiksey Monastery',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monastery',
      description: 'Often compared to the Potala Palace in Lhasa, Thiksey Monastery (Thiksey Gompa) is a stunning 12-storey whitewashed monastery perched on a hilltop 19 km from Leh. Home to around 100 monks of the Yellow Hat (Gelugpa) order of Tibetan Buddhism, the monastery houses a magnificent 15-metre (49-foot) Maitreya Buddha statue — the largest such statue in Ladakh. The early morning prayer ceremony (puja) at 6:30 am with chanting monks is an unforgettable experience.',
      shortDescription: '12-storey Buddhist monastery with a 49-foot Maitreya Buddha — Ladakh\'s mini Potala Palace',
      latitude: 33.9133,
      longitude: 77.6671,
      avgDurationMins: 90,
      avgCostINR: 50,
      bestTimeToVisit: 'Early morning (6–7am) for the prayer ceremony; late afternoon for golden light on the monastery',
      tags: ['monastery', 'Buddhist', 'must-visit', 'architecture', 'spiritual', 'photography', 'prayer'],
      tips: ['Arrive at 6:30am for the morning prayer ceremony — deeply atmospheric', 'The 15-metre Maitreya Buddha statue in the main prayer hall is stunning', 'The rooftop offers panoramic views of the Indus Valley', 'Respectful dress required — remove shoes in the prayer halls'],
    },
    {
      slug: 'khardung-la-pass-ladakh',
      name: 'Khardung La Pass',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      subcategory: 'Mountain Pass',
      description: 'Khardung La at 5,359 metres (17,582 feet) is one of the world\'s highest motorable passes and the gateway to the Nubra Valley. The pass is a rite of passage for every Ladakh road-tripper and motorcyclist — the signboard at the top (claiming 18,380 ft, debated) is one of the most photographed in India. The drive from Leh (39 km, about 1.5 hours) passes through stark, lunar landscapes with views of the Karakoram Range. Snow is present year-round.',
      shortDescription: 'One of the world\'s highest motorable passes at 17,582 feet — the gateway to Nubra Valley',
      latitude: 34.2824,
      longitude: 77.6025,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'June–September when the pass is open; morning for clearest views',
      tags: ['mountain-pass', 'high-altitude', 'adventure', 'biking', 'photography', 'iconic', 'must-visit'],
      tips: ['Acclimatize in Leh for at least 2 days before attempting the pass', 'Do not stay at the top for more than 15–20 minutes — altitude is extreme', 'Carry warm clothing even in summer — temperatures can drop below 0°C at the top', 'The road is well-maintained but narrow — drive carefully with steep drops'],
    },
    {
      slug: 'nubra-valley-ladakh',
      name: 'Nubra Valley',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Valley',
      description: 'Nubra Valley, accessible via Khardung La pass, is a surreal high-altitude cold desert where double-humped Bactrian camels roam sand dunes against a backdrop of snow-capped peaks. The Hunder sand dunes, Diskit Monastery (with a 32-metre Maitreya Buddha statue overlooking the valley), and Panamik hot springs are the main attractions. The contrast between the white sand dunes and the Karakoram mountains creates a landscape unlike anywhere else on earth.',
      shortDescription: 'Surreal cold desert with Bactrian camels, sand dunes, and Karakoram peaks',
      latitude: 34.6885,
      longitude: 77.5670,
      avgDurationMins: 480,
      avgCostINR: 600,
      bestTimeToVisit: 'June–September; plan for at least 2 days to explore properly',
      tags: ['valley', 'desert', 'camels', 'monastery', 'nature', 'photography', 'unique', 'adventure'],
      tips: ['Protected Area Permit (PAP) required — same permit covers Nubra and Pangong', 'Plan at least 2 days — Nubra deserves more than a rushed visit', 'Bactrian camel ride on Hunder sand dunes: ₹300–500 for 30 minutes', 'Diskit Monastery sunset is spectacular — the valley turns golden', 'Basic guesthouses available in Hunder and Diskit (₹800–2,000/night)'],
    },
    {
      slug: 'leh-palace-ladakh',
      name: 'Leh Palace',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Palace',
      description: 'Leh Palace is a nine-storey former royal palace built in the 17th century by King Sengge Namgyal — modelled after the Potala Palace in Lhasa, Tibet. Perched on Tsemo Hill overlooking Leh town, the palace offers commanding 360-degree views of the town, the Stok Kangri range, and the Indus Valley. Though partly in ruins, the palace is being progressively restored and contains a small museum of royal artefacts and Tibetan Buddhist art.',
      shortDescription: '17th-century royal palace on Tsemo Hill with 360-degree views of Leh and the Indus Valley',
      latitude: 34.1677,
      longitude: 77.5850,
      avgDurationMins: 90,
      avgCostINR: 100,
      bestTimeToVisit: 'Late afternoon for golden light and sunset views from the rooftop',
      tags: ['palace', 'views', 'heritage', 'Buddhist', 'photography', 'panoramic', 'royal'],
      tips: ['The rooftop offers the best panoramic views of Leh — perfect for sunset', 'Climb slowly — the altitude (3,500 m) makes even short walks tiring', 'The nearby Tsemo Fort and Tsemo Gompa are a short additional climb above the palace', 'Visit on your first or second day in Leh — the gentle climb helps acclimatization'],
    },
  ];

  for (const poi of lehLadakhPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: lehLadakh.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.7,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: MUMBAI ────────────────────────────────────────────
  console.log('📍 Seeding Mumbai POIs...');

  const mumbaiPois = [
    {
      slug: 'gateway-of-india-mumbai',
      name: 'Gateway of India',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Landmark',
      description: 'Mumbai\'s most iconic landmark, the Gateway of India was built in 1924 to commemorate the visit of King George V and Queen Mary. The 26-metre basalt arch overlooking the Arabian Sea combines Hindu and Muslim architectural styles and is the starting point for the famous Elephanta Caves ferry. The Gateway is also the spot where the last British troops left India in 1948. The Taj Mahal Palace Hotel — one of the world\'s most famous luxury hotels — stands directly behind it.',
      shortDescription: 'Mumbai\'s iconic 1924 waterfront arch — where the British left India and ferries depart for Elephanta',
      latitude: 18.9220,
      longitude: 72.8347,
      avgDurationMins: 45,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening for atmospheric views and the illuminated Taj Palace backdrop',
      tags: ['landmark', 'iconic', 'free', 'photography', 'waterfront', 'history', 'must-visit'],
      tips: ['The area is lively in the evenings with photographers, balloon sellers, and food vendors', 'Best photographed from the ferry departing for Elephanta Caves', 'The Taj Mahal Palace Hotel behind the Gateway offers high tea (₹2,500 per person) — worth the splurge', 'Security check required to enter the Gateway area'],
    },
    {
      slug: 'marine-drive-mumbai',
      name: 'Marine Drive',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Promenade',
      description: 'Marine Drive is a 3.6 km long, C-shaped boulevard along the Arabian Sea coast, known as the Queen\'s Necklace because of the string of streetlights that resemble a necklace of pearls when viewed from elevated points at night. Lined with Art Deco buildings (Mumbai has the world\'s second-largest collection of Art Deco architecture after Miami), Marine Drive is where Mumbai comes to breathe — morning joggers, evening strollers, couples, families, and dreamers sitting on the sea wall watching the sunset.',
      shortDescription: 'The Queen\'s Necklace — Mumbai\'s iconic Art Deco seafront promenade and sunset spot',
      latitude: 18.9432,
      longitude: 72.8235,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening for sunset views; night for the iconic "Queen\'s Necklace" lights',
      tags: ['promenade', 'free', 'sunset', 'Art-Deco', 'iconic', 'evening', 'photography', 'romantic'],
      tips: ['Walk the full stretch from Nariman Point to Girgaon Chowpatty (3.6 km)', 'Chowpatty Beach at the northern end has famous street food — try pav bhaji and bhel puri', 'The Art Deco buildings are best appreciated from the opposite side of the road', 'Best views of the "necklace" at night from Malabar Hill'],
    },
    {
      slug: 'elephanta-caves-mumbai',
      name: 'Elephanta Caves',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monument',
      description: 'A UNESCO World Heritage Site, the Elephanta Caves are a collection of rock-cut cave temples on Elephanta Island, a one-hour ferry ride from the Gateway of India. Dating to the 5th–8th centuries, the caves contain magnificent sculptures dedicated to Lord Shiva — the 6-metre-high Trimurti (three-headed Shiva) is one of the finest rock-cut sculptures in the world. The ferry ride across Mumbai Harbour offers great views of the Mumbai skyline.',
      shortDescription: 'UNESCO rock-cut cave temples with a magnificent 6-metre Trimurti Shiva sculpture',
      latitude: 18.9633,
      longitude: 72.9315,
      avgDurationMins: 180,
      avgCostINR: 40,
      bestTimeToVisit: 'Morning — take the first ferry (9am) for a cooler, less crowded experience',
      tags: ['UNESCO', 'caves', 'monument', 'Shiva', 'sculpture', 'ferry', 'must-visit', 'archaeological'],
      tips: ['Ferry from Gateway of India — ₹200 return (economy) or ₹300 (deluxe); 1 hour each way', 'Cave entry: ₹40 for Indians', 'The climb from the jetty to the caves involves about 120 steps — toy train available (₹20)', 'Closed on Mondays', 'Carry water and snacks — limited options on the island'],
    },
    {
      slug: 'dhobi-ghat-mumbai',
      name: 'Dhobi Ghat',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Landmark',
      description: 'Dhobi Ghat is the world\'s largest open-air laundry — a mind-boggling spectacle of over 700 concrete wash pens where an estimated 10,000 items of clothing are washed daily by hand. Located near Mahalaxmi station, this 140-year-old institution is a living symbol of Mumbai\'s incredible work ethic and the dhobi community\'s centuries-old trade. The sight of thousands of garments drying on clotheslines against the backdrop of high-rise apartments is quintessential Mumbai.',
      shortDescription: 'World\'s largest open-air laundry — 700+ wash pens and Mumbai\'s most iconic contrast',
      latitude: 18.9783,
      longitude: 72.8260,
      avgDurationMins: 30,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning (7–10am) when washing is at its peak and light is best for photography',
      tags: ['landmark', 'free', 'unique', 'photography', 'local-life', 'iconic', 'Mumbai'],
      tips: ['Best viewed from the Mahalaxmi Bridge overpass for the panoramic view', 'Walking tours inside the laundry are available through local guides (₹200–500)', 'Be respectful — this is a working area and people\'s livelihoods', 'Nearest station: Mahalaxmi (Western Line)'],
    },
    {
      slug: 'colaba-causeway-mumbai',
      name: 'Colaba Causeway',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Shopping/Market',
      description: 'Colaba Causeway (Shahid Bhagat Singh Road) is Mumbai\'s most famous street shopping destination — a vibrant stretch from the Taj Mahal Palace Hotel to the Colaba Market. The pavement stalls sell everything from vintage Bollywood posters and oxidised jewellery to leather bags, hippie clothes, and antiques. The area is also packed with legendary restaurants and cafés — Leopold Café (since 1871), Theobroma, Café Mondegar, and Bademiya (iconic late-night kebabs).',
      shortDescription: 'Mumbai\'s most vibrant street shopping and cafe stretch — vintage finds to iconic eateries',
      latitude: 18.9225,
      longitude: 72.8328,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening when the street stalls are fully set up and the atmosphere is buzzing',
      tags: ['shopping', 'street-market', 'free', 'cafes', 'food', 'nightlife', 'vintage', 'iconic'],
      tips: ['Bargain hard at street stalls — start at one-third of the quoted price', 'Leopold Café (since 1871) is a Mumbai institution — also featured in "Shantaram"', 'Bademiya (behind the Taj Hotel) serves legendary late-night kebab rolls', 'Sunday flea market near Café Churchill has rare finds and antiques'],
    },
  ];

  for (const poi of mumbaiPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: mumbai.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: GOA ───────────────────────────────────────────────
  console.log('📍 Seeding Goa POIs...');

  const goaPois = [
    {
      slug: 'anjuna-beach-goa',
      name: 'Anjuna Beach',
      category: ExperienceCategory.ISLAND_BEACH,
      subcategory: 'Beach',
      description: 'Anjuna Beach is the legendary heart of Goa\'s hippie and trance culture — the beach that put Goa on the global backpacker map in the 1960s. Today, Anjuna blends its bohemian heritage with modern beach shack restaurants, flea markets, and sunset bars. The iconic Wednesday Flea Market (now Saturday too) attracts traders from across India selling everything from Kashmiri pashminas to Rajasthani jewellery. Curlies Beach Shack at the southern end is ground zero for Goa\'s trance scene.',
      shortDescription: 'Goa\'s legendary hippie beach — flea markets, trance culture, and iconic beach shacks',
      latitude: 15.5732,
      longitude: 73.7419,
      avgDurationMins: 180,
      avgCostINR: 0,
      bestTimeToVisit: 'Sunset for the iconic view; Wednesday/Saturday for the flea market',
      tags: ['beach', 'free', 'nightlife', 'flea-market', 'hippie', 'trance', 'sunset', 'iconic'],
      tips: ['The Wednesday Flea Market (now also Saturday) is a must-visit for shopping and vibes', 'Curlies Beach Shack is legendary for trance parties — check event schedule', 'Swim only in the marked areas — rocks and currents can be dangerous', 'Rent a scooter to reach Anjuna from other beaches (₹300–400/day)'],
    },
    {
      slug: 'basilica-of-bom-jesus-goa',
      name: 'Basilica of Bom Jesus',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Church/UNESCO',
      description: 'A UNESCO World Heritage Site, the Basilica of Bom Jesus (1605) is one of the finest examples of Baroque architecture in India and holds the mortal remains of St. Francis Xavier — the patron saint of Goa. The saint\'s body, remarkably preserved after over 460 years, is displayed in a silver casket and publicly exhibited once every 10 years (last in 2014, next in 2024). The basilica\'s ornate gilded altarpiece, wooden carvings, and colonial grandeur are breathtaking.',
      shortDescription: 'UNESCO Baroque basilica housing the 460-year-old preserved body of St. Francis Xavier',
      latitude: 15.5009,
      longitude: 73.9116,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for peaceful exploration; the light through the windows is beautiful',
      tags: ['UNESCO', 'church', 'free', 'heritage', 'Baroque', 'history', 'must-visit', 'Portuguese'],
      tips: ['Free entry — one of Goa\'s most important historical sites', 'The adjacent Se Cathedral (largest church in Asia) is also worth visiting', 'Old Goa (Velha Goa) has several Portuguese churches within walking distance', 'Photography is allowed inside — the gilded altarpiece is stunning'],
    },
    {
      slug: 'dudhsagar-falls-goa',
      name: 'Dudhsagar Falls',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Waterfall',
      description: 'Dudhsagar Falls (Sea of Milk) is one of India\'s tallest waterfalls at 310 metres (1,017 feet), cascading down a cliff face in the Western Ghats on the Goa-Karnataka border. The waterfall is at its most spectacular during and just after the monsoon (July–December) when the volume of water turns the falls into a thundering white torrent. The journey to the falls — through the Bhagwan Mahavir Wildlife Sanctuary and past a railway bridge — is an adventure in itself.',
      shortDescription: 'India\'s fifth tallest waterfall at 310 metres — thundering "Sea of Milk" in the Western Ghats',
      latitude: 15.3144,
      longitude: 74.3143,
      avgDurationMins: 240,
      avgCostINR: 500,
      bestTimeToVisit: 'October–January for impressive water flow and accessible roads',
      tags: ['waterfall', 'nature', 'adventure', 'wildlife', 'photography', 'Western-Ghats', 'must-visit'],
      tips: ['Access is via jeep from Collem/Kulem village — ₹400–500 per person (shared jeep, 45 min each way)', 'The trail involves wading through streams — wear sturdy waterproof shoes', 'Swimming at the base is allowed but currents can be strong', 'Best visited October–January; closed during peak monsoon (Jun–Sep) due to dangerous conditions'],
    },
    {
      slug: 'fort-aguada-goa',
      name: 'Fort Aguada',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Fort',
      description: 'Built in 1612 by the Portuguese to guard against Dutch and Maratha invasions, Fort Aguada is the best-preserved Portuguese fort in Goa. Perched on a hilltop at the confluence of the Mandovi River and the Arabian Sea, the fort offers panoramic views of the coastline from Candolim to Baga. The fort includes a four-storey Portuguese lighthouse (the oldest of its kind in Asia), a moat, and a massive freshwater spring that once supplied ships (Aguada means "water" in Portuguese).',
      shortDescription: '1612 Portuguese sea fort with Asia\'s oldest lighthouse and panoramic coastline views',
      latitude: 15.4924,
      longitude: 73.7735,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Late afternoon for golden light and sunset views over the Arabian Sea',
      tags: ['fort', 'free', 'Portuguese', 'views', 'lighthouse', 'history', 'photography', 'sunset'],
      tips: ['Free entry — one of the best-preserved Portuguese forts in Goa', 'The lighthouse area offers the best panoramic views', 'Combine with Sinquerim Beach at the base of the fort', 'The Taj Holiday Village and Fort Aguada Beach Resort occupy the lower portion of the fort complex'],
    },
  ];

  for (const poi of goaPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: goa.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  console.log('✅ POIs Part 1 seeded for 12 cities (53 POIs total)');

  // ── POIs: KOCHI ────────────────────────────────────────────
  console.log('📍 Seeding Kochi POIs...');

  const kochiPois = [
    {
      slug: 'chinese-fishing-nets-kochi',
      name: 'Chinese Fishing Nets',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Landmark',
      description: 'The cantilevered Chinese fishing nets (Cheena vala) at Fort Kochi are one of India\'s most iconic coastal sights. Believed to have been introduced by Chinese explorer Zheng He in the 14th century, these massive shore-operated lift nets are worked by teams of fishermen using counterweights. The best time to photograph them is at sunset, when the silhouettes against the Arabian Sea create an unforgettable image. Fresh catch from the nets can be bought and cooked at nearby stalls.',
      shortDescription: 'Iconic 14th-century cantilevered fishing nets — Fort Kochi\'s most photographed landmark',
      latitude: 9.9658,
      longitude: 76.2428,
      avgDurationMins: 30,
      avgCostINR: 0,
      bestTimeToVisit: 'Sunset for the best silhouette photographs',
      tags: ['landmark', 'free', 'photography', 'sunset', 'iconic', 'Fort-Kochi'],
      tips: ['Best photographed at sunset', 'You can help the fishermen pull the nets for a small tip', 'Buy fresh catch and get it cooked at nearby stalls', 'Combine with a Fort Kochi heritage walk'],
    },
    {
      slug: 'fort-kochi-walk',
      name: 'Fort Kochi Walk',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Heritage Walk',
      description: 'Fort Kochi is a living museum of colonial history — Portuguese, Dutch, and British influences blend seamlessly in this charming waterfront neighbourhood. A self-guided walk takes you past St. Francis Church (India\'s oldest European church, 1503), Santa Cruz Cathedral, the Dutch Cemetery, and streets lined with colonial bungalows and vibrant street art. The Kochi-Muziris Biennale transforms the area into a contemporary art destination every two years.',
      shortDescription: 'Colonial heritage walk through 500 years of Portuguese, Dutch, and British history',
      latitude: 9.9639,
      longitude: 76.2430,
      avgDurationMins: 180,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for comfortable walking temperatures and fewer crowds',
      tags: ['heritage', 'free', 'walking', 'colonial', 'art', 'photography', 'history'],
      tips: ['Start at the Chinese Fishing Nets and walk south', 'St. Francis Church has Vasco da Gama\'s original burial site', 'Look for Kochi Biennale street art on building walls', 'Many charming cafes along the route for breaks'],
    },
    {
      slug: 'mattancherry-palace-kochi',
      name: 'Mattancherry Palace',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Museum',
      description: 'Also known as the Dutch Palace, Mattancherry Palace was built by the Portuguese in 1555 and gifted to the Raja of Kochi. Later renovated by the Dutch, it houses some of India\'s finest Hindu mythological murals — the Ramayana murals in the royal bedchambers are extraordinary. The coronation hall displays royal regalia, palanquins, and weapons. The adjacent Jew Town and Paradesi Synagogue (1568) make this area a cultural goldmine.',
      shortDescription: 'Colonial palace with India\'s finest Hindu mythological murals and royal regalia',
      latitude: 9.9575,
      longitude: 76.2594,
      avgDurationMins: 60,
      avgCostINR: 5,
      bestTimeToVisit: 'Morning to avoid crowds; closed on Fridays',
      tags: ['museum', 'history', 'murals', 'colonial', 'heritage', 'art'],
      tips: ['Photography is not allowed inside', 'Combine with Jew Town and Paradesi Synagogue next door', 'Closed on Fridays', 'Entry fee is just ₹5 — one of India\'s best bargains'],
    },
    {
      slug: 'backwater-day-cruise-kochi',
      name: 'Backwater Day Cruise',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Experience',
      description: 'A day cruise through Kerala\'s famous backwater network from Kochi offers a glimpse into the serene village life along the palm-fringed waterways. Glide past paddy fields, toddy shops, coir-making villages, and centuries-old churches. The backwaters are a UNESCO-recognized ecosystem — a network of interconnected canals, rivers, and lakes stretching over 900 km along the Malabar Coast.',
      shortDescription: 'Cruise through Kerala\'s iconic palm-fringed backwater canals and village life',
      latitude: 9.9400,
      longitude: 76.2600,
      avgDurationMins: 480,
      avgCostINR: 1500,
      bestTimeToVisit: 'October–March for pleasant weather and clear skies',
      tags: ['backwaters', 'cruise', 'nature', 'village', 'photography', 'must-do', 'Kerala'],
      tips: ['Book a small motorboat for a more intimate experience than large houseboats', 'Carry sunscreen and a hat', 'Ask for a route through narrow canals for the best village views', 'Lunch is usually included — expect traditional Kerala fish curry and rice'],
    },
  ];

  for (const poi of kochiPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: kochi.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: MUNNAR ────────────────────────────────────────────
  console.log('📍 Seeding Munnar POIs...');

  const munnarPois = [
    {
      slug: 'tea-plantations-tour-munnar',
      name: 'Tea Plantations Tour',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Plantation',
      description: 'Munnar\'s rolling hills are carpeted with emerald-green tea plantations that stretch to the horizon — a visual spectacle unlike anything else in India. The Kanan Devan Hills produce some of the finest tea in the world. A plantation tour takes you through the plucking process, the factory where leaves are withered, rolled, fermented, and dried, and ends with a tasting session. The KDHP Tea Museum is an excellent starting point.',
      shortDescription: 'Walk through emerald tea estates and learn the art of tea-making in India\'s tea country',
      latitude: 10.0889,
      longitude: 77.0595,
      avgDurationMins: 180,
      avgCostINR: 200,
      bestTimeToVisit: 'Morning for misty views and comfortable temperatures',
      tags: ['tea', 'plantation', 'nature', 'photography', 'must-visit', 'Kerala', 'hills'],
      tips: ['Visit the KDHP Tea Museum for context before the plantation walk', 'Buy fresh tea directly from the estate — much cheaper than shops in town', 'Morning mist creates magical photography conditions', 'Wear comfortable shoes for walking on uneven terrain'],
    },
    {
      slug: 'eravikulam-national-park-munnar',
      name: 'Eravikulam National Park',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'National Park',
      description: 'Home to the endangered Nilgiri tahr (a mountain goat found nowhere else on Earth), Eravikulam National Park is a stunning high-altitude grassland ecosystem at 2,000+ metres. The park offers spectacular views of the Western Ghats and is famous for the Neelakurinji flower bloom — a rare event that turns the hills blue-purple once every 12 years (next bloom: 2030). The tahr are remarkably tame and often approach visitors.',
      shortDescription: 'High-altitude national park home to the endangered Nilgiri tahr mountain goat',
      latitude: 10.1750,
      longitude: 77.0650,
      avgDurationMins: 180,
      avgCostINR: 125,
      bestTimeToVisit: 'September–November for clear skies; closed during monsoon (Feb–Mar for calving season)',
      tags: ['wildlife', 'national-park', 'tahr', 'nature', 'trekking', 'Western-Ghats', 'photography'],
      tips: ['Park shuttle buses take you up — private vehicles not allowed', 'Nilgiri tahr are very approachable but do not feed them', 'Carry a jacket — temperatures can drop significantly at altitude', 'Closed Feb–Mar for tahr calving season'],
    },
    {
      slug: 'top-station-munnar',
      name: 'Top Station',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Viewpoint',
      description: 'At 1,880 metres, Top Station is the highest point on the Munnar–Kodaikanal road and offers breathtaking panoramic views of the Tamil Nadu plains, the Western Ghats, and on clear days, the distant Vaigai Dam. Named because it was the top terminus of a colonial-era ropeway used to transport tea, the viewpoint is surrounded by grasslands and shola forests. The drive up through hairpin bends is an adventure in itself.',
      shortDescription: 'Munnar\'s highest viewpoint with sweeping panoramas of the Western Ghats',
      latitude: 10.1300,
      longitude: 77.2400,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning for clear views before clouds roll in',
      tags: ['viewpoint', 'free', 'scenic', 'photography', 'nature', 'Western-Ghats'],
      tips: ['Go early morning for the clearest views', 'The drive is 32 km from Munnar town — allow 1.5 hours each way', 'Carry warm clothing — it gets cold and windy', 'Combine with a visit to Kundala Dam on the way'],
    },
  ];

  for (const poi of munnarPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: munnar.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: ALLEPPEY ────────────────────────────────────────────
  console.log('📍 Seeding Alleppey POIs...');

  const alleppeyPois = [
    {
      slug: 'houseboat-overnight-alleppey',
      name: 'Houseboat Overnight',
      category: ExperienceCategory.LUXURY_STAYS,
      subcategory: 'Experience',
      description: 'An overnight houseboat (kettuvallam) cruise on Alleppey\'s backwaters is Kerala\'s signature travel experience. These traditional rice barges have been converted into floating hotels with bedrooms, bathrooms, and a kitchen where a personal chef prepares fresh Kerala cuisine. Glide through narrow canals lined with coconut palms, past village churches, paddy fields, and fishermen casting their nets. Sunset and sunrise on the backwaters are magical.',
      shortDescription: 'Kerala\'s iconic overnight houseboat cruise through palm-fringed backwater canals',
      latitude: 9.4900,
      longitude: 76.3300,
      avgDurationMins: 1440,
      avgCostINR: 6000,
      bestTimeToVisit: 'October–March for pleasant weather; avoid peak monsoon (Jun–Aug)',
      tags: ['houseboat', 'backwaters', 'luxury', 'must-do', 'Kerala', 'romance', 'overnight'],
      tips: ['Book a 1-bedroom houseboat for a private experience (₹6,000–8,000)', 'Ensure AC is included in summer months', 'The chef will cook fresh fish bought from village markets along the way', 'Ask for the Punnamada Lake route for wider, scenic waterways'],
    },
    {
      slug: 'alleppey-beach',
      name: 'Alleppey Beach',
      category: ExperienceCategory.ISLAND_BEACH,
      subcategory: 'Beach',
      description: 'Alleppey Beach is a long, relatively uncrowded stretch of golden sand along the Arabian Sea. The historic 137-year-old Alleppey Lighthouse stands at one end. Unlike Goa\'s party beaches, Alleppey Beach offers a quieter, more local experience — families picnicking, fishermen pulling in their catch, and spectacular sunsets. The old pier extending into the sea is a popular photography spot.',
      shortDescription: 'Quiet golden beach with a historic lighthouse and spectacular Arabian Sea sunsets',
      latitude: 9.4929,
      longitude: 76.3248,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening for sunset views; mornings to watch fishermen',
      tags: ['beach', 'free', 'sunset', 'lighthouse', 'photography', 'quiet'],
      tips: ['The old pier is great for sunset photography', 'Climb the Alleppey Lighthouse for panoramic views (₹25)', 'Swimming can be risky — strong currents in parts', 'Street food stalls along the beach road serve fresh fish fry'],
    },
    {
      slug: 'backwater-village-walk-alleppey',
      name: 'Backwater Village Walk',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Experience',
      description: 'A guided walk through the backwater villages around Alleppey offers an intimate glimpse into rural Kerala life that houseboats cannot provide. Walk along narrow pathways between paddy fields, visit toddy tappers climbing coconut trees, watch coir (coconut fiber) being spun, and interact with villagers in their homes. Many tours include a traditional Kerala lunch cooked in a village home — an authentic and memorable experience.',
      shortDescription: 'Intimate guided walk through Kerala\'s backwater villages and rural life',
      latitude: 9.5100,
      longitude: 76.3400,
      avgDurationMins: 120,
      avgCostINR: 300,
      bestTimeToVisit: 'Morning for comfortable temperatures and active village life',
      tags: ['village', 'walking', 'culture', 'authentic', 'Kerala', 'rural', 'photography'],
      tips: ['Book through a local community tourism initiative for the most authentic experience', 'Wear comfortable walking shoes — paths can be muddy after rain', 'Carry mosquito repellent', 'A home-cooked Kerala lunch is usually available for an extra ₹200–300'],
    },
  ];

  for (const poi of alleppeyPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: alleppey.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: BENGALURU ────────────────────────────────────────────
  console.log('📍 Seeding Bengaluru POIs...');

  const bengaluruPois = [
    {
      slug: 'lalbagh-botanical-garden-bengaluru',
      name: 'Lalbagh Botanical Garden',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Garden',
      description: 'Lalbagh is Bengaluru\'s green lung — a 240-acre botanical garden originally laid out by Hyder Ali in 1760 and later expanded by Tipu Sultan. Home to over 1,800 species of plants, a beautiful glasshouse modeled on London\'s Crystal Palace, and a 3,000-million-year-old rock formation (one of the oldest in the world), Lalbagh is a peaceful retreat in the heart of the city. The biannual flower show attracts lakhs of visitors.',
      shortDescription: '240-acre botanical garden with 1,800+ plant species and a 3-billion-year-old rock',
      latitude: 12.9507,
      longitude: 77.5848,
      avgDurationMins: 120,
      avgCostINR: 20,
      bestTimeToVisit: 'Early morning for joggers and birdwatching; flower show in January and August',
      tags: ['garden', 'nature', 'botanical', 'heritage', 'photography', 'morning', 'family-friendly'],
      tips: ['Early morning is best for birdwatching — over 100 species recorded', 'The flower show in January and August is spectacular', 'The rock formation near the bandstand is over 3 billion years old', 'Multiple entry gates — the main gate on Double Road is the most convenient'],
    },
    {
      slug: 'cubbon-park-bengaluru',
      name: 'Cubbon Park',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Park',
      description: 'Cubbon Park is a 300-acre green oasis in the centre of Bengaluru, established in 1870 by Sir Mark Cubbon. The park features grand colonial buildings (Attara Kacheri — the High Court, the State Library, and the Seshadri Iyer Memorial Hall), tree-lined avenues with over 6,000 trees including century-old rain trees, and a vibrant morning jogger and walker culture. The park is car-free on Sundays, making it perfect for cycling.',
      shortDescription: 'Bengaluru\'s beloved 300-acre green heart with colonial architecture and ancient trees',
      latitude: 12.9763,
      longitude: 77.5929,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning for walking/jogging; Sundays for car-free cycling',
      tags: ['park', 'free', 'nature', 'colonial', 'morning', 'cycling', 'family-friendly'],
      tips: ['Car-free on Sundays — rent a cycle and explore', 'The bandstand area has excellent photo opportunities', 'Visit the Venkatappa Art Gallery inside the park', 'Street food vendors near the MG Road entrance'],
    },
    {
      slug: 'nandi-hills-sunrise-bengaluru',
      name: 'Nandi Hills Sunrise',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Viewpoint',
      description: 'Nandi Hills (Nandidurga) is Bengaluru\'s favourite weekend escape — a hill fortress 60 km north of the city, rising to 1,478 metres. The sunrise from Tipu\'s Drop (a 600-metre cliff from which Tipu Sultan reportedly had prisoners thrown) is legendary. The hilltop also features Tipu Sultan\'s summer palace, ancient Shiva and Vishnu temples, and panoramic views of the Deccan Plateau. On clear mornings, the sea of clouds below is breathtaking.',
      shortDescription: 'Legendary sunrise viewpoint atop a 1,478m hill fortress — Bengaluru\'s weekend escape',
      latitude: 13.3702,
      longitude: 77.6835,
      avgDurationMins: 180,
      avgCostINR: 20,
      bestTimeToVisit: 'Arrive by 5:30 AM for sunrise; weekdays to avoid crowds',
      tags: ['sunrise', 'viewpoint', 'nature', 'weekend', 'photography', 'hill-station', 'must-visit'],
      tips: ['Leave Bengaluru by 4 AM to catch sunrise — the gate opens at 5 AM', 'Weekends are extremely crowded — go on a weekday if possible', 'Carry warm layers — it gets cold at the top, especially pre-dawn', 'The cycling route up is popular with enthusiasts'],
    },
    {
      slug: 'bangalore-palace-bengaluru',
      name: 'Bangalore Palace',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Palace',
      description: 'Bangalore Palace is a stunning Tudor-style palace built in 1878 by King Chamarajendra Wadiyar X, inspired by England\'s Windsor Castle. Set in 454 acres of prime land in central Bengaluru, the palace features fortified towers, turrets, Gothic windows, and interiors decorated with elegant wood carvings, floral motifs, and paintings. The grounds are now famous for hosting large concerts and events. A fascinating contrast to South Indian palace architecture.',
      shortDescription: 'Tudor-style royal palace inspired by Windsor Castle, set in 454 acres',
      latitude: 12.9988,
      longitude: 77.5921,
      avgDurationMins: 90,
      avgCostINR: 230,
      bestTimeToVisit: 'Morning for fewer crowds; photography fee is extra',
      tags: ['palace', 'heritage', 'Tudor', 'architecture', 'royal', 'photography'],
      tips: ['Photography fee is ₹230 on top of entry', 'Audio guide available for ₹100', 'The grounds are used for concerts — check event calendar', 'Combine with a walk to nearby Vasanth Nagar neighbourhood'],
    },
  ];

  for (const poi of bengaluruPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: bengaluru.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: MYSURU ────────────────────────────────────────────
  console.log('📍 Seeding Mysuru POIs...');

  const mysuruPois = [
    {
      slug: 'mysore-palace-mysuru',
      name: 'Mysore Palace',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Palace',
      description: 'Mysore Palace (Amba Vilas Palace) is India\'s most visited monument after the Taj Mahal, attracting over 6 million visitors annually. Built in 1912 in Indo-Saracenic style, the palace is a visual feast — the Durbar Hall with its ornate ceiling, the royal throne (200 kg of gold), and the stunning evening illumination with 97,000 light bulbs every Sunday and during Dasara are unforgettable. The Dasara festival (September/October) sees the palace at its most spectacular.',
      shortDescription: 'India\'s second-most visited monument — a golden Indo-Saracenic masterpiece',
      latitude: 12.3051,
      longitude: 76.6551,
      avgDurationMins: 120,
      avgCostINR: 70,
      bestTimeToVisit: 'Sunday evening for the 97,000-bulb illumination; Dasara festival for the grandest spectacle',
      tags: ['palace', 'must-visit', 'illumination', 'heritage', 'architecture', 'Dasara', 'photography'],
      tips: ['Sunday and public holiday illumination (7–7:45 PM) is unmissable', 'Cameras and phones are not allowed inside — only exterior photography', 'Visit during Dasara (September/October) for the grand procession', 'Audio guide available for ₹100 — highly recommended'],
    },
    {
      slug: 'chamundi-hills-mysuru',
      name: 'Chamundi Hills',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Temple/Viewpoint',
      description: 'Chamundi Hills rises 1,065 metres above Mysuru and is crowned by the Sri Chamundeshwari Temple, the patron deity of the Mysore royal family. The 1,008-step climb (or a short drive) passes the iconic 5-metre-tall Nandi Bull statue carved from a single rock in 1659. The hilltop offers panoramic views of Mysuru city below. The temple, originally built in the 12th century, has been patronized by the Wadiyar dynasty for centuries.',
      shortDescription: 'Sacred hilltop temple with a giant Nandi bull and panoramic city views',
      latitude: 12.2725,
      longitude: 76.6700,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning for the 1,008-step climb; sunset for city views',
      tags: ['temple', 'free', 'viewpoint', 'heritage', 'trekking', 'photography', 'spiritual'],
      tips: ['The 1,008-step climb takes about 45–60 minutes — carry water', 'Alternatively, drive up and walk down via the steps', 'The monolithic Nandi Bull at step 700 is a must-stop', 'Free entry to the temple; remove footwear'],
    },
    {
      slug: 'brindavan-gardens-mysuru',
      name: 'Brindavan Gardens',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Garden',
      description: 'Built in 1932 alongside the Krishna Raja Sagara Dam, Brindavan Gardens is one of India\'s best-known terraced gardens. The symmetrical layout with fountains, flower beds, and topiary is stunning by day, but the gardens truly come alive at night when the musical fountain show illuminates the cascading water in a kaleidoscope of colours. The dam itself, across the Cauvery River, provides a scenic backdrop.',
      shortDescription: 'Iconic terraced garden famous for its evening musical fountain show',
      latitude: 12.4214,
      longitude: 76.5728,
      avgDurationMins: 90,
      avgCostINR: 30,
      bestTimeToVisit: 'Evening for the musical fountain show (starts at 6:30 PM or 7 PM)',
      tags: ['garden', 'fountain', 'evening', 'family-friendly', 'photography', 'romantic'],
      tips: ['Musical fountain show timings: 6:30 PM weekdays, 7 PM weekends', 'The boating in the reservoir is a nice add-on', 'About 20 km from Mysuru — combine with Srirangapatna visit', 'Can get very crowded on weekends and holidays'],
    },
    {
      slug: 'devaraja-market-mysuru',
      name: 'Devaraja Market',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Market',
      description: 'Devaraja Market is Mysuru\'s oldest and most vibrant market, operating for over 130 years. This sprawling bazaar is a feast for the senses — mountains of colourful kumkum powder, jasmine garlands, fresh spices (Mysore sandalwood and agarbatti are famous), silk sarees, and seasonal fruits. The market is the best place to buy Mysore Pak (the famous sweet invented here), sandalwood products, and incense at wholesale prices.',
      shortDescription: 'Mysuru\'s 130-year-old bazaar — spices, silks, flowers, and the original Mysore Pak',
      latitude: 12.3106,
      longitude: 76.6525,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for the freshest produce and flowers; closed on certain days',
      tags: ['market', 'free', 'shopping', 'spices', 'local', 'food', 'photography'],
      tips: ['Buy Mysore Pak from the stalls here — freshest and cheapest in the city', 'Sandalwood products (soap, oil, incense) make great souvenirs', 'Bargain gently — prices are already reasonable', 'Best visited in the morning when produce is freshest'],
    },
  ];

  for (const poi of mysuruPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: mysuru.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: CHENNAI ────────────────────────────────────────────
  console.log('📍 Seeding Chennai POIs...');

  const chennaiPois = [
    {
      slug: 'marina-beach-chennai',
      name: 'Marina Beach',
      category: ExperienceCategory.ISLAND_BEACH,
      subcategory: 'Beach',
      description: 'Marina Beach is the second-longest urban beach in the world, stretching 13 km along the Bay of Bengal. This is Chennai\'s soul — every evening, thousands of Chennaiites gather here to walk, play cricket, eat sundal (spiced chickpeas) and murukku from beach vendors, and watch the sunrise (it\'s an east-facing beach). The beach is flanked by important buildings: the University of Madras, Ice House (Vivekananda Illam), and the lighthouse.',
      shortDescription: 'World\'s second-longest urban beach — Chennai\'s evening gathering place',
      latitude: 13.0500,
      longitude: 80.2824,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning for sunrise; evening for local atmosphere and street food',
      tags: ['beach', 'free', 'iconic', 'sunset', 'street-food', 'family-friendly', 'photography'],
      tips: ['Sunrise here is spectacular — it faces east', 'Try sundal (spiced chickpeas) and murukku from beach vendors', 'Swimming is not recommended due to strong currents', 'The lighthouse is open for visitors — climb for panoramic views'],
    },
    {
      slug: 'kapaleeshwarar-temple-chennai',
      name: 'Kapaleeshwarar Temple',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Temple',
      description: 'Kapaleeshwarar Temple is Chennai\'s finest example of Dravidian architecture — a 7th-century Shiva temple in the heart of Mylapore, one of the oldest residential areas in India. The towering 37-metre gopuram (gateway tower) is covered in brightly painted sculptures of gods, goddesses, and mythological figures. The temple tank and the surrounding Mylapore neighbourhood with its silk shops, filter coffee houses, and sabha (music halls) are quintessential Chennai.',
      shortDescription: 'Stunning 7th-century Dravidian temple with a towering 37-metre gopuram in Mylapore',
      latitude: 13.0337,
      longitude: 80.2696,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for puja atmosphere; evening for beautifully lit gopuram',
      tags: ['temple', 'free', 'Dravidian', 'heritage', 'architecture', 'spiritual', 'must-visit'],
      tips: ['Free entry — remove footwear at the entrance', 'The Arubathimoovar Festival (March/April) is spectacular', 'Explore Mylapore neighbourhood after — excellent filter coffee and silk shops', 'Photography allowed in the outer courtyard only'],
    },
    {
      slug: 'san-thome-cathedral-chennai',
      name: 'San Thome Cathedral',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Church',
      description: 'San Thome Cathedral Basilica is one of only three churches in the world built over the tomb of an apostle of Jesus Christ — St. Thomas, who is believed to have arrived in India in 52 AD. Originally built by the Portuguese in the 16th century, the current neo-Gothic structure dates to 1896. The underground tomb chapel, stained glass windows, and the museum documenting St. Thomas\'s journey to India are deeply moving.',
      shortDescription: 'Neo-Gothic basilica built over the tomb of St. Thomas the Apostle',
      latitude: 13.0336,
      longitude: 80.2783,
      avgDurationMins: 45,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for quiet contemplation; Sunday for Mass',
      tags: ['church', 'free', 'heritage', 'colonial', 'spiritual', 'architecture', 'history'],
      tips: ['The underground tomb chapel is the highlight — deeply atmospheric', 'Free entry and photography allowed', 'Just a short walk from Kapaleeshwarar Temple — visit both', 'The museum on St. Thomas\'s life is informative'],
    },
    {
      slug: 'dakshinachitra-chennai',
      name: 'DakshinaChitra',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Museum',
      description: 'DakshinaChitra is a unique living heritage museum 25 km south of Chennai that showcases the art, architecture, and culture of South India. Authentic traditional houses from Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh have been reconstructed here, with artisans practising traditional crafts (pottery, weaving, kolam-making) in real-time. It\'s the best single-stop introduction to South Indian heritage, culture, and craftsmanship.',
      shortDescription: 'Living heritage museum showcasing authentic South Indian traditional houses and crafts',
      latitude: 12.8214,
      longitude: 80.2314,
      avgDurationMins: 120,
      avgCostINR: 100,
      bestTimeToVisit: 'Morning to avoid afternoon heat; closed on Tuesdays',
      tags: ['museum', 'heritage', 'crafts', 'South-India', 'architecture', 'family-friendly', 'culture'],
      tips: ['Closed on Tuesdays', 'Allow at least 2 hours — there is a lot to see', 'The artisan demonstrations (pottery, weaving) are excellent', 'Located on ECR road — combine with a drive along the coast'],
    },
  ];

  for (const poi of chennaiPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: chennai.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.3,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: PONDICHERRY ────────────────────────────────────────────
  console.log('📍 Seeding Pondicherry POIs...');

  const pondicherryPois = [
    {
      slug: 'french-quarter-walk-pondicherry',
      name: 'French Quarter Walk',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Heritage Walk',
      description: 'The French Quarter (Ville Blanche) is Pondicherry\'s most charming neighbourhood — a grid of tree-lined streets with mustard-yellow colonial villas, bougainvillea-draped walls, and blue-and-white street signs in both French and Tamil. A walking tour takes you past the French Consulate, Lycee Francais, historic churches, and elegant boutique hotels. The area has a distinctly Mediterranean feel that is unique in India.',
      shortDescription: 'Charming colonial quarter with mustard-yellow French villas and bougainvillea-draped streets',
      latitude: 11.9340,
      longitude: 79.8360,
      avgDurationMins: 150,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning or late afternoon for golden light and comfortable walking',
      tags: ['heritage', 'free', 'colonial', 'French', 'walking', 'photography', 'architecture'],
      tips: ['Rent a bicycle for the most charming way to explore', 'Rue Suffren and Rue Dumas are the most photogenic streets', 'Many heritage buildings have been converted to boutique hotels and cafes', 'Free heritage walking tours available on weekends'],
    },
    {
      slug: 'promenade-beach-pondicherry',
      name: 'Promenade Beach',
      category: ExperienceCategory.ISLAND_BEACH,
      subcategory: 'Beach',
      description: 'The Promenade (Goubert Avenue) is Pondicherry\'s iconic 1.5-km seafront walkway along the Bay of Bengal. Lined with heritage buildings, the Gandhi statue, the old lighthouse, and the War Memorial, it is closed to traffic in the early mornings and evenings, transforming into a lively pedestrian zone. The rocky beach is not for swimming but the sunrise views, street food vendors, and the French Quarter backdrop make it Pondicherry\'s most beloved spot.',
      shortDescription: 'Iconic 1.5-km seafront promenade with sunrise views and French Quarter backdrop',
      latitude: 11.9330,
      longitude: 79.8370,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning for sunrise and the car-free promenade experience',
      tags: ['beach', 'free', 'sunrise', 'promenade', 'iconic', 'walking', 'photography'],
      tips: ['Car-free from 6–8:30 AM — the best time to visit', 'Sunrise is spectacular — faces due east', 'The Gandhi statue and War Memorial are at the southern end', 'Evening ice cream vendors and balloon sellers create a festive atmosphere'],
    },
    {
      slug: 'auroville-pondicherry',
      name: 'Auroville',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Spiritual/Experimental',
      description: 'Auroville is an experimental universal township founded in 1968 by Mirra Alfassa (The Mother) and designed by architect Roger Anger. Home to over 3,000 people from 50+ countries, it is dedicated to human unity and conscious living. The centrepiece is the Matrimandir — a stunning 29-metre golden sphere used for silent meditation, surrounded by 12 gardens. The community also features innovative architecture, organic farms, and alternative energy projects.',
      shortDescription: 'Experimental universal township with the golden Matrimandir meditation sphere',
      latitude: 12.0068,
      longitude: 79.8107,
      avgDurationMins: 180,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for Matrimandir viewing; advance booking required for inner chamber meditation',
      tags: ['spiritual', 'free', 'architecture', 'unique', 'meditation', 'community', 'must-visit'],
      tips: ['Book Matrimandir inner chamber meditation at least 2 days in advance', 'The viewpoint gives a good view of the Matrimandir without a booking', 'Carry your own water bottle — limited shops inside', 'Explore the community cafes and organic farms for a deeper experience'],
    },
    {
      slug: 'paradise-beach-pondicherry',
      name: 'Paradise Beach',
      category: ExperienceCategory.ISLAND_BEACH,
      subcategory: 'Beach',
      description: 'Paradise Beach (Plage Paradiso) is a secluded golden sand beach accessible only by a short boat ride from Chunnambar Boathouse. This isolation keeps it uncrowded and pristine — a rarity on India\'s east coast. The crescent-shaped beach is backed by casuarina groves and is perfect for swimming, sunbathing, and beach games. The boat ride through the backwater creek is an added bonus.',
      shortDescription: 'Secluded golden beach accessible only by boat — Pondicherry\'s hidden paradise',
      latitude: 11.8883,
      longitude: 79.8220,
      avgDurationMins: 180,
      avgCostINR: 200,
      bestTimeToVisit: 'Morning for calm seas and fewer visitors',
      tags: ['beach', 'secluded', 'swimming', 'boat-ride', 'nature', 'relaxation'],
      tips: ['Boat from Chunnambar Boathouse — ₹200 return per person', 'Carry your own food and water — limited facilities on the beach', 'Go on weekdays for a near-private beach experience', 'The last boat back is usually at 5:30 PM — confirm timings'],
    },
  ];

  for (const poi of pondicherryPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: pondicherry.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: HAMPI ────────────────────────────────────────────
  console.log('📍 Seeding Hampi POIs...');

  const hampiPois = [
    {
      slug: 'virupaksha-temple-hampi',
      name: 'Virupaksha Temple',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Temple',
      description: 'Virupaksha Temple is the oldest functioning temple in India — continuously worshipped since the 7th century, long before the Vijayanagara Empire made Hampi its capital. The 49-metre gopuram dominates Hampi\'s skyline and the temple\'s inner sanctum houses a Shiva linga. The temple elephant Lakshmi blesses visitors in the mornings. The annual chariot festival (January/February) sees thousands of pilgrims pulling the massive temple chariot through Hampi Bazaar.',
      shortDescription: 'India\'s oldest functioning temple with a 49-metre gopuram — continuously worshipped since the 7th century',
      latitude: 15.3350,
      longitude: 76.4600,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning for puja and elephant blessing; sunset for golden light on the gopuram',
      tags: ['temple', 'free', 'heritage', 'UNESCO', 'ancient', 'spiritual', 'must-visit'],
      tips: ['The temple elephant Lakshmi blesses visitors in the morning — offer a banana or coin', 'Free entry — remove footwear', 'The gopuram is best photographed from across the river at sunset', 'The chariot festival in January/February is spectacular'],
    },
    {
      slug: 'vittala-temple-complex-hampi',
      name: 'Vittala Temple Complex',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Temple/UNESCO',
      description: 'The Vittala Temple Complex is Hampi\'s crowning glory and a UNESCO World Heritage Site masterpiece. The iconic stone chariot (actually a shrine to Garuda) is one of India\'s most photographed monuments. The musical pillars in the main hall produce different musical notes when tapped — an engineering marvel from the 15th century. The complex also features elaborate stone carvings, an ancient marketplace, and the king\'s balance where rulers were weighed against gold.',
      shortDescription: 'UNESCO masterpiece with the iconic stone chariot and musical pillars',
      latitude: 15.3447,
      longitude: 76.4713,
      avgDurationMins: 120,
      avgCostINR: 40,
      bestTimeToVisit: 'Morning for best light and comfortable temperatures; avoid midday heat',
      tags: ['UNESCO', 'temple', 'stone-chariot', 'must-visit', 'architecture', 'heritage', 'photography'],
      tips: ['The stone chariot is on the ₹50 note — compare!', 'Tapping the musical pillars is now restricted to protect them', 'Electric golf carts available from the entrance (₹30)', 'Allow at least 2 hours — the complex is vast'],
    },
    {
      slug: 'matanga-hill-sunrise-hampi',
      name: 'Matanga Hill Sunrise',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Viewpoint',
      description: 'Matanga Hill is the highest point in Hampi and offers the most spectacular sunrise viewpoint in all of Karnataka. The 30-minute scramble up boulders rewards you with a 360-degree panorama of the entire Hampi ruins landscape — the Virupaksha Temple, Achyutaraya Temple, the Tungabhadra River, and the surreal boulder-strewn terrain stretching to the horizon. The sunrise light painting the ancient granite landscape in shades of orange and gold is unforgettable.',
      shortDescription: 'Hampi\'s highest point with a 360-degree sunrise panorama of the ancient ruins',
      latitude: 15.3380,
      longitude: 76.4650,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Pre-dawn for sunrise — start climbing by 5:30 AM',
      tags: ['sunrise', 'viewpoint', 'free', 'trekking', 'photography', 'must-do', 'panorama'],
      tips: ['Start climbing by 5:30 AM for sunrise — carry a torch/phone light', 'Wear shoes with good grip — the rock scramble is steep in parts', 'Carry water — no vendors on top', 'Sunset from here is equally stunning but less popular'],
    },
    {
      slug: 'hippie-island-hampi',
      name: 'Hippie Island',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      subcategory: 'Culture',
      description: 'Across the Tungabhadra River from Hampi\'s main ruins lies Virupapur Gaddi, known as Hippie Island — a laid-back enclave of guesthouses, cafes, rice paddies, and boulder-climbing spots that attracts backpackers, climbers, and digital nomads. The vibe is relaxed and bohemian, with hammock cafes overlooking rice fields, sunset sessions on boulders, and a vibrant community of travellers. The coracle (round boat) crossing from Hampi is an experience in itself.',
      shortDescription: 'Bohemian backpacker enclave across the river with hammock cafes and boulder climbing',
      latitude: 15.3450,
      longitude: 76.4450,
      avgDurationMins: 240,
      avgCostINR: 0,
      bestTimeToVisit: 'October–March for pleasant weather; evening for sunset on boulders',
      tags: ['backpacker', 'free', 'bouldering', 'cafe', 'bohemian', 'river', 'adventure'],
      tips: ['Cross by coracle (round boat) from near Virupaksha Temple — ₹20–50', 'The motorized ferry from the main ghat is more reliable', 'Many budget guesthouses with river views from ₹500/night', 'The bouldering here is world-class — equipment rental available'],
    },
  ];

  for (const poi of hampiPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: hampi.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: KOLKATA ────────────────────────────────────────────
  console.log('📍 Seeding Kolkata POIs...');

  const kolkataPois = [
    {
      slug: 'victoria-memorial-kolkata',
      name: 'Victoria Memorial',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Museum/Landmark',
      description: 'The Victoria Memorial is Kolkata\'s most iconic monument — a magnificent white marble building blending British and Mughal architecture, set in 64 acres of manicured gardens. Built between 1906 and 1921 to commemorate Queen Victoria, it now houses a museum with an extraordinary collection of Mughal miniatures, oil paintings, rare books, and artifacts from the British Raj. The evening sound-and-light show and the illuminated building at night are spectacular.',
      shortDescription: 'Magnificent white marble monument with Mughal-British architecture and a world-class museum',
      latitude: 22.5448,
      longitude: 88.3426,
      avgDurationMins: 120,
      avgCostINR: 30,
      bestTimeToVisit: 'Late afternoon for golden light; evening for the sound-and-light show',
      tags: ['landmark', 'museum', 'must-visit', 'heritage', 'colonial', 'photography', 'architecture'],
      tips: ['Evening sound-and-light show is excellent (₹50)', 'The gardens are beautiful for a stroll — entry separate from museum', 'Photography allowed outside but not inside the museum', 'Closed on Mondays and national holidays'],
    },
    {
      slug: 'howrah-bridge-kolkata',
      name: 'Howrah Bridge',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Landmark',
      description: 'Howrah Bridge (Rabindra Setu) is one of the most iconic structures in India — a cantilever bridge spanning the Hooghly River that carries over 100,000 vehicles and countless pedestrians daily. Built in 1943 without any nuts or bolts (it is held together by rivets), the bridge\'s silhouette against the sunset or in the early morning mist is quintessential Kolkata. The Mallick Ghat flower market beneath it adds a splash of colour and fragrance.',
      shortDescription: 'India\'s iconic rivet-held cantilever bridge — Kolkata\'s defining landmark since 1943',
      latitude: 22.5850,
      longitude: 88.3467,
      avgDurationMins: 30,
      avgCostINR: 0,
      bestTimeToVisit: 'Sunrise for misty views; evening for illumination',
      tags: ['landmark', 'free', 'iconic', 'photography', 'engineering', 'bridge'],
      tips: ['Photography ON the bridge is technically prohibited — be discreet', 'Best photographed from the Prinsep Ghat or a boat on the Hooghly', 'Visit the Mallick Ghat flower market underneath at dawn', 'Walk across for the full experience — it takes about 15 minutes'],
    },
    {
      slug: 'college-street-kolkata',
      name: 'College Street',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Book Market',
      description: 'College Street (Boi Para) is the largest second-hand book market in the world and the intellectual heart of Kolkata. Stretching along the campus walls of Presidency University and the Calcutta Medical College, thousands of bookstalls sell everything from rare first editions to the latest textbooks at a fraction of retail price. The legendary Indian Coffee House, where Kolkata\'s intellectuals have debated for decades, is a must-visit.',
      shortDescription: 'World\'s largest second-hand book market and home to the legendary Indian Coffee House',
      latitude: 22.5726,
      longitude: 88.3620,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'Late morning for the best book-browsing and a coffee at Indian Coffee House',
      tags: ['books', 'free', 'market', 'intellectual', 'coffee', 'heritage', 'unique'],
      tips: ['Visit the Indian Coffee House for filter coffee and nostalgia', 'Bargain is expected — start at 40% of asking price for old books', 'Best on weekday mornings when stalls are fully stocked', 'Carry a tote bag — you will buy more books than you planned'],
    },
    {
      slug: 'kumartuli-kolkata',
      name: 'Kumartuli',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Artisan Quarter',
      description: 'Kumartuli is Kolkata\'s extraordinary artisan quarter where hundreds of sculptors (kumars) create the clay idols of Durga, Kali, Saraswati, and other deities used in Kolkata\'s legendary festivals. Walking through the narrow lanes, you see every stage of the process — bamboo frames, straw bodies, clay sculpting, and the final painting. In the months before Durga Puja (September/October), the energy is electric. It is a living tradition unchanged for over 300 years.',
      shortDescription: 'Historic artisan quarter where hundreds of sculptors craft clay deities for Kolkata\'s festivals',
      latitude: 22.5930,
      longitude: 88.3620,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'August–September when Durga Puja preparation is at its peak',
      tags: ['art', 'free', 'artisan', 'Durga-Puja', 'heritage', 'unique', 'photography', 'culture'],
      tips: ['Visit in August–September for Durga Puja preparation at its peak', 'Ask permission before photographing the artisans and their work', 'The lanes are narrow and can be muddy — wear appropriate shoes', 'A local guide adds tremendous context to the visit'],
    },
    {
      slug: 'park-street-kolkata',
      name: 'Park Street',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Food/Nightlife',
      description: 'Park Street is Kolkata\'s most famous boulevard — a wide, tree-lined avenue that has been the city\'s food, nightlife, and cultural epicentre since the 1950s. Iconic restaurants like Peter Cat (chelo kebab), Mocambo (continental), Flurys (breakfast and pastries), and Bar-B-Q are institutions. During Christmas and New Year, Park Street is illuminated with spectacular lights and becomes the centre of Kolkata\'s celebrations.',
      shortDescription: 'Kolkata\'s legendary food and nightlife boulevard with iconic restaurants since the 1950s',
      latitude: 22.5516,
      longitude: 88.3524,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening for dinner and atmosphere; Christmas week for spectacular illuminations',
      tags: ['food', 'free', 'nightlife', 'restaurants', 'Christmas', 'iconic', 'heritage'],
      tips: ['Peter Cat\'s chelo kebab is legendary — expect a queue', 'Flurys for breakfast/brunch is a Kolkata tradition', 'Christmas illuminations (December) are spectacular', 'The South Park Street Cemetery nearby is a hauntingly beautiful colonial relic'],
    },
  ];

  for (const poi of kolkataPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: kolkata.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: DARJEELING ────────────────────────────────────────────
  console.log('📍 Seeding Darjeeling POIs...');

  const darjeelingPois = [
    {
      slug: 'tiger-hill-sunrise-darjeeling',
      name: 'Tiger Hill Sunrise',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Viewpoint',
      description: 'Tiger Hill (2,590 m) offers one of the most spectacular sunrise views on Earth — the first rays of sunlight hitting the snow-capped peak of Kanchenjunga (8,586 m, world\'s third-highest mountain) and, on exceptionally clear days, Mount Everest in the far distance. The play of light on the Himalayan peaks, turning from deep blue to pink to gold, is a once-in-a-lifetime experience. Jeeps depart from Darjeeling town at 4 AM.',
      shortDescription: 'Legendary sunrise viewpoint with Kanchenjunga and (on clear days) Everest views',
      latitude: 26.9978,
      longitude: 88.2640,
      avgDurationMins: 120,
      avgCostINR: 100,
      bestTimeToVisit: 'October–December for clearest skies; arrive by 5 AM',
      tags: ['sunrise', 'viewpoint', 'Kanchenjunga', 'must-do', 'Himalayas', 'photography', 'iconic'],
      tips: ['Book a shared jeep the night before (₹100–150 per person, departs 4 AM)', 'Carry heavy warm clothing — it is freezing at dawn', 'October–December has the clearest skies', 'The observation lounge has telescopes for a closer view (₹10)'],
    },
    {
      slug: 'darjeeling-himalayan-railway',
      name: 'Darjeeling Himalayan Railway',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      subcategory: 'Heritage Railway',
      description: 'The Darjeeling Himalayan Railway (DHR) — affectionately known as the "Toy Train" — is a UNESCO World Heritage Site and one of the most charming railway journeys in the world. Built in 1881, the narrow-gauge steam locomotive climbs from New Jalpaiguri (at 100 m) to Darjeeling (at 2,200 m) through loops, zigzags, and spirals, passing through tea gardens and Himalayan villages. The Batasia Loop with its war memorial and Kanchenjunga backdrop is the highlight.',
      shortDescription: 'UNESCO heritage steam train climbing through tea gardens and Himalayan spirals since 1881',
      latitude: 27.0485,
      longitude: 88.2637,
      avgDurationMins: 120,
      avgCostINR: 800,
      bestTimeToVisit: 'Morning for the Darjeeling–Ghum joyride; October–December for clear mountain views',
      tags: ['UNESCO', 'heritage', 'train', 'must-do', 'iconic', 'photography', 'adventure'],
      tips: ['The 2-hour Darjeeling–Ghum joyride is the most popular option (₹800)', 'Sit on the right side for the best Kanchenjunga views', 'The Batasia Loop photo stop is the highlight', 'Full NJP–Darjeeling journey takes 7–8 hours — book well in advance'],
    },
    {
      slug: 'tea-garden-tour-darjeeling',
      name: 'Tea Garden Tour',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Plantation',
      description: 'Darjeeling produces the "Champagne of Teas" — a muscatel-flavoured tea prized worldwide. A tour of the Happy Valley Tea Estate (one of the oldest, established 1854) or Makaibari (the world\'s first tea factory, 1859) takes you through the plucking process, withering troughs, rolling machines, and fermentation rooms. The tasting session at the end, where you learn to distinguish first flush from second flush, is an education in itself.',
      shortDescription: 'Tour the gardens producing the "Champagne of Teas" with tastings of rare first flush',
      latitude: 27.0360,
      longitude: 88.2600,
      avgDurationMins: 90,
      avgCostINR: 200,
      bestTimeToVisit: 'March–May for first flush plucking season; mornings for factory tours',
      tags: ['tea', 'plantation', 'tasting', 'heritage', 'must-do', 'food', 'photography'],
      tips: ['Happy Valley Tea Estate is the most accessible from Darjeeling town', 'First flush (March–April) and second flush (May–June) are peak plucking seasons', 'Buy tea directly from the estate — significantly cheaper than shops', 'Combine with a walk through the surrounding tea gardens'],
    },
    {
      slug: 'peace-pagoda-darjeeling',
      name: 'Peace Pagoda',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monument',
      description: 'The Japanese Peace Pagoda (Nipponzan Myohoji) in Darjeeling is one of over 80 peace pagodas built worldwide by the Japanese Buddhist monk Nichidatsu Fujii after World War II. The gleaming white stupa contains relics of the Buddha and features four golden avatars of the Buddha on its exterior. Set on a hilltop among pine and deodar forests, it offers serene views of Kanchenjunga and a profoundly peaceful atmosphere.',
      shortDescription: 'Serene Japanese Buddhist stupa with golden Buddha statues and Kanchenjunga views',
      latitude: 27.0400,
      longitude: 88.2540,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Late afternoon for golden light on the pagoda and mountain views',
      tags: ['monument', 'free', 'Buddhist', 'peace', 'spiritual', 'views', 'photography'],
      tips: ['Free entry and a wonderfully peaceful atmosphere', 'Accessible by a short walk or taxi from Darjeeling town', 'Combine with the nearby Darjeeling Ropeway', 'Monks chant at the pagoda at dawn and dusk'],
    },
  ];

  for (const poi of darjeelingPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: darjeeling.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: GANGTOK ────────────────────────────────────────────
  console.log('📍 Seeding Gangtok POIs...');

  const gangtokPois = [
    {
      slug: 'tsomgo-lake-gangtok',
      name: 'Tsomgo Lake',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Lake',
      description: 'Tsomgo Lake (Changu Lake) is a glacial lake at 3,753 metres, about 40 km from Gangtok on the old Nathu La trade route. The oval-shaped lake, held sacred by the Sikkimese, changes colour with the seasons — from deep blue in summer to completely frozen white in winter. Surrounded by steep mountains and rhododendrons, the lake is stunningly beautiful. Yak rides along the lakeshore are a popular activity.',
      shortDescription: 'Sacred glacial lake at 3,753m that changes colour with the seasons',
      latitude: 27.3754,
      longitude: 88.7675,
      avgDurationMins: 120,
      avgCostINR: 200,
      bestTimeToVisit: 'May–June for rhododendrons; December–February for frozen lake',
      tags: ['lake', 'glacial', 'nature', 'sacred', 'photography', 'yak-ride', 'high-altitude'],
      tips: ['Indian nationals need a Protected Area Permit (PAP) — arranged through tour operators', 'Carry altitude sickness medication — the lake is at 3,753m', 'Yak rides available for ₹300–500', 'Road can be closed in heavy snowfall — check before going'],
    },
    {
      slug: 'nathula-pass-gangtok',
      name: 'Nathula Pass',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      subcategory: 'Border/Viewpoint',
      description: 'Nathula Pass (4,310 m) on the India-China border is one of the highest motorable passes in the world and was once part of the ancient Silk Route connecting India to Tibet. Indian tourists can visit the border post where Indian and Chinese soldiers stand face to face. The drive from Gangtok through alpine meadows, yak-grazed hillsides, and snow-dusted peaks is as spectacular as the destination. A deeply patriotic and geographically thrilling experience.',
      shortDescription: 'India-China border at 4,310m on the ancient Silk Route — one of the world\'s highest passes',
      latitude: 27.3863,
      longitude: 88.8306,
      avgDurationMins: 180,
      avgCostINR: 200,
      bestTimeToVisit: 'May–October (closed November–April); Wednesday and weekends only',
      tags: ['border', 'adventure', 'high-altitude', 'Silk-Route', 'must-do', 'photography', 'patriotic'],
      tips: ['Open only on Wednesday, Thursday, Saturday, and Sunday', 'Protected Area Permit required — arranged through registered tour operators only', 'Acclimatize at Tsomgo Lake first before ascending to 4,310m', 'Carry warm clothing, sunscreen, and altitude medication'],
    },
    {
      slug: 'rumtek-monastery-gangtok',
      name: 'Rumtek Monastery',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Monastery',
      description: 'Rumtek Monastery is the seat of the Karmapa — the head of the Kagyu school of Tibetan Buddhism — and is one of the most important Buddhist monasteries outside Tibet. The original monastery was built in 1740, and the current magnificent structure was rebuilt in the 1960s by the 16th Karmapa after fleeing Tibet. The Golden Stupa in the Dharma Chakra Centre, the thangka paintings, and the prayer halls are extraordinary. The monastery offers a profound sense of peace.',
      shortDescription: 'Seat of the Karmapa — one of the most important Tibetan Buddhist monasteries outside Tibet',
      latitude: 27.2875,
      longitude: 88.5725,
      avgDurationMins: 90,
      avgCostINR: 10,
      bestTimeToVisit: 'Morning for prayer sessions; Tibetan New Year (Losar) for festivities',
      tags: ['monastery', 'Buddhist', 'spiritual', 'heritage', 'Tibetan', 'architecture', 'peace'],
      tips: ['Photography is not allowed inside the prayer halls', 'The Golden Stupa contains the relics of the 16th Karmapa', 'About 24 km from Gangtok — taxi takes 1 hour', 'Dress modestly and maintain silence in the prayer halls'],
    },
    {
      slug: 'mg-marg-gangtok',
      name: 'MG Marg',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Promenade',
      description: 'MG Marg (Mahatma Gandhi Road) is Gangtok\'s charming pedestrian-only main street — one of the cleanest and most well-maintained public spaces in India. Lined with shops, cafes, restaurants, and handicraft stores, it is the social heart of Gangtok. Try momos (Sikkim-style with fiery chutney), thukpa (noodle soup), and churpi (yak cheese) from the street vendors. The views of Kanchenjunga from the benches along the promenade are a bonus.',
      shortDescription: 'Gangtok\'s charming pedestrian promenade — momos, mountain views, and Sikkimese culture',
      latitude: 27.3314,
      longitude: 88.6126,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Evening for the liveliest atmosphere and mountain views',
      tags: ['promenade', 'free', 'food', 'shopping', 'momos', 'evening', 'family-friendly'],
      tips: ['Try Sikkimese momos from the street vendors — different from Delhi-style', 'The pedestrian zone is car-free — perfect for evening strolls', 'Buy Sikkimese handicrafts and thangka paintings from the shops', 'Kanchenjunga views from the benches on clear evenings'],
    },
  ];

  for (const poi of gangtokPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: gangtok.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: SHILLONG ────────────────────────────────────────────
  console.log('📍 Seeding Shillong POIs...');

  const shillongPois = [
    {
      slug: 'living-root-bridges-cherrapunji',
      name: 'Living Root Bridges (Cherrapunji)',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Natural Wonder',
      description: 'The living root bridges of Meghalaya are one of the world\'s most extraordinary examples of bio-engineering. The Khasi and Jaintia tribes train the aerial roots of Ficus elastica trees across rivers and streams, creating natural bridges that grow stronger over centuries. The double-decker root bridge at Nongriat village (3,500+ steps down and up!) is the most famous, and is believed to be over 200 years old. These are UNESCO-tentative listed and found nowhere else on Earth.',
      shortDescription: 'Bio-engineered tree root bridges found nowhere else on Earth — a 200-year-old living wonder',
      latitude: 25.2880,
      longitude: 91.7207,
      avgDurationMins: 300,
      avgCostINR: 0,
      bestTimeToVisit: 'October–April for dry weather and comfortable trekking; avoid monsoon',
      tags: ['nature', 'free', 'trekking', 'unique', 'UNESCO-tentative', 'must-do', 'adventure', 'photography'],
      tips: ['The trek to the double-decker bridge is 3,500 steps each way — requires good fitness', 'Start early morning and carry plenty of water and snacks', 'Stay overnight at Nongriat village to avoid the exhausting return climb in one day', 'Hire a local Khasi guide for the safest experience'],
    },
    {
      slug: 'umiam-lake-shillong',
      name: 'Umiam Lake',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Lake',
      description: 'Umiam Lake (Barapani) is a stunning reservoir 15 km north of Shillong, surrounded by pine-covered East Khasi Hills. Created by damming the Umiam River in 1965, the lake\'s deep blue-green waters against the backdrop of forested hills create a scene reminiscent of a Scottish loch — earning Shillong its nickname "Scotland of the East." Boating, kayaking, and water sports are available, and the lakeside picnic spots are popular with locals.',
      shortDescription: 'Stunning blue-green reservoir surrounded by pine hills — the "Scotland of the East"',
      latitude: 25.6586,
      longitude: 91.8772,
      avgDurationMins: 90,
      avgCostINR: 20,
      bestTimeToVisit: 'Morning for mirror-like reflections; October–March for clear skies',
      tags: ['lake', 'nature', 'boating', 'photography', 'scenic', 'picnic', 'water-sports'],
      tips: ['Stop on the highway viewpoint for the best panoramic photograph', 'Boating and kayaking available at the Orchid Lake Resort side', 'The lake is on the Guwahati–Shillong highway — visit on arrival or departure', 'Carry a jacket — it can be windy and cool by the lake'],
    },
    {
      slug: 'don-bosco-museum-shillong',
      name: 'Don Bosco Museum',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Museum',
      description: 'The Don Bosco Centre for Indigenous Cultures is one of the finest museums in India and the best place to understand Northeast India\'s extraordinary tribal diversity. Spread over seven floors, it documents the cultures, crafts, textiles, music, and traditions of over 30 tribal groups across all eight Northeastern states. The skywalk on the top floor offers panoramic views of Shillong. The museum is a masterclass in ethnographic documentation.',
      shortDescription: 'Seven-storey museum documenting 30+ tribal cultures of Northeast India',
      latitude: 25.5690,
      longitude: 91.8820,
      avgDurationMins: 120,
      avgCostINR: 100,
      bestTimeToVisit: 'Morning to spend adequate time; closed on Sundays',
      tags: ['museum', 'tribal', 'culture', 'Northeast-India', 'heritage', 'must-visit', 'education'],
      tips: ['Allow at least 2 hours — there is an enormous amount to see', 'The 7th floor skywalk has excellent Shillong panoramic views', 'Closed on Sundays', 'The tribal textile and costume section is outstanding'],
    },
    {
      slug: 'dawki-river-shillong',
      name: 'Dawki River',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'River',
      description: 'The Umngot River at Dawki is famous for its crystal-clear water — so transparent that boats appear to float in mid-air. Located on the India-Bangladesh border, 96 km from Shillong, Dawki has become one of India\'s most viral travel destinations. Beyond the Instagram moments, the river valley with its limestone cliffs and the Jaintia Hills backdrop is genuinely breathtaking. Boating on the river is the main activity.',
      shortDescription: 'Crystal-clear river where boats appear to float in mid-air — India\'s most viral travel spot',
      latitude: 25.1868,
      longitude: 92.0186,
      avgDurationMins: 180,
      avgCostINR: 500,
      bestTimeToVisit: 'October–May for clear water; avoid monsoon when water turns turbid',
      tags: ['river', 'boating', 'crystal-clear', 'photography', 'must-visit', 'nature', 'border'],
      tips: ['Boat ride costs ₹500–800 per boat (seats 4–5)', 'Water is clearest in winter (November–February)', 'Combine with a visit to the Bangladesh border and Tamabil market', 'The drive from Shillong takes about 2.5 hours — start early'],
    },
  ];

  for (const poi of shillongPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: shillong.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.5,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  // ── POIs: AHMEDABAD ────────────────────────────────────────────
  console.log('📍 Seeding Ahmedabad POIs...');

  const ahmedabadPois = [
    {
      slug: 'sabarmati-ashram-ahmedabad',
      name: 'Sabarmati Ashram',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Museum/Heritage',
      description: 'Sabarmati Ashram, on the banks of the Sabarmati River, was Mahatma Gandhi\'s home for 13 years (1917–1930) and the epicentre of India\'s freedom struggle. It was from here that Gandhi launched the historic Dandi Salt March in 1930. The ashram preserves Gandhi\'s spartan living quarters (Hriday Kunj), his iconic spinning wheel (charkha), and an excellent museum with his letters, photographs, and personal belongings. A deeply moving and inspirational visit.',
      shortDescription: 'Gandhi\'s home for 13 years and launchpad of the Salt March — India\'s most sacred freedom shrine',
      latitude: 23.0607,
      longitude: 72.5807,
      avgDurationMins: 90,
      avgCostINR: 0,
      bestTimeToVisit: 'Early morning for a peaceful experience; evenings for the river-view sunset',
      tags: ['heritage', 'free', 'Gandhi', 'freedom', 'museum', 'must-visit', 'history', 'spiritual'],
      tips: ['Free entry and open every day', 'The museum and sound-and-light show are excellent', 'Visit early morning for the most peaceful experience', 'The riverfront promenade nearby is great for an evening walk'],
    },
    {
      slug: 'adalaj-stepwell-ahmedabad',
      name: 'Adalaj Stepwell',
      category: ExperienceCategory.CULTURE_HISTORY,
      subcategory: 'Architecture',
      description: 'Adalaj Vav is one of India\'s finest stepwells — a five-storey deep structure built in 1498 in Indo-Islamic architectural style. Stepwells were ingenious water-harvesting structures that also served as cool retreats and social gathering places. Adalaj\'s intricately carved pillars, galleries, and platforms feature a mesmerizing blend of Hindu and Islamic motifs — floral patterns, dancing figures, elephants, and geometric designs that showcase the secular artistry of 15th-century Gujarat.',
      shortDescription: 'Exquisitely carved five-storey stepwell blending Hindu and Islamic architecture from 1498',
      latitude: 23.1668,
      longitude: 72.5812,
      avgDurationMins: 60,
      avgCostINR: 0,
      bestTimeToVisit: 'Morning for the best light filtering through the levels; midday for dramatic shadows',
      tags: ['architecture', 'free', 'stepwell', 'heritage', 'photography', 'must-visit', 'UNESCO-tentative'],
      tips: ['Free entry and open every day', 'The play of light and shadow at midday is magical for photography', 'About 18 km from Ahmedabad centre — combine with other outskirts visits', 'One of the most photogenic monuments in Gujarat'],
    },
    {
      slug: 'manek-chowk-night-market-ahmedabad',
      name: 'Manek Chowk Night Market',
      category: ExperienceCategory.FOOD_MARKETS,
      subcategory: 'Night Market',
      description: 'Manek Chowk is Ahmedabad\'s legendary triple-duty square — a vegetable market by morning, a jewellery bazaar by afternoon, and Gujarat\'s most famous street food destination by night. After 9 PM, the square transforms into an electric open-air food court serving Ahmedabad\'s iconic dishes: handvo, dal-vada, pav bhaji, kulfi falooda, masala gola, and the city-famous sandwich varieties. Entirely vegetarian, incredibly delicious, and quintessentially Gujarati.',
      shortDescription: 'Ahmedabad\'s legendary night food market — three identities, one square, pure vegetarian bliss',
      latitude: 23.0245,
      longitude: 72.5831,
      avgDurationMins: 120,
      avgCostINR: 0,
      bestTimeToVisit: 'After 9 PM for the street food experience; past 10 PM for peak buzz',
      tags: ['street-food', 'free', 'night-market', 'vegetarian', 'must-visit', 'local', 'food', 'iconic'],
      tips: ['Come hungry — you will want to try everything', 'The food stalls open after 9 PM and peak around 10:30 PM', 'Everything is vegetarian — this is Gujarat', 'Try the famous Ahmedabad sandwich, kulfi falooda, and handvo'],
    },
    {
      slug: 'kankaria-lake-ahmedabad',
      name: 'Kankaria Lake',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      subcategory: 'Park/Lake',
      description: 'Kankaria Lake is a 500-year-old polygonal lake in the heart of Ahmedabad that has been transformed into the city\'s favourite recreational space. The 2.5 km lakefront promenade features a zoo, amusement park, balloon ride, food courts, kid\'s play areas, and the beautiful Nagina Wadi island garden. The evening atmosphere, with families strolling, street food vendors, and the illuminated lakefront, captures Ahmedabad\'s family-friendly culture perfectly.',
      shortDescription: '500-year-old lakefront recreation area — Ahmedabad\'s beloved evening gathering place',
      latitude: 23.0068,
      longitude: 72.6019,
      avgDurationMins: 120,
      avgCostINR: 25,
      bestTimeToVisit: 'Evening for the best atmosphere and illuminated lakefront',
      tags: ['lake', 'park', 'family-friendly', 'evening', 'recreation', 'heritage', 'food'],
      tips: ['Entry fee is ₹25 — very affordable for the experience', 'The balloon ride offers excellent aerial views', 'Kankaria Carnival (December) is a festive highlight', 'Car-free Sundays on the lakefront are popular'],
    },
  ];

  for (const poi of ahmedabadPois) {
    await prisma.pointOfInterest.upsert({
      where: { slug: poi.slug },
      update: {},
      create: {
        cityId: ahmedabad.id,
        name: poi.name,
        slug: poi.slug,
        category: poi.category,
        subcategory: poi.subcategory,
        description: poi.description,
        shortDescription: poi.shortDescription,
        latitude: poi.latitude,
        longitude: poi.longitude,
        avgDurationMins: poi.avgDurationMins,
        avgCostINR: poi.avgCostINR,
        bestTimeToVisit: poi.bestTimeToVisit,
        tags: poi.tags,
        tips: poi.tips,
        status: ContentStatus.PUBLISHED,
        ratingAvg: 4.4,
        ratingCount: Math.floor(Math.random() * 200) + 80,
      },
    });
  }

  console.log('✅ POIs Part 2 seeded for 13 cities (53 additional POIs)');

  // ── EXPERIENCES ──────────────────────────────────────────
  console.log('✨ Seeding India experiences...');

  const indiaExperiences = [
    {
      slug: 'rajasthan-heritage-trail',
      name: 'Rajasthan Heritage Trail',
      category: ExperienceCategory.CULTURE_HISTORY,
      shortDescription: 'Explore Rajasthan\'s magnificent forts, palaces, and living traditions across the Land of Kings',
      description: 'Rajasthan is India\'s most visually dramatic state — a land of imposing hilltop forts, opulent palaces, colourful bazaars, and desert landscapes straight out of a fairy tale. From the pink city of Jaipur and the blue city of Jodhpur to the golden city of Jaisalmer and the lake city of Udaipur, every stop is a masterclass in architecture, history, and Rajput culture. The heritage hotels (converted havelis and palaces) make the experience even more immersive.',
      idealDurationDays: { min: 7, max: 10 },
      budgetRangeINR: { budget: 20000, midRange: 50000, luxury: 200000 },
      bestDestinations: ['india'],
      tags: ['heritage', 'forts', 'palaces', 'culture', 'photography'],
    },
    {
      slug: 'kerala-backwater-cruise',
      name: 'Kerala Backwater Cruise',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      shortDescription: 'Glide through Kerala\'s palm-fringed backwater canals on a traditional houseboat',
      description: 'Kerala\'s backwaters — a 900-km network of interconnected canals, rivers, and lakes — are one of India\'s most unique ecosystems. A houseboat cruise from Alleppey through the Vembanad Lake system is the quintessential Kerala experience. Watch village life unfold along the banks: fishermen casting nets, women washing clothes, toddy tappers climbing coconut trees. The overnight experience, with a personal chef cooking fresh Kerala cuisine on board, is magical.',
      idealDurationDays: { min: 2, max: 4 },
      budgetRangeINR: { budget: 5000, midRange: 15000, luxury: 50000 },
      bestDestinations: ['india'],
      tags: ['backwaters', 'houseboat', 'nature', 'relaxation', 'Kerala'],
    },
    {
      slug: 'goa-beach-hopping',
      name: 'Goa Beach Hopping',
      category: ExperienceCategory.ISLAND_BEACH,
      shortDescription: 'Discover Goa\'s diverse beaches — from party shores to secluded coves and Portuguese heritage',
      description: 'Goa offers India\'s most diverse beach experience. North Goa has the famous party beaches (Baga, Calangute, Anjuna) with beach shacks, nightclubs, and flea markets. South Goa has quieter, more upscale stretches (Palolem, Agonda, Cola). Beyond the beaches, Goa\'s Portuguese heritage — centuries-old churches, Latin Quarter houses, and a unique Indo-Portuguese cuisine — adds cultural depth. The monsoon season transforms Goa into a lush green paradise ideal for exploring waterfalls and spice plantations.',
      idealDurationDays: { min: 3, max: 5 },
      budgetRangeINR: { budget: 8000, midRange: 20000, luxury: 60000 },
      bestDestinations: ['india'],
      tags: ['beach', 'nightlife', 'Portuguese', 'seafood', 'relaxation'],
    },
    {
      slug: 'himalayan-trekking',
      name: 'Himalayan Trekking',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      shortDescription: 'Trek through the world\'s mightiest mountain range — from meadows to glaciers',
      description: 'The Indian Himalayas offer treks for every level — from the beginner-friendly Triund (Dharamshala) and Kedarkantha (Uttarakhand) to the challenging Chadar frozen river trek (Ladakh) and Rupin Pass. The landscapes transition from dense deodar forests to alpine meadows (bugyals), glacial moraines, and snow-capped peaks. Popular circuits include the Valley of Flowers, Roopkund, Hampta Pass, and the Pin Parvati. The trekking season is typically May–June and September–October.',
      idealDurationDays: { min: 5, max: 12 },
      budgetRangeINR: { budget: 8000, midRange: 25000, luxury: 60000 },
      bestDestinations: ['india'],
      tags: ['trekking', 'mountains', 'adventure', 'nature', 'Himalayas'],
    },
    {
      slug: 'south-indian-temple-trail',
      name: 'South Indian Temple Trail',
      category: ExperienceCategory.CULTURE_HISTORY,
      shortDescription: 'Journey through Tamil Nadu\'s magnificent Dravidian temples — towering gopurams and living traditions',
      description: 'Tamil Nadu has the densest concentration of monumental Hindu temples in the world. The great Chola temples of Thanjavur and Gangaikonda Cholapuram (UNESCO), the sprawling Meenakshi Amman Temple in Madurai, the Shore Temple at Mamallapuram, and the Brihadeeswarar Temple are architectural marvels spanning 1,000+ years. These are not museums — they are living temples with daily pujas, festivals, and rituals that have continued unbroken for centuries.',
      idealDurationDays: { min: 7, max: 10 },
      budgetRangeINR: { budget: 10000, midRange: 25000, luxury: 60000 },
      bestDestinations: ['india'],
      tags: ['temples', 'Dravidian', 'heritage', 'UNESCO', 'spirituality'],
    },
    {
      slug: 'indian-street-food-odyssey',
      name: 'Indian Street Food Odyssey',
      category: ExperienceCategory.FOOD_MARKETS,
      shortDescription: 'Eat your way across India\'s legendary street food capitals — chaat, kebabs, dosas, and more',
      description: 'India is the world\'s greatest street food destination. Every city has its iconic dishes: Delhi\'s Chandni Chowk (paranthas, chaat, jalebis), Lucknow\'s Aminabad (galouti kebabs, biryani), Kolkata\'s Park Street (kathi rolls, mishti doi), Mumbai\'s Chowpatty (vada pav, pav bhaji), Ahmedabad\'s Manek Chowk (handvo, fafda), and Chennai\'s Mylapore (filter coffee, idli-sambar). A food trail across India is a journey through the country\'s soul.',
      idealDurationDays: { min: 5, max: 10 },
      budgetRangeINR: { budget: 5000, midRange: 15000, luxury: 30000 },
      bestDestinations: ['india'],
      tags: ['street-food', 'food-trail', 'vegetarian', 'culture', 'budget-friendly'],
    },
    {
      slug: 'golden-triangle-tour',
      name: 'Golden Triangle Tour',
      category: ExperienceCategory.CULTURE_HISTORY,
      shortDescription: 'India\'s classic introduction — Delhi, Agra, and Jaipur in one iconic circuit',
      description: 'The Golden Triangle is India\'s most popular tourist circuit, connecting Delhi (Mughal and modern capital), Agra (Taj Mahal, Agra Fort), and Jaipur (Pink City, Amber Fort) in a roughly triangular route. Each leg is 4–6 hours by road or train, making it an efficient introduction to India\'s diversity. The circuit covers Mughal architecture, Rajput heritage, bustling bazaars, and some of the world\'s most recognizable monuments — all in under a week.',
      idealDurationDays: { min: 4, max: 6 },
      budgetRangeINR: { budget: 10000, midRange: 30000, luxury: 100000 },
      bestDestinations: ['india'],
      tags: ['classic', 'Taj-Mahal', 'heritage', 'first-trip', 'must-do'],
    },
    {
      slug: 'ladakh-road-trip',
      name: 'Ladakh Road Trip',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      shortDescription: 'Epic high-altitude road trip through Ladakh\'s moonscapes, monasteries, and mountain passes',
      description: 'The Manali–Leh and Srinagar–Leh highways are among the world\'s most spectacular road journeys, crossing multiple passes above 4,000 m. Ladakh itself is a high-altitude desert of surreal beauty — azure Pangong Lake, the magnetic hill, Nubra Valley\'s sand dunes and Bactrian camels, and ancient Buddhist monasteries (Thiksey, Hemis, Diskit) clinging to mountainsides. The Royal Enfield motorcycle trip to Ladakh is a rite of passage for Indian travellers.',
      idealDurationDays: { min: 10, max: 14 },
      budgetRangeINR: { budget: 25000, midRange: 50000, luxury: 120000 },
      bestDestinations: ['india'],
      tags: ['road-trip', 'motorcycle', 'high-altitude', 'monastery', 'adventure'],
    },
    {
      slug: 'kerala-ayurveda-retreat',
      name: 'Kerala Ayurveda Retreat',
      category: ExperienceCategory.LUXURY_STAYS,
      shortDescription: 'Rejuvenate with authentic Ayurvedic treatments in Kerala — India\'s wellness capital',
      description: 'Kerala is the birthplace of Ayurveda, and the state\'s dedicated Ayurvedic resorts offer authentic Panchakarma detox programmes, Abhyanga massages, Shirodhara treatments, and holistic wellness experiences rooted in 5,000 years of tradition. From budget ashram-style centres to luxury retreats like Somatheeram and Kairali, Kerala offers Ayurveda at every price point. The monsoon season (June–September) is traditionally considered the best time for Ayurvedic treatments.',
      idealDurationDays: { min: 5, max: 14 },
      budgetRangeINR: { budget: 20000, midRange: 60000, luxury: 200000 },
      bestDestinations: ['india'],
      tags: ['Ayurveda', 'wellness', 'spa', 'luxury', 'monsoon'],
    },
    {
      slug: 'wildlife-safari-india',
      name: 'Wildlife Safari India',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      shortDescription: 'Track tigers, elephants, and rhinos in India\'s spectacular national parks',
      description: 'India is home to over 100 national parks, including some of the best wildlife viewing in Asia. Ranthambore (Rajasthan), Jim Corbett (Uttarakhand), and Bandhavgarh (MP) offer the best tiger-sighting odds. Kaziranga (Assam) is home to two-thirds of the world\'s one-horned rhinoceros. Periyar (Kerala) offers elephant and bison sightings by boat. Gir (Gujarat) is the last home of the Asiatic lion. The safari experience in India combines thrilling wildlife with stunning landscapes.',
      idealDurationDays: { min: 3, max: 5 },
      budgetRangeINR: { budget: 10000, midRange: 30000, luxury: 80000 },
      bestDestinations: ['india'],
      tags: ['wildlife', 'safari', 'tiger', 'national-park', 'photography'],
    },
    {
      slug: 'northeast-explorer',
      name: 'Northeast Explorer',
      category: ExperienceCategory.NATURE_LANDSCAPES,
      shortDescription: 'Discover India\'s hidden gem — the seven sisters of Northeast India',
      description: 'Northeast India is India\'s best-kept secret — eight states of staggering natural beauty, unique tribal cultures, and virtually no tourist crowds. Meghalaya\'s living root bridges and cleanest village in Asia, Sikkim\'s Buddhist monasteries and Kanchenjunga views, Assam\'s tea gardens and Kaziranga rhinos, Nagaland\'s Hornbill Festival, and Arunachal\'s remote monasteries offer experiences found nowhere else in India. The region is safe, welcoming, and increasingly accessible.',
      idealDurationDays: { min: 7, max: 14 },
      budgetRangeINR: { budget: 15000, midRange: 35000, luxury: 70000 },
      bestDestinations: ['india'],
      tags: ['Northeast', 'tribal', 'nature', 'off-beat', 'adventure'],
    },
    {
      slug: 'varanasi-spiritual-journey',
      name: 'Varanasi Spiritual Journey',
      category: ExperienceCategory.CULTURE_HISTORY,
      shortDescription: 'Experience the world\'s oldest living city — dawn boat rides, ghats, and eternal rituals',
      description: 'Varanasi (Kashi/Banaras) is one of the oldest continuously inhabited cities in the world and Hinduism\'s holiest city. A dawn boat ride on the Ganges past the 84 ghats — with their cremation pyres, yoga practitioners, and morning bathers — is one of the most profound travel experiences on Earth. The evening Ganga Aarti at Dashashwamedh Ghat, the lanes of the old city, and the silk weavers of Banaras add cultural depth to the spiritual intensity.',
      idealDurationDays: { min: 2, max: 3 },
      budgetRangeINR: { budget: 3000, midRange: 10000, luxury: 30000 },
      bestDestinations: ['india'],
      tags: ['spiritual', 'Ganges', 'ghats', 'heritage', 'must-visit'],
    },
    {
      slug: 'andaman-island-escape',
      name: 'Andaman Island Escape',
      category: ExperienceCategory.ISLAND_BEACH,
      shortDescription: 'India\'s tropical paradise — pristine beaches, coral reefs, and WWII history',
      description: 'The Andaman Islands offer India\'s best beach and diving experience — crystal-clear turquoise waters, pristine white-sand beaches, vibrant coral reefs, and dense tropical forests. Havelock Island (Swaraj Dweep) has Radhanagar Beach, consistently ranked among Asia\'s best. Neil Island (Shaheed Dweep) is quieter and more intimate. Port Blair\'s Cellular Jail tells the poignant story of India\'s freedom fighters. Scuba diving and snorkelling here rival the Maldives at a fraction of the cost.',
      idealDurationDays: { min: 5, max: 7 },
      budgetRangeINR: { budget: 15000, midRange: 35000, luxury: 80000 },
      bestDestinations: ['india'],
      tags: ['islands', 'beach', 'diving', 'coral', 'tropical'],
    },
    {
      slug: 'darjeeling-tea-trail',
      name: 'Darjeeling Tea Trail',
      category: ExperienceCategory.FOOD_MARKETS,
      shortDescription: 'Sip the "Champagne of Teas" in its misty Himalayan homeland',
      description: 'Darjeeling produces the world\'s most prized tea — a light, muscatel-flavoured brew that commands premium prices globally. A tea trail through the historic estates (Happy Valley, Makaibari, Glenburn) includes plantation walks through manicured bushes, factory tours showing the withering-rolling-fermenting-drying process, and tasting sessions where you learn to distinguish first flush from second flush. The backdrop of Kanchenjunga and the colonial-era tea bungalow stays make this a uniquely Indian luxury experience.',
      idealDurationDays: { min: 3, max: 5 },
      budgetRangeINR: { budget: 5000, midRange: 15000, luxury: 40000 },
      bestDestinations: ['india'],
      tags: ['tea', 'Darjeeling', 'plantation', 'luxury', 'hills'],
    },
    {
      slug: 'rajasthan-desert-safari',
      name: 'Rajasthan Desert Safari',
      category: ExperienceCategory.ADVENTURE_ACTIVITIES,
      shortDescription: 'Camel safaris and desert camping under the stars in the Thar Desert',
      description: 'The Thar Desert around Jaisalmer and Sam Sand Dunes offers India\'s most romantic adventure — camel safaris through golden sand dunes, overnight camping under a canopy of stars (the Milky Way is clearly visible), Rajasthani folk music and dance around a bonfire, and sunrise views from the dunes. The non-touristy Khuri and Desert National Park routes offer a more authentic experience with encounters with desert wildlife and nomadic communities.',
      idealDurationDays: { min: 2, max: 4 },
      budgetRangeINR: { budget: 5000, midRange: 15000, luxury: 50000 },
      bestDestinations: ['india'],
      tags: ['desert', 'camel', 'camping', 'stars', 'adventure'],
    },
  ];

  for (const exp of indiaExperiences) {
    await prisma.experience.upsert({
      where: { slug: exp.slug },
      update: {},
      create: {
        name: exp.name,
        slug: exp.slug,
        category: exp.category,
        shortDescription: exp.shortDescription,
        description: exp.description,
        idealDurationDays: exp.idealDurationDays,
        budgetRangeINR: exp.budgetRangeINR,
        bestDestinations: exp.bestDestinations,
        tags: exp.tags,
        status: ContentStatus.PUBLISHED,
      },
    });
  }

  console.log('✅ 15 India experiences seeded');

  // ── SAMPLE ITINERARY 1: GOLDEN TRIANGLE ─────────────────────────
  console.log('🗺️  Seeding Golden Triangle itinerary...');

  await prisma.itinerary.upsert({
    where: { shareToken: 'india-golden-triangle-5d' },
    update: {},
    create: {
      title: 'Golden Triangle — 5 Days of Heritage',
      description: 'India\'s classic introductory circuit connecting Delhi, Agra, and Jaipur — three cities that showcase the best of Mughal and Rajput architecture, vibrant bazaars, and iconic monuments including the Taj Mahal. This 5-day itinerary is perfect for first-time visitors and covers India\'s greatest highlights at a balanced pace.',
      destinationSlugs: ['india'],
      durationDays: 5,
      travelStyle: 'CULTURAL',
      pace: 'BALANCED',
      companionType: 'SOLO',
      budgetTotalINR: 25000,
      interests: ['culture', 'heritage', 'food', 'history', 'photography'],
      status: 'PUBLISHED',
      isAiGenerated: false,
      isPublic: true,
      isSample: true,
      shareToken: 'india-golden-triangle-5d',
      viewCount: 892,
      saveCount: 215,
      days: {
        create: [
          {
            dayNumber: 1,
            title: 'Delhi — Old Delhi Heritage & Street Food',
            description: 'Explore the Mughal grandeur of Old Delhi and its legendary street food scene',
            dailyBudgetINR: 4000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '09:00',
                  endTime: '12:00',
                  title: 'Red Fort & Chandni Chowk',
                  description: 'Start at the iconic Red Fort (UNESCO), then dive into the sensory overload of Chandni Chowk — Asia\'s oldest market. Try paranthas at Paranthe Wali Gali and jalebis at Old Famous Jalebi Wala.',
                  estimatedCostINR: 500,
                  transportMode: 'metro',
                  tags: ['UNESCO', 'heritage', 'street-food', 'must-visit'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '13:00',
                  endTime: '16:00',
                  title: 'Qutub Minar & Humayun\'s Tomb',
                  description: 'Visit the 72.5m Qutub Minar (UNESCO) and the rust-free Iron Pillar. Then head to Humayun\'s Tomb (UNESCO) — the garden-tomb that inspired the Taj Mahal.',
                  estimatedCostINR: 1200,
                  transportMode: 'taxi',
                  tags: ['UNESCO', 'Mughal', 'history', 'photography'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '18:00',
                  endTime: '20:30',
                  title: 'India Gate & Kartavya Path',
                  description: 'Watch the illuminated India Gate war memorial and stroll along Kartavya Path. End with dinner at a Khan Market restaurant or street-side kulfi.',
                  estimatedCostINR: 800,
                  transportMode: 'taxi',
                  tags: ['landmark', 'evening', 'iconic', 'dinner'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 2,
            title: 'Delhi — New Delhi & Departure to Agra',
            description: 'Explore New Delhi\'s monuments before taking the train to Agra',
            dailyBudgetINR: 5000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '08:00',
                  endTime: '11:00',
                  title: 'Lotus Temple & Akshardham',
                  description: 'Visit the serene Lotus Temple (Baha\'i House of Worship) and the grand Akshardham complex with its stunning exhibitions on Indian culture and heritage.',
                  estimatedCostINR: 200,
                  transportMode: 'metro',
                  tags: ['temple', 'architecture', 'spiritual', 'free'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:00',
                  endTime: '16:00',
                  title: 'Train to Agra (Gatimaan Express)',
                  description: 'Board the Gatimaan Express from Hazrat Nizamuddin station — India\'s fastest train covers Delhi–Agra in just 100 minutes. Arrive Agra by 2 PM. Check into hotel near Taj Mahal.',
                  estimatedCostINR: 1500,
                  transportMode: 'train',
                  transportDurationMins: 100,
                  transportNotes: 'Book Gatimaan Express well in advance — ₹750–1,500',
                  tags: ['transfer', 'train', 'Gatimaan'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:00',
                  endTime: '20:00',
                  title: 'Mehtab Bagh Sunset View of Taj',
                  description: 'Cross the river to Mehtab Bagh for the most stunning sunset view of the Taj Mahal reflected in the Yamuna River. A far less crowded way to see the Taj on your first evening.',
                  estimatedCostINR: 500,
                  transportMode: 'auto-rickshaw',
                  tags: ['Taj-Mahal', 'sunset', 'photography', 'romantic'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 3,
            title: 'Agra — Taj Mahal Sunrise & Agra Fort',
            description: 'Experience the Taj Mahal at sunrise and explore the magnificent Agra Fort',
            dailyBudgetINR: 5000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '05:30',
                  endTime: '09:00',
                  title: 'Taj Mahal Sunrise',
                  description: 'Enter through the South Gate at 6 AM for the magical sunrise experience. Watch the white marble change colour from pale pink to golden to brilliant white. The reflection pool photographs are best in the early light.',
                  estimatedCostINR: 1300,
                  transportMode: 'walking',
                  tags: ['Taj-Mahal', 'sunrise', 'UNESCO', 'must-do', 'iconic'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '11:00',
                  endTime: '14:00',
                  title: 'Agra Fort',
                  description: 'Explore the massive Agra Fort (UNESCO) — the imperial Mughal seat of power. The Diwan-i-Am, Diwan-i-Khas, Sheesh Mahal, and the poignant Musamman Burj (where Shah Jahan spent his final years gazing at the Taj) are highlights.',
                  estimatedCostINR: 1000,
                  transportMode: 'auto-rickshaw',
                  tags: ['UNESCO', 'Mughal', 'fort', 'history'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '15:00',
                  endTime: '19:00',
                  title: 'Travel to Jaipur',
                  description: 'Take a 4-hour road journey (or train) from Agra to Jaipur through the Rajasthan countryside. Stop for chai at a highway dhaba for an authentic experience. Arrive Jaipur by evening.',
                  estimatedCostINR: 1500,
                  transportMode: 'bus',
                  transportDurationMins: 240,
                  transportNotes: 'AC Volvo bus ₹800–1,200 or taxi ₹3,500–4,000',
                  tags: ['transfer', 'road-trip', 'Rajasthan'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 4,
            title: 'Jaipur — Amber Fort & Pink City',
            description: 'Discover Jaipur\'s magnificent Amber Fort and the Pink City\'s iconic landmarks',
            dailyBudgetINR: 5500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '08:00',
                  endTime: '12:00',
                  title: 'Amber Fort',
                  description: 'Explore the grand Amber Fort (UNESCO) — a masterpiece of Rajput architecture. Walk up the cobbled path (or take a jeep), marvel at the Sheesh Mahal, and enjoy the panoramic views of Maota Lake and the Aravalli Hills from the ramparts.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  tags: ['UNESCO', 'fort', 'Rajput', 'must-visit', 'photography'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '13:00',
                  endTime: '16:00',
                  title: 'Hawa Mahal & City Palace',
                  description: 'Photograph the iconic Hawa Mahal (Palace of Winds) with its 953 latticed windows. Then explore the City Palace complex with its stunning Peacock Gate, royal armoury, and textile gallery.',
                  estimatedCostINR: 1500,
                  transportMode: 'auto-rickshaw',
                  tags: ['palace', 'heritage', 'Pink-City', 'photography', 'iconic'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:00',
                  endTime: '20:00',
                  title: 'Nahargarh Fort Sunset',
                  description: 'Drive up to Nahargarh Fort on the Aravalli ridge for the most spectacular sunset view of Jaipur. The entire Pink City glows golden below. Stop at the Padao restaurant for chai with a view.',
                  estimatedCostINR: 800,
                  transportMode: 'taxi',
                  tags: ['sunset', 'fort', 'views', 'photography', 'romantic'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 5,
            title: 'Jaipur — Bazaars, Food & Departure',
            description: 'Shop in Jaipur\'s colourful bazaars and savour Rajasthani cuisine before departing',
            dailyBudgetINR: 5500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '09:00',
                  endTime: '12:00',
                  title: 'Jantar Mantar & Albert Hall Museum',
                  description: 'Visit Jantar Mantar (UNESCO) — the world\'s largest stone sundial and a collection of astronomical instruments built in 1734. Then explore the Albert Hall Museum, Rajasthan\'s oldest museum with stunning Indo-Saracenic architecture.',
                  estimatedCostINR: 500,
                  transportMode: 'walking',
                  tags: ['UNESCO', 'science', 'museum', 'architecture'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:30',
                  endTime: '15:30',
                  title: 'Johari Bazaar & Bapu Bazaar Shopping',
                  description: 'Shop for Jaipur\'s famous blue pottery, block-printed textiles, lac bangles, and gemstones in the vibrant Johari and Bapu Bazaars. Lunch at LMB (Laxmi Mishthan Bhandar) for legendary Rajasthani thali.',
                  estimatedCostINR: 2000,
                  transportMode: 'walking',
                  tags: ['shopping', 'bazaar', 'food', 'Rajasthani-thali'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '16:00',
                  endTime: '19:00',
                  title: 'Departure from Jaipur',
                  description: 'Take a flight or train back to Delhi (or onwards). Jaipur airport is 12 km from the city. Alternatively, the Shatabdi Express to Delhi takes 4.5 hours.',
                  estimatedCostINR: 2000,
                  transportMode: 'taxi',
                  tags: ['departure', 'transfer'],
                  sortOrder: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── SAMPLE ITINERARY 2: KERALA BACKWATERS ─────────────────────────
  console.log('🗺️  Seeding Kerala Backwaters itinerary...');

  await prisma.itinerary.upsert({
    where: { shareToken: 'india-kerala-backwaters-4d' },
    update: {},
    create: {
      title: 'Kerala Backwaters & Spice Trail — 4 Days',
      description: 'Experience the best of God\'s Own Country — colonial Fort Kochi, the emerald tea estates of Munnar, and the iconic backwaters of Alleppey. This 4-day itinerary blends culture, nature, and relaxation at a leisurely Kerala pace, with fresh seafood, Ayurvedic flavours, and some of India\'s most beautiful landscapes.',
      destinationSlugs: ['india'],
      durationDays: 4,
      travelStyle: 'LEISURE',
      pace: 'RELAXED',
      companionType: 'COUPLE',
      budgetTotalINR: 20000,
      interests: ['nature', 'food', 'culture', 'relaxation', 'backwaters'],
      status: 'PUBLISHED',
      isAiGenerated: false,
      isPublic: true,
      isSample: true,
      shareToken: 'india-kerala-backwaters-4d',
      viewCount: 634,
      saveCount: 178,
      days: {
        create: [
          {
            dayNumber: 1,
            title: 'Kochi — Fort Kochi Heritage & Kathakali',
            description: 'Explore Kochi\'s colonial heritage, Chinese fishing nets, and experience a traditional Kathakali dance performance',
            dailyBudgetINR: 4000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '09:00',
                  endTime: '12:30',
                  title: 'Fort Kochi Heritage Walk',
                  description: 'Walk through 500 years of colonial history — the Chinese Fishing Nets, St. Francis Church (India\'s oldest European church, 1503), Santa Cruz Cathedral, and streets lined with Portuguese and Dutch architecture. Stop for a filter coffee at Kashi Art Cafe.',
                  estimatedCostINR: 300,
                  transportMode: 'walking',
                  tags: ['heritage', 'colonial', 'photography', 'must-visit'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '13:00',
                  endTime: '16:00',
                  title: 'Mattancherry Palace & Jew Town',
                  description: 'Visit the Dutch Palace with its extraordinary Hindu murals, browse the antique shops of Jew Town, and see the 1568 Paradesi Synagogue — the oldest active synagogue in the Commonwealth. Lunch at a Fort Kochi seafood restaurant.',
                  estimatedCostINR: 1200,
                  transportMode: 'auto-rickshaw',
                  tags: ['museum', 'heritage', 'synagogue', 'shopping', 'food'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:30',
                  endTime: '20:00',
                  title: 'Sunset at Chinese Nets & Kathakali Show',
                  description: 'Watch the sunset silhouette the Chinese Fishing Nets, then attend a Kathakali dance performance at the Kerala Kathakali Centre. The elaborate makeup process (visible from 5 PM) is as fascinating as the performance itself.',
                  estimatedCostINR: 600,
                  transportMode: 'walking',
                  tags: ['sunset', 'Kathakali', 'culture', 'evening', 'must-do'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 2,
            title: 'Munnar — Tea Plantations & Mountain Views',
            description: 'Drive into the Western Ghats and explore Munnar\'s legendary tea estates and national park',
            dailyBudgetINR: 5500,
            weatherAdvisory: 'Munnar can be cool — carry a light jacket. Mornings are often misty.',
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '06:00',
                  endTime: '11:00',
                  title: 'Scenic Drive Kochi to Munnar',
                  description: 'The 130 km drive from Kochi to Munnar (4–5 hours) is one of India\'s most scenic drives — climbing from the coastal plains through rubber and cardamom plantations into the misty Western Ghats. Stop at Cheeyappara and Valara waterfalls en route.',
                  estimatedCostINR: 2000,
                  transportMode: 'taxi',
                  transportDurationMins: 270,
                  transportNotes: 'Hire a taxi for ₹2,000–2,500 (one way). The hairpin bends are best navigated by an experienced local driver.',
                  tags: ['scenic-drive', 'waterfalls', 'Western-Ghats', 'transfer'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:00',
                  endTime: '15:00',
                  title: 'Tea Plantation Tour & KDHP Museum',
                  description: 'Visit the KDHP Tea Museum to learn the history of Munnar\'s tea industry, then walk through the emerald tea estates. Watch the plucking, withering, rolling, and drying process, and end with a tasting session of different grades.',
                  estimatedCostINR: 500,
                  transportMode: 'walking',
                  tags: ['tea', 'plantation', 'museum', 'must-do', 'photography'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '15:30',
                  endTime: '18:00',
                  title: 'Eravikulam National Park',
                  description: 'Spot the endangered Nilgiri tahr (mountain goat) in their natural high-altitude grassland habitat. The park shuttle takes you up through stunning scenery. The tahr are remarkably tame and often approach visitors.',
                  estimatedCostINR: 500,
                  transportMode: 'bus',
                  tags: ['wildlife', 'national-park', 'tahr', 'nature'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 3,
            title: 'Alleppey — Houseboat Overnight on the Backwaters',
            description: 'Drive to Alleppey and board a traditional houseboat for an overnight cruise through Kerala\'s famous backwaters',
            dailyBudgetINR: 8000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '07:00',
                  endTime: '12:00',
                  title: 'Drive Munnar to Alleppey',
                  description: 'The 170 km drive from the mountains to the coast (5 hours) takes you through a dramatic landscape transition — from misty tea hills to rubber plantations to the flat, palm-fringed backwater country. Stop for a traditional Kerala meals (thali) en route.',
                  estimatedCostINR: 2500,
                  transportMode: 'taxi',
                  transportDurationMins: 300,
                  transportNotes: 'Taxi ₹2,500–3,000. The drive is scenic but winding in the first half.',
                  tags: ['transfer', 'scenic-drive', 'Kerala'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:30',
                  endTime: '17:00',
                  title: 'Board Houseboat & Backwater Cruise',
                  description: 'Board your traditional kettuvallam (rice barge) houseboat at Alleppey boat jetty. Cruise through narrow canals fringed with coconut palms, passing village churches, paddy fields, and fishermen casting their nets. Your onboard chef prepares fresh Kerala fish curry for lunch.',
                  estimatedCostINR: 4000,
                  transportMode: 'ferry',
                  tags: ['houseboat', 'backwaters', 'must-do', 'iconic', 'Kerala'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:30',
                  endTime: '21:00',
                  title: 'Sunset on the Backwaters & Onboard Dinner',
                  description: 'Watch the spectacular sunset from your houseboat deck as the boat anchors for the night. Dinner is a traditional Kerala feast — fish pollichathu, avial, thoran, and payasam — cooked fresh by your onboard chef. Fall asleep to the gentle lapping of water.',
                  estimatedCostINR: 1500,
                  tags: ['sunset', 'dinner', 'romantic', 'backwaters', 'overnight'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 4,
            title: 'Alleppey — Backwater Village & Departure',
            description: 'Morning on the backwaters, village walk, and departure from Kochi',
            dailyBudgetINR: 2500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '06:00',
                  endTime: '09:00',
                  title: 'Sunrise & Morning Cruise',
                  description: 'Wake to a magical sunrise over the backwaters. After breakfast on the houseboat (appam, stew, and Kerala filter coffee), cruise through the village canals watching morning life unfold — fishermen, school children, toddy tappers. Disembark by 9 AM.',
                  estimatedCostINR: 500,
                  tags: ['sunrise', 'backwaters', 'breakfast', 'photography'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '09:30',
                  endTime: '12:00',
                  title: 'Backwater Village Walk',
                  description: 'Take a guided walk through the backwater villages — see coir-making, toddy tapping, and traditional Kerala life up close. Enjoy a home-cooked Kerala lunch in a village home for an authentic and memorable experience.',
                  estimatedCostINR: 800,
                  transportMode: 'walking',
                  tags: ['village', 'culture', 'authentic', 'food', 'Kerala'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '13:00',
                  endTime: '16:00',
                  title: 'Transfer to Kochi for Departure',
                  description: 'Drive from Alleppey to Kochi airport (85 km, 2 hours) for your onward journey. Alternatively, spend another night in Fort Kochi and fly out the next morning.',
                  estimatedCostINR: 1200,
                  transportMode: 'taxi',
                  transportDurationMins: 120,
                  transportNotes: 'Taxi Alleppey to Kochi airport ₹1,200–1,500',
                  tags: ['departure', 'transfer'],
                  sortOrder: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── SAMPLE ITINERARY 3: RAJASTHAN ROYAL CIRCUIT ─────────────────────────
  console.log('🗺️  Seeding Rajasthan Royal Circuit itinerary...');

  await prisma.itinerary.upsert({
    where: { shareToken: 'india-rajasthan-royal-7d' },
    update: {},
    create: {
      title: 'Rajasthan Royal Circuit — 7 Days',
      description: 'A week-long journey through the Land of Kings — from the Pink City of Jaipur and the Blue City of Jodhpur to the Lake City of Udaipur. This itinerary covers Rajasthan\'s three greatest cities, their magnificent forts and palaces, colourful bazaars, and the legendary Rajasthani hospitality. Stay in heritage hotels converted from royal havelis for the full royal experience.',
      destinationSlugs: ['india'],
      durationDays: 7,
      travelStyle: 'CULTURAL',
      pace: 'BALANCED',
      companionType: 'COUPLE',
      budgetTotalINR: 35000,
      interests: ['heritage', 'culture', 'architecture', 'food', 'photography'],
      status: 'PUBLISHED',
      isAiGenerated: false,
      isPublic: true,
      isSample: true,
      shareToken: 'india-rajasthan-royal-7d',
      viewCount: 756,
      saveCount: 198,
      days: {
        create: [
          {
            dayNumber: 1,
            title: 'Jaipur — Amber Fort & Pink City Welcome',
            description: 'Arrive in Jaipur and explore the magnificent Amber Fort and the Pink City\'s iconic landmarks',
            dailyBudgetINR: 5500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '09:00',
                  endTime: '13:00',
                  title: 'Amber Fort',
                  description: 'Start your Rajasthan journey at the grand Amber Fort (UNESCO). Walk up the cobbled path to this Rajput masterpiece perched above Maota Lake. The Sheesh Mahal (Hall of Mirrors), Ganesh Pol, and rampart views are extraordinary.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  tags: ['UNESCO', 'fort', 'Rajput', 'must-visit', 'photography'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '14:00',
                  endTime: '17:00',
                  title: 'Hawa Mahal, City Palace & Jantar Mantar',
                  description: 'Photograph the iconic Hawa Mahal, explore the City Palace\'s Peacock Gate and royal collections, and visit the UNESCO-listed Jantar Mantar astronomical instruments. All three are within walking distance of each other.',
                  estimatedCostINR: 1500,
                  transportMode: 'auto-rickshaw',
                  tags: ['palace', 'UNESCO', 'Pink-City', 'heritage'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:30',
                  endTime: '20:00',
                  title: 'Nahargarh Fort Sunset & Rajasthani Dinner',
                  description: 'Drive up to Nahargarh Fort for Jaipur\'s best sunset panorama. Then dine at a traditional Rajasthani restaurant — try dal baati churma, laal maas, and ker sangri with bajra roti.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  tags: ['sunset', 'fort', 'dinner', 'Rajasthani-food'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 2,
            title: 'Jaipur — Bazaars, Crafts & Royal Culture',
            description: 'Dive into Jaipur\'s vibrant bazaars, blue pottery workshops, and textile traditions',
            dailyBudgetINR: 4500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '09:00',
                  endTime: '12:00',
                  title: 'Blue Pottery Workshop & Albert Hall Museum',
                  description: 'Visit a blue pottery workshop in Jaipur to watch artisans create this distinctive turquoise-and-white craft. Then explore the Albert Hall Museum — Rajasthan\'s oldest museum with stunning Indo-Saracenic architecture.',
                  estimatedCostINR: 800,
                  transportMode: 'auto-rickshaw',
                  tags: ['crafts', 'museum', 'blue-pottery', 'culture'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:30',
                  endTime: '16:00',
                  title: 'Johari & Bapu Bazaar Shopping',
                  description: 'Shop in Jaipur\'s legendary bazaars — gemstones and jewellery at Johari Bazaar, block-printed textiles and lac bangles at Bapu Bazaar. Lunch at LMB for the famous Rajasthani thali.',
                  estimatedCostINR: 2000,
                  transportMode: 'walking',
                  tags: ['shopping', 'bazaar', 'textiles', 'food'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:00',
                  endTime: '20:00',
                  title: 'Chokhi Dhani Cultural Village',
                  description: 'Experience Rajasthani culture at Chokhi Dhani — an ethnic village resort with folk dances, puppet shows, camel rides, and a lavish Rajasthani dinner served on leaf plates in traditional style.',
                  estimatedCostINR: 1200,
                  transportMode: 'taxi',
                  tags: ['culture', 'folk-dance', 'dinner', 'entertainment'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 3,
            title: 'Jaipur to Jodhpur — The Blue City Awaits',
            description: 'Travel to Jodhpur and explore the mighty Mehrangarh Fort',
            dailyBudgetINR: 5500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '07:00',
                  endTime: '13:00',
                  title: 'Drive to Jodhpur via Ajmer/Pushkar',
                  description: 'The 330 km drive from Jaipur to Jodhpur (5–6 hours) passes through the Aravalli Hills. Optional stop at the sacred Pushkar Lake and Brahma Temple (the only Brahma temple in the world) for a quick visit.',
                  estimatedCostINR: 2000,
                  transportMode: 'taxi',
                  transportDurationMins: 330,
                  transportNotes: 'Hire a taxi for ₹4,000–5,000 (one way). Train option: Jaipur-Jodhpur Intercity Express (5.5 hours, ₹400–800).',
                  tags: ['transfer', 'road-trip', 'Pushkar'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '14:00',
                  endTime: '17:00',
                  title: 'Mehrangarh Fort',
                  description: 'Explore Mehrangarh — one of India\'s most impressive forts. Rising 125 metres above the Blue City on a sheer cliff, the fort\'s palatial rooms (Moti Mahal, Phool Mahal, Sheesh Mahal) house an outstanding museum of Rajput artefacts, palanquins, and weapons.',
                  estimatedCostINR: 1000,
                  transportMode: 'auto-rickshaw',
                  tags: ['fort', 'must-visit', 'museum', 'architecture', 'views'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:30',
                  endTime: '20:00',
                  title: 'Blue City Walk & Sunset from Fort Ramparts',
                  description: 'Walk through the blue-painted Brahmin houses of the old city below the fort. Watch the sunset from the fort ramparts with the Blue City glowing below — one of Rajasthan\'s most magical views.',
                  estimatedCostINR: 800,
                  transportMode: 'walking',
                  tags: ['Blue-City', 'sunset', 'photography', 'heritage-walk'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 4,
            title: 'Jodhpur — Markets, Mandore & Marwar Culture',
            description: 'Explore Jodhpur\'s vibrant markets, Mandore Gardens, and the Marwar food tradition',
            dailyBudgetINR: 4000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '08:00',
                  endTime: '11:00',
                  title: 'Sardar Market & Clock Tower',
                  description: 'Dive into the buzzing Sardar Market around the iconic Ghanta Ghar (Clock Tower). Browse spices (Jodhpur is famous for its mirchi vada and makhania lassi), tie-dye fabrics, Jodhpuri mojari (leather shoes), and antiques in the narrow lanes.',
                  estimatedCostINR: 800,
                  transportMode: 'walking',
                  tags: ['market', 'shopping', 'food', 'spices', 'local'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:00',
                  endTime: '15:00',
                  title: 'Mandore Gardens & Jaswant Thada',
                  description: 'Visit the Mandore Gardens with their royal cenotaphs and Hall of Heroes. Then stop at the Jaswant Thada — an exquisite white marble memorial near Mehrangarh that glows in the afternoon light.',
                  estimatedCostINR: 500,
                  transportMode: 'auto-rickshaw',
                  tags: ['garden', 'memorial', 'marble', 'photography'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '16:00',
                  endTime: '20:00',
                  title: 'Umaid Bhawan Palace & Marwari Dinner',
                  description: 'Visit the Art Deco Umaid Bhawan Palace museum (part still a royal residence, part Taj hotel). End with a dinner of Jodhpuri mirchi vada, pyaaz kachori, and makhania lassi at a local favourite.',
                  estimatedCostINR: 1200,
                  transportMode: 'taxi',
                  tags: ['palace', 'Art-Deco', 'dinner', 'food'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 5,
            title: 'Jodhpur to Udaipur — Ranakpur Temples En Route',
            description: 'Travel to Udaipur with a stop at the stunning Ranakpur Jain temples',
            dailyBudgetINR: 5000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '07:00',
                  endTime: '11:00',
                  title: 'Drive to Ranakpur Jain Temple',
                  description: 'The Ranakpur Jain Temple (halfway between Jodhpur and Udaipur) is one of India\'s most exquisite architectural gems — 1,444 intricately carved marble pillars, each unique, supporting a vast mandapa. The play of light and shadow through the carved jali screens is mesmerising.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  transportDurationMins: 180,
                  tags: ['Jain', 'temple', 'architecture', 'marble', 'photography'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:00',
                  endTime: '15:00',
                  title: 'Continue to Udaipur',
                  description: 'Complete the scenic drive from Ranakpur to Udaipur (90 km, 2.5 hours) through the Aravalli Hills. Arrive in the Lake City and check into your hotel, ideally with a view of Lake Pichola.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  transportDurationMins: 150,
                  tags: ['transfer', 'scenic-drive', 'Aravalli'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '16:00',
                  endTime: '20:00',
                  title: 'Lake Pichola Sunset Boat Ride',
                  description: 'Take a sunset boat ride on Lake Pichola, passing the Lake Palace (now a luxury Taj hotel) and Jag Mandir island palace. The City Palace and Aravalli Hills glow golden in the setting sun. End with dinner at a lakeside rooftop restaurant.',
                  estimatedCostINR: 1500,
                  transportMode: 'ferry',
                  tags: ['lake', 'sunset', 'boat', 'romantic', 'must-do'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 6,
            title: 'Udaipur — City Palace, Old City & Monsoon Palace',
            description: 'Explore Udaipur\'s magnificent City Palace, the old city\'s art scene, and the hilltop Monsoon Palace',
            dailyBudgetINR: 5500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '09:00',
                  endTime: '12:30',
                  title: 'City Palace Complex',
                  description: 'Explore Udaipur\'s City Palace — the largest palace complex in Rajasthan. The Mor Chowk (Peacock Court), Manak Mahal (Ruby Palace), Badi Mahal (Garden Palace), and the palace museum with miniature paintings and royal artefacts are extraordinary.',
                  estimatedCostINR: 1500,
                  transportMode: 'walking',
                  tags: ['palace', 'museum', 'heritage', 'must-visit', 'architecture'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '13:00',
                  endTime: '16:00',
                  title: 'Old City Walk — Ghats, Temples & Art',
                  description: 'Wander the narrow lanes of Udaipur\'s old city — Gangaur Ghat (where Octopussy was filmed), the Jagdish Temple with its stunning Indo-Aryan architecture, and the many miniature painting galleries and handicraft shops.',
                  estimatedCostINR: 1500,
                  transportMode: 'walking',
                  tags: ['heritage-walk', 'temple', 'art', 'shopping', 'ghats'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '16:30',
                  endTime: '20:00',
                  title: 'Monsoon Palace Sunset',
                  description: 'Drive up to the hilltop Sajjangarh (Monsoon Palace) for a panoramic sunset over Udaipur and its lakes. The Aravalli Hills and Fateh Sagar Lake are particularly beautiful in the golden hour light. Return for dinner at Ambrai restaurant overlooking Lake Pichola.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  tags: ['sunset', 'palace', 'panorama', 'photography', 'dinner'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 7,
            title: 'Udaipur — Morning Market & Departure',
            description: 'Final morning exploring Udaipur before departing',
            dailyBudgetINR: 5000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '07:00',
                  endTime: '10:00',
                  title: 'Fateh Sagar Lake & Saheliyon ki Bari',
                  description: 'Morning walk along Fateh Sagar Lake, then visit Saheliyon ki Bari (Garden of the Maidens) — a beautiful 18th-century garden with lotus pools, marble elephants, and fountains built by a Maharana for 48 ladies-in-waiting.',
                  estimatedCostINR: 500,
                  transportMode: 'auto-rickshaw',
                  tags: ['lake', 'garden', 'morning', 'heritage', 'peaceful'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '10:30',
                  endTime: '13:00',
                  title: 'Hathi Pol Bazaar & Last Shopping',
                  description: 'Browse the vibrant Hathi Pol (Elephant Gate) market for Udaipur\'s famous miniature paintings, silver jewellery, and traditional Rajasthani textiles. Pick up last souvenirs and have a final Rajasthani meal.',
                  estimatedCostINR: 2000,
                  transportMode: 'walking',
                  tags: ['shopping', 'bazaar', 'miniature-paintings', 'souvenirs'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '14:00',
                  endTime: '17:00',
                  title: 'Departure from Udaipur',
                  description: 'Transfer to Udaipur airport (Maharana Pratap Airport, 22 km) for your onward flight. Alternatively, an overnight train to Delhi or Jaipur is a scenic option through the Aravalli range.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  tags: ['departure', 'transfer'],
                  sortOrder: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ 3 India sample itineraries seeded');

  // ── SAMPLE ITINERARY 4: NORTHEAST INDIA HIDDEN GEMS ─────────────────────────
  console.log('🗺️  Seeding Northeast India itinerary...');

  await prisma.itinerary.upsert({
    where: { shareToken: 'india-northeast-7d' },
    update: {},
    create: {
      title: 'Northeast India Hidden Gems — 7 Days',
      description: 'Discover India\'s best-kept secret — the enchanting Northeast. From the misty monasteries and alpine lakes of Sikkim to the colonial charm of Darjeeling and the living root bridges of Meghalaya, this 7-day itinerary takes you through some of the most stunning and least-explored landscapes in the country. Perfect for adventurous travellers seeking offbeat experiences far from the tourist trail.',
      destinationSlugs: ['india'],
      durationDays: 7,
      travelStyle: 'ADVENTURE',
      pace: 'BALANCED',
      companionType: 'SOLO',
      budgetTotalINR: 30000,
      interests: ['adventure', 'nature', 'culture', 'photography', 'trekking'],
      status: 'PUBLISHED',
      isAiGenerated: false,
      isPublic: true,
      isSample: true,
      shareToken: 'india-northeast-7d',
      viewCount: 543,
      saveCount: 156,
      days: {
        create: [
          {
            dayNumber: 1,
            title: 'Gangtok — Arrival & MG Marg Evening',
            description: 'Arrive in Gangtok and acclimatize to the altitude while exploring the capital of Sikkim',
            dailyBudgetINR: 3500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '09:00',
                  endTime: '12:00',
                  title: 'Arrive in Gangtok & Check In',
                  description: 'Fly into Bagdogra Airport (nearest to Gangtok) and take a shared or private taxi up the winding mountain road to Gangtok (4–5 hours, 125 km). The drive itself is stunning — lush green valleys, terraced farms, and the Teesta River below. Check into your hotel and rest to acclimatize (altitude: 1,650m).',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  transportDurationMins: 270,
                  transportNotes: 'Shared taxi from Bagdogra ₹300–500, private taxi ₹3,000–4,000. Pre-book for comfort.',
                  tags: ['arrival', 'transfer', 'scenic-drive', 'Sikkim'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '14:00',
                  endTime: '16:30',
                  title: 'Rumtek Monastery',
                  description: 'Visit the Rumtek Monastery — the largest monastery in Sikkim and the seat of the Karmapa. The main shrine room with its stunning murals, the Golden Stupa containing relics, and the peaceful courtyard with mountain views make this a spiritual highlight. Check the monastery schedule for prayer ceremonies.',
                  estimatedCostINR: 800,
                  transportMode: 'taxi',
                  tags: ['monastery', 'Buddhism', 'spiritual', 'architecture', 'must-visit'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:30',
                  endTime: '20:00',
                  title: 'MG Marg Stroll & Sikkimese Dinner',
                  description: 'Stroll along MG Marg — Gangtok\'s charming pedestrian-only main street lined with cafes, bookshops, and handicraft stores. Try authentic Sikkimese food — momos (steamed dumplings), thukpa (noodle soup), and churpee (yak cheese). The street is beautifully lit at night with mountain views.',
                  estimatedCostINR: 800,
                  transportMode: 'walking',
                  tags: ['food', 'evening', 'momos', 'shopping', 'pedestrian-street'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 2,
            title: 'Gangtok — Tsomgo Lake & Nathula Pass',
            description: 'Day trip to the high-altitude Tsomgo Lake and the India-China border at Nathula Pass',
            dailyBudgetINR: 4500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '06:00',
                  endTime: '10:00',
                  title: 'Tsomgo Lake (Changu Lake)',
                  description: 'Depart early for the stunning Tsomgo Lake at 3,753m altitude — a glacial lake that changes colour with the seasons. In winter, it freezes completely; in summer, it reflects the snow-capped peaks and rhododendrons. Yak rides are available at the lakeside. Carry warm clothing even in summer.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  transportDurationMins: 90,
                  transportNotes: 'Protected area — Indian citizens need a permit (arranged by tour operator, ₹200). Shared taxi ₹500 per person.',
                  tags: ['lake', 'glacial', 'high-altitude', 'photography', 'must-visit'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '10:30',
                  endTime: '14:00',
                  title: 'Nathula Pass (India-China Border)',
                  description: 'Drive up to Nathula Pass at 4,310m — one of the few open trading border posts between India and China. See the border gate, the Indian and Chinese soldiers on guard, and the barbed wire fence at this historic Silk Route pass. The views of the snow-covered Himalayan ridges are breathtaking. Open only Wed–Sun; closed Mon–Tue.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  tags: ['border', 'high-altitude', 'Silk-Route', 'history', 'permit-required'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '16:00',
                  endTime: '19:00',
                  title: 'Return to Gangtok & Tashi Viewpoint',
                  description: 'On the way back, stop at Tashi Viewpoint for panoramic views of Kanchenjunga (the world\'s third-highest peak) if the weather is clear. Return to Gangtok for a warm dinner and rest — the high altitude day can be tiring.',
                  estimatedCostINR: 500,
                  transportMode: 'taxi',
                  tags: ['viewpoint', 'Kanchenjunga', 'sunset', 'mountains'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 3,
            title: 'Gangtok to Darjeeling — Toy Train & Tiger Hill',
            description: 'Travel to Darjeeling and ride the iconic Himalayan Toy Train',
            dailyBudgetINR: 4500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '06:00',
                  endTime: '11:00',
                  title: 'Drive to Darjeeling',
                  description: 'Take the scenic 4-hour drive from Gangtok to Darjeeling (100 km) through misty tea estates, with the Kanchenjunga range as a backdrop. The road winds through Teesta Valley and climbs through dense forests. Stop for chai at one of the roadside stalls with mountain views.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  transportDurationMins: 240,
                  transportNotes: 'Shared taxi ₹300–400 per person from Gangtok SNT stand. Private taxi ₹3,000–4,000.',
                  tags: ['transfer', 'scenic-drive', 'tea-estates', 'mountains'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:00',
                  endTime: '15:00',
                  title: 'Darjeeling Himalayan Railway (Toy Train)',
                  description: 'Ride the UNESCO-listed Darjeeling Himalayan Railway — the iconic narrow-gauge "Toy Train" built in 1881. The 2-hour joy ride from Darjeeling to Ghum and back passes through loops, zigzags, and Batasia Loop with its war memorial and Kanchenjunga views. Book the steam engine ride for the full heritage experience.',
                  estimatedCostINR: 1500,
                  transportMode: 'train',
                  transportDurationMins: 120,
                  transportNotes: 'Joy ride tickets ₹800–1,200. Book at Darjeeling station or online via IRCTC.',
                  tags: ['UNESCO', 'toy-train', 'heritage', 'must-do', 'iconic'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '16:00',
                  endTime: '19:00',
                  title: 'Mall Road & Glenary\'s',
                  description: 'Walk along Darjeeling\'s Mall Road (Chowrasta) — the town\'s social hub with mountain views. Browse the Oxford Book & Stationery, Tibetan refugee handicrafts, and local tea shops. End with a hot chocolate and pastries at Glenary\'s — a colonial-era bakery and restaurant since 1935.',
                  estimatedCostINR: 800,
                  transportMode: 'walking',
                  tags: ['colonial', 'cafe', 'shopping', 'evening', 'heritage'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 4,
            title: 'Darjeeling — Tiger Hill Sunrise & Tea Gardens',
            description: 'Witness the famous Tiger Hill sunrise over Kanchenjunga and explore Darjeeling\'s legendary tea estates',
            dailyBudgetINR: 4000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '04:00',
                  endTime: '08:00',
                  title: 'Tiger Hill Sunrise',
                  description: 'Wake up at 3:30 AM for the legendary Tiger Hill sunrise — at 2,590m, this is the best viewpoint for Kanchenjunga (8,586m, world\'s third-highest peak) and on clear days, even Mount Everest is visible 200 km away. The sun painting the snow peaks pink, orange, and gold is one of India\'s most spectacular natural sights.',
                  estimatedCostINR: 800,
                  transportMode: 'taxi',
                  tags: ['sunrise', 'must-do', 'Kanchenjunga', 'Everest', 'photography', 'iconic'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '10:00',
                  endTime: '14:00',
                  title: 'Happy Valley Tea Estate',
                  description: 'Tour the Happy Valley Tea Estate — one of the few organic tea gardens in Darjeeling (established 1854). Walk through the manicured rows of tea bushes, watch the plucking and processing, and taste fresh first-flush and second-flush Darjeeling tea. The factory tour explains the five stages of tea production.',
                  estimatedCostINR: 500,
                  transportMode: 'walking',
                  tags: ['tea', 'organic', 'factory-tour', 'tasting', 'nature'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '15:00',
                  endTime: '18:00',
                  title: 'Peace Pagoda & Padmaja Naidu Zoo',
                  description: 'Visit the Japanese Peace Pagoda (Shanti Stupa) for serene mountain views and then explore the Padmaja Naidu Himalayan Zoological Park — home to rare snow leopards, red pandas, and Tibetan wolves. The zoo\'s breeding programme for snow leopards is one of the most successful in the world.',
                  estimatedCostINR: 500,
                  transportMode: 'walking',
                  tags: ['pagoda', 'zoo', 'snow-leopard', 'red-panda', 'nature'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 5,
            title: 'Darjeeling to Shillong — Gateway to Meghalaya',
            description: 'Travel to Shillong and explore the Scotland of the East',
            dailyBudgetINR: 4500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '06:00',
                  endTime: '12:00',
                  title: 'Travel to Shillong',
                  description: 'Take the journey from Darjeeling to Shillong via Bagdogra Airport (flight to Guwahati, then 3-hour drive to Shillong) or by road via Siliguri. The drive from Guwahati to Shillong (100 km) ascends through pine forests and the beautiful Umiam Lake appears as you approach the city.',
                  estimatedCostINR: 2500,
                  transportMode: 'flight',
                  transportDurationMins: 300,
                  transportNotes: 'Bagdogra to Guwahati flight ₹2,000–4,000. Guwahati to Shillong shared taxi ₹300, private ₹2,500.',
                  tags: ['transfer', 'flight', 'Meghalaya', 'Northeast'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '13:00',
                  endTime: '16:00',
                  title: 'Umiam Lake & Don Bosco Museum',
                  description: 'Stop at Umiam Lake (Barapani) — a stunning reservoir surrounded by pine-covered hills, perfect for photos. Then visit the Don Bosco Centre for Indigenous Cultures — a 7-storey museum showcasing the culture, art, and traditions of all Northeast Indian tribes. It is one of the best museums in India for understanding the region.',
                  estimatedCostINR: 800,
                  transportMode: 'taxi',
                  tags: ['lake', 'museum', 'tribal-culture', 'Northeast', 'photography'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:00',
                  endTime: '20:00',
                  title: 'Police Bazaar & Khasi Dinner',
                  description: 'Explore Police Bazaar — Shillong\'s bustling commercial hub. Sample Khasi cuisine: jadoh (rice cooked with pork or chicken), tungrymbai (fermented soybean), and doh khlieh (pork salad with onions). Shillong is also India\'s rock music capital — check if any live gigs are on at a local cafe.',
                  estimatedCostINR: 800,
                  transportMode: 'walking',
                  tags: ['bazaar', 'food', 'Khasi', 'music', 'nightlife'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 6,
            title: 'Cherrapunji — Living Root Bridges & Waterfalls',
            description: 'Day trip to Cherrapunji (Sohra) for living root bridges and some of the tallest waterfalls in India',
            dailyBudgetINR: 4500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '06:00',
                  endTime: '12:00',
                  title: 'Living Root Bridges of Nongriat',
                  description: 'The highlight of the Northeast — trek down 3,500 steps into the Nongriat Valley to see the double-decker Living Root Bridge. These extraordinary bridges are made from the aerial roots of rubber fig trees trained over decades by the Khasi tribe. The double-decker bridge is over 180 years old and can hold 50 people. The trek is challenging but unforgettable.',
                  estimatedCostINR: 1500,
                  transportMode: 'walking',
                  tags: ['trek', 'living-root-bridge', 'must-do', 'unique', 'nature', 'Khasi'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '13:00',
                  endTime: '16:00',
                  title: 'Nohkalikai Falls & Seven Sisters Falls',
                  description: 'Visit Nohkalikai Falls — India\'s tallest plunge waterfall at 340 metres, dropping into a stunning turquoise pool. The viewpoint offers one of the most dramatic vistas in India. Then stop at Nohsngithiang Falls (Seven Sisters Falls) where seven streams plunge 315 metres down a cliff face — most spectacular during the monsoon.',
                  estimatedCostINR: 800,
                  transportMode: 'taxi',
                  tags: ['waterfall', 'tallest', 'photography', 'nature', 'dramatic'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:00',
                  endTime: '19:30',
                  title: 'Mawsmai Cave & Return to Shillong',
                  description: 'Explore the Mawsmai limestone cave — a 150-metre-long natural cave with stunning stalactites and stalagmites. The cave is well-lit and accessible (some tight squeezes add to the adventure). Return to Shillong for dinner.',
                  estimatedCostINR: 1000,
                  transportMode: 'taxi',
                  tags: ['cave', 'limestone', 'adventure', 'geology'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 7,
            title: 'Dawki River & Departure',
            description: 'Visit the crystal-clear Dawki River at the India-Bangladesh border before departing',
            dailyBudgetINR: 4500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '06:00',
                  endTime: '11:00',
                  title: 'Dawki River (Umngot River)',
                  description: 'Drive to Dawki (80 km from Shillong) to see the Umngot River — famous for its crystal-clear waters where boats appear to float in mid-air. Take a boat ride on the transparent river with the India-Bangladesh border visible across the water. The early morning light is best for the iconic floating-boat photographs.',
                  estimatedCostINR: 2000,
                  transportMode: 'taxi',
                  transportDurationMins: 150,
                  tags: ['river', 'crystal-clear', 'boat-ride', 'must-visit', 'photography', 'border'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:00',
                  endTime: '14:00',
                  title: 'Mawlynnong — Asia\'s Cleanest Village',
                  description: 'Visit Mawlynnong, awarded "Cleanest Village in Asia" — a model Khasi village with bamboo dustbins, flower-lined pathways, and a living root bridge within walking distance. The skywalk (bamboo platform atop a tree) offers views of the Bangladesh plains below.',
                  estimatedCostINR: 800,
                  transportMode: 'taxi',
                  tags: ['cleanest-village', 'eco-tourism', 'culture', 'unique'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '15:00',
                  endTime: '18:00',
                  title: 'Return to Guwahati & Departure',
                  description: 'Drive back to Guwahati (180 km, 4 hours) for your flight or train onward. If time permits, stop at Kamakhya Temple on Nilachal Hill — one of India\'s most important Shakti Peethas with panoramic views of the Brahmaputra River.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  transportDurationMins: 240,
                  tags: ['departure', 'transfer', 'temple'],
                  sortOrder: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ── SAMPLE ITINERARY 5: LADAKH EXPEDITION ─────────────────────────
  console.log('🗺️  Seeding Ladakh Expedition itinerary...');

  await prisma.itinerary.upsert({
    where: { shareToken: 'india-ladakh-6d' },
    update: {},
    create: {
      title: 'Ladakh Expedition — 6 Days',
      description: 'The ultimate high-altitude adventure through the moonscape of Ladakh — ancient monasteries perched on clifftops, the world\'s highest motorable passes, the surreal blue of Pangong Tso, and the sand dunes of Nubra Valley. This 6-day expedition covers Leh, Nubra Valley, and Pangong Lake at a pace that allows proper acclimatization. Perfect for adventurers, photographers, and anyone seeking landscapes unlike anywhere else on Earth.',
      destinationSlugs: ['india'],
      durationDays: 6,
      travelStyle: 'ADVENTURE',
      pace: 'BALANCED',
      companionType: 'FRIENDS',
      budgetTotalINR: 35000,
      interests: ['adventure', 'photography', 'nature', 'mountains', 'monasteries'],
      status: 'PUBLISHED',
      isAiGenerated: false,
      isPublic: true,
      isSample: true,
      shareToken: 'india-ladakh-6d',
      viewCount: 987,
      saveCount: 312,
      days: {
        create: [
          {
            dayNumber: 1,
            title: 'Leh — Arrival & Acclimatization',
            description: 'Arrive in Leh and spend the day acclimatizing to the extreme altitude (3,500m)',
            dailyBudgetINR: 4000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '08:00',
                  endTime: '11:00',
                  title: 'Arrive in Leh & Rest',
                  description: 'Fly into Kushok Bakula Rimpochee Airport — the landing over snow-capped peaks and into the brown moonscape valley is one of the most dramatic in the world. IMPORTANT: Rest at your hotel for the first few hours. Leh is at 3,500m and altitude sickness is real. Drink plenty of water, avoid exertion, and let your body adjust.',
                  estimatedCostINR: 500,
                  transportMode: 'taxi',
                  transportNotes: 'Pre-book airport pickup through your hotel (₹500–800). Most guesthouses are in Changspa or Fort Road area.',
                  tags: ['arrival', 'acclimatization', 'high-altitude', 'rest'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '14:00',
                  endTime: '16:30',
                  title: 'Leh Palace & Old Town Walk',
                  description: 'After resting, take a gentle walk to Leh Palace — a 9-storey 17th-century royal palace modelled on the Potala Palace in Lhasa. The rooftop offers 360-degree views of the Stok Range, Zanskar Range, and the Indus Valley. Walk slowly through the old town\'s narrow lanes with ancient wooden balconied houses.',
                  estimatedCostINR: 500,
                  transportMode: 'walking',
                  tags: ['palace', 'heritage', 'views', 'old-town', 'gentle-walk'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:00',
                  endTime: '19:30',
                  title: 'Shanti Stupa Sunset',
                  description: 'Climb the steps (or drive up) to Shanti Stupa — a white-domed Buddhist peace pagoda built by a Japanese monk. The sunset views from here are extraordinary: the Leh Valley, Stok Kangri peak (6,153m), and the confluence of the Indus and Zanskar rivers spread below. Return for a Ladakhi thukpa dinner.',
                  estimatedCostINR: 500,
                  transportMode: 'walking',
                  tags: ['stupa', 'sunset', 'Buddhism', 'panorama', 'must-visit', 'photography'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 2,
            title: 'Leh — Monasteries & Indus Valley',
            description: 'Explore the ancient Buddhist monasteries of the Indus Valley',
            dailyBudgetINR: 5000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '07:00',
                  endTime: '11:00',
                  title: 'Thiksey Monastery',
                  description: 'Visit Thiksey Gompa — Ladakh\'s most photogenic monastery, resembling a mini Potala Palace rising 12 storeys on a hilltop. Arrive by 7 AM to witness the morning prayer ceremony (puja) with chanting monks, trumpets, and cymbals. The 15-metre seated Maitreya Buddha statue is magnificent.',
                  estimatedCostINR: 800,
                  transportMode: 'taxi',
                  tags: ['monastery', 'Buddhism', 'prayer', 'photography', 'must-visit', 'sunrise'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '11:30',
                  endTime: '15:00',
                  title: 'Hemis Monastery & Shey Palace',
                  description: 'Explore Hemis Monastery — the largest and wealthiest monastery in Ladakh, famous for its annual masked dance festival. The museum houses a stunning collection of thangka paintings, gold statues, and ancient weapons. Then visit the nearby Shey Palace with its giant copper-gilt Buddha statue.',
                  estimatedCostINR: 1000,
                  transportMode: 'taxi',
                  tags: ['monastery', 'museum', 'thangka', 'heritage', 'Hemis'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '16:00',
                  endTime: '19:00',
                  title: 'Sangam (Indus-Zanskar Confluence) & Magnetic Hill',
                  description: 'Drive to the Sangam — the breathtaking confluence of the turquoise Zanskar and muddy Indus rivers. The two-toned river meeting is a spectacular sight. Nearby, experience the optical illusion of Magnetic Hill where vehicles appear to roll uphill. Stop at the Gurudwara Pathar Sahib on the way back.',
                  estimatedCostINR: 1500,
                  transportMode: 'taxi',
                  tags: ['confluence', 'rivers', 'Magnetic-Hill', 'photography', 'Gurudwara'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 3,
            title: 'Leh to Nubra Valley — Khardung La Pass',
            description: 'Cross the mighty Khardung La pass into the surreal Nubra Valley',
            dailyBudgetINR: 6500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '06:00',
                  endTime: '11:00',
                  title: 'Khardung La Pass (5,359m)',
                  description: 'Depart early for the exhilarating drive over Khardung La — one of the world\'s highest motorable passes at 5,359m. The road climbs through switchbacks with increasingly dramatic mountain scenery. Stop at the top for photos with the iconic signboard, prayer flags fluttering in the wind, and snow-capped peaks in every direction. Descend into the Nubra Valley.',
                  estimatedCostINR: 3000,
                  transportMode: 'taxi',
                  transportDurationMins: 240,
                  transportNotes: 'Protected area — PAP required (arranged in Leh, ₹400–600 per person). Carry warm clothing for the pass. Hire a taxi for 2-day Nubra trip (₹8,000–10,000).',
                  tags: ['high-pass', 'Khardung-La', 'must-do', 'photography', 'adventure', 'permit-required'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:00',
                  endTime: '15:00',
                  title: 'Diskit Monastery & Giant Maitreya',
                  description: 'Visit Diskit Monastery — the oldest and largest monastery in Nubra Valley (founded 1420). The 32-metre Maitreya Buddha statue standing below the monastery, facing the Shyok River valley, is an iconic Ladakh image. The views of the stark desert valley, green oasis villages, and distant Karakoram Range from the monastery are surreal.',
                  estimatedCostINR: 500,
                  transportMode: 'taxi',
                  tags: ['monastery', 'giant-Buddha', 'photography', 'views', 'iconic'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '16:00',
                  endTime: '19:00',
                  title: 'Hunder Sand Dunes & Bactrian Camels',
                  description: 'The most surreal sight in Ladakh — white sand dunes in the middle of a high-altitude cold desert at 3,000m, with double-humped Bactrian camels (descended from Silk Route caravans) wandering through. Take a short camel ride at sunset. Stay at a camp or guesthouse in Hunder village.',
                  estimatedCostINR: 1500,
                  transportMode: 'walking',
                  tags: ['sand-dunes', 'Bactrian-camels', 'sunset', 'camping', 'Silk-Route', 'unique'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 4,
            title: 'Nubra Valley — Hot Spring & Return to Leh',
            description: 'Visit the Panamik hot spring and explore Nubra before returning to Leh',
            dailyBudgetINR: 5000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '07:00',
                  endTime: '10:00',
                  title: 'Panamik Hot Spring & Ensa Monastery',
                  description: 'Drive to Panamik village to soak in the natural sulphur hot springs — believed to have medicinal properties. The setting is stunning: a green valley surrounded by barren mountains with the Siachen Glacier visible in the distance. Visit the small Ensa Monastery nearby for serene morning views.',
                  estimatedCostINR: 1000,
                  transportMode: 'taxi',
                  tags: ['hot-spring', 'natural', 'monastery', 'valley', 'relaxation'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '10:30',
                  endTime: '16:00',
                  title: 'Return to Leh via Khardung La',
                  description: 'Drive back over Khardung La to Leh. The return journey offers different light and perspectives on the dramatic landscape. Stop at the small tea houses along the way for butter tea and Maggi — the quintessential Ladakh trail food. Arrive in Leh by afternoon.',
                  estimatedCostINR: 2000,
                  transportMode: 'taxi',
                  transportDurationMins: 300,
                  tags: ['transfer', 'high-pass', 'scenic-drive', 'return'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:00',
                  endTime: '20:00',
                  title: 'Leh Market & Rest',
                  description: 'Spend a relaxed evening in Leh Main Bazaar. Browse Tibetan handicrafts, pashmina shawls, turquoise jewellery, and singing bowls. Dine at one of the rooftop restaurants on Fort Road with views of the illuminated Leh Palace and Tsemo Castle above.',
                  estimatedCostINR: 1500,
                  transportMode: 'walking',
                  tags: ['shopping', 'market', 'dinner', 'relaxation', 'handicrafts'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 5,
            title: 'Leh to Pangong Tso — Chang La Pass',
            description: 'Drive over Chang La pass to the legendary Pangong Lake',
            dailyBudgetINR: 7000,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '06:00',
                  endTime: '11:00',
                  title: 'Drive to Pangong via Chang La (5,360m)',
                  description: 'Depart early for the 5-hour drive to Pangong Tso via Chang La — the third-highest motorable pass in the world. The road climbs through barren, Mars-like landscapes and crosses several high-altitude plateaus. Chang La is often snowbound even in summer — carry warm layers.',
                  estimatedCostINR: 3000,
                  transportMode: 'taxi',
                  transportDurationMins: 300,
                  transportNotes: 'Protected area — PAP required. Hire a taxi for the Pangong trip (₹7,000–9,000 for 2 days). Carry snacks and water — no shops for long stretches.',
                  tags: ['high-pass', 'Chang-La', 'adventure', 'permit-required', 'scenic-drive'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '12:00',
                  endTime: '16:00',
                  title: 'Pangong Tso — First Views',
                  description: 'The first glimpse of Pangong Tso is life-changing — a 134-km-long lake at 4,350m altitude, stretching from India into Tibet, with impossibly blue water that shifts from azure to turquoise to deep blue depending on the light. Famous from the climax of "3 Idiots". Walk along the shore, skip stones on the crystal water, and take in the silence.',
                  estimatedCostINR: 1000,
                  transportMode: 'walking',
                  tags: ['lake', 'Pangong', 'must-visit', '3-Idiots', 'photography', 'iconic', 'high-altitude'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '17:00',
                  endTime: '20:00',
                  title: 'Lakeside Camping & Stargazing',
                  description: 'Stay at one of the lakeside camps (tented accommodation with basic facilities). Watch the sunset paint the surrounding mountains in shades of rust, purple, and gold while the lake turns deep indigo. At night, with zero light pollution, the Milky Way is visible in stunning clarity — some of the best stargazing in India.',
                  estimatedCostINR: 2500,
                  transportMode: 'walking',
                  tags: ['camping', 'sunset', 'stargazing', 'Milky-Way', 'lakeside', 'experience'],
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            dayNumber: 6,
            title: 'Pangong Tso Sunrise & Return to Leh',
            description: 'Watch the sunrise over Pangong Lake and return to Leh for departure',
            dailyBudgetINR: 7500,
            items: {
              create: [
                {
                  timeSlot: 'morning',
                  startTime: '05:30',
                  endTime: '08:00',
                  title: 'Pangong Tso Sunrise',
                  description: 'Wake up early for the Pangong sunrise — the lake transforms through an incredible palette of colours as dawn breaks over the Changthang Plateau. The still water mirrors the mountains and sky perfectly. Explore the southern bank for different perspectives and look for wild marmots and kiangs (wild asses) on the shore.',
                  estimatedCostINR: 500,
                  transportMode: 'walking',
                  tags: ['sunrise', 'photography', 'lake', 'wildlife', 'peaceful'],
                  sortOrder: 0,
                },
                {
                  timeSlot: 'afternoon',
                  startTime: '09:00',
                  endTime: '15:00',
                  title: 'Return to Leh via Changthang Plateau',
                  description: 'Begin the return drive to Leh (5 hours). The return route through the Changthang Plateau offers vast open landscapes with wild horses, marmot colonies, and nomadic Changpa herders with their pashmina goats. Stop at Tangtse village for a final chai and momos before crossing Chang La again.',
                  estimatedCostINR: 3500,
                  transportMode: 'taxi',
                  transportDurationMins: 300,
                  tags: ['return', 'scenic-drive', 'plateau', 'wildlife', 'nomads'],
                  sortOrder: 1,
                },
                {
                  timeSlot: 'evening',
                  startTime: '16:00',
                  endTime: '19:00',
                  title: 'Farewell Leh & Departure',
                  description: 'Final evening in Leh. Pick up last souvenirs — Ladakhi apricot jam, seabuckthorn juice, pashmina shawls, and prayer flags to take home. Have a farewell dinner of skyu (Ladakhi pasta) or tingmo (steamed bread) with spicy meat curry. Depart by early morning flight the next day.',
                  estimatedCostINR: 2000,
                  transportMode: 'walking',
                  tags: ['departure', 'shopping', 'farewell-dinner', 'souvenirs'],
                  sortOrder: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ 5 India sample itineraries seeded');

  // ── BLOG POSTS ───────────────────────────────────────────
  console.log('📝 Seeding India blog posts...');

  await prisma.blogPost.upsert({
    where: { slug: 'ultimate-india-travel-guide' },
    update: {},
    create: {
      title: 'The Ultimate India Travel Guide for First-Timers',
      slug: 'ultimate-india-travel-guide',
      excerpt: 'Everything you need to know before your first trip across India — from budget expectations and transport options to food tips, safety advice, and must-have apps.',
      content: `India is unlike any other destination on Earth. A first trip here can be overwhelming, exhilarating, and deeply rewarding all at once. This guide covers the practical essentials every first-time traveller needs to know.

**When to Visit**
India is a year-round destination, but timing matters. October to March is the sweet spot for most of the country — pleasant weather across the plains, Rajasthan, and South India. The Himalayas (Ladakh, Himachal, Uttarakhand) are best from May to September. Monsoon season (July–September) brings lush landscapes to Kerala and the Northeast but heavy rain elsewhere.

**Budget Expectations**
India remains one of the world\'s most affordable travel destinations. Budget travellers can comfortably spend ₹1,500–2,500 per day covering accommodation (₹400–800 for hostels/guesthouses), meals (₹100–300 per meal at local restaurants), and local transport. Mid-range travellers should budget ₹4,000–8,000 per day for boutique hotels, AC taxis, and restaurant dining.

**Getting Around**
Indian Railways is the backbone of long-distance travel — book through the IRCTC app or website. Sleeper class (₹200–500) is an experience; AC classes (₹500–2,000) offer comfort. Budget airlines (IndiGo, SpiceJet, Air India Express) connect major cities with fares often under ₹3,000 if booked early. Within cities, use Ola/Uber for taxis, metro systems in Delhi, Mumbai, Bangalore, and Kolkata, and auto-rickshaws everywhere else.

**Food Tips**
India is a vegetarian paradise — you will never struggle to find delicious meat-free food anywhere. Every region has its own cuisine: Rajasthani dal baati churma, South Indian dosas and idlis, Bengali fish curry, Punjabi butter chicken, and Gujarati thalis. Street food is generally safe at busy stalls with high turnover. Stick to freshly cooked food and bottled water.

**Must-Have Apps**
Download these before arriving: IRCTC (train bookings), Ola/Uber (taxis), Google Maps (offline maps essential), Zomato/Swiggy (food delivery and restaurant discovery), MakeMyTrip (hotels and flights), Google Translate (for Hindi and regional languages), and UPI-enabled payment apps (PhonePe/Google Pay — widely accepted even at street stalls).

**Safety Advice**
India is generally safe for travellers exercising normal precautions. Avoid isolated areas at night, use registered taxis, keep valuables secure, and carry copies of your ID. Women travellers should dress modestly in smaller towns and avoid travelling alone late at night. The emergency helpline is 112.

**Packing Essentials**
Comfortable walking shoes, modest clothing (covering shoulders and knees for temples), sunscreen, mosquito repellent, basic medications (for stomach issues — carry Imodium and ORS), a universal power adapter, and a good daypack. In winter, pack warm layers for North India.

**Cultural Etiquette**
Remove shoes before entering temples and homes. Use your right hand for eating and greetings. Dress modestly at religious sites. Ask permission before photographing people. Tipping is appreciated but not mandatory — 10% at restaurants, ₹20–50 for small services. Learn a few Hindi words: "Namaste" (hello), "Dhanyavaad" (thank you), "Kitna?" (how much?).`,
      coverImageUrl: '/images/blog/ultimate-india-travel-guide.jpg',
      category: 'destination_guide',
      tags: ['india', 'guide', 'first-time', 'tips'],
      authorName: 'Trails and Miles Team',
      readTimeMinutes: 8,
      relatedSlugs: ['india'],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'weekend-getaways-from-delhi' },
    update: {},
    create: {
      title: '50 Weekend Getaways from Delhi Under ₹10,000',
      slug: 'weekend-getaways-from-delhi',
      excerpt: 'Escape the capital without burning a hole in your pocket — the best weekend destinations within driving or train distance of Delhi, all under ₹10,000 for two days.',
      content: `Delhi NCR residents are blessed with an incredible variety of weekend getaways in every direction — mountains to the north, desert to the west, heritage to the south, and wildlife to the east. Here are the top destinations you can cover in a weekend for under ₹10,000 (including transport, accommodation, food, and activities).

**Rishikesh (230 km, 5–6 hours)** — ₹4,000–7,000
The yoga capital of the world offers rafting on the Ganges (₹700–1,200), cafe hopping at Beatles Ashram area, the Laxman Jhula and Ram Jhula bridges, and the evening Ganga Aarti at Triveni Ghat. Stay at riverside hostels or ashrams (₹300–800/night). Best: September–November, February–April.

**Jaipur (270 km, 4–5 hours)** — ₹5,000–8,000
The Pink City is perfect for a culture-packed weekend. Amber Fort, Hawa Mahal, City Palace, and Nahargarh Fort sunset can all be covered in two days. Budget hostels start at ₹400/night. Volvo buses from Kashmere Gate (₹600–900). Best: October–March.

**Agra (230 km, 3–4 hours)** — ₹3,000–6,000
The Taj Mahal at sunrise is a bucket-list experience. Add Agra Fort, Mehtab Bagh, and Fatehpur Sikri for a complete weekend. Gatimaan Express (₹750–1,500) gets you there in 100 minutes. Budget hotels near Taj start ₹500/night. Best: October–March.

**Shimla (340 km, 7–8 hours)** — ₹5,000–8,000
The former British summer capital offers colonial architecture, Mall Road walks, Kufri day trips, and the toy train experience from Kalka. AC Volvo buses from ISBT (₹700–1,000). Guesthouses from ₹600/night. Best: March–June, September–November.

**Manali (530 km, 12–14 hours)** — ₹6,000–9,000
For adventure seekers — Solang Valley paragliding (₹1,500–2,500), Old Manali cafes, Hadimba Temple, and Jogini Falls. Overnight Volvo buses (₹800–1,200) save on a hotel night. Hostels from ₹400/night. Best: March–June, September–November.

**Mussoorie (280 km, 6–7 hours)** — ₹4,000–7,000
The "Queen of Hills" offers Kempty Falls, Gun Hill ropeway, Lal Tibba viewpoint, and the scenic Camel\'s Back Road walk. Stay at budget hotels on Mall Road (₹500–800/night). Best: March–June, September–November.

**Nainital (300 km, 7–8 hours)** — ₹4,000–7,000
The charming lake town with Naini Lake boating, Snow View via ropeway, and Naina Devi Temple. Walk around the lake, visit Tiffin Top, and try the local bhatt ki churkani. Hotels from ₹500/night. Best: March–June, September–November.

**Jim Corbett National Park (250 km, 5–6 hours)** — ₹5,000–9,000
India\'s oldest national park for tiger safaris (jeep safari ₹4,500–6,000 per vehicle). Dhikala zone is the best but requires advance booking on the forest department website. Budget stays in Ramnagar town from ₹600/night. Best: November–June.

**Amritsar (450 km, 7–8 hours)** — ₹5,000–8,000
The Golden Temple is a spiritual experience unlike any other — the langar (free community kitchen) serves 50,000 meals daily. Add the Wagah Border ceremony, Jallianwala Bagh, and Amritsari kulcha for a memorable weekend. Shatabdi Express (₹700–1,000). Best: October–March.

**Mcleodganj (480 km, 10–12 hours)** — ₹5,000–8,000
Home of the Dalai Lama and the Tibetan exile community. Trek to Triund (9,350 ft) for stunning Dhauladhar views, explore the Tsuglagkhang Complex, and enjoy Tibetan food in the cafes of Bhagsu. Hostels from ₹300/night. Best: March–June, September–November.

**Other top picks**: Mathura-Vrindavan (spiritual), Sariska (wildlife), Neemrana (heritage stay), Lansdowne (peace), Kasauli (colonial charm), Dehradun-Rajaji Park (Doon Valley), Haridwar (pilgrimage & aarti).

**Pro Tips**: Book Volvo buses 3–5 days ahead on RedBus. Travel on weekdays to save 30–40% on accommodation. Pack light — one backpack is enough for a weekend. Download offline maps for hill stations with patchy connectivity.`,
      coverImageUrl: '/images/blog/weekend-getaways-from-delhi.jpg',
      category: 'budget',
      tags: ['delhi', 'weekend', 'budget', 'getaways'],
      authorName: 'Trails and Miles Team',
      readTimeMinutes: 10,
      relatedSlugs: ['india'],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'kerala-backwaters-houseboat-guide' },
    update: {},
    create: {
      title: 'Kerala Backwaters: Complete Houseboat Guide with Prices',
      slug: 'kerala-backwaters-houseboat-guide',
      excerpt: 'Everything you need to know about Kerala\'s iconic houseboat experience — from choosing the right boat and route to real price breakdowns and insider booking tips.',
      content: `A houseboat cruise through Kerala\'s backwaters is one of India\'s most iconic travel experiences. Floating through palm-fringed canals, watching village life drift by, and dining on fresh Kerala cuisine cooked onboard — it is quintessential God\'s Own Country. Here is your complete guide.

**Types of Houseboats**
Kettuvallam (traditional rice barges converted into houseboats) come in several tiers. **Standard houseboats** (₹5,000–8,000 per night) have basic rooms, an open deck, and included meals. **Deluxe houseboats** (₹8,000–15,000) offer AC bedrooms, attached bathrooms, upper deck lounge, and a dedicated cook. **Premium/Luxury houseboats** (₹15,000–30,000+) feature jacuzzis, private sundecks, multi-course gourmet meals, and butler service. All houseboats include a captain, a cook, and at least one crew member.

**What is Included**
A standard overnight cruise includes: welcome drink, lunch, evening tea and snacks, dinner, breakfast, and the boat with crew. Alcohol is usually not included but can be purchased separately. Some boats include fishing equipment and canoe rides through narrow canals.

**Best Routes**
The **Alleppey to Kumarakom** route (or reverse) is the most popular — winding through Vembanad Lake and narrow village canals. The **Alleppey to Alumkadavu** route is quieter and more scenic. For something offbeat, try the **Kollam to Alleppey** route (8-hour daytime cruise) covering the longest backwater stretch in Kerala. The narrow canals around **Kuttanad** (the rice bowl below sea level) offer the most intimate village experience.

**Booking Tips**
Book directly with houseboat operators in Alleppey (Finishing Point jetty) for the best prices — walk-in rates are 30–40% cheaper than online aggregators. During peak season (December–February), book 2–3 weeks ahead. The **Kerala Tourism Development Corporation (KTDC)** operates government houseboats at fixed, reasonable rates. Always check the boat in person before paying if possible — photos can be misleading.

**What to Pack**
Sunscreen and sunglasses (the deck gets hot), mosquito repellent (essential after sunset), a light jacket for the evening breeze, comfortable clothing, a power bank (some boats have limited charging points), binoculars for birdwatching, and a good book for the slow, peaceful afternoons.

**Best Time to Visit**
**October to February** is ideal — cool weather, clear skies, and the backwaters are at their most beautiful after the monsoon. **June to September** (monsoon) offers lush green landscapes and the lowest prices but expect rain. **March to May** is hot and humid — AC boats are essential. The **Nehru Trophy Snake Boat Race** (August in Alleppey) is a spectacular cultural event if your visit coincides.

**Budget Breakdown for a Couple**
Economy trip: Standard houseboat ₹6,000 + transport from Kochi ₹1,000 + extras ₹1,000 = ₹8,000 total. Comfortable trip: Deluxe houseboat ₹12,000 + transport ₹1,500 + extras ₹2,000 = ₹15,500 total. The houseboat experience is surprisingly accessible — and worth every rupee.

**Insider Tips**
Choose a boat with an upper deck for the best views and photography. The evening and early morning hours are the most magical — golden light, fewer boats, and village sounds carrying across the water. Tip the crew ₹300–500 at the end — they work hard and the gesture is appreciated. Carry cash — there are no ATMs on the water.`,
      coverImageUrl: '/images/blog/kerala-backwaters-houseboat-guide.jpg',
      category: 'destination_guide',
      tags: ['kerala', 'backwaters', 'houseboat', 'alleppey'],
      authorName: 'Trails and Miles Team',
      readTimeMinutes: 7,
      relatedSlugs: ['india'],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'rajasthan-budget-guide' },
    update: {},
    create: {
      title: 'Rajasthan on a Budget: ₹2,000/Day Royal Experience',
      slug: 'rajasthan-budget-guide',
      excerpt: 'You do not need a king\'s ransom to experience the Land of Kings — here is how to explore Rajasthan\'s forts, palaces, and bazaars on just ₹2,000 per day.',
      content: `Rajasthan conjures images of opulent palaces and luxury heritage hotels, but the state is also one of India\'s most rewarding destinations for budget travellers. With planning and local knowledge, ₹2,000 per day covers accommodation, food, transport, and sightseeing comfortably.

**Accommodation (₹400–800/night)**
Rajasthan has an excellent hostel scene. Zostel, Moustache, and GoStops operate in Jaipur, Jodhpur, Udaipur, and Pushkar with dorm beds from ₹300–500 and private rooms from ₹800–1,200. For something uniquely Rajasthani, try dharamshalas (temple guesthouses) in Pushkar and Nathdwara — clean rooms for ₹200–400 with a spiritual atmosphere. In smaller towns like Bundi and Chittorgarh, family-run guesthouses offer rooms with character for ₹500–800.

**Food (₹300–500/day)**
Rajasthani street food is legendary AND cheap. Start mornings with pyaaz kachori and chai (₹30–50). Lunch at a local "thali" restaurant serving unlimited dal, baati, churma, vegetables, roti, and rice for ₹80–150. Evening snacks of mirchi vada, samosa, and lassi (₹50–80). Dinner at a dhaba with laal maas or gatte ki sabzi with bajra roti (₹100–200). In Jaipur, the Masala Chowk food court offers a hygienic way to try multiple Rajasthani specialities under one roof.

**Transport (₹200–400/day)**
Rajasthan State Road Transport Corporation (RSRTC) buses are the backbone of budget travel — AC buses between cities cost ₹200–500 (Jaipur–Jodhpur ₹400, Jodhpur–Udaipur ₹300). Indian Railways connects all major cities with sleeper class fares under ₹300. Within cities, shared auto-rickshaws cost ₹10–20 per ride, and many old cities are walkable. Rent a bicycle in Udaipur\'s old town for ₹100/day.

**Free and Cheap Sightseeing**
Many of Rajasthan\'s best experiences are free or nearly so. Free walking tours operate in Jaipur, Jodhpur, and Udaipur (tip-based). Sunset from Nahargarh Fort walls (free after entry ₹50). Walking through Jodhpur\'s Blue City lanes (free). Pushkar Lake ghats and aarti (free). Udaipur\'s Gangaur Ghat and lake views (free). Most forts charge ₹50–200 for Indian citizens — a fraction of the international tourist price.

**Temple Stays and Ashrams**
Pushkar is the budget capital of Rajasthan — stay at ashrams for ₹100–300, eat sattvic meals for ₹50, and soak in the spiritual atmosphere for free. The Brahma Temple, evening aarti, and 52 ghats are all free to visit. Nathdwara\'s Shrinathji Temple area has dharamshalas from ₹200/night.

**Off-Season Travel**
Visit in July–September (monsoon) or April–May (summer) for 40–60% savings on accommodation. Monsoon Rajasthan is surprisingly beautiful — the forts and palaces look dramatic against cloudy skies, and the Aravallis turn green. Carry an umbrella and enjoy the emptier tourist sites.

**Sample Budget (Per Person/Day)**
Dorm bed: ₹400 | Breakfast: ₹50 | Lunch thali: ₹120 | Chai & snacks: ₹50 | Sightseeing: ₹200 | Local transport: ₹200 | Dinner: ₹150 | Miscellaneous: ₹100 = **₹1,270/day**. Even with a private room (₹500–800), you stay well under ₹2,000. The royal experience does not require a royal budget.`,
      coverImageUrl: '/images/blog/rajasthan-budget-guide.jpg',
      category: 'budget',
      tags: ['rajasthan', 'budget', 'jaipur', 'jodhpur', 'udaipur'],
      authorName: 'Trails and Miles Team',
      readTimeMinutes: 8,
      relatedSlugs: ['india'],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'solo-female-travel-india' },
    update: {},
    create: {
      title: 'Solo Female Travel in India: An Honest Safety Guide',
      slug: 'solo-female-travel-india',
      excerpt: 'An honest, balanced guide for women travelling solo in India — the safest regions, practical safety tips, what to expect, and how to have an incredible experience.',
      content: `India gets a mixed reputation for solo female travel, and it is important to be honest about both the challenges and the incredible rewards. Millions of women — Indian and international — travel safely across India every year. With the right preparation and awareness, solo female travel in India can be deeply fulfilling.

**Safest Regions and Cities**
Some regions are notably more comfortable for solo women travellers. **Kerala** consistently ranks as one of India\'s safest states — high literacy, progressive attitudes, and well-developed tourism infrastructure. **Northeast India** (Meghalaya, Sikkim, Mizoram) is matrilineal in many communities and exceptionally safe. **Himachal Pradesh** (Manali, Dharamshala, Spiti) has a strong backpacker culture and welcoming locals. **Goa** is comfortable for solo women, especially North Goa\'s beach areas. In cities, **Bangalore**, **Chennai**, **Pune**, and **Kolkata** are generally considered safer than Delhi.

**Practical Safety Tips**
Always share your live location with a trusted person (Google Maps or WhatsApp). Pre-book accommodation rather than searching on arrival. Use verified transport — Ola/Uber with trip sharing enabled, or pre-paid airport taxis. Avoid empty streets and poorly lit areas after dark. Trust your instincts — if something feels wrong, leave immediately. At railway stations, use the ladies\' waiting room and book upper berths in sleeper class for privacy.

**Transport Safety**
Book AC coaches on trains — more expensive but safer and more comfortable. On buses, choose seats near the front or near other women. Many Indian trains have "ladies\' coaches" — look for the L marking. Use ride-hailing apps over auto-rickshaws for the trip tracking feature. For night travel, fly or book 2AC/3AC train berths rather than buses.

**Recommended Hostels for Women**
The hostel scene in India has transformed in the past five years. **Zostel** (pan-India chain) has excellent safety measures and female dorms. **goStops** and **Moustache Hostel** are equally reliable. In Jaipur, try **Hostel Pearl Palace**. In Udaipur, **BunkYard** has great reviews from solo women. Many hostels organise group outings, making it easy to meet fellow travellers.

**What to Wear**
There is no need to drastically change your wardrobe, but modest dressing helps in smaller towns and religious sites. Loose kurtas with jeans or palazzo pants are comfortable, culturally appropriate, and widely available in India. In tourist areas (Goa, Manali, Rishikesh), casual Western wear is perfectly fine. Carry a scarf/dupatta — it doubles as a temple cover-up and sun protection.

**Emergency Contacts and Apps**
Save these: 112 (unified emergency), 1091 (women\'s helpline), 100 (police). Download the **Himmat Plus** app (Delhi Police SOS), **Shake2Safety** (sends SOS on phone shake), and **bSafe** (location sharing and fake call feature). Most states also have their own women safety apps.

**The Honest Truth**
Staring is common and uncomfortable — sunglasses and headphones help create a personal barrier. Unwanted attention can happen but is almost always verbal, not physical. Saying "no" firmly works in most situations. Having a "husband" (real or fictional) is a useful social tool for deflecting persistent attention. Millions of Indian women navigate these realities daily — observe and learn from them.

**The Reward**
Solo female travellers in India often report some of their most meaningful travel experiences — being invited into homes for chai, having deep conversations with local women, discovering inner strength through navigating challenges, and finding a confidence that transforms not just the trip but life itself. India demands more from you as a traveller, and gives back even more.`,
      coverImageUrl: '/images/blog/solo-female-travel-india.jpg',
      category: 'solo',
      tags: ['solo', 'women', 'safety', 'india', 'tips'],
      authorName: 'Trails and Miles Team',
      readTimeMinutes: 9,
      relatedSlugs: ['india'],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'india-street-food-guide' },
    update: {},
    create: {
      title: 'Street Food Across India: City-by-City Guide',
      slug: 'india-street-food-guide',
      excerpt: 'A mouth-watering tour of India\'s greatest street food — from Delhi\'s chaat to Mumbai\'s vada pav, Kolkata\'s puchka to Ahmedabad\'s fafda, one city at a time.',
      content: `India\'s street food culture is arguably the richest and most diverse on the planet. Every city, every neighbourhood has its own specialities, passed down through generations of vendors who have perfected a single dish over decades. Here is your city-by-city guide to eating your way across India.

**Delhi — The Chaat Capital**
Delhi is the undisputed king of Indian street food. In **Chandni Chowk** (Asia\'s oldest market), start with paranthas at Paranthe Wali Gali — 13 types of stuffed bread fried in ghee (₹50–100). Walk to Old Famous Jalebi Wala for hot, syrupy jalebis (₹30). **Dilli 6** chaat — gol gappe, aloo tikki, papdi chaat, and dahi bhalla — is an art form. In South Delhi, visit **Khan Market** for modern street food fusion and **Bengali Market** for chhole bhature (₹60–80). Do not miss **Karim\'s** in Jama Masjid area for seekh kebabs and nihari (₹100–200).

**Mumbai — Vada Pav & Pav Bhaji**
Mumbai\'s street food is fast, flavourful, and designed for the city\'s pace. **Vada pav** (₹15–30) — the "Indian burger" of spiced potato fritter in a bun with chutneys — is available on every corner; Anand Stall at Vile Parle is legendary. **Pav bhaji** at Juhu Beach (₹60–80) is best enjoyed at sunset. **Bhel puri, sev puri, and ragda pattice** along Marine Drive are Mumbai monsoon essentials. For South Mumbai flavours, try the **keema pav** at Olympia and **bun maska with Irani chai** at Kyani & Co.

**Kolkata — Puchka & Rolls**
Kolkata\'s **puchka** (the Bengali gol gappa) has a tangier, spicier water than Delhi\'s version — the Vardaan Market puchka stall is iconic (₹20 for 6). The **Kathi roll** was invented here at Nizam\'s in New Market — flaky paratha wrapped around spiced meat or egg (₹40–80). **Jhalmuri** (puffed rice with mustard oil and spices) is Kolkata\'s walking snack (₹15–20). In North Kolkata, the **Tiretta Bazaar Chinese breakfast** (sui mai, momos, and noodle soup at 6 AM) reflects the city\'s Chinese heritage. End with **mishti doi** (sweet yoghurt) and rosogolla from any sweet shop.

**Ahmedabad — Fafda, Jalebi & Khaman**
Gujarat\'s capital has India\'s richest vegetarian street food scene. Sunday mornings belong to **fafda-jalebi** (crispy gram flour strips with jalebis and papaya chutney) — ₹40–60. **Khaman dhokla** (steamed gram flour cakes with mustard tempering) — light, tangy, and addictive (₹30). The **Manek Chowk Night Market** transforms from a jewellery market by day to a street food paradise at night — try dabeli, handvo, and ganthia. **Law Garden\'s** night market offers kulfi falooda, Gujarati pizza, and cheese-loaded street food.

**Varanasi — Tamatar Chaat & Lassi**
The holy city\'s food is as ancient as its ghats. **Tamatar chaat** (spicy tomato chaat unique to Varanasi) — tangy, fiery, and unlike anything elsewhere (₹20–30). **Blue Lassi** near Manikarnika Ghat serves thick, creamy lassi in clay cups with 80+ flavour options (₹50–80). **Kachori sabzi** at Ram Bhandar (₹30) is a Banarasi breakfast institution. **Banarasi paan** (betel leaf with sweet fillings) from Rajesh Paan Bhandar is the perfect way to end a meal.

**Chennai — Filter Coffee & Dosa**
South India\'s capital runs on filter coffee. **Mylapore** has the best — strong, frothy, served in a steel tumbler and davara set (₹15–30). **Murugan Idli Shop** serves soft-as-cloud idlis with their signature range of chutneys. The **kothu parotta** (shredded parotta stir-fried with egg, vegetables, and spices) at roadside stalls is addictive (₹50–80). **Sundal** (spiced chickpeas) on Marina Beach is a healthy beachside snack. Try **Jigarthanda** (a Madurai speciality available in Chennai) — a cold drink of milk, almond gum, and ice cream.

**Lucknow — Kebab Heaven**
Lucknow is the kebab capital of India. **Tunday Kababi** in Old Lucknow serves the legendary galouti kebabs — melt-in-your-mouth minced meat patties with 160 spices (₹80–150). **Prakash ki Kulfi** is Lucknow\'s most famous frozen treat. **Basket chaat** at Royal Cafe — a crispy potato basket filled with layers of chaat — is unique to the city. The Chowk area\'s narrow lanes hide gems: **biryani** at Idris, **nihari** at Raheem\'s, and **sheermal** (saffron bread) at Naushijaan.

**Amritsar — The Food Capital**
Punjab\'s holy city might have India\'s most generous food culture. Start at the Golden Temple\'s **langar** (free community kitchen, serving 50,000 people daily). Then hit **Kesar da Dhaba** for dal makhani slow-cooked for 18 hours (₹100). **Beera Chicken** for tandoori chicken, **Ahuja Lassi** for giant glasses of thick mango lassi, and **Brijwasi Chaat Bhandar** for tikki and gol gappe. The **Lawrence Road** food walk is essential — kulcha, amritsari fish fry, and chole.

**Street Food Safety Tips**: Eat at stalls with high turnover (food is fresher). Stick to freshly cooked items. Carry hand sanitiser. Avoid pre-cut fruit. Drink bottled water or freshly made beverages.`,
      coverImageUrl: '/images/blog/india-street-food-guide.jpg',
      category: 'food',
      tags: ['food', 'street-food', 'delhi', 'mumbai', 'kolkata'],
      authorName: 'Trails and Miles Team',
      readTimeMinutes: 10,
      relatedSlugs: ['india'],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'best-time-visit-india' },
    update: {},
    create: {
      title: 'Best Time to Visit Every Indian State',
      slug: 'best-time-visit-india',
      excerpt: 'India is a year-round destination if you know where to go when — this month-by-month guide tells you exactly which regions are perfect in every season.',
      content: `India\'s climate is incredibly diverse — from tropical beaches to frozen passes, scorching deserts to rain-soaked forests. Every month of the year, somewhere in India is at its absolute best. Here is your comprehensive seasonal guide.

**October – November: The Golden Season**
This is India\'s sweet spot. The monsoon has retreated, the landscape is lush green, and temperatures are pleasant everywhere. **Rajasthan** glows golden with perfect sightseeing weather (25–30°C). **Kerala** is post-monsoon paradise — backwaters are full, vegetation is lush, Ayurveda season begins. **Goa** starts its peak season as beach shacks reopen. **Diwali** and **Dussehra** festivals bring colour to the entire country. The **Northeast** (Meghalaya, Assam) is stunning after the rains.

**December – January: Peak Winter**
North India gets cold but incredibly atmospheric. **Delhi** has foggy mornings and the best chai weather. **Varanasi** morning boat rides through river mist are magical. **Rajasthan** is perfect but crowded — book ahead. **Rann of Kutch** (Gujarat) hosts the spectacular Rann Utsav with its white salt desert. **South India** (Tamil Nadu, Karnataka, Kerala) enjoys perfect 25–28°C weather. **Andaman Islands** have the clearest seas for diving and snorkelling. **Ladakh** is closed to most tourists but Chadar Trek (frozen river walk) runs in January.

**February – March: Spring Awakening**
The most colourful time in India. **Holi** (March) is celebrated across North India — Mathura and Vrindavan are the epicentres. **Almond blossoms** in Kashmir create pink-and-white valleys. **Central India** (Madhya Pradesh, Maharashtra) wildlife parks are at their best for tiger safaris — Ranthambore, Bandhavgarh, Kanha, Tadoba. Water holes shrink, making animal sightings more frequent. **Khajuraho Dance Festival** and **Ellora-Ajanta Festival** happen in February-March.

**April – May: Summer Heat & Hill Stations**
The plains get hot (40–45°C), but this is prime hill station season. **Shimla, Manali, Dharamshala, Mussoorie, Nainital, Darjeeling** are at their best — warm days, cool nights, and blooming rhododendrons. **Ladakh** opens up from May onwards as passes clear of snow. **Spiti Valley** becomes accessible via Rohtang Pass. **Valley of Flowers** (Uttarakhand) begins blooming from late May. **Kashmir\'s** gardens (Shalimar, Nishat) are in full flower. This is also the best time for **Sikkim** rhododendron treks.

**June: Monsoon Arrival**
The Southwest Monsoon hits **Kerala** around June 1 — the state transforms with torrential rains, making it the best time for Ayurvedic treatments at discounted rates. **Leh-Ladakh** is now fully accessible and the landscape turns green. **Meghalaya** receives the first heavy rains — Cherrapunji and Mawsynram get dramatic. The first rains in **Rajasthan** bring relief and desert blooms.

**July – August: Full Monsoon**
India\'s most dramatic season. **Kerala monsoon** is spectacular — waterfalls at full force, backwaters overflowing, green paddy fields. **Coorg (Karnataka)** and **Western Ghats** are lush and misty. **Ladakh** is in peak season — July and August are the best months with warm days, open passes, and festivals (Hemis Festival). **Valley of Flowers** is in full bloom (July–August). **Goa** monsoon is hauntingly beautiful — empty beaches, dramatic skies, cheap accommodation. The **Northeast** gets heavy rain but is incredibly green.

**September: Monsoon Retreat**
The rains begin to ease. **Onam** celebrations in Kerala, **Ganesh Chaturthi** in Maharashtra (Mumbai\'s biggest festival), and **Durga Puja** preparations in Kolkata mark the festive season\'s beginning. **Hampi** and **Gokarna** (Karnataka) emerge from monsoon looking refreshed. **Spiti Valley** has a brief golden window before winter closes the passes.

**Quick Reference by Region:**
- Himalayas (Ladakh, Spiti): May–September
- Hill Stations (Shimla, Manali, Darjeeling): March–June, September–November
- Rajasthan & North Plains: October–March
- South India: October–March (East Coast has Nov–Dec cyclone risk)
- Goa: November–February (peak), September–October (offbeat)
- Northeast: October–April (avoid June–August rains)
- Andaman: November–April
- Kashmir: March–May (tulips), September–November (autumn)
- Central India Wildlife: November–June`,
      coverImageUrl: '/images/blog/best-time-visit-india.jpg',
      category: 'tips',
      tags: ['india', 'seasons', 'weather', 'planning'],
      authorName: 'Trails and Miles Team',
      readTimeMinutes: 8,
      relatedSlugs: ['india'],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'ladakh-manali-leh-road-guide' },
    update: {},
    create: {
      title: 'Ladakh by Road: Manali to Leh Highway Complete Guide',
      slug: 'ladakh-manali-leh-road-guide',
      excerpt: 'The Manali–Leh Highway is one of the world\'s greatest road trips — here is everything you need to know about the route, acclimatization, permits, fuel, and stops.',
      content: `The Manali to Leh Highway (475 km) is not just a road — it is a transformative journey across some of the most spectacular mountain terrain on Earth. Crossing five high passes, two of them above 5,000 metres, the road takes you from green pine forests to barren moonscapes in just two days. Here is your complete guide.

**Route Overview**
The highway runs from Manali (2,050m) to Leh (3,500m), crossing five major passes: Rohtang La (3,978m), Baralacha La (4,890m), Nakee La (4,739m), Lachalung La (5,065m), and Tanglang La (5,328m). The total distance is approximately 475 km, typically covered in 2 days with an overnight stop at Jispa or Sarchu. The road is open from mid-June to mid-October (weather dependent).

**Day 1: Manali to Jispa/Sarchu (220 km, 8–10 hours)**
Depart Manali early morning. Cross the Atal Tunnel (9.02 km — the world\'s longest highway tunnel above 10,000 ft) to reach Sissu in the Lahaul Valley. The landscape transforms dramatically from green to brown. Continue through Keylong (the capital of Lahaul) to Jispa — a gentler stopping point — or push to Sarchu (4,290m) for a more adventurous overnight. Jispa (3,200m) is recommended for better acclimatization.

**Day 2: Jispa/Sarchu to Leh (255 km, 10–12 hours)**
The longer and more dramatic day. Cross the Baralacha La (4,890m) where four mountain ranges meet. The Suraj Tal (lake at 4,950m) is hauntingly beautiful. Continue through the 21 Gata Loops (hairpin bends climbing 700m) to Nakee La and Lachalung La. The Pang plateau (4,600m) is a surreal flat expanse surrounded by peaks. Cross Tanglang La (5,328m) — the highest point on the highway — before descending through the stunning Upshi gorge into the Indus Valley and Leh.

**Acclimatization Tips**
Altitude sickness is the biggest risk on this route. Symptoms include headache, nausea, breathlessness, and fatigue. **Critical rules**: Stay hydrated (3–4 litres per day), avoid alcohol for the first 48 hours, do not rush — let your body adjust. Carry Diamox (acetazolamide) as a preventive — consult a doctor before the trip. If symptoms worsen (confusion, inability to walk straight), descend immediately. Spending a night at Jispa rather than Sarchu significantly reduces altitude sickness risk.

**Permits Required**
Indian citizens do not need a special permit for the Manali–Leh highway itself. However, for side trips from Leh (Nubra Valley, Pangong Lake, Tso Moriri), a **Protected Area Permit (PAP)** is required — easily arranged in Leh through any travel agent (₹400–600 per person, ready in a few hours). Carry your ID (Aadhaar/passport) at all times — there are military checkpoints along the route.

**Fuel Stops**
This is critical — fill up at **every** fuel station. The main fuel stops are: Manali, Tandi (last reliable petrol pump for 365 km), Karu (first pump before Leh). Carry 5–10 litres of extra fuel in a jerry can if riding a bike. Some temporary fuel stations operate at Pang and Sarchu during peak season but cannot be relied upon.

**Where to Stay**
Tent camps and dhabas operate along the route from June to September. **Jispa**: Hotel Ibex (₹1,500–2,500) or Padma Lodge (₹800–1,200) — comfortable with hot water. **Sarchu**: Tent camps (₹800–1,500) — basic but functional; carry a sleeping bag for warmth at 4,290m. **Pang**: Very basic tent camps (₹500–800) — emergency stop only. All stops serve hot Maggi, dal-rice, and chai.

**Bike vs Car**
**Bike** (Royal Enfield, Himalayan, or KTM): The classic Ladakh experience. Rental in Manali ₹1,200–2,000/day. More freedom, more connection with the landscape, but more physically demanding and exposed to weather. Carry rain gear, warm gloves, and a balaclava. **Car/SUV**: Safer, more comfortable, and the only option for families. Hire a Mahindra Thar or Toyota Innova with experienced driver (₹3,500–5,000/day). The driver handles the challenging sections.

**Best Months**
**July and August** offer the most reliable road conditions — snow has cleared from all passes and the weather is warmest. **Mid-June** is the earliest the road typically opens — expect snow at higher passes and possible closures. **September** is beautiful (autumn colours in Lahaul) but passes can close early after unexpected snowfall. **October** is risky — the road officially closes mid-October.

**Must-Stop Viewpoints**
Atal Tunnel exit (first view of Lahaul Valley), Deepak Tal lake (turquoise gem between Keylong and Baralacha), Suraj Tal (one of India\'s highest lakes), the 21 Gata Loops (photograph from the top), More Plains (the vast high-altitude plateau), Tanglang La summit (the highest point), and the first view of the Indus Valley descending from Upshi.

**Essential Packing**
Warm layers (temperatures drop below 0°C at night at passes), windproof jacket, thermal innerwear, sunglasses (UV protection essential at altitude), sunscreen SPF 50+, lip balm, basic medicines (Diamox, Disprin, ORS, anti-nausea), torch/headlamp, power bank (no electricity at many stops), snacks (dry fruits, energy bars, chocolate), and a full tank of patience — delays and road blocks are part of the adventure.`,
      coverImageUrl: '/images/blog/ladakh-manali-leh-road-guide.jpg',
      category: 'adventure',
      tags: ['ladakh', 'road-trip', 'manali', 'leh', 'adventure'],
      authorName: 'Trails and Miles Team',
      readTimeMinutes: 9,
      relatedSlugs: ['india'],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  console.log('✅ 8 India blog posts seeded');

  console.log('✅ India seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
