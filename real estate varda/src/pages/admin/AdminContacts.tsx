import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  deleteAdminContact,
  fetchAdminContacts,
  updateAdminContactStatus,
} from '../../services/api';
import type { ContactStatus, ContactSubmission } from '../../types/realestate';

export function AdminContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | ContactStatus>('All');

  useEffect(() => {
    fetchAdminContacts()
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, status: ContactStatus) {
    const updated = await updateAdminContactStatus(id, status);
    setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  async function handleDelete(id: string) {
    await deleteAdminContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  const filtered =
    statusFilter === 'All'
      ? contacts
      : contacts.filter((c) => c.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#112239] tracking-tight">Contact Messages</h1>
          <p className="text-sm text-[#64748B]">
            Review general contact form submissions, corporate leasing, and NRI requests.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F4EFE6]">
          {(['All', 'New', 'Reviewed', 'Resolved'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-[#112239] shadow-xs'
                  : 'text-[#64748B] hover:text-[#112239]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-[#112239]/10 p-8 text-center text-xs text-[#64748B]">
            Loading contact submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#112239]/10 p-10 text-center text-sm text-[#64748B]">
            No contact messages in this status.
          </div>
        ) : (
          filtered.map((cnt) => (
            <article
              key={cnt.id}
              className="bg-white rounded-xl border border-[#112239]/10 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A6B43] font-semibold">
                  <span>{cnt.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums text-[#64748B]">
                    {new Date(cnt.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-base font-bold text-[#112239]">{cnt.name}</div>
                <div className="text-xs text-[#475569] tabular-nums">
                  {cnt.email} · {cnt.phone}
                </div>
                <p className="text-sm text-[#475569] pt-1 leading-relaxed">{cnt.message}</p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <select
                  value={cnt.status}
                  onChange={(e) => handleStatusChange(cnt.id, e.target.value as ContactStatus)}
                  aria-label={`Update status for ${cnt.name}`}
                  className="px-3 py-2 rounded-lg border border-[#112239]/15 text-xs font-semibold text-[#112239] bg-white cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleDelete(cnt.id)}
                  aria-label={`Delete contact submission from ${cnt.name}`}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
