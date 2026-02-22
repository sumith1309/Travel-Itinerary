// ============================================================
// TRAILS AND MILES — Phase 2 Seed Script
// Additional POIs, sample users, and sample itineraries
// Run: npx tsx prisma/seed-phase2.ts
// ============================================================

import 'dotenv/config';
import { PrismaClient, ContentStatus, ExperienceCategory, DietaryPreference } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting Phase 2 seed...');

  // ── SAMPLE USERS ──────────────────────────────────────────
  console.log('👤 Seeding sample users...');

  const passwordHash = await bcrypt.hash('Test@1234', 12);

  const priya = await prisma.user.upsert({
    where: { email: 'priya.sharma@example.com' },
    update: {},
    create: {
      email: 'priya.sharma@example.com',
      name: 'Priya Sharma',
      passwordHash,
      passportNationality: 'IN',
      emailVerified: new Date(),
      travelProfile: {
        create: {
          defaultTravelStyle: 'ADVENTURE',
          defaultPace: 'BALANCED',
          budgetMinINR: 40000,
          budgetMaxINR: 150000,
          preferredInterests: ['culture', 'food', 'nature', 'photography', 'heritage'],
          dietaryPreferences: [DietaryPreference.VEGETARIAN],
          companionType: 'SOLO',
          onboardingCompleted: true,
        },
      },
    },
  });

  const rahul = await prisma.user.upsert({
    where: { email: 'rahul.mehta@example.com' },
    update: {},
    create: {
      email: 'rahul.mehta@example.com',
      name: 'Rahul Mehta',
      passwordHash,
      passportNationality: 'IN',
      emailVerified: new Date(),
      travelProfile: {
        create: {
          defaultTravelStyle: 'LUXURY',
          defaultPace: 'RELAXED',
          budgetMinINR: 100000,
          budgetMaxINR: 500000,
          preferredInterests: ['luxury', 'beaches', 'diving', 'wellness', 'nightlife'],
          dietaryPreferences: [DietaryPreference.NO_PREFERENCE],
          companionType: 'COUPLE',
          onboardingCompleted: true,
        },
      },
    },
  });

  const ananya = await prisma.user.upsert({
    where: { email: 'ananya.reddy@example.com' },
    update: {},
    create: {
      email: 'ananya.reddy@example.com',
      name: 'Ananya Reddy',
      passwordHash,
      passportNationality: 'IN',
      emailVerified: new Date(),
      travelProfile: {
        create: {
          defaultTravelStyle: 'BUDGET',
          defaultPace: 'FAST',
          budgetMinINR: 20000,
          budgetMaxINR: 60000,
          preferredInterests: ['backpacking', 'street-food', 'temples', 'markets', 'budget-friendly'],
          dietaryPreferences: [DietaryPreference.VEGAN],
          companionType: 'FRIENDS',
          onboardingCompleted: true,
        },
      },
    },
  });

  console.log(`  ✅ Created users: ${priya.name}, ${rahul.name}, ${ananya.name}`);

  // ── TRAVEL HISTORY ────────────────────────────────────────
  console.log('🧳 Seeding travel history...');

  const vietnam = await prisma.country.findUnique({ where: { slug: 'vietnam' } });
  const thailand = await prisma.country.findUnique({ where: { slug: 'thailand' } });
  const indonesia = await prisma.country.findUnique({ where: { slug: 'indonesia' } });

  if (vietnam && thailand) {
    await prisma.travelHistory.upsert({
      where: { id: 'th-priya-vietnam' },
      update: {},
      create: {
        id: 'th-priya-vietnam',
        userId: priya.id,
        destinationId: vietnam.id,
        tripDate: new Date('2025-10-15'),
        durationDays: 7,
        travelStyle: 'CULTURAL',
        budgetSpentINR: 55000,
        rating: 5,
        highlights: ['Ha Long Bay cruise', 'Old Quarter street food', 'Hoi An lanterns'],
        notes: 'Amazing trip! The vegetarian pho in Hanoi was incredible.',
      },
    });

    await prisma.travelHistory.upsert({
      where: { id: 'th-rahul-thailand' },
      update: {},
      create: {
        id: 'th-rahul-thailand',
        userId: rahul.id,
        destinationId: thailand.id,
        tripDate: new Date('2025-12-20'),
        durationDays: 5,
        travelStyle: 'LUXURY',
        budgetSpentINR: 180000,
        rating: 4,
        highlights: ['Rooftop dining in Bangkok', 'Phuket beach clubs', 'Thai massage'],
      },
    });
  }

  // ── BANGKOK POIs ──────────────────────────────────────────
  console.log('📍 Seeding Bangkok POIs...');

  const bangkok = await prisma.city.findUnique({ where: { slug: 'bangkok' } });
  if (bangkok) {
    const bangkokPois = [
      {
        slug: 'grand-palace-bangkok',
        name: 'Grand Palace & Wat Phra Kaew',
        category: ExperienceCategory.CULTURE_HISTORY,
        subcategory: 'Palace & Temple',
        description: 'The crown jewel of Bangkok and Thailand\'s most sacred Buddhist temple. The Grand Palace complex covers 218,000 sq metres and has been the official residence of Thai kings since 1782. The Emerald Buddha (Phra Kaew Morakot) is housed in Wat Phra Kaew — one of the most revered religious sites in all of Thailand.',
        shortDescription: 'Thailand\'s most sacred temple and former royal residence since 1782',
        latitude: 13.7510,
        longitude: 100.4914,
        avgDurationMins: 150,
        avgCostINR: 500,
        tags: ['temple', 'palace', 'must-see', 'photography', 'history', 'architecture'],
        bestTimeToVisit: 'Open 8:30am–3:30pm. Arrive at opening to beat crowds and heat.',
        tips: ['Strict dress code: long pants/skirts, covered shoulders. Sarongs available to borrow.', 'Entry: ₹500 (THB 500). Keep ticket for same-day entry to other sites.', 'Beware of touts outside saying "palace is closed" — it isn\'t.'],
      },
      {
        slug: 'wat-arun-bangkok',
        name: 'Wat Arun (Temple of Dawn)',
        category: ExperienceCategory.CULTURE_HISTORY,
        subcategory: 'Temple',
        description: 'One of Bangkok\'s most iconic landmarks, Wat Arun\'s 70-metre Khmer-style spire is decorated with intricate porcelain mosaic and shells that shimmer at sunrise and sunset. Cross the Chao Phraya River by ferry for stunning views and climb the steep central prang for panoramic river views.',
        shortDescription: 'Iconic riverside temple with a towering porcelain-encrusted spire',
        latitude: 13.7437,
        longitude: 100.4888,
        avgDurationMins: 60,
        avgCostINR: 200,
        tags: ['temple', 'riverside', 'sunset', 'photography', 'iconic'],
        bestTimeToVisit: 'Late afternoon for golden light. Stunning from across the river at sunset.',
        tips: ['Take the ₹15 cross-river ferry from Tha Tien pier', 'Climb carefully — the steps are steep', 'Best photos from the opposite bank at sunset'],
      },
      {
        slug: 'chatuchak-market-bangkok',
        name: 'Chatuchak Weekend Market',
        category: ExperienceCategory.FOOD_MARKETS,
        subcategory: 'Market',
        description: 'The world\'s largest outdoor market with over 15,000 stalls spread across 35 acres. Open only on weekends, Chatuchak is a sprawling maze of everything imaginable — from vintage clothing and handmade crafts to antiques, pets, plants, and some of Bangkok\'s best street food. Budget half a day minimum.',
        shortDescription: 'World\'s largest outdoor market: 15,000+ stalls of Thai goods, crafts, and street food',
        latitude: 13.7999,
        longitude: 100.5509,
        avgDurationMins: 240,
        avgCostINR: 2000,
        tags: ['market', 'shopping', 'street-food', 'weekend', 'bargains', 'local-experience'],
        bestTimeToVisit: 'Saturday or Sunday, 9am–5pm. Go early to avoid peak heat.',
        tips: ['Use the Chatuchak Guide app to navigate sections', 'Bring cash — many stalls don\'t accept cards', 'Section 2 & 3 have excellent vegetarian Thai food'],
      },
      {
        slug: 'khao-san-road-bangkok',
        name: 'Khao San Road',
        category: ExperienceCategory.ADVENTURE_ACTIVITIES,
        subcategory: 'Nightlife & Street Culture',
        description: 'The legendary backpacker street is more than just cheap beer and pad thai — it\'s a cultural experience in itself. By day it\'s a street market selling everything from fisherman pants to fake IDs. By night it transforms into an open-air party with live music, cheap cocktails, and the chaotic energy that put Bangkok on every traveller\'s map.',
        shortDescription: 'Bangkok\'s legendary backpacker strip — street food, nightlife, and traveller culture',
        latitude: 13.7589,
        longitude: 100.4975,
        avgDurationMins: 120,
        avgCostINR: 1500,
        tags: ['nightlife', 'backpacker', 'street-food', 'evening', 'budget-friendly', 'lively'],
        bestTimeToVisit: 'Evening from 7pm onwards for the full atmosphere',
        tips: ['Watch your belongings in crowds', 'Try the pad thai from the corner carts — ₹80', 'Walk to nearby Rambuttri Alley for a quieter vibe'],
      },
      {
        slug: 'floating-market-damnoen-saduak',
        name: 'Damnoen Saduak Floating Market',
        category: ExperienceCategory.FOOD_MARKETS,
        subcategory: 'Traditional Market',
        description: 'Thailand\'s most famous floating market — vendors in traditional wooden boats sell fruits, pad thai, coconut pancakes, and colourful souvenirs along a network of narrow canals. While touristy, it\'s a quintessential Thai experience and a photographer\'s paradise. The boat ride through the canals lined with traditional houses is magical.',
        shortDescription: 'Iconic canal market where vendors sell Thai food and crafts from traditional longboats',
        latitude: 13.5241,
        longitude: 99.9582,
        avgDurationMins: 180,
        avgCostINR: 1800,
        tags: ['market', 'boat', 'food', 'photography', 'traditional', 'iconic'],
        bestTimeToVisit: 'Early morning (7–9am) before tour buses arrive',
        tips: ['90km from central Bangkok — leave by 6am', 'Book a private long-tail boat (₹1,200/hr) rather than a big group tour', 'Amphawa Floating Market (nearby) is more authentic and less crowded'],
      },
    ];

    for (const poi of bangkokPois) {
      await prisma.pointOfInterest.upsert({
        where: { slug: poi.slug },
        update: {},
        create: {
          cityId: bangkok.id,
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
          tags: poi.tags,
          bestTimeToVisit: poi.bestTimeToVisit,
          tips: poi.tips,
          status: ContentStatus.PUBLISHED,
          ratingAvg: 4.5,
          ratingCount: Math.floor(Math.random() * 200) + 50,
        },
      });
    }
  }

  // ── BALI POIs ─────────────────────────────────────────────
  console.log('📍 Seeding Bali POIs...');

  const bali = await prisma.city.findUnique({ where: { slug: 'bali' } });
  if (bali) {
    const baliPois = [
      {
        slug: 'ubud-rice-terraces-tegallalang',
        name: 'Tegallalang Rice Terraces',
        category: ExperienceCategory.NATURE_LANDSCAPES,
        subcategory: 'Natural Landscape',
        description: 'The dramatic cascading rice terraces of Tegallalang are Bali\'s most photographed landscape. The ancient subak (irrigation) system — a UNESCO World Heritage cultural landscape — has been used for over 1,000 years. Walk the terraces, swing on the famous Bali Swing, and sip coffee at one of the many cafés overlooking the valley.',
        shortDescription: 'UNESCO-listed cascading rice terraces with the famous Bali Swing',
        latitude: -8.4312,
        longitude: 115.2794,
        avgDurationMins: 120,
        avgCostINR: 500,
        tags: ['rice-terraces', 'photography', 'UNESCO', 'nature', 'iconic', 'swing'],
        bestTimeToVisit: 'Early morning (7–9am) for golden light and fewer crowds',
        tips: ['Entry: ₹300. Bali Swing: ₹1,500 separate.', 'Wear comfortable shoes — paths are uneven and can be slippery', 'The best viewpoint cafés are on the western side of the valley'],
      },
      {
        slug: 'uluwatu-temple-bali',
        name: 'Uluwatu Temple & Kecak Dance',
        category: ExperienceCategory.CULTURE_HISTORY,
        subcategory: 'Temple & Performance',
        description: 'Perched on a dramatic 70-metre cliff above the Indian Ocean, Pura Luhur Uluwatu is one of Bali\'s six key directional temples. The sunset here is extraordinary, and the nightly Kecak fire dance — a mesmerising Ramayana performance by 50+ men chanting in unison — is one of Bali\'s most unforgettable cultural experiences. Indian travellers will recognise the Ramayana story.',
        shortDescription: 'Clifftop sea temple with Ramayana Kecak fire dance at sunset',
        latitude: -8.8291,
        longitude: 115.0849,
        avgDurationMins: 150,
        avgCostINR: 800,
        tags: ['temple', 'cliff', 'sunset', 'kecak-dance', 'Ramayana', 'must-see', 'cultural'],
        bestTimeToVisit: 'Arrive by 5pm for sunset and the 6pm Kecak Dance',
        tips: ['Temple entry: ₹250. Kecak dance: ₹800.', 'Watch out for monkeys — they steal sunglasses and phones', 'Sarong required (provided at entrance)'],
      },
      {
        slug: 'ubud-monkey-forest',
        name: 'Sacred Monkey Forest Sanctuary',
        category: ExperienceCategory.NATURE_LANDSCAPES,
        subcategory: 'Nature & Wildlife',
        description: 'A sacred nature reserve and Hindu temple complex home to over 1,200 Balinese long-tailed macaques. The forest is a living cultural space where Balinese Hinduism and nature coexist — ancient banyan trees, moss-covered stone temples, and playful (sometimes cheeky) monkeys create a magical atmosphere.',
        shortDescription: 'Sacred nature reserve with 1,200+ macaques and ancient Hindu temples',
        latitude: -8.5185,
        longitude: 115.2588,
        avgDurationMins: 90,
        avgCostINR: 400,
        tags: ['monkeys', 'temple', 'nature', 'ubud', 'family-friendly', 'photography'],
        bestTimeToVisit: 'Morning (8–10am) when monkeys are active but crowds are thin',
        tips: ['Entry: ₹400. Don\'t bring food or shiny objects — monkeys will grab them', 'Secure your phone and sunglasses', 'Walk the full path — the deeper temples are stunning and quieter'],
      },
      {
        slug: 'tirta-empul-water-temple',
        name: 'Tirta Empul Water Temple',
        category: ExperienceCategory.CULTURE_HISTORY,
        subcategory: 'Hindu Water Temple',
        description: 'One of Bali\'s most sacred Hindu water temples, built in 926 AD around natural spring water believed to have purifying properties. Balinese Hindus and visitors can participate in the melukat (purification) ritual — walking through a series of 30 holy water fountains while offering prayers. Deeply meaningful for Indian Hindu travellers.',
        shortDescription: 'Sacred Hindu purification temple with holy spring water rituals dating to 926 AD',
        latitude: -8.4153,
        longitude: 115.3154,
        avgDurationMins: 90,
        avgCostINR: 300,
        tags: ['temple', 'hindu', 'purification', 'spiritual', 'water-temple', 'sacred'],
        bestTimeToVisit: 'Morning (8–10am) for a more meditative atmosphere',
        tips: ['Entry: ₹300. Sarong provided.', 'You can participate in the purification — wear a sarong and follow the sequence left to right', 'Bring a waterproof phone case if you want to film the ritual'],
      },
      {
        slug: 'seminyak-beach-club',
        name: 'Seminyak Beach & Potato Head Club',
        category: ExperienceCategory.ISLAND_BEACH,
        subcategory: 'Beach & Beach Club',
        description: 'Seminyak is Bali\'s stylish beach neighbourhood — golden sand, world-class surf, and legendary beach clubs. Potato Head Beach Club is the crown jewel — a sustainably designed venue with an infinity pool, multiple restaurants, live DJs, and one of the best sunset views in Asia. The perfect blend of relaxation and scene.',
        shortDescription: 'Bali\'s chicest beach strip with the iconic Potato Head Beach Club',
        latitude: -8.6905,
        longitude: 115.1565,
        avgDurationMins: 240,
        avgCostINR: 3000,
        tags: ['beach', 'beach-club', 'sunset', 'nightlife', 'dining', 'pool', 'surfing'],
        bestTimeToVisit: 'Afternoon onwards for the beach club sunset experience',
        tips: ['No entry fee at Potato Head — min spend on food/drinks', 'Surfing lessons on the beach from ₹1,500/hr', 'Walk north to Echo Beach for a more local vibe'],
      },
    ];

    for (const poi of baliPois) {
      await prisma.pointOfInterest.upsert({
        where: { slug: poi.slug },
        update: {},
        create: {
          cityId: bali.id,
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
          tags: poi.tags,
          bestTimeToVisit: poi.bestTimeToVisit,
          tips: poi.tips,
          status: ContentStatus.PUBLISHED,
          ratingAvg: 4.4,
          ratingCount: Math.floor(Math.random() * 200) + 50,
        },
      });
    }
  }

  // ── SINGAPORE POIs ────────────────────────────────────────
  console.log('📍 Seeding Singapore POIs...');

  const singaporeCity = await prisma.city.findUnique({ where: { slug: 'singapore-city' } });
  if (singaporeCity) {
    const sgPois = [
      {
        slug: 'gardens-by-the-bay',
        name: 'Gardens by the Bay',
        category: ExperienceCategory.NATURE_LANDSCAPES,
        subcategory: 'Garden & Attraction',
        description: 'Singapore\'s futuristic garden park is an engineering and botanical marvel. The iconic Supertree Grove — 18 tree-like structures up to 50 metres tall — is breathtaking at night during the Garden Rhapsody light and sound show. The Cloud Forest dome houses the world\'s tallest indoor waterfall. A must-see that perfectly encapsulates Singapore\'s blend of nature and technology.',
        shortDescription: 'Futuristic botanical gardens with iconic Supertrees and Cloud Forest dome',
        latitude: 1.2816,
        longitude: 103.8636,
        avgDurationMins: 180,
        avgCostINR: 1800,
        tags: ['gardens', 'supertrees', 'futuristic', 'family-friendly', 'night-show', 'photography', 'must-see'],
        bestTimeToVisit: 'Late afternoon — explore domes, then stay for the 7:45pm/8:45pm light show',
        tips: ['Supertree Grove is free. Domes: ₹1,800 combined ticket.', 'OCBC Skyway (₹600) gives you a walkway between Supertrees', 'Garden Rhapsody show is free — 7:45pm and 8:45pm nightly'],
      },
      {
        slug: 'marina-bay-sands-singapore',
        name: 'Marina Bay Sands',
        category: ExperienceCategory.LUXURY_STAYS,
        subcategory: 'Iconic Landmark',
        description: 'The three-towered Marina Bay Sands is Singapore\'s most iconic building — home to the world-famous infinity rooftop pool (guests only), the SkyPark observation deck, a luxury mall, a casino, and several celebrity chef restaurants. Even if you don\'t stay here, the SkyPark offers one of Asia\'s best panoramic views, and the Spectra light show at the waterfront is free nightly.',
        shortDescription: 'Singapore\'s iconic three-tower hotel with the world\'s most famous infinity pool',
        latitude: 1.2834,
        longitude: 103.8607,
        avgDurationMins: 120,
        avgCostINR: 2000,
        tags: ['iconic', 'skyline', 'luxury', 'views', 'shopping', 'infinity-pool', 'landmark'],
        bestTimeToVisit: 'Evening for SkyPark views and the 8pm/9pm Spectra light show',
        tips: ['SkyPark observation deck: ₹1,500', 'Infinity pool is for hotel guests only (rooms from ₹25,000/night)', 'Spectra light & water show: free, nightly at 8pm and 9pm (Fri/Sat also 10pm)'],
      },
      {
        slug: 'little-india-singapore',
        name: 'Little India',
        category: ExperienceCategory.CULTURE_HISTORY,
        subcategory: 'Cultural District',
        description: 'A vibrant slice of India in the heart of Singapore. Serangoon Road is lined with colourful shophouses, gold jewellery stores, spice shops, and some of the best Indian restaurants outside India. Tekka Centre hawker market has excellent biryani, dosa, and thali. For Indian travellers, it\'s a comforting home-away-from-home with Mustafa Centre (24-hour shopping complex) nearby.',
        shortDescription: 'Vibrant Indian district with temples, Tekka Market, and 24hr Mustafa Centre',
        latitude: 1.3065,
        longitude: 103.8521,
        avgDurationMins: 150,
        avgCostINR: 1500,
        tags: ['indian-food', 'shopping', 'culture', 'temples', 'market', 'home-comfort', 'budget-friendly'],
        bestTimeToVisit: 'Late morning for Tekka Centre breakfast/lunch, or Sunday evening for the weekly market bustle',
        tips: ['Komala Vilas (pure veg) and Ananda Bhavan are Indian traveller favourites', 'Mustafa Centre is a 24/7 shopping complex — great for souvenirs and electronics', 'Sri Veeramakaliamman Temple is worth a visit'],
      },
      {
        slug: 'sentosa-island-singapore',
        name: 'Sentosa Island',
        category: ExperienceCategory.ADVENTURE_ACTIVITIES,
        subcategory: 'Theme Park & Beach',
        description: 'Singapore\'s resort island has Universal Studios, the S.E.A. Aquarium (one of the world\'s largest), Adventure Cove Waterpark, beautiful beaches, and the Skyline Luge. Perfect for families and couples who want a fun day out. Connected to the mainland by monorail, cable car, or a boardwalk.',
        shortDescription: 'Resort island with Universal Studios, aquarium, beaches, and adventure parks',
        latitude: 1.2494,
        longitude: 103.8303,
        avgDurationMins: 360,
        avgCostINR: 5000,
        tags: ['family-friendly', 'theme-park', 'aquarium', 'beach', 'adventure', 'universal-studios'],
        bestTimeToVisit: 'Weekdays are less crowded. Full day recommended.',
        tips: ['Universal Studios: ₹5,500. S.E.A. Aquarium: ₹2,500.', 'Buy combo tickets for savings', 'Siloso Beach is free and has a nice sunset bar'],
      },
      {
        slug: 'hawker-centres-singapore',
        name: 'Hawker Centre Food Tour',
        category: ExperienceCategory.FOOD_MARKETS,
        subcategory: 'Food Experience',
        description: 'Singapore\'s hawker centres are UNESCO Intangible Cultural Heritage — open-air food courts where Michelin-starred meals cost ₹200. Maxwell Food Centre (chicken rice), Lau Pa Sat (satay street), Chinatown Complex (largest hawker centre), and Old Airport Road are legendary. For Indian travellers, Tekka Centre in Little India serves authentic South Indian food.',
        shortDescription: 'UNESCO heritage street food culture — Michelin meals from ₹200',
        latitude: 1.2804,
        longitude: 103.8447,
        avgDurationMins: 120,
        avgCostINR: 800,
        tags: ['food', 'hawker', 'UNESCO', 'budget-friendly', 'local-experience', 'must-do', 'vegetarian-options'],
        bestTimeToVisit: '11:30am–1pm for lunch rush (best variety), or 6–8pm for dinner',
        tips: ['Tian Tian Chicken Rice at Maxwell Food Centre — the most famous stall', 'Hill Street Tai Hwa Pork Noodle is a Michelin-starred hawker stall', 'Vegetarian: Tekka Centre Indian stalls, or look for "素" (vegetarian) signs at Chinese stalls'],
      },
    ];

    for (const poi of sgPois) {
      await prisma.pointOfInterest.upsert({
        where: { slug: poi.slug },
        update: {},
        create: {
          cityId: singaporeCity.id,
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
          tags: poi.tags,
          bestTimeToVisit: poi.bestTimeToVisit,
          tips: poi.tips,
          status: ContentStatus.PUBLISHED,
          ratingAvg: 4.6,
          ratingCount: Math.floor(Math.random() * 200) + 80,
        },
      });
    }
  }

  // ── MALÉ POIs ─────────────────────────────────────────────
  console.log('📍 Seeding Malé POIs...');

  const male = await prisma.city.findUnique({ where: { slug: 'male' } });
  if (male) {
    const malePois = [
      {
        slug: 'male-fish-market',
        name: 'Malé Fish Market',
        category: ExperienceCategory.FOOD_MARKETS,
        subcategory: 'Market',
        description: 'The bustling fish market on the northern waterfront of Malé is the beating heart of Maldivian food culture. Fishermen bring in fresh tuna, grouper, and reef fish every morning, and the market is a sensory overload of colour, sound, and ocean smells. Adjacent is the local produce market with tropical fruits and spices.',
        shortDescription: 'Bustling waterfront market where Maldivian fishermen sell fresh daily catch',
        latitude: 4.1770,
        longitude: 73.5105,
        avgDurationMins: 45,
        avgCostINR: 0,
        tags: ['market', 'fish', 'local-experience', 'morning', 'photography', 'free'],
        bestTimeToVisit: 'Early morning (6–8am) when the boats come in with fresh catch',
        tips: ['Free to visit — just watch and photograph', 'The adjacent local market has tropical fruits and Maldivian snacks', 'Best experienced with a local guide who can explain the fish varieties'],
      },
      {
        slug: 'old-friday-mosque-male',
        name: 'Old Friday Mosque (Hukuru Miskiiy)',
        category: ExperienceCategory.CULTURE_HISTORY,
        subcategory: 'Historical Mosque',
        description: 'Built in 1658 from intricately carved coral stone, Hukuru Miskiiy is the oldest mosque in the Maldives and a UNESCO tentative list site. The lacquered interior features beautiful Arabic calligraphy and wood carvings. The surrounding cemetery contains tombstones of former sultans. A fascinating glimpse into Maldivian Islamic heritage.',
        shortDescription: 'Oldest mosque in the Maldives (1658), built from carved coral stone',
        latitude: 4.1748,
        longitude: 73.5088,
        avgDurationMins: 30,
        avgCostINR: 0,
        tags: ['mosque', 'heritage', 'history', 'architecture', 'UNESCO-tentative', 'free'],
        bestTimeToVisit: 'Outside prayer times. Dress modestly (shoulders and knees covered).',
        tips: ['Free entry but donations welcome', 'Remove shoes before entering', 'The nearby National Museum is also worth a 30-minute visit (₹200)'],
      },
    ];

    for (const poi of malePois) {
      await prisma.pointOfInterest.upsert({
        where: { slug: poi.slug },
        update: {},
        create: {
          cityId: male.id,
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
          tags: poi.tags,
          bestTimeToVisit: poi.bestTimeToVisit,
          tips: poi.tips,
          status: ContentStatus.PUBLISHED,
          ratingAvg: 4.2,
          ratingCount: Math.floor(Math.random() * 100) + 20,
        },
      });
    }
  }

  // ── SAMPLE ITINERARIES ────────────────────────────────────
  console.log('🗺️  Seeding additional sample itineraries...');

  // Bangkok & Phuket 5 Days
  await prisma.itinerary.upsert({
    where: { shareToken: 'bangkok-phuket-5-day' },
    update: {},
    create: {
      title: 'Bangkok & Phuket — 5 Days of Temples, Street Food & Beaches',
      description: 'The ultimate first-timer\'s Thailand combo: explore Bangkok\'s dazzling temples and legendary street food, then fly south to Phuket\'s stunning beaches and island-hopping adventures. Perfect for couples and solo travellers.',
      destinationSlugs: ['thailand'],
      durationDays: 5,
      travelStyle: 'LEISURE',
      pace: 'BALANCED',
      companionType: 'COUPLE',
      budgetTotalINR: 85000,
      interests: ['temples', 'food', 'beaches', 'nightlife'],
      status: 'PUBLISHED',
      isAiGenerated: false,
      isPublic: true,
      isSample: true,
      shareToken: 'bangkok-phuket-5-day',
      viewCount: 892,
      saveCount: 215,
      days: {
        create: [
          {
            dayNumber: 1,
            title: 'Arrive Bangkok — Grand Palace & Riverside',
            description: 'Explore Bangkok\'s cultural heart along the Chao Phraya River',
            dailyBudgetINR: 6000,
            items: {
              create: [
                { timeSlot: 'morning', startTime: '09:00', endTime: '12:00', title: 'Grand Palace & Wat Phra Kaew', description: 'Start with Thailand\'s most sacred site. Explore the ornate palace complex and the revered Emerald Buddha.', estimatedCostINR: 500, transportMode: 'taxi', tags: ['temple', 'must-see', 'photography'], sortOrder: 0 },
                { timeSlot: 'afternoon', startTime: '13:00', endTime: '16:00', title: 'Wat Arun & Chao Phraya Ferry', description: 'Cross the river to the Temple of Dawn. Climb the central spire for panoramic views. Take a river ferry back.', estimatedCostINR: 250, transportMode: 'ferry', tags: ['temple', 'riverside', 'photography'], sortOrder: 1 },
                { timeSlot: 'evening', startTime: '18:00', endTime: '21:00', title: 'Khao San Road Street Food & Nightlife', description: 'Dive into the legendary backpacker street for pad thai, cocktails, and the buzzing evening atmosphere.', estimatedCostINR: 1500, transportMode: 'taxi', tags: ['street-food', 'nightlife', 'evening'], sortOrder: 2 },
              ],
            },
          },
          {
            dayNumber: 2,
            title: 'Bangkok Markets & Modern City',
            description: 'From ancient markets to rooftop bars — Bangkok\'s dual personality',
            dailyBudgetINR: 5500,
            items: {
              create: [
                { timeSlot: 'morning', startTime: '09:00', endTime: '13:00', title: 'Chatuchak Weekend Market', description: '15,000+ stalls across 35 acres. Shop for souvenirs, vintage clothing, and sample Thai street food.', estimatedCostINR: 2000, transportMode: 'metro', tags: ['market', 'shopping', 'street-food'], sortOrder: 0 },
                { timeSlot: 'afternoon', startTime: '14:00', endTime: '17:00', title: 'Jim Thompson House & Thai Silk', description: 'Visit the beautiful teak house museum of the American who revived Thailand\'s silk industry. Then shop on Siam Square.', estimatedCostINR: 600, transportMode: 'metro', tags: ['museum', 'shopping', 'culture'], sortOrder: 1 },
                { timeSlot: 'evening', startTime: '18:30', endTime: '21:00', title: 'Rooftop Dinner at Vertigo', description: 'End your Bangkok adventure with cocktails 61 floors above the city at one of Asia\'s most famous rooftop bars.', estimatedCostINR: 3000, transportMode: 'taxi', tags: ['rooftop', 'fine-dining', 'views', 'evening'], sortOrder: 2 },
              ],
            },
          },
          {
            dayNumber: 3,
            title: 'Fly to Phuket — Beach Day',
            description: 'Morning flight south to Thailand\'s premier beach destination',
            dailyBudgetINR: 8000,
            items: {
              create: [
                { timeSlot: 'morning', startTime: '07:00', endTime: '12:00', title: 'Flight Bangkok → Phuket', description: 'Fly from Don Mueang/Suvarnabhumi to Phuket. AirAsia/VietJet flights from ₹2,000.', estimatedCostINR: 3000, transportMode: 'bus', tags: ['flight', 'transfer'], sortOrder: 0 },
                { timeSlot: 'afternoon', startTime: '13:00', endTime: '17:00', title: 'Kata Beach & Swimming', description: 'Check in to your hotel and head to Kata Beach — one of Phuket\'s prettiest with clean sand and gentle waves.', estimatedCostINR: 800, transportMode: 'taxi', tags: ['beach', 'swimming', 'relaxation'], sortOrder: 1 },
                { timeSlot: 'evening', startTime: '18:00', endTime: '21:00', title: 'Phuket Old Town Dinner', description: 'Explore the charming Sino-Portuguese architecture of Old Town and dine at one of the excellent local restaurants.', estimatedCostINR: 1500, transportMode: 'taxi', tags: ['old-town', 'dinner', 'architecture'], sortOrder: 2 },
              ],
            },
          },
          {
            dayNumber: 4,
            title: 'Phi Phi Islands Day Trip',
            description: 'Speedboat to the stunning Phi Phi Islands for snorkelling and beaches',
            dailyBudgetINR: 7000,
            items: {
              create: [
                { timeSlot: 'morning', startTime: '07:00', endTime: '12:00', title: 'Speedboat to Phi Phi + Maya Bay', description: 'Board a speedboat to the Phi Phi Islands. Visit the famous Maya Bay (The Beach), snorkel in crystal waters, and spot reef sharks.', estimatedCostINR: 4000, transportMode: 'ferry', tags: ['island', 'snorkelling', 'boat-trip', 'photography'], sortOrder: 0 },
                { timeSlot: 'afternoon', startTime: '12:00', endTime: '16:00', title: 'Lunch on Phi Phi Don & Bamboo Island', description: 'Beach lunch on Phi Phi Don island, then snorkel at Bamboo Island — pristine white sand and turquoise shallows.', estimatedCostINR: 1500, transportMode: 'ferry', tags: ['beach', 'lunch', 'snorkelling'], sortOrder: 1 },
                { timeSlot: 'evening', startTime: '18:00', endTime: '21:00', title: 'Sunset Dinner at Promthep Cape', description: 'Return to Phuket and drive to Promthep Cape for one of Thailand\'s most famous sunset viewpoints. Dinner nearby.', estimatedCostINR: 1500, transportMode: 'taxi', tags: ['sunset', 'viewpoint', 'dinner'], sortOrder: 2 },
              ],
            },
          },
          {
            dayNumber: 5,
            title: 'Big Buddha & Departure',
            description: 'Morning cultural visit before flying home',
            dailyBudgetINR: 4000,
            items: {
              create: [
                { timeSlot: 'morning', startTime: '09:00', endTime: '11:30', title: 'Big Buddha & Chalong Temple', description: 'Visit the 45-metre Big Buddha statue for panoramic island views, then stop at Wat Chalong — Phuket\'s most important temple.', estimatedCostINR: 300, transportMode: 'taxi', tags: ['temple', 'views', 'morning', 'culture'], sortOrder: 0 },
                { timeSlot: 'afternoon', startTime: '13:00', endTime: '16:00', title: 'Phuket Airport — Departure', description: 'Last-minute shopping at Jungceylon Mall or Central Festival, then head to the airport.', estimatedCostINR: 2000, transportMode: 'taxi', tags: ['departure', 'shopping'], sortOrder: 1 },
              ],
            },
          },
        ],
      },
    },
  });

  // Bali Wellness Retreat 4 Days
  await prisma.itinerary.upsert({
    where: { shareToken: 'bali-wellness-retreat-4-day' },
    update: {},
    create: {
      title: 'Bali Wellness Retreat — 4 Days of Yoga, Temples & Rice Terraces',
      description: 'A soul-nourishing Bali itinerary centred around Ubud — the island\'s spiritual heart. Combine yoga, meditation, temple visits, and healing rituals with the stunning natural beauty of rice terraces and waterfalls. Perfect for solo travellers and wellness seekers. Highly vegetarian-friendly.',
      destinationSlugs: ['indonesia'],
      durationDays: 4,
      travelStyle: 'CULTURAL',
      pace: 'RELAXED',
      companionType: 'SOLO',
      budgetTotalINR: 48000,
      interests: ['wellness', 'yoga', 'temples', 'nature', 'vegetarian'],
      status: 'PUBLISHED',
      isAiGenerated: false,
      isPublic: true,
      isSample: true,
      shareToken: 'bali-wellness-retreat-4-day',
      viewCount: 654,
      saveCount: 189,
      days: {
        create: [
          {
            dayNumber: 1,
            title: 'Arrival in Ubud — Settle into the Spiritual Heart',
            description: 'Arrive in Bali and head straight to Ubud for a gentle introduction',
            dailyBudgetINR: 6000,
            items: {
              create: [
                { timeSlot: 'morning', startTime: '10:00', endTime: '13:00', title: 'Transfer from Airport to Ubud', description: 'Private driver from Ngurah Rai Airport to your Ubud villa. The 90-minute drive passes through rice terraces and villages.', estimatedCostINR: 1200, transportMode: 'taxi', tags: ['transfer', 'scenic'], sortOrder: 0 },
                { timeSlot: 'afternoon', startTime: '14:00', endTime: '17:00', title: 'Ubud Palace & Art Market', description: 'Gentle exploration of central Ubud. Visit the Royal Palace (free), browse the art market for handmade crafts, and find your favourite café.', estimatedCostINR: 1000, transportMode: 'walking', tags: ['palace', 'art', 'shopping', 'walking'], sortOrder: 1 },
                { timeSlot: 'evening', startTime: '18:00', endTime: '20:30', title: 'Sunset Yoga + Organic Dinner', description: 'Join a sunset yoga class at The Yoga Barn (₹600). Then dinner at Clear Café — Ubud\'s best organic vegetarian restaurant.', estimatedCostINR: 2000, transportMode: 'walking', tags: ['yoga', 'vegetarian', 'organic', 'evening'], sortOrder: 2 },
              ],
            },
          },
          {
            dayNumber: 2,
            title: 'Temples & Rice Terraces',
            description: 'Bali\'s most sacred temples and iconic landscapes',
            dailyBudgetINR: 5000,
            items: {
              create: [
                { timeSlot: 'morning', startTime: '07:00', endTime: '10:00', title: 'Tirta Empul Holy Water Temple', description: 'Participate in the sacred melukat purification ritual at this 1,000-year-old Hindu water temple. Walk through the 30 holy fountains while offering prayers.', estimatedCostINR: 300, transportMode: 'taxi', tags: ['temple', 'hindu', 'spiritual', 'purification'], sortOrder: 0 },
                { timeSlot: 'afternoon', startTime: '11:00', endTime: '14:00', title: 'Tegallalang Rice Terraces', description: 'Walk the UNESCO-listed cascading rice terraces. Coffee tasting at a local plantation (luwak coffee), lunch at a terrace-view café.', estimatedCostINR: 1500, transportMode: 'taxi', tags: ['rice-terraces', 'UNESCO', 'photography', 'nature'], sortOrder: 1 },
                { timeSlot: 'evening', startTime: '16:00', endTime: '19:00', title: 'Sacred Monkey Forest & Evening Walk', description: 'Explore the Sacred Monkey Forest Sanctuary, then walk through Ubud\'s rice paddy path (Campuhan Ridge Walk) as the sun sets.', estimatedCostINR: 800, transportMode: 'walking', tags: ['monkeys', 'nature', 'walking', 'sunset'], sortOrder: 2 },
              ],
            },
          },
          {
            dayNumber: 3,
            title: 'Waterfall & Healing Day',
            description: 'Bali\'s hidden waterfalls and traditional healing',
            dailyBudgetINR: 5500,
            items: {
              create: [
                { timeSlot: 'morning', startTime: '07:30', endTime: '11:00', title: 'Tegenungan Waterfall + Jungle Walk', description: 'Visit one of Bali\'s most beautiful waterfalls — swim in the natural pool, hike the surrounding jungle paths, and breathe in the tropical air.', estimatedCostINR: 500, transportMode: 'taxi', tags: ['waterfall', 'nature', 'swimming', 'hiking'], sortOrder: 0 },
                { timeSlot: 'afternoon', startTime: '12:00', endTime: '15:00', title: 'Traditional Balinese Healing Session', description: 'Experience a traditional Balinese healing session with a local balian (healer). Combines energy work, herbal remedies, and spiritual guidance. Life-changing for many travellers.', estimatedCostINR: 2000, transportMode: 'taxi', tags: ['healing', 'spiritual', 'traditional', 'wellness'], sortOrder: 1 },
                { timeSlot: 'evening', startTime: '17:00', endTime: '20:00', title: 'Cooking Class — Vegetarian Balinese Food', description: 'Learn to cook traditional Balinese dishes (vegetarian options) at a family compound. Market visit + cooking + feast on your creations.', estimatedCostINR: 2500, transportMode: 'taxi', tags: ['cooking-class', 'vegetarian', 'food', 'experience'], sortOrder: 2 },
              ],
            },
          },
          {
            dayNumber: 4,
            title: 'Sunrise & Departure',
            description: 'One final magical morning before heading home',
            dailyBudgetINR: 4000,
            items: {
              create: [
                { timeSlot: 'morning', startTime: '05:30', endTime: '09:00', title: 'Campuhan Ridge Walk at Sunrise', description: 'Wake early for the magical Campuhan Ridge Walk — a narrow path between two lush valleys. The sunrise light on the palm trees is extraordinary. Finish with breakfast at Karsa Kafe.', estimatedCostINR: 500, transportMode: 'walking', tags: ['sunrise', 'walking', 'nature', 'photography'], sortOrder: 0 },
                { timeSlot: 'afternoon', startTime: '11:00', endTime: '15:00', title: 'Transfer to Airport & Departure', description: 'Final shopping for incense, batik, or silver jewellery in Ubud market. Private driver back to Ngurah Rai Airport for your flight.', estimatedCostINR: 1500, transportMode: 'taxi', tags: ['departure', 'shopping'], sortOrder: 1 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('\n✅ Phase 2 seed complete!');
  console.log('📊 Summary:');
  console.log('  - 3 Sample users (Priya, Rahul, Ananya) with travel profiles');
  console.log('  - 2 Travel history entries');
  console.log('  - 5 Bangkok POIs');
  console.log('  - 5 Bali POIs');
  console.log('  - 5 Singapore POIs');
  console.log('  - 2 Malé POIs');
  console.log('  - 2 Sample itineraries (Bangkok+Phuket 5D, Bali Wellness 4D)');
}

main()
  .catch((e) => {
    console.error('❌ Phase 2 seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
