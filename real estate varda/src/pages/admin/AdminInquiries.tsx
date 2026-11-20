import { useEffect, useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import {
  deleteAdminInquiry,
  fetchAdminInquiries,
  updateAdminInquiryStatus,
} from '../../services/api';
import { getWhatsAppUrl, type Inquiry, type InquiryStatus } from '../../types/realestate';

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | InquiryStatus>('All');

  useEffect(() => {
    fetchAdminInquiries()
      .then(setInquiries)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, status: InquiryStatus) {
    const updated = await updateAdminInquiryStatus(id, status);
    setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }

  async function handleDelete(id: string) {
    await deleteAdminInquiry(id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  }

  const filtered =
    statusFilter === 'All'
      ? inquiries
      : inquiries.filter((i) => i.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#112239] tracking-tight">Property Inquiries</h1>
          <p className="text-sm text-[#64748B]">
            Review site visit requests, brochure downloads, and buyer inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#F4EFE6]">
          {(['All', 'New', 'Contacted', 'Site Visit Scheduled', 'Closed'] as const).map((st) => (
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
            Loading property inquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#112239]/10 p-10 text-center text-sm text-[#64748B]">
            No inquiries found in this status.
          </div>
        ) : (
          filtered.map((inq) => (
            <article
              key={inq.id}
              className="bg-white rounded-xl border border-[#112239]/10 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A6B43] font-semibold">
                  <span>{inq.propertyTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{inq.visitType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums text-[#64748B]">
                    {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-base font-bold text-[#112239]">{inq.name}</div>
                <div className="text-xs text-[#475569] tabular-nums">
                  {inq.email} · {inq.phone}
                </div>
                {inq.message && (
                  <p className="text-sm text-[#475569] pt-1 leading-relaxed">{inq.message}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <select
                  value={inq.status}
                  onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                  aria-label={`Update status for ${inq.name}`}
                  className="px-3 py-2 rounded-lg border border-[#112239]/15 text-xs font-semibold text-[#112239] bg-white cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                  <option value="Closed">Closed</option>
                </select>

                <a
                  href={getWhatsAppUrl(
                    `Hello ${inq.name}, following up from Vadra Developer regarding your inquiry on ${inq.propertyTitle}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#112239]/12 text-xs font-semibold text-[#112239] hover:bg-[#F2E9DB]"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#8A6B43]" aria-hidden="true" />
                  <span>Follow Up</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(inq.id)}
                  aria-label={`Delete inquiry from ${inq.name}`}
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
