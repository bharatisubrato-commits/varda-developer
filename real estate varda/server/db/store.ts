import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type {
  Agent,
  ContactSubmission,
  DataStore,
  Inquiry,
  Property,
} from '../types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const SEED_IMAGES = {
  villa: '/src/assets/images/hero_luxury_villa_1794943289766.jpg',
  tower: '/src/assets/images/tower_skyline_residences_1794943289945.jpg',
  bungalow: '/src/assets/images/serene_modern_bungalow_1794943289701.jpg',
  interior: '/src/assets/images/sunlit_living_interior_1794943290438.jpg',
  commercial: '/src/assets/images/commercial_business_plaza_1794943292323.jpg',
  penthouse: '/src/assets/images/penthouse_terrace_view_1794943291757.jpg',
};

/**
 * Generates realistic initial enterprise real estate seed data for Vadra Developer
 * centered in Durgapur (PIN 713217), West Bengal.
 */
function createSeedData(): DataStore {
  const now = new Date().toISOString();

  const agents: Agent[] = [
    {
      id: 'agt-01',
      name: 'Arjun Vadra',
      role: 'Managing Director & Chief Architect',
      department: 'Leadership',
      email: 'arjun.vadra@vadradeveloper.com',
      phone: '8388922869',
      experienceYears: 22,
      reraCert: 'WBRERA/IND/00412',
      specialization: 'Master-Planned Townships & Urban Architecture',
      bio: 'Founded Vadra Developer in Durgapur with a mandate to deliver institutional-grade construction, transparent RERA compliance, and enduring urban landmarks across West Bengal.',
      languages: ['English', 'Bengali', 'Hindi'],
      featured: true,
      createdAt: now,
    },
    {
      id: 'agt-02',
      name: 'Subhajit Chatterjee',
      role: 'VP, Residential Sales & Customer Relations',
      department: 'Residential Sales',
      email: 'subhajit.c@vadradeveloper.com',
      phone: '8388922869',
      experienceYears: 14,
      reraCert: 'WBRERA/AGT/01984',
      specialization: 'Luxury Villas & High-Rise Residences',
      bio: 'Leads residential advisory across Bidhannagar and City Centre townships, guiding families through financial structuring, site inspections, and timely handover.',
      languages: ['Bengali', 'English', 'Hindi'],
      featured: true,
      createdAt: now,
    },
    {
      id: 'agt-03',
      name: 'Ananya Sen',
      role: 'Head of NRI & Institutional Advisory',
      department: 'NRI Desk',
      email: 'ananya.sen@vadradeveloper.com',
      phone: '8388922869',
      experienceYears: 11,
      reraCert: 'WBRERA/AGT/02210',
      specialization: 'Cross-Border Investments & Asset Management',
      bio: 'Advises global Indian buyers and corporate executives investing in Durgapur, Asansol, and the NH-19 industrial growth corridor.',
      languages: ['English', 'Bengali'],
      featured: true,
      createdAt: now,
    },
    {
      id: 'agt-04',
      name: 'Debashis Mukherjee',
      role: 'Director, Commercial & Retail Leasing',
      department: 'Commercial Advisory',
      email: 'debashis.m@vadradeveloper.com',
      phone: '8388922869',
      experienceYears: 16,
      reraCert: 'WBRERA/AGT/01455',
      specialization: 'Grade-A Office Suites & High-Street Retail',
      bio: 'Specializes in enterprise campus leasing, flagship retail showrooms, and mixed-use commercial developments along NH-19.',
      languages: ['Bengali', 'Hindi', 'English'],
      featured: false,
      createdAt: now,
    },
  ];

  const properties: Property[] = [
    {
      id: 'prop-01',
      title: 'Vadra Imperial Villa',
      slug: 'vadra-imperial-villa-bidhannagar',
      developmentName: 'Vadra Crest Enclave',
      location: 'Bidhannagar, Durgapur',
      address: 'Plot 14, Sector II-B, Bidhannagar, Durgapur',
      city: 'Durgapur',
      pinCode: '713217',
      listingCategory: 'For Sale',
      propertyType: 'Villa',
      constructionStatus: 'Ready to Move',
      price: 38500000, // ₹3.85 Cr
      bedrooms: 4,
      bathrooms: 4,
      areaSqFt: 3650,
      parkingSpaces: 2,
      reraId: 'WBRERA/P/PAS/2025/001412',
      possessionDate: 'Immediate Possession',
      featured: true,
      published: true,
      summary: 'Architectural concrete-and-teak courtyard villa with private lap pool and smart home automation.',
      description:
        'Set inside the gated Vadra Crest Enclave in Bidhannagar, Durgapur, Vadra Imperial Villa pairs double-height living volumes with floor-to-ceiling glazing overlooking landscaped greens. Engineered with seismic-resistant RCC framing, Italian marble flooring, solar water heating, and a private landscaped deck.',
      features: [
        'Private Infinity Plunge Pool',
        'Italian Statuario Marble Flooring',
        '100% DG Power Backup',
        'Smart Climate & Lighting Controls',
        '24/7 Three-Tier Perimeter Security',
        'Clubhouse & Heated Lap Pool Access',
      ],
      images: [SEED_IMAGES.villa, SEED_IMAGES.interior, SEED_IMAGES.bungalow],
      agentId: 'agt-02',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prop-02',
      title: 'The Grandeur Skyline Towers',
      slug: 'grandeur-skyline-towers-city-centre',
      developmentName: 'Vadra Grandeur',
      location: 'City Centre, Durgapur',
      address: 'Phase I, Near Junction Mall, City Centre, Durgapur',
      city: 'Durgapur',
      pinCode: '713217',
      listingCategory: 'For Sale',
      propertyType: 'Apartment',
      constructionStatus: 'Under Construction',
      price: 16500000, // ₹1.65 Cr
      bedrooms: 3,
      bathrooms: 3,
      areaSqFt: 2150,
      parkingSpaces: 2,
      reraId: 'WBRERA/P/PAS/2025/001894',
      possessionDate: 'December 2027',
      featured: true,
      published: true,
      summary: 'Twin 22-storey luxury high-rise towers featuring wraparound sky decks and 72% open green cover.',
      description:
        'Rising above City Centre, The Grandeur Skyline Towers bring metropolitan luxury living to Durgapur. Each 3 BHK corner residence receives three-side natural ventilation, wide cantilevered balconies, acoustic double-glazed windows, and direct access to a 35,000 sq ft residents clubhouse.',
      features: [
        '35,000 Sq. Ft. Grand Clubhouse',
        'Triple-Height Air-Conditioned Lobby',
        'EV Charging Bays at Every Pillar',
        'Rainwater Harvesting & Solar Rooftop',
        'Jogging Track & Reflexology Park',
        'IGBC Gold Pre-Certified Design',
      ],
      images: [SEED_IMAGES.tower, SEED_IMAGES.interior, SEED_IMAGES.penthouse],
      agentId: 'agt-02',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prop-03',
      title: 'Serene Timberline Bungalow',
      slug: 'serene-timberline-bungalow-fuljhore',
      developmentName: 'Vadra Green Meadows',
      location: 'Fuljhore, Durgapur',
      address: 'Avenue 4, Vadra Green Meadows, Fuljhore, Durgapur',
      city: 'Durgapur',
      pinCode: '713217',
      listingCategory: 'For Rent',
      propertyType: 'Bungalow',
      constructionStatus: 'Ready to Move',
      price: 75000, // ₹75,000 /month
      bedrooms: 4,
      bathrooms: 3,
      areaSqFt: 2600,
      parkingSpaces: 2,
      reraId: 'WBRERA/P/PAS/2024/000918',
      possessionDate: 'Available Immediately',
      featured: true,
      published: true,
      summary: 'Fully finished executive duplex bungalow with stone facade, private lawn, and modular European kitchen.',
      description:
        'Tailored for senior executives, medical directors, and visiting industrial leaders in Durgapur, Serene Timberline Bungalow offers a peaceful low-density sanctuary just 8 minutes from City Centre and NH-19. Includes furnished living spaces, shaded terrace, and landscaped private garden.',
      features: [
        'Private Manicured Front Lawn',
        'Modular Kitchen with Built-In Appliances',
        'Cantilevered Teak-Clad Balcony',
        'Dedicated Staff Quarters',
        '24-Hour Treated Water & Power Backup',
        'Walking Distance to International Schools',
      ],
      images: [SEED_IMAGES.bungalow, SEED_IMAGES.interior, SEED_IMAGES.villa],
      agentId: 'agt-03',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prop-04',
      title: 'Sovereign Sky Penthouse',
      slug: 'sovereign-sky-penthouse-city-centre',
      developmentName: 'Vadra Grandeur',
      location: 'City Centre, Durgapur',
      address: '22nd Floor, Tower A, Vadra Grandeur, Durgapur',
      city: 'Durgapur',
      pinCode: '713217',
      listingCategory: 'For Sale',
      propertyType: 'Penthouse',
      constructionStatus: 'New Launch',
      price: 45000000, // ₹4.50 Cr
      bedrooms: 5,
      bathrooms: 5,
      areaSqFt: 4800,
      parkingSpaces: 3,
      reraId: 'WBRERA/P/PAS/2026/002011',
      possessionDate: 'March 2028',
      featured: false,
      published: true,
      summary: 'Duplex sky residence with private landscaped roof terrace, fireplace lounge, and panoramic city views.',
      description:
        'An ultra-exclusive collection of four duplex penthouses crowning Tower A of Vadra Grandeur. Features a private elevator foyer, 1,200 sq ft open-air terrace deck with pergolas, private home theater wiring, and uninterrupted panoramic vistas across Durgapur.',
      features: [
        'Private High-Speed Elevator Foyer',
        '1,200 Sq. Ft. Landscaped Sky Terrace',
        'VRV Central Air Conditioning',
        'Private Home Office & Library Lounge',
        'Three Covered Basement Car Parks',
        'Dedicated Concierge Desk',
      ],
      images: [SEED_IMAGES.penthouse, SEED_IMAGES.interior, SEED_IMAGES.tower],
      agentId: 'agt-01',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prop-05',
      title: 'Vadra One Exchange Plaza',
      slug: 'vadra-one-exchange-plaza-nh19',
      developmentName: 'Vadra Business District',
      location: 'Muchipara, NH-19, Durgapur',
      address: 'Plot C-1, Muchipara Commercial Corridor, NH-19, Durgapur',
      city: 'Durgapur',
      pinCode: '713217',
      listingCategory: 'For Sale',
      propertyType: 'Commercial',
      constructionStatus: 'Ready to Move',
      price: 24000000, // ₹2.40 Cr
      bedrooms: 0,
      bathrooms: 4,
      areaSqFt: 3200,
      parkingSpaces: 6,
      reraId: 'WBRERA/P/PAS/2024/001120',
      possessionDate: 'Immediate Fit-Out',
      featured: false,
      published: true,
      summary: 'Grade-A corporate office floor and high-visibility retail frontage directly along NH-19.',
      description:
        'Positioned on Durgapur’s prime arterial highway corridor, Vadra One Exchange Plaza delivers institutional-grade office suites and double-height retail showrooms for banks, IT enterprises, healthcare clinics, and flagship consumer brands.',
      features: [
        'Direct NH-19 Highway Frontage',
        'Double-Height Limestone & Glass Atrium',
        'High-Speed Destination-Controlled Lifts',
        '100% Redundant Power & Fiber Backbone',
        'Multi-Level Visitor Parking',
        'Fire-Rated Central HVAC Infrastructure',
      ],
      images: [SEED_IMAGES.commercial, SEED_IMAGES.tower, SEED_IMAGES.penthouse],
      agentId: 'agt-04',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prop-06',
      title: 'Aurelia Garden Residences',
      slug: 'aurelia-garden-residences-benachity',
      developmentName: 'Vadra Aurelia',
      location: 'Benachity, Durgapur',
      address: 'Sector IV, Near Gandhi More, Benachity, Durgapur',
      city: 'Durgapur',
      pinCode: '713217',
      listingCategory: 'For Sale',
      propertyType: 'Apartment',
      constructionStatus: 'Ready to Move',
      price: 9200000, // ₹92 Lakhs
      bedrooms: 3,
      bathrooms: 2,
      areaSqFt: 1620,
      parkingSpaces: 1,
      reraId: 'WBRERA/P/PAS/2024/000774',
      possessionDate: 'Immediate Possession',
      featured: false,
      published: true,
      summary: 'Vastu-compliant 3 BHK family apartments with sunlit balconies and central landscaped podium.',
      description:
        'Designed for modern Durgapur families seeking proximity to Benachity’s commercial hub, schools, and multi-specialty hospitals without sacrificing serenity. Every apartment features cross-ventilated rooms, vitrified timber-finish tiles, and modular kitchen provisions.',
      features: [
        'Vastu-Compliant East & North Facades',
        'Landscaped Podium & Kids Play Zone',
        'Multi-Gym & Indoor Games Lounge',
        'CCTV Surveillance & Intercom',
        'Covered Stilt Car Parking',
        'Zero-Leakage Waterproofing Warranty',
      ],
      images: [SEED_IMAGES.interior, SEED_IMAGES.tower, SEED_IMAGES.bungalow],
      agentId: 'agt-02',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prop-07',
      title: 'Emerald Crest Serviced Residence',
      slug: 'emerald-crest-serviced-residence-bidhannagar',
      developmentName: 'Vadra Crest Enclave',
      location: 'Bidhannagar, Durgapur',
      address: 'Block D, Sector II, Bidhannagar, Durgapur',
      city: 'Durgapur',
      pinCode: '713217',
      listingCategory: 'For Rent',
      propertyType: 'Apartment',
      constructionStatus: 'Ready to Move',
      price: 42000, // ₹42,000 /month
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1380,
      parkingSpaces: 1,
      reraId: 'WBRERA/P/PAS/2023/000501',
      possessionDate: 'Available Immediately',
      featured: false,
      published: true,
      summary: 'Turnkey furnished 2 BHK corporate residence overlooking tranquil tree-lined avenues in Bidhannagar.',
      description:
        'Move-in ready apartment furnished to boutique hotel standards, complete with solid oak dining, inverter air-conditioning, high-speed fiber readiness, and dedicated basement parking inside a quiet gated community.',
      features: [
        'Fully Furnished Turnkey Interiors',
        'Wide Garden-Facing Sit-Out Balcony',
        '24/7 Facility Management Desk',
        'Gated Community with Jogging Track',
        'Close to Mission Hospital & NIT Durgapur',
      ],
      images: [SEED_IMAGES.interior, SEED_IMAGES.bungalow, SEED_IMAGES.tower],
      agentId: 'agt-03',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prop-08',
      title: 'Vadra Heritage Estate Plots',
      slug: 'vadra-heritage-estate-plots-arrah',
      developmentName: 'Vadra Heritage Park',
      location: 'Arrah, Durgapur',
      address: 'Phase II, Shastri Avenue Extension, Arrah, Durgapur',
      city: 'Durgapur',
      pinCode: '713217',
      listingCategory: 'For Sale',
      propertyType: 'Plot',
      constructionStatus: 'Ready to Move',
      price: 6800000, // ₹68 Lakhs
      bedrooms: 0,
      bathrooms: 0,
      areaSqFt: 3600,
      parkingSpaces: 2,
      reraId: 'WBRERA/P/PAS/2025/001603',
      possessionDate: 'Immediate Registration',
      featured: false,
      published: true,
      summary: 'Clear-title gated residential villa plots with underground utilities, concrete avenues, and clubhouse.',
      description:
        'Build a bespoke family estate within a master-planned 18-acre gated enclave. Each freehold residential plot comes with underground electrical cabling, storm-water drainage, landscaped avenue trees, and full access to the Vadra Heritage Clubhouse.',
      features: [
        '100% Freehold Clear Title',
        '40-Ft Internal Concrete Avenues',
        'Underground Power & Water Supply',
        '24/7 Compound Wall & Security Gate',
        'Approved Custom Villa Architectural Guidelines',
      ],
      images: [SEED_IMAGES.villa, SEED_IMAGES.bungalow, SEED_IMAGES.penthouse],
      agentId: 'agt-01',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const inquiries: Inquiry[] = [
    {
      id: 'inq-101',
      propertyId: 'prop-01',
      propertyTitle: 'Vadra Imperial Villa',
      name: 'Dr. Ritwik Basu',
      email: 'ritwik.basu@healthcare-bengal.org',
      phone: '+91 98300 44120',
      visitType: 'Site Visit',
      message: 'Looking to schedule a private family walkthrough this Saturday afternoon with our architect.',
      status: 'Site Visit Scheduled',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'inq-102',
      propertyId: 'prop-02',
      propertyTitle: 'The Grandeur Skyline Towers',
      name: 'Saurav Ghosh',
      email: 'saurav.ghosh@steelcorp.in',
      phone: '+91 94340 88211',
      visitType: 'Price Quotation',
      message: 'Please share the all-inclusive payment schedule and SBI home loan tie-up details for Tower B higher floors.',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 'inq-103',
      propertyId: 'prop-05',
      propertyTitle: 'Vadra One Exchange Plaza',
      name: 'Meera & Associates LLP',
      email: 'ops@meeraassociates.co.in',
      phone: '+91 98311 71005',
      visitType: 'Floor Plan & Brochure',
      message: 'Interested in acquiring two contiguous office suites (6,400 sq ft total) for our regional advisory hub.',
      status: 'Contacted',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ];

  const contacts: ContactSubmission[] = [
    {
      id: 'cnt-201',
      name: 'Pradip Kumar Roy',
      email: 'pradip.roy@nri-london.co.uk',
      phone: '+44 7700 900421',
      subject: 'NRI Investment Consultation in Durgapur',
      message: 'Visiting Durgapur next month and would like to explore ready-to-move villas and penthouses under Vadra Developer.',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    },
    {
      id: 'cnt-202',
      name: 'Indrani Dasgupta',
      email: 'indrani.d@gmail.com',
      phone: '+91 97321 55409',
      subject: 'Corporate Bulk Leasing Inquiry',
      message: 'Seeking 6 furnished 2 BHK or 3 BHK residences near Bidhannagar / City Centre for incoming senior engineering leads.',
      status: 'Reviewed',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];

  return { properties, agents, inquiries, contacts };
}

let cachedStore: DataStore | null = null;

function ensureStore(): DataStore {
  if (cachedStore) return cachedStore;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    const seed = createSeedData();
    fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    cachedStore = seed;
    return cachedStore;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as DataStore;
    if (!parsed.properties || !parsed.agents || !parsed.inquiries || !parsed.contacts) {
      throw new Error('Invalid store structure');
    }
    cachedStore = parsed;
    return cachedStore;
  } catch {
    const seed = createSeedData();
    fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2), 'utf-8');
    cachedStore = seed;
    return cachedStore;
  }
}

function persistStore(store: DataStore): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmpPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(store, null, 2), 'utf-8');
  fs.renameSync(tmpPath, STORE_PATH);
  cachedStore = store;
}

export function getStore(): DataStore {
  return ensureStore();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

// --- Property Operations ---

export function listProperties(includeDrafts = false): Property[] {
  const store = ensureStore();
  return includeDrafts
    ? [...store.properties]
    : store.properties.filter((p) => p.published);
}

export function getPropertyById(idOrSlug: string, includeDrafts = false): Property | undefined {
  const store = ensureStore();
  const found = store.properties.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (!found) return undefined;
  if (!includeDrafts && !found.published) return undefined;
  return found;
}

export function createProperty(
  input: Omit<Property, 'id' | 'slug' | 'createdAt' | 'updatedAt'>
): Property {
  const store = ensureStore();
  const now = new Date().toISOString();
  const id = `prop-${randomUUID().slice(0, 8)}`;
  const prop: Property = {
    ...input,
    id,
    slug: `${slugify(input.title)}-${id.slice(-4)}`,
    createdAt: now,
    updatedAt: now,
  };
  store.properties.unshift(prop);
  persistStore(store);
  return prop;
}

export function updateProperty(id: string, patch: Partial<Property>): Property | null {
  const store = ensureStore();
  const idx = store.properties.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const existing = store.properties[idx];
  const updated: Property = {
    ...existing,
    ...patch,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  store.properties[idx] = updated;
  persistStore(store);
  return updated;
}

export function deleteProperty(id: string): boolean {
  const store = ensureStore();
  const prevLen = store.properties.length;
  store.properties = store.properties.filter((p) => p.id !== id);
  if (store.properties.length === prevLen) return false;
  persistStore(store);
  return true;
}

// --- Agent Operations ---

export function listAgents(): Agent[] {
  return [...ensureStore().agents];
}

export function createAgent(input: Omit<Agent, 'id' | 'createdAt'>): Agent {
  const store = ensureStore();
  const agent: Agent = {
    ...input,
    id: `agt-${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  store.agents.push(agent);
  persistStore(store);
  return agent;
}

export function updateAgent(id: string, patch: Partial<Agent>): Agent | null {
  const store = ensureStore();
  const idx = store.agents.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const updated: Agent = {
    ...store.agents[idx],
    ...patch,
    id: store.agents[idx].id,
    createdAt: store.agents[idx].createdAt,
  };
  store.agents[idx] = updated;
  persistStore(store);
  return updated;
}

export function deleteAgent(id: string): boolean {
  const store = ensureStore();
  const prevLen = store.agents.length;
  store.agents = store.agents.filter((a) => a.id !== id);
  if (store.agents.length === prevLen) return false;
  persistStore(store);
  return true;
}

// --- Inquiry Operations ---

export function listInquiries(): Inquiry[] {
  return [...ensureStore().inquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createInquiry(
  input: Omit<Inquiry, 'id' | 'status' | 'createdAt'>
): Inquiry {
  const store = ensureStore();
  const inquiry: Inquiry = {
    ...input,
    id: `inq-${randomUUID().slice(0, 8)}`,
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  store.inquiries.unshift(inquiry);
  persistStore(store);
  return inquiry;
}

export function updateInquiryStatus(
  id: string,
  status: Inquiry['status']
): Inquiry | null {
  const store = ensureStore();
  const idx = store.inquiries.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  store.inquiries[idx] = { ...store.inquiries[idx], status };
  persistStore(store);
  return store.inquiries[idx];
}

export function deleteInquiry(id: string): boolean {
  const store = ensureStore();
  const prevLen = store.inquiries.length;
  store.inquiries = store.inquiries.filter((i) => i.id !== id);
  if (store.inquiries.length === prevLen) return false;
  persistStore(store);
  return true;
}

// --- Contact Submission Operations ---

export function listContacts(): ContactSubmission[] {
  return [...ensureStore().contacts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createContact(
  input: Omit<ContactSubmission, 'id' | 'status' | 'createdAt'>
): ContactSubmission {
  const store = ensureStore();
  const submission: ContactSubmission = {
    ...input,
    id: `cnt-${randomUUID().slice(0, 8)}`,
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  store.contacts.unshift(submission);
  persistStore(store);
  return submission;
}

export function updateContactStatus(
  id: string,
  status: ContactSubmission['status']
): ContactSubmission | null {
  const store = ensureStore();
  const idx = store.contacts.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  store.contacts[idx] = { ...store.contacts[idx], status };
  persistStore(store);
  return store.contacts[idx];
}

export function deleteContact(id: string): boolean {
  const store = ensureStore();
  const prevLen = store.contacts.length;
  store.contacts = store.contacts.filter((c) => c.id !== id);
  if (store.contacts.length === prevLen) return false;
  persistStore(store);
  return true;
}
