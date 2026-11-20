import { Router } from 'express';
import {
  createAgent,
  createProperty,
  deleteAgent,
  deleteContact,
  deleteInquiry,
  deleteProperty,
  listAgents,
  listContacts,
  listInquiries,
  listProperties,
  updateAgent,
  updateContactStatus,
  updateInquiryStatus,
  updateProperty,
} from '../db/store.ts';
import {
  issueAdminToken,
  requireAdminAuth,
  validateAdminCredentials,
  type AuthenticatedRequest,
} from '../middleware/auth.ts';

export const adminRouter = Router();

/**
 * POST /api/admin/login
 * Issues a signed session token when valid admin credentials are provided
 */
adminRouter.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  if (!validateAdminCredentials(email, password)) {
    res.status(401).json({ error: 'Invalid administrator credentials.' });
    return;
  }

  const session = issueAdminToken(email.trim());
  res.json({
    token: session.token,
    expiresAt: session.expiresAt,
    user: { email: email.trim(), role: 'admin', name: 'Vadra Administrator' },
  });
});

// All routes below require a valid Bearer session token
adminRouter.use(requireAdminAuth);

adminRouter.get('/me', (req: AuthenticatedRequest, res) => {
  res.json({ user: req.adminUser });
});

adminRouter.get('/stats', (_req, res) => {
  const properties = listProperties(true);
  const agents = listAgents();
  const inquiries = listInquiries();
  const contacts = listContacts();

  res.json({
    stats: {
      totalProperties: properties.length,
      publishedProperties: properties.filter((p) => p.published).length,
      draftProperties: properties.filter((p) => !p.published).length,
      totalAgents: agents.length,
      totalInquiries: inquiries.length,
      newInquiries: inquiries.filter((i) => i.status === 'New').length,
      totalContacts: contacts.length,
      newContacts: contacts.filter((c) => c.status === 'New').length,
    },
    recentInquiries: inquiries.slice(0, 5),
    recentContacts: contacts.slice(0, 5),
  });
});

// --- Admin Properties CRUD ---

adminRouter.get('/properties', (_req, res) => {
  res.json({ properties: listProperties(true) });
});

adminRouter.post('/properties', (req, res) => {
  const body = req.body ?? {};
  if (!body.title || !body.location || !body.price) {
    res.status(400).json({ error: 'Title, location, and price are required.' });
    return;
  }

  const created = createProperty({
    title: String(body.title).trim(),
    developmentName: String(body.developmentName || 'Vadra Township').trim(),
    location: String(body.location).trim(),
    address: String(body.address || body.location).trim(),
    city: String(body.city || 'Durgapur').trim(),
    pinCode: String(body.pinCode || '713217').trim(),
    listingCategory: body.listingCategory === 'For Rent' ? 'For Rent' : 'For Sale',
    propertyType: body.propertyType || 'Apartment',
    constructionStatus: body.constructionStatus || 'Ready to Move',
    price: Number(body.price) || 0,
    bedrooms: Number(body.bedrooms) || 0,
    bathrooms: Number(body.bathrooms) || 0,
    areaSqFt: Number(body.areaSqFt) || 0,
    parkingSpaces: Number(body.parkingSpaces) || 1,
    reraId: String(body.reraId || 'WBRERA/P/PAS/2026/PENDING').trim(),
    possessionDate: String(body.possessionDate || 'Immediate Possession').trim(),
    featured: Boolean(body.featured),
    published: body.published !== undefined ? Boolean(body.published) : true,
    summary: String(body.summary || '').trim(),
    description: String(body.description || body.summary || '').trim(),
    features: Array.isArray(body.features)
      ? body.features.map((f: unknown) => String(f).trim()).filter(Boolean)
      : [],
    images:
      Array.isArray(body.images) && body.images.length > 0
        ? body.images.map((img: unknown) => String(img).trim()).filter(Boolean)
        : ['/src/assets/images/tower_skyline_residences_1794943289945.jpg'],
    agentId: String(body.agentId || 'agt-01'),
  });

  res.status(201).json({ property: created });
});

adminRouter.patch('/properties/:id', (req, res) => {
  const updated = updateProperty(req.params.id, req.body ?? {});
  if (!updated) {
    res.status(404).json({ error: 'Property not found.' });
    return;
  }
  res.json({ property: updated });
});

adminRouter.delete('/properties/:id', (req, res) => {
  const ok = deleteProperty(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Property not found.' });
    return;
  }
  res.json({ deleted: true });
});

// --- Admin Agents CRUD ---

adminRouter.get('/agents', (_req, res) => {
  res.json({ agents: listAgents() });
});

adminRouter.post('/agents', (req, res) => {
  const body = req.body ?? {};
  if (!body.name || !body.role || !body.email) {
    res.status(400).json({ error: 'Name, role, and email are required.' });
    return;
  }

  const created = createAgent({
    name: String(body.name).trim(),
    role: String(body.role).trim(),
    department: body.department || 'Residential Sales',
    email: String(body.email).trim(),
    phone: String(body.phone || '8388922869').trim(),
    experienceYears: Number(body.experienceYears) || 5,
    reraCert: String(body.reraCert || 'WBRERA/AGT/PENDING').trim(),
    specialization: String(body.specialization || 'Residential Advisory').trim(),
    bio: String(body.bio || '').trim(),
    languages: Array.isArray(body.languages)
      ? body.languages.map((l: unknown) => String(l).trim()).filter(Boolean)
      : ['English', 'Bengali', 'Hindi'],
    featured: Boolean(body.featured),
  });

  res.status(201).json({ agent: created });
});

adminRouter.patch('/agents/:id', (req, res) => {
  const updated = updateAgent(req.params.id, req.body ?? {});
  if (!updated) {
    res.status(404).json({ error: 'Agent not found.' });
    return;
  }
  res.json({ agent: updated });
});

adminRouter.delete('/agents/:id', (req, res) => {
  const ok = deleteAgent(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Agent not found.' });
    return;
  }
  res.json({ deleted: true });
});

// --- Admin Inquiries ---

adminRouter.get('/inquiries', (_req, res) => {
  res.json({ inquiries: listInquiries() });
});

adminRouter.patch('/inquiries/:id', (req, res) => {
  const { status } = req.body ?? {};
  const allowed = ['New', 'Contacted', 'Site Visit Scheduled', 'Closed'];
  if (!allowed.includes(status)) {
    res.status(400).json({ error: 'Invalid inquiry status.' });
    return;
  }
  const updated = updateInquiryStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }
  res.json({ inquiry: updated });
});

adminRouter.delete('/inquiries/:id', (req, res) => {
  const ok = deleteInquiry(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }
  res.json({ deleted: true });
});

// --- Admin Contacts ---

adminRouter.get('/contacts', (_req, res) => {
  res.json({ contacts: listContacts() });
});

adminRouter.patch('/contacts/:id', (req, res) => {
  const { status } = req.body ?? {};
  const allowed = ['New', 'Reviewed', 'Resolved'];
  if (!allowed.includes(status)) {
    res.status(400).json({ error: 'Invalid contact status.' });
    return;
  }
  const updated = updateContactStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ error: 'Contact submission not found.' });
    return;
  }
  res.json({ contact: updated });
});

adminRouter.delete('/contacts/:id', (req, res) => {
  const ok = deleteContact(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Contact submission not found.' });
    return;
  }
  res.json({ deleted: true });
});
