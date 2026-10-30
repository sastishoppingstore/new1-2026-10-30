// API helper utilities
import { FALLBACK_PROPERTIES } from './defaultProperties';

export interface Property {
  id?: number;
  title: string;
  price_pkr: number; // in PKR
  type: 'House' | 'Plot' | 'Apartment' | 'Commercial' | 'Farmhouse';
  purpose: 'Sale' | 'Rent';
  city: string;
  society: string;
  location: string;
  area_marla?: number | null;
  area_sqft?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  image: string;
  gallery?: string[] | null;
  description: string;
  amenities?: string[] | null;
  status?: 'Available' | 'Sold' | 'Reserved' | 'NOC Approved' | null;
  noc_verified?: boolean | null;
  featured?: boolean | null;
  possession?: 'Ready' | 'Ongoing' | 'Upcoming' | null;
  agent_name?: string | null;
  agent_phone?: string | null;
  created_at?: string | null;
}

export interface Inquiry {
  id?: number;
  property_id: number;
  property_title: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  created_at?: string;
}

export const formatPKR = (amount: number) => {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `PKR ${cr.toFixed(cr < 10 ? 2 : 1)} Crore${cr > 1 ? 's' : ''}`;
  }
  if (amount >= 100000) {
    const lac = amount / 100000;
    return `PKR ${lac.toFixed(lac < 10 ? 1 : 0)} Lakh${lac > 1 ? 's' : ''}`;
  }
  if (amount >= 1000) return `PKR ${(amount / 1000).toFixed(0)} Thousand`;
  return `PKR ${amount.toLocaleString('en-PK')}`;
};

export const formatPKRShort = (amount: number) => {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `${cr.toFixed(cr < 10 ? 2 : 1)} Cr`;
  }
  if (amount >= 100000) {
    const lac = amount / 100000;
    return `${lac.toFixed(lac < 10 ? 1 : 0)} Lac`;
  }
  return `${(amount / 1000).toFixed(0)}K`;
};

// ============== IMAGE RESOLUTION HELPER ==============
export const resolveImageUrl = (img?: string): string => {
  const fallback = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  if (!img) return fallback;
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return img;
  }
  const clean = img.replace(/^\/+/, '');
  const p = window.location.pathname;
  const lastSlash = p.lastIndexOf('/');
  const base = lastSlash <= 0 ? '' : p.substring(0, lastSlash);
  return `${base}/${clean}`;
};

// ============== API CALLS ==============

const getBaseDir = (): string => {
  const p = window.location.pathname;
  const lastSlash = p.lastIndexOf('/');
  if (lastSlash <= 0) return '';
  return p.substring(0, lastSlash);
};

const getCandidateUrls = (endpoint: string, qs: string = ''): string[] => {
  const base = getBaseDir();
  const q = qs ? '?' + qs : '';
  return [
    `${base}/api/${endpoint}.php${q}`,
    `${base}/api/${endpoint}${q}`,
    `./api/${endpoint}.php${q}`,
    `./api/${endpoint}${q}`,
    `/api/${endpoint}.php${q}`,
    `/api/${endpoint}${q}`,
  ];
};

const get = async <T,>(endpoint: string, qs: string = ''): Promise<T> => {
  const urls = getCandidateUrls(endpoint, qs);
  let lastErr: any = null;
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const data = await r.json();
        return data;
      }
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error(`GET ${endpoint} failed`);
};

const post = async <T,>(endpoint: string, body: unknown): Promise<T> => {
  const urls = getCandidateUrls(endpoint);
  let lastErr: any = null;
  for (const url of urls) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (r.ok) return await r.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error(`POST ${endpoint} failed`);
};

const del = async (endpoint: string, body: unknown) => {
  const urls = getCandidateUrls(endpoint);
  let lastErr: any = null;
  for (const url of urls) {
    try {
      const r = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (r.ok) return await r.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error(`DELETE ${endpoint} failed`);
};

export const api = {
  listProperties: async (params: Record<string, string> = {}): Promise<Property[]> => {
    const qs = new URLSearchParams(params).toString();
    try {
      const data = await get<Property[]>('properties', qs);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      console.warn('API error, falling back to cached properties:', err);
    }
    return FALLBACK_PROPERTIES;
  },
  createProperty: (data: Omit<Property, 'id'>) => post<Property>('properties', data),
  deleteProperty: (id: number) => del('properties', { id }),
  createInquiry: (data: Omit<Inquiry, 'id'>) => post<Inquiry>('inquiries', data),
  listInquiries: () => get<Inquiry[]>('inquiries'),
  saveProperty: (session_id: string, property_id: number, property_title: string) =>
    post('saved', { session_id, property_id, property_title }),
  listSaved: (session_id: string) => get<any[]>('saved', `session_id=${session_id}`).catch(() => []),
  unsaveProperty: (id: number) => del('saved', { id }),
};
