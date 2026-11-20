import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../types/realestate';

type FaqCategory = 'All' | 'Buying & RERA' | 'Finance & Loans' | 'Visits & NRI';

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'All'>;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-rera',
    category: 'Buying & RERA',
    question: 'Are all Vadra Developer projects registered under West Bengal RERA?',
    answer:
      'Yes. Every residential township, villa enclave, and commercial development by Vadra Developer in Durgapur (PIN 713217) carries full WBRERA registration, sanctioned municipal plans, and clear freehold land titles. Complete legal dossiers are shared prior to booking.',
  },
  {
    id: 'faq-loans',
    category: 'Finance & Loans',
    question: 'Which banks provide pre-approved home loans for Vadra Developer properties?',
    answer:
      'Our developments are pre-approved by State Bank of India (SBI), HDFC Bank, ICICI Bank, and Axis Bank. Our in-house financial desk coordinates property valuation, legal scrutiny reports, and milestone-linked disbursement directly with your chosen lender.',
  },
  {
    id: 'faq-visit',
    category: 'Visits & NRI',
    question: 'How can I schedule a guided site visit in Durgapur?',
    answer:
      'You can request a private site tour directly on any property page, submit a message through our Contact page, or message our Durgapur advisory desk on WhatsApp at +91 83889 22869. Visits operate 7 days a week between 9:30 AM and 7:00 PM IST.',
  },
  {
    id: 'faq-payment',
    category: 'Finance & Loans',
    question: 'Are payment schedules construction-linked, and are there hidden charges?',
    answer:
      'All under-construction residences follow transparent construction-linked payment schedules aligned with WBRERA escrow guidelines. Before allotment, you receive an itemized, all-inclusive cost sheet detailing carpet area, GST, stamp duty estimates, and club/parking provisions.',
  },
  {
    id: 'faq-nri',
    category: 'Visits & NRI',
    question: 'Can NRIs and outstation buyers purchase and register a residence remotely?',
    answer:
      'Yes. Our dedicated NRI & Institutional Desk facilitates live architectural video walkthroughs, NRE/NRO payment structuring in compliance with FEMA regulations, and Power of Attorney coordination for seamless registration in Durgapur.',
  },
  {
    id: 'faq-warranty',
    category: 'Buying & RERA',
    question: 'What structural warranty and post-handover maintenance support are provided?',
    answer:
      'Every Vadra residence includes the statutory 5-year structural defect liability warranty alongside a professionally managed facility team overseeing 24/7 security, DG power backup, landscaping, and water treatment across the enclave.',
  },
];

interface FaqSectionProps {
  surface?: 'white' | 'alabaster';
}

export function FaqSection({ surface = 'alabaster' }: FaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('All');
  const [openId, setOpenId] = useState<string>(FAQ_ITEMS[0].id);

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const bgClass =
    surface === 'white'
      ? 'bg-white border-t border-[#112239]/8'
      : 'bg-[#FAF8F5] border-t border-[#112239]/8';

  const cardBgClass = surface === 'white' ? 'bg-[#FAF8F5]' : 'bg-white';

  return (
    <section id="faq" className={`py-16 lg:py-20 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Header & Advisory CTA */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
              Buyer &amp; Investor Clarity
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#112239] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Clear answers on WBRERA compliance, home loan approvals, NRI acquisitions, and site
              visits across our Durgapur developments.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#F2ECE2] w-fit">
              {(['All', 'Buying & RERA', 'Finance & Loans', 'Visits & NRI'] as const).map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category);
                      const first =
                        category === 'All'
                          ? FAQ_ITEMS[0]
                          : FAQ_ITEMS.find((i) => i.category === category);
                      if (first) setOpenId(first.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      activeCategory === category
                        ? 'bg-white text-[#112239] shadow-xs'
                        : 'text-[#64748B] hover:text-[#112239]'
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={getWhatsAppUrl(
                  'Hello Vadra Developer, I have a question regarding your Durgapur developments.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#112239] text-white text-xs font-semibold hover:bg-[#1C3557] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#C59B65]" aria-hidden="true" />
                <span>Ask on WhatsApp</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#112239] hover:text-[#8A6B43] transition-colors whitespace-nowrap"
              >
                <span>Contact Sales Desk</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Accordion Stack */}
          <div className="lg:col-span-7 space-y-3">
            {filteredFaqs.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`${cardBgClass} rounded-2xl border transition-colors ${
                    isOpen ? 'border-[#B9915E]/60' : 'border-[#112239]/10'
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? '' : item.id)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A6B43] block">
                        {item.category}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#112239] block leading-snug">
                        {item.question}
                      </span>
                    </div>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#112239] text-white rotate-180'
                          : 'bg-[#F2E9DB] text-[#112239]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-3.5 text-sm text-[#475569] leading-relaxed border-t border-[#112239]/6 mt-1">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
