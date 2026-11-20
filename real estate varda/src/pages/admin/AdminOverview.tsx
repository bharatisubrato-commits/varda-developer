import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Inbox, Mail, Users } from 'lucide-react';
import { fetchAdminStats } from '../../services/api';
import type { AdminStats, ContactSubmission, Inquiry } from '../../types/realestate';

export function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchAdminStats()
      .then((res) => {
        if (active) {
          setStats(res.stats);
          setRecentInquiries(res.recentInquiries);
          setRecentContacts(res.recentContacts);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-white rounded-xl border border-[#112239]/8" />
          ))}
        </div>
        <div className="h-72 bg-white rounded-xl border border-[#112239]/8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#112239] tracking-tight">
            Executive Portfolio Overview
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Live inventory, advisory team, and incoming buyer inquiries for Vadra Developer.
          </p>
        </div>

        <Link
          to="/admin/properties"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#112239] text-white text-xs font-semibold hover:bg-[#1C3557] transition-colors whitespace-nowrap"
        >
          <span>Manage Listings</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-[#112239]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Properties</span>
            <Building2 className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
          </div>
          <div className="text-3xl font-bold text-[#112239] tabular-nums">
            {stats.totalProperties}
          </div>
          <div className="text-xs text-[#475569] tabular-nums">
            {stats.publishedProperties} published · {stats.draftProperties} draft
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#112239]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Property Inquiries</span>
            <Inbox className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
          </div>
          <div className="text-3xl font-bold text-[#112239] tabular-nums">
            {stats.totalInquiries}
          </div>
          <div className="text-xs text-[#475569] tabular-nums">
            {stats.newInquiries} awaiting response
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#112239]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Contact Messages</span>
            <Mail className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
          </div>
          <div className="text-3xl font-bold text-[#112239] tabular-nums">
            {stats.totalContacts}
          </div>
          <div className="text-xs text-[#475569] tabular-nums">
            {stats.newContacts} new messages
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#112239]/10 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Advisory Team</span>
            <Users className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
          </div>
          <div className="text-3xl font-bold text-[#112239] tabular-nums">
            {stats.totalAgents}
          </div>
          <div className="text-xs text-[#475569]">Active RERA-certified advisors</div>
        </div>
      </div>

      {/* Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <section className="bg-white rounded-xl border border-[#112239]/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#112239]/8 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#112239]">Recent Property Inquiries</h2>
            <Link
              to="/admin/inquiries"
              className="text-xs font-semibold text-[#8A6B43] hover:text-[#112239]"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-[#112239]/8">
            {recentInquiries.length === 0 ? (
              <div className="p-6 text-xs text-[#64748B]">No inquiries received yet.</div>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#112239] truncate">{inq.name}</div>
                    <div className="text-xs text-[#64748B] truncate">
                      {inq.propertyTitle} · {inq.visitType}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#112239]/10 text-[#112239] shrink-0">
                    {inq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Contact Submissions */}
        <section className="bg-white rounded-xl border border-[#112239]/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#112239]/8 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#112239]">Recent Contact Submissions</h2>
            <Link
              to="/admin/contacts"
              className="text-xs font-semibold text-[#8A6B43] hover:text-[#112239]"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-[#112239]/8">
            {recentContacts.length === 0 ? (
              <div className="p-6 text-xs text-[#64748B]">No contact submissions yet.</div>
            ) : (
              recentContacts.map((cnt) => (
                <div key={cnt.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#112239] truncate">{cnt.name}</div>
                    <div className="text-xs text-[#64748B] truncate">{cnt.subject}</div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#112239]/10 text-[#112239] shrink-0">
                    {cnt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
