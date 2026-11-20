export type ListingCategory = 'For Sale' | 'For Rent';
export type PropertyType = 'Villa' | 'Apartment' | 'Bungalow' | 'Penthouse' | 'Commercial' | 'Plot';
export type ConstructionStatus = 'Ready to Move' | 'Under Construction' | 'New Launch';

export interface Property {
  id: string;
  title: string;
  slug: string;
  developmentName: string;
  location: string;
  address: string;
  city: string;
  pinCode: string;
  listingCategory: ListingCategory;
  propertyType: PropertyType;
  constructionStatus: ConstructionStatus;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  parkingSpaces: number;
  reraId: string;
  possessionDate: string;
  featured: boolean;
  published: boolean;
  summary: string;
  description: string;
  features: string[];
  images: string[];
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: 'Leadership' | 'Residential Sales' | 'Commercial Advisory' | 'NRI Desk';
  email: string;
  phone: string;
  experienceYears: number;
  reraCert: string;
  specialization: string;
  bio: string;
  languages: string[];
  featured: boolean;
  createdAt: string;
}

export type InquiryStatus = 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Closed';

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  visitType: 'Site Visit' | 'Floor Plan & Brochure' | 'Price Quotation' | 'Virtual Tour';
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export type ContactStatus = 'New' | 'Reviewed' | 'Resolved';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface AdminStats {
  totalProperties: number;
  publishedProperties: number;
  draftProperties: number;
  totalAgents: number;
  totalInquiries: number;
  newInquiries: number;
  totalContacts: number;
  newContacts: number;
}

export const COMPANY_INFO = {
  name: 'Vadra Developer',
  shortTag: 'Residential · Commercial · Townships',
  addressLine: 'City Centre, Sector II, Durgapur, PIN - 713217, West Bengal',
  shortAddress: 'Durgapur, PIN - 713217, West Bengal',
  phoneRaw: '8388922869',
  phoneDisplay: '+91 83889 22869',
  email: 'concierge@vadradeveloper.com',
  hours: 'Mon – Sun · 9:30 AM – 7:00 PM IST',
};

export const ARCHITECTURAL_GALLERY_PRESETS = [
  {
    label: 'Luxury Villa & Infinity Pool',
    url: '/src/assets/images/hero_luxury_villa_1794943289766.jpg',
  },
  {
    label: 'High-Rise Skyline Towers',
    url: '/src/assets/images/tower_skyline_residences_1794943289945.jpg',
  },
  {
    label: 'Modern Timberline Bungalow',
    url: '/src/assets/images/serene_modern_bungalow_1794943289701.jpg',
  },
  {
    label: 'Sunlit Living Interior',
    url: '/src/assets/images/sunlit_living_interior_1794943290438.jpg',
  },
  {
    label: 'Commercial Business Plaza',
    url: '/src/assets/images/commercial_business_plaza_1794943292323.jpg',
  },
  {
    label: 'Penthouse Sky Terrace',
    url: '/src/assets/images/penthouse_terrace_view_1794943291757.jpg',
  },
];

export function formatINR(amount: number, category?: ListingCategory): string {
  if (category === 'For Rent') {
    return `₹ ${amount.toLocaleString('en-IN')} /month`;
  }
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹ ${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹ ${lakh.toFixed(1).replace(/\.0$/, '')} Lakhs`;
  }
  return `₹ ${amount.toLocaleString('en-IN')}`;
}

export function getWhatsAppUrl(message?: string): string {
  const defaultMsg =
    'Hello Vadra Developer, I would like to inquire about your properties in Durgapur (PIN 713217).';
  const text = encodeURIComponent(message || defaultMsg);
  return `https://wa.me/91${COMPANY_INFO.phoneRaw}?text=${text}`;
}
