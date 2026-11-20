import type {
  AdminStats,
  Agent,
  ContactStatus,
  ContactSubmission,
  Inquiry,
  InquiryStatus,
  Property,
} from '../types/realestate';

const TOKEN_STORAGE_KEY = 'vadra_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function request<T>(url: string, options: RequestInit = {}, auth = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth) {
    const token = getAdminToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMessage = (data as { error?: string }).error || `Request failed (${res.status})`;
    throw new Error(errMessage);
  }
  return data as T;
}

export interface PropertyFilters {
  search?: string;
  location?: string;
  type?: string;
  category?: string;
  bedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: boolean;
  sort?: string;
}

// --- Public API ---

export async function fetchProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.location && filters.location !== 'All') params.set('location', filters.location);
  if (filters.type && filters.type !== 'All') params.set('type', filters.type);
  if (filters.category && filters.category !== 'All') params.set('category', filters.category);
  if (filters.bedrooms && filters.bedrooms !== 'All') params.set('bedrooms', filters.bedrooms);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.featured) params.set('featured', 'true');
  if (filters.sort) params.set('sort', filters.sort);

  const qs = params.toString();
  const res = await request<{ properties: Property[] }>(`/api/properties${qs ? `?${qs}` : ''}`);
  return res.properties;
}

export async function fetchPropertyDetail(
  id: string
): Promise<{ property: Property; agent: Agent | null }> {
  return request<{ property: Property; agent: Agent | null }>(`/api/properties/${encodeURIComponent(id)}`);
}

export async function fetchAgents(): Promise<Agent[]> {
  const res = await request<{ agents: Agent[] }>('/api/agents');
  return res.agents;
}

export async function submitPropertyInquiry(payload: {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  visitType: Inquiry['visitType'];
  message: string;
}): Promise<Inquiry> {
  const res = await request<{ inquiry: Inquiry }>('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.inquiry;
}

export async function submitContactForm(payload: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<ContactSubmission> {
  const res = await request<{ contact: ContactSubmission }>('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.contact;
}

// --- Admin Auth & Protected API ---

export async function adminLogin(
  email: string,
  password: string
): Promise<{ token: string; user: { email: string; role: string; name: string } }> {
  const res = await request<{ token: string; user: { email: string; role: string; name: string } }>(
    '/api/admin/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );
  setAdminToken(res.token);
  return res;
}

export async function verifyAdminSession(): Promise<{ user: { email: string; role: string } }> {
  return request<{ user: { email: string; role: string } }>('/api/admin/me', {}, true);
}

export async function fetchAdminStats(): Promise<{
  stats: AdminStats;
  recentInquiries: Inquiry[];
  recentContacts: ContactSubmission[];
}> {
  return request('/api/admin/stats', {}, true);
}

export async function fetchAdminProperties(): Promise<Property[]> {
  const res = await request<{ properties: Property[] }>('/api/admin/properties', {}, true);
  return res.properties;
}

export async function createAdminProperty(
  payload: Partial<Property>
): Promise<Property> {
  const res = await request<{ property: Property }>(
    '/api/admin/properties',
    { method: 'POST', body: JSON.stringify(payload) },
    true
  );
  return res.property;
}

export async function updateAdminProperty(
  id: string,
  payload: Partial<Property>
): Promise<Property> {
  const res = await request<{ property: Property }>(
    `/api/admin/properties/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    true
  );
  return res.property;
}

export async function deleteAdminProperty(id: string): Promise<void> {
  await request(`/api/admin/properties/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);
}

export async function fetchAdminAgents(): Promise<Agent[]> {
  const res = await request<{ agents: Agent[] }>('/api/admin/agents', {}, true);
  return res.agents;
}

export async function createAdminAgent(payload: Partial<Agent>): Promise<Agent> {
  const res = await request<{ agent: Agent }>(
    '/api/admin/agents',
    { method: 'POST', body: JSON.stringify(payload) },
    true
  );
  return res.agent;
}

export async function updateAdminAgent(id: string, payload: Partial<Agent>): Promise<Agent> {
  const res = await request<{ agent: Agent }>(
    `/api/admin/agents/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    true
  );
  return res.agent;
}

export async function deleteAdminAgent(id: string): Promise<void> {
  await request(`/api/admin/agents/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);
}

export async function fetchAdminInquiries(): Promise<Inquiry[]> {
  const res = await request<{ inquiries: Inquiry[] }>('/api/admin/inquiries', {}, true);
  return res.inquiries;
}

export async function updateAdminInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<Inquiry> {
  const res = await request<{ inquiry: Inquiry }>(
    `/api/admin/inquiries/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
    true
  );
  return res.inquiry;
}

export async function deleteAdminInquiry(id: string): Promise<void> {
  await request(`/api/admin/inquiries/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);
}

export async function fetchAdminContacts(): Promise<ContactSubmission[]> {
  const res = await request<{ contacts: ContactSubmission[] }>('/api/admin/contacts', {}, true);
  return res.contacts;
}

export async function updateAdminContactStatus(
  id: string,
  status: ContactStatus
): Promise<ContactSubmission> {
  const res = await request<{ contact: ContactSubmission }>(
    `/api/admin/contacts/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
    true
  );
  return res.contact;
}

export async function deleteAdminContact(id: string): Promise<void> {
  await request(`/api/admin/contacts/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);
}
