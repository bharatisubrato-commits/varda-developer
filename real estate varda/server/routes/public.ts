import { Router } from 'express';
import {
  createContact,
  createInquiry,
  getPropertyById,
  listAgents,
  listProperties,
} from '../db/store.ts';

export const publicRouter = Router();

publicRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vadra-developer-api' });
});

/**
 * GET /api/properties
 * Supports query filtering by search, location, type, category, bedrooms, minPrice, maxPrice, featured, sort
 */
publicRouter.get('/properties', (req, res) => {
  const {
    search,
    location,
    type,
    category,
    bedrooms,
    minPrice,
    maxPrice,
    featured,
    sort,
  } = req.query as Record<string, string | undefined>;

  let results = listProperties(false);

  if (featured === 'true') {
    results = results.filter((p) => p.featured);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.developmentName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.propertyType.toLowerCase().includes(q)
    );
  }

  if (location && location !== 'All') {
    const loc = location.toLowerCase();
    results = results.filter((p) => p.location.toLowerCase().includes(loc));
  }

  if (type && type !== 'All') {
    results = results.filter((p) => p.propertyType.toLowerCase() === type.toLowerCase());
  }

  if (category && category !== 'All') {
    results = results.filter(
      (p) => p.listingCategory.toLowerCase() === category.toLowerCase()
    );
  }

  if (bedrooms && bedrooms !== 'All') {
    const minBeds = Number(bedrooms);
    if (!Number.isNaN(minBeds) && minBeds > 0) {
      results = results.filter((p) => p.bedrooms >= minBeds);
    }
  }

  if (minPrice) {
    const min = Number(minPrice);
    if (!Number.isNaN(min) && min > 0) {
      results = results.filter((p) => p.price >= min);
    }
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!Number.isNaN(max) && max > 0) {
      results = results.filter((p) => p.price <= max);
    }
  }

  if (sort === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'area-desc') {
    results.sort((a, b) => b.areaSqFt - a.areaSqFt);
  } else {
    results.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  res.json({ properties: results, total: results.length });
});

/**
 * GET /api/properties/:id
 * Returns full property details alongside its assigned advisor profile
 */
publicRouter.get('/properties/:id', (req, res) => {
  const property = getPropertyById(req.params.id, false);
  if (!property) {
    res.status(404).json({ error: 'Property not found or unpublished.' });
    return;
  }
  const agents = listAgents();
  const agent = agents.find((a) => a.id === property.agentId) || agents[0] || null;
  res.json({ property, agent });
});

/**
 * GET /api/agents
 */
publicRouter.get('/agents', (_req, res) => {
  const agents = listAgents();
  res.json({ agents });
});

/**
 * POST /api/inquiries
 * Validates and persists a property-specific buyer/tenant inquiry
 */
publicRouter.post('/inquiries', (req, res) => {
  const { propertyId, name, email, phone, visitType, message } = req.body ?? {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Please provide your full name.' });
    return;
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }
  if (!phone || typeof phone !== 'string' || phone.replace(/\D/g, '').length < 10) {
    res.status(400).json({ error: 'Please provide a valid 10-digit phone number.' });
    return;
  }

  const property = propertyId ? getPropertyById(String(propertyId), true) : undefined;
  const created = createInquiry({
    propertyId: property?.id || String(propertyId || 'general'),
    propertyTitle: property?.title || 'General Property Inquiry',
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    visitType: visitType || 'Site Visit',
    message: typeof message === 'string' ? message.trim() : '',
  });

  res.status(201).json({ inquiry: created });
});

/**
 * POST /api/contacts
 * Validates and persists general contact form submissions
 */
publicRouter.post('/contacts', (req, res) => {
  const { name, email, phone, subject, message } = req.body ?? {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Please provide your full name.' });
    return;
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }
  if (!phone || typeof phone !== 'string' || phone.replace(/\D/g, '').length < 10) {
    res.status(400).json({ error: 'Please provide a valid 10-digit phone number.' });
    return;
  }
  if (!message || typeof message !== 'string' || message.trim().length < 8) {
    res.status(400).json({ error: 'Please include a short message (at least 8 characters).' });
    return;
  }

  const created = createContact({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    subject: typeof subject === 'string' && subject.trim() ? subject.trim() : 'General Inquiry',
    message: message.trim(),
  });

  res.status(201).json({ contact: created });
});
