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
  price: number; // Numeric value in INR (or monthly rent in INR when For Rent)
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

export interface DataStore {
  properties: Property[];
  agents: Agent[];
  inquiries: Inquiry[];
  contacts: ContactSubmission[];
}
