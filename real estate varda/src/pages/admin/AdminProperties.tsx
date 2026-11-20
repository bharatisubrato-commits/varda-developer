import { useEffect, useState, type FormEvent } from 'react';
import { Eye, EyeOff, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import {
  createAdminProperty,
  deleteAdminProperty,
  fetchAdminAgents,
  fetchAdminProperties,
  updateAdminProperty,
} from '../../services/api';
import {
  ARCHITECTURAL_GALLERY_PRESETS,
  formatINR,
  type Agent,
  type ConstructionStatus,
  type ListingCategory,
  type Property,
  type PropertyType,
} from '../../types/realestate';

interface PropertyFormState {
  title: string;
  developmentName: string;
  location: string;
  address: string;
  city: string;
  pinCode: string;
  listingCategory: ListingCategory;
  propertyType: PropertyType;
  constructionStatus: ConstructionStatus;
  price: string;
  bedrooms: string;
  bathrooms: string;
  areaSqFt: string;
  parkingSpaces: string;
  reraId: string;
  possessionDate: string;
  featured: boolean;
  published: boolean;
  summary: string;
  description: string;
  featuresText: string;
  imageUrl: string;
  agentId: string;
}

const EMPTY_FORM: PropertyFormState = {
  title: '',
  developmentName: 'Vadra Crest Enclave',
  location: 'Bidhannagar, Durgapur',
  address: 'Sector II, Bidhannagar, Durgapur',
  city: 'Durgapur',
  pinCode: '713217',
  listingCategory: 'For Sale',
  propertyType: 'Apartment',
  constructionStatus: 'Ready to Move',
  price: '12500000',
  bedrooms: '3',
  bathrooms: '3',
  areaSqFt: '1850',
  parkingSpaces: '1',
  reraId: 'WBRERA/P/PAS/2026/002401',
  possessionDate: 'Immediate Possession',
  featured: false,
  published: true,
  summary: '',
  description: '',
  featuresText: '24/7 Security, Power Backup, Landscaped Garden, Clubhouse',
  imageUrl: ARCHITECTURAL_GALLERY_PRESETS[1].url,
  agentId: 'agt-01',
};

export function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PropertyFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [props, agts] = await Promise.all([fetchAdminProperties(), fetchAdminAgents()]);
      setProperties(props);
      setAgents(agts);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      agentId: agents[0]?.id || 'agt-01',
    });
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(p: Property) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      developmentName: p.developmentName,
      location: p.location,
      address: p.address,
      city: p.city,
      pinCode: p.pinCode,
      listingCategory: p.listingCategory,
      propertyType: p.propertyType,
      constructionStatus: p.constructionStatus,
      price: String(p.price),
      bedrooms: String(p.bedrooms),
      bathrooms: String(p.bathrooms),
      areaSqFt: String(p.areaSqFt),
      parkingSpaces: String(p.parkingSpaces),
      reraId: p.reraId,
      possessionDate: p.possessionDate,
      featured: p.featured,
      published: p.published,
      summary: p.summary,
      description: p.description,
      featuresText: p.features.join(', '),
      imageUrl: p.images[0] || ARCHITECTURAL_GALLERY_PRESETS[0].url,
      agentId: p.agentId,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.title.trim() || !form.location.trim()) {
      setFormError('Property title and location are required.');
      return;
    }

    const payload: Partial<Property> = {
      title: form.title.trim(),
      developmentName: form.developmentName.trim(),
      location: form.location.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      pinCode: form.pinCode.trim(),
      listingCategory: form.listingCategory,
      propertyType: form.propertyType,
      constructionStatus: form.constructionStatus,
      price: Number(form.price) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      areaSqFt: Number(form.areaSqFt) || 0,
      parkingSpaces: Number(form.parkingSpaces) || 0,
      reraId: form.reraId.trim(),
      possessionDate: form.possessionDate.trim(),
      featured: form.featured,
      published: form.published,
      summary: form.summary.trim(),
      description: form.description.trim() || form.summary.trim(),
      features: form.featuresText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      images: [form.imageUrl.trim() || ARCHITECTURAL_GALLERY_PRESETS[0].url],
      agentId: form.agentId,
    };

    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateAdminProperty(editingId, payload);
        setProperties((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      } else {
        const created = await createAdminProperty(payload);
        setProperties((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save property.');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(p: Property) {
    const updated = await updateAdminProperty(p.id, { published: !p.published });
    setProperties((prev) => prev.map((item) => (item.id === p.id ? updated : item)));
  }

  async function handleDelete(p: Property) {
    await deleteAdminProperty(p.id);
    setProperties((prev) => prev.filter((item) => item.id !== p.id));
  }

  const filtered = properties.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.developmentName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && p.published) ||
      (statusFilter === 'draft' && !p.published);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#112239] tracking-tight">Property Listings</h1>
          <p className="text-sm text-[#64748B]">
            Create, edit, publish/unpublish, and manage residential &amp; commercial developments.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#112239] text-white text-xs font-semibold hover:bg-[#1C3557] transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="bg-white rounded-xl border border-[#112239]/10 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#112239]/12 text-sm focus:outline-none focus:border-[#B9915E]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F4EFE6]">
          {(['all', 'published', 'draft'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-white text-[#112239] shadow-xs'
                  : 'text-[#64748B] hover:text-[#112239]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#112239]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#112239]/10 bg-[#FAF8F5] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Area (sq ft)</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#112239]/8 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#64748B]">
                    Loading properties...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-[#64748B]">
                    No properties match your current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#112239]">{p.title}</div>
                      <div className="text-xs text-[#64748B]">
                        {p.developmentName} · {p.listingCategory}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-[#475569]">
                      {p.propertyType}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#475569]">{p.location}</td>
                    <td className="py-3 px-4 text-xs text-right tabular-nums text-[#475569]">
                      {p.areaSqFt.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-right tabular-nums text-[#112239]">
                      {formatINR(p.price, p.listingCategory)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                          p.published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(p)}
                          title={p.published ? 'Unpublish listing' : 'Publish listing'}
                          aria-label={p.published ? `Unpublish ${p.title}` : `Publish ${p.title}`}
                          className="p-2 rounded-lg border border-[#112239]/10 text-[#475569] hover:text-[#112239] hover:bg-[#FAF8F5] cursor-pointer"
                        >
                          {p.published ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          title="Edit property"
                          aria-label={`Edit ${p.title}`}
                          className="p-2 rounded-lg border border-[#112239]/10 text-[#475569] hover:text-[#112239] hover:bg-[#FAF8F5] cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          title="Delete property"
                          aria-label={`Delete ${p.title}`}
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Property Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-[#112239]/15 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#112239]/10">
              <h2 className="text-lg font-bold text-[#112239]">
                {editingId ? 'Edit Property Listing' : 'Create Property Listing'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="p-2 rounded-lg hover:bg-[#FAF8F5] text-[#64748B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Vadra Crest Sky Villa"
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Development / Township Name
                  </label>
                  <input
                    type="text"
                    value={form.developmentName}
                    onChange={(e) => setForm({ ...form, developmentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Category
                  </label>
                  <select
                    value={form.listingCategory}
                    onChange={(e) =>
                      setForm({ ...form, listingCategory: e.target.value as ListingCategory })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm bg-white"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Property Type
                  </label>
                  <select
                    value={form.propertyType}
                    onChange={(e) =>
                      setForm({ ...form, propertyType: e.target.value as PropertyType })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm bg-white"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    value={form.areaSqFt}
                    onChange={(e) => setForm({ ...form, areaSqFt: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={form.bedrooms}
                    onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={form.bathrooms}
                    onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Construction Status
                  </label>
                  <select
                    value={form.constructionStatus}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        constructionStatus: e.target.value as ConstructionStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm bg-white"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="New Launch">New Launch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    RERA Registration ID
                  </label>
                  <input
                    type="text"
                    value={form.reraId}
                    onChange={(e) => setForm({ ...form, reraId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Assigned Advisor
                  </label>
                  <select
                    value={form.agentId}
                    onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm bg-white"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#112239] mb-1">
                  Primary Architectural Image Preset
                </label>
                <select
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm bg-white"
                >
                  {ARCHITECTURAL_GALLERY_PRESETS.map((preset) => (
                    <option key={preset.url} value={preset.url}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#112239] mb-1">
                  Summary Tagline
                </label>
                <input
                  type="text"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Concise 1-sentence highlight..."
                  className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#112239] mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#112239] mb-1">
                  Key Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#112239] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="rounded accent-[#112239]"
                  />
                  <span>Publish immediately on public website</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#112239] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded accent-[#112239]"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#112239]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#112239]/15 text-xs font-semibold text-[#475569] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#112239] text-white text-xs font-semibold hover:bg-[#1C3557] disabled:opacity-60 cursor-pointer"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
