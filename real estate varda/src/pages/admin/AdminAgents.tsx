import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  createAdminAgent,
  deleteAdminAgent,
  fetchAdminAgents,
  updateAdminAgent,
} from '../../services/api';
import type { Agent } from '../../types/realestate';

interface AgentFormState {
  name: string;
  role: string;
  department: Agent['department'];
  email: string;
  phone: string;
  experienceYears: string;
  reraCert: string;
  specialization: string;
  bio: string;
  languagesText: string;
}

const EMPTY_AGENT: AgentFormState = {
  name: '',
  role: 'Senior Relationship Advisor',
  department: 'Residential Sales',
  email: '',
  phone: '8388922869',
  experienceYears: '8',
  reraCert: 'WBRERA/AGT/2026/001',
  specialization: 'Luxury Townships & Villas',
  bio: '',
  languagesText: 'English, Bengali, Hindi',
};

export function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AgentFormState>(EMPTY_AGENT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminAgents()
      .then(setAgents)
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_AGENT);
    setModalOpen(true);
  }

  function openEdit(a: Agent) {
    setEditingId(a.id);
    setForm({
      name: a.name,
      role: a.role,
      department: a.department,
      email: a.email,
      phone: a.phone,
      experienceYears: String(a.experienceYears),
      reraCert: a.reraCert,
      specialization: a.specialization,
      bio: a.bio,
      languagesText: a.languages.join(', '),
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Partial<Agent> = {
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department,
      email: form.email.trim(),
      phone: form.phone.trim(),
      experienceYears: Number(form.experienceYears) || 5,
      reraCert: form.reraCert.trim(),
      specialization: form.specialization.trim(),
      bio: form.bio.trim(),
      languages: form.languagesText
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        const updated = await updateAdminAgent(editingId, payload);
        setAgents((prev) => prev.map((a) => (a.id === editingId ? updated : a)));
      } else {
        const created = await createAdminAgent(payload);
        setAgents((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteAdminAgent(id);
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#112239] tracking-tight">
            Leadership &amp; Advisors
          </h1>
          <p className="text-sm text-[#64748B]">
            Manage RERA-certified property advisors and corporate leadership profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#112239] text-white text-xs font-semibold hover:bg-[#1C3557] transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Advisor</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#112239]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#112239]/10 bg-[#FAF8F5] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-4">Advisor</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Experience</th>
                <th className="py-3 px-4">RERA Reg</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#112239]/8 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#64748B]">
                    Loading advisors...
                  </td>
                </tr>
              ) : (
                agents.map((a) => (
                  <tr key={a.id} className="hover:bg-[#FAF8F5]/70">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#112239]">{a.name}</div>
                      <div className="text-xs text-[#64748B]">{a.role}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#475569]">{a.department}</td>
                    <td className="py-3.5 px-4 text-xs text-[#475569]">
                      <div>{a.email}</div>
                      <div className="tabular-nums text-[#64748B]">+91 {a.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-right tabular-nums text-[#112239]">
                      {a.experienceYears} yrs
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono-tabular text-[#475569]">
                      {a.reraCert}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(a)}
                          aria-label={`Edit ${a.name}`}
                          className="p-2 rounded-lg border border-[#112239]/10 text-[#475569] hover:text-[#112239] cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(a.id)}
                          aria-label={`Delete ${a.name}`}
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

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-[#112239]/15 w-full max-w-xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#112239]/10">
              <h2 className="text-lg font-bold text-[#112239]">
                {editingId ? 'Edit Advisor Profile' : 'Add Advisor Profile'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[#FAF8F5] text-[#64748B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">Role *</label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value as Agent['department'] })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm bg-white"
                  >
                    <option value="Leadership">Leadership</option>
                    <option value="Residential Sales">Residential Sales</option>
                    <option value="Commercial Advisory">Commercial Advisory</option>
                    <option value="NRI Desk">NRI Desk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    RERA Certificate
                  </label>
                  <input
                    type="text"
                    value={form.reraCert}
                    onChange={(e) => setForm({ ...form, reraCert: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#112239] mb-1">
                    Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.languagesText}
                    onChange={(e) => setForm({ ...form, languagesText: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#112239] mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#112239] mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#112239]/15 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-[#112239]/10 flex justify-end gap-3">
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
                  className="px-5 py-2 rounded-xl bg-[#112239] text-white text-xs font-semibold hover:bg-[#1C3557] cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Advisor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
