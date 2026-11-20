import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Building2, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { fetchAgents } from '../services/api';
import type { Agent } from '../types/realestate';
import { getWhatsAppUrl } from '../types/realestate';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { TestimonialsSection } from '../components/TestimonialsSection';

export function AboutPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchAgents()
      .then((list) => {
        if (active) setAgents(list);
      })
      .catch(() => {
        if (active) setAgents([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const milestones = [
    {
      year: '2008',
      title: 'Foundation in Durgapur',
      detail: 'Established our civil engineering and residential development practice in Sector II, Bidhannagar.',
    },
    {
      year: '2014',
      title: 'First Integrated Township',
      detail: 'Delivered Vadra Green Meadows spanning 14 acres with dedicated clubhouse and rainwater harvesting.',
    },
    {
      year: '2020',
      title: 'Commercial Corridor Expansion',
      detail: 'Launched Grade-A corporate workspaces along the NH-19 Muchipara industrial belt.',
    },
    {
      year: '2026',
      title: 'Vadra Grandeur Skyline',
      detail: 'Delivering 22-storey IGBC Gold-certified luxury residences and sky penthouses in City Centre.',
    },
  ];

  return (
    <div className="bg-[#FAF8F5]">
      {/* Corporate Story Header */}
      <section className="py-14 lg:py-20 border-b border-[#112239]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
              About Vadra Developer
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#112239] tracking-tight leading-tight">
              Institutional Engineering.{' '}
              <span className="font-serif-editorial italic font-semibold text-[#B9915E]">
                Rooted in Durgapur.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              Inspired by the governance standards of India’s premier infrastructure houses, Vadra
              Developer brings structured urban master-planning, zero-compromise structural safety,
              and timeless architectural proportions to West Bengal.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#112239]/10">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#112239] tabular-nums">
                  6.2M+
                </div>
                <div className="text-xs text-[#64748B] mt-1">Sq. Ft. Delivered &amp; Ongoing</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#112239] tabular-nums">
                  100%
                </div>
                <div className="text-xs text-[#64748B] mt-1">WBRERA Compliance</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#112239] tabular-nums">
                  18+
                </div>
                <div className="text-xs text-[#64748B] mt-1">Years Legacy</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-[#EDE6DA] min-h-[300px]">
            <ImageWithFallback
              src="/src/assets/images/commercial_business_plaza_1794943292323.jpg"
              alt="Vadra Developer corporate headquarters and commercial plaza"
              fallbackTitle="Vadra Corporate Plaza"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Institutional Pillars */}
      <section className="py-16 bg-white border-b border-[#112239]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
              Development Philosophy
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#112239]">
              Built for Multi-Generational Value
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#112239]/8 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EADBC5] text-[#112239] flex items-center justify-center">
                <Building2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#112239]">01. Structural Integrity</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Every slab and foundation undergoes third-party NABL lab cube testing, Zone-III
                seismic framing, and double-coat waterproofing protocols.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#112239]/8 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EADBC5] text-[#112239] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#112239]">02. Transparent Governance</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Clear freehold land titles, RERA-escrowed construction funds, and standardized
                all-inclusive cost sheets with zero hidden escalations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#112239]/8 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EADBC5] text-[#112239] flex items-center justify-center">
                <Award className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#112239]">03. Sustainable Master-Planning</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Minimum 65% open landscaped cover, solar-powered common utilities, EV-ready parking,
                and rainwater recharge wells across all enclaves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Milestones */}
      <section className="py-16 bg-[#F4EFE6] border-b border-[#112239]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#112239] mb-8">
            Our Journey Across West Bengal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((item) => (
              <div
                key={item.year}
                className="bg-white rounded-2xl border border-[#112239]/8 p-6 space-y-2.5"
              >
                <div className="font-mono-tabular text-sm font-bold text-[#B9915E]">
                  {item.year}
                </div>
                <h3 className="text-base font-bold text-[#112239]">{item.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Advisory Team Directory */}
      <section className="py-16 lg:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
                Leadership &amp; Advisors
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#112239]">
                Meet the Vadra Advisory Team
              </h2>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#112239] hover:text-[#8A6B43] transition-colors"
            >
              <span>Connect With an Advisor</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-48 bg-white rounded-2xl border border-[#112239]/8" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map((agent) => {
                const initials = agent.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2);

                return (
                  <article
                    key={agent.id}
                    className="bg-white rounded-2xl border border-[#112239]/10 p-6 sm:p-7 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#112239] text-[#C59B65] flex items-center justify-center text-lg font-bold shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#8A6B43]">
                            {agent.department} · {agent.experienceYears} yrs exp.
                          </div>
                          <h3 className="text-lg font-bold text-[#112239]">{agent.name}</h3>
                          <p className="text-sm text-[#475569]">{agent.role}</p>
                        </div>
                      </div>

                      <p className="text-sm text-[#64748B] leading-relaxed">{agent.bio}</p>

                      <div className="text-xs text-[#475569] space-y-1">
                        <div>
                          <span className="font-semibold text-[#112239]">Focus:</span>{' '}
                          {agent.specialization}
                        </div>
                        <div>
                          <span className="font-semibold text-[#112239]">Languages:</span>{' '}
                          {agent.languages.join(' · ')}
                        </div>
                        <div>
                          <span className="font-semibold text-[#112239]">RERA Reg:</span>{' '}
                          <span className="font-mono-tabular">{agent.reraCert}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#112239]/8 flex flex-wrap items-center gap-3">
                      <a
                        href={`mailto:${agent.email}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#112239] hover:text-[#8A6B43] transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#B9915E]" aria-hidden="true" />
                        <span>{agent.email}</span>
                      </a>
                      <span className="text-[#CBD5E1]" aria-hidden="true">
                        ·
                      </span>
                      <a
                        href={`tel:+91${agent.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#112239] hover:text-[#8A6B43] transition-colors tabular-nums"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#B9915E]" aria-hidden="true" />
                        <span>+91 {agent.phone}</span>
                      </a>
                      <a
                        href={getWhatsAppUrl(`Hello ${agent.name}, I would like to consult regarding a Vadra Developer property.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2E9DB] text-[#112239] text-xs font-semibold hover:bg-[#EADBC5] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#8A6B43]" aria-hidden="true" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Homeowner & Investor Reviews */}
      <TestimonialsSection surface="white" />
    </div>
  );
}
