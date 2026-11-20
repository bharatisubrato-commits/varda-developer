import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Calculator,
  FileCheck2,
  Globe2,
  Landmark,
  PaintBucket,
  Repeat,
} from 'lucide-react';
import { formatINR, getWhatsAppUrl } from '../types/realestate';
import { FaqSection } from '../components/FaqSection';

export function ServicesPage() {
  // Interactive Home Loan EMI Calculator State
  const [loanAmountLakhs, setLoanAmountLakhs] = useState(85);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const emiStats = useMemo(() => {
    const principal = loanAmountLakhs * 100000;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureYears * 12;

    if (monthlyRate === 0) {
      const emi = Math.round(principal / months);
      return { emi, totalInterest: 0, totalPayable: principal };
    }

    const factor = Math.pow(1 + monthlyRate, months);
    const emi = Math.round((principal * monthlyRate * factor) / (factor - 1));
    const totalPayable = emi * months;
    const totalInterest = totalPayable - principal;

    return { emi, totalInterest, totalPayable };
  }, [loanAmountLakhs, interestRate, tenureYears]);

  const services = [
    {
      num: '01.',
      icon: FileCheck2,
      title: 'Buyer Advisory & RERA Due Diligence',
      description:
        'Complete legal title verification, West Bengal RERA registration walkthroughs, sanctioned floor plans, and allotment documentation handled in-house.',
    },
    {
      num: '02.',
      icon: Landmark,
      title: 'Home Loan & Financial Structuring',
      description:
        'Pre-approved project tie-ups with SBI, HDFC, ICICI, and Axis Bank ensuring rapid sanction letters and transparent milestone-linked disbursements.',
    },
    {
      num: '03.',
      icon: Globe2,
      title: 'NRI & Overseas Investor Desk',
      description:
        'End-to-end FEMA/RBI compliance guidance, virtual walkthroughs, power-of-attorney coordination, and dedicated asset care for global Indian buyers.',
    },
    {
      num: '04.',
      icon: Repeat,
      title: 'Resale & Corporate Leasing Desk',
      description:
        'Institutional resale facilitation and long-term corporate tenancy management for industrial executives and medical professionals across Durgapur.',
    },
    {
      num: '05.',
      icon: PaintBucket,
      title: 'Turnkey Interior & Custom Fit-Outs',
      description:
        'In-house architectural studio offering modular kitchens, wardrobe systems, and Vastu-aligned interior customization prior to handover.',
    },
    {
      num: '06.',
      icon: Building2,
      title: 'Commercial & Joint Venture Development',
      description:
        'Strategic land acquisition, joint-development partnerships, and build-to-suit commercial floors along the NH-19 economic corridor.',
    },
  ];

  return (
    <div className="bg-[#FAF8F5]">
      {/* Header */}
      <section className="py-14 lg:py-20 border-b border-[#112239]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
            Advisory &amp; Lifecycle Services
          </p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-[#112239] tracking-tight max-w-3xl">
            Comprehensive Support for Buyers, Sellers &amp; Institutional Investors
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#475569] max-w-2xl leading-relaxed">
            From your first site visit in Durgapur to registration, home-loan disbursement, and
            post-handover estate management, Vadra Developer acts as a single accountable partner.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white border-b border-[#112239]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <article
                  key={svc.title}
                  className="p-7 rounded-2xl bg-[#FAF8F5] border border-[#112239]/8 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-11 h-11 rounded-full bg-[#EADBC5] text-[#112239] flex items-center justify-center">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono-tabular text-xs font-semibold text-[#8A6B43]">
                        {svc.num}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#112239]">{svc.title}</h2>
                    <p className="text-sm text-[#475569] leading-relaxed">{svc.description}</p>
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#112239] hover:text-[#8A6B43] transition-colors"
                  >
                    <span>Request Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Home Loan EMI Calculator */}
      <section className="py-16 lg:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#112239]/10 p-7 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2.5 text-[#8A6B43] text-xs font-semibold tracking-wider uppercase">
                <Calculator className="w-4 h-4" aria-hidden="true" />
                <span>Financial Planning Tool</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#112239]">
                Home Loan EMI Estimator
              </h2>
              <p className="text-sm text-[#64748B]">
                Estimate your monthly installment across approved partner banks for Vadra Developer
                residences.
              </p>

              <div className="space-y-5 pt-2">
                <div>
                  <div className="flex justify-between text-sm font-semibold text-[#112239] mb-2">
                    <label htmlFor="emi-principal">Loan Amount</label>
                    <span className="tabular-nums text-[#8A6B43]">
                      {formatINR(loanAmountLakhs * 100000)}
                    </span>
                  </div>
                  <input
                    id="emi-principal"
                    type="range"
                    min={20}
                    max={450}
                    step={5}
                    value={loanAmountLakhs}
                    onChange={(e) => setLoanAmountLakhs(Number(e.target.value))}
                    className="w-full accent-[#112239] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold text-[#112239] mb-2">
                    <label htmlFor="emi-rate">Interest Rate (% p.a.)</label>
                    <span className="tabular-nums text-[#8A6B43]">{interestRate.toFixed(2)}%</span>
                  </div>
                  <input
                    id="emi-rate"
                    type="range"
                    min={7}
                    max={12}
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-[#112239] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold text-[#112239] mb-2">
                    <label htmlFor="emi-tenure">Loan Tenure</label>
                    <span className="tabular-nums text-[#8A6B43]">{tenureYears} Years</span>
                  </div>
                  <input
                    id="emi-tenure"
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full accent-[#112239] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#112239] text-white rounded-2xl p-7 sm:p-8 space-y-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#C59B65] font-semibold">
                  Estimated Monthly EMI
                </div>
                <div className="mt-2 text-3xl sm:text-4xl font-bold tabular-nums">
                  ₹ {emiStats.emi.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/15 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Principal Amount</span>
                  <span className="font-semibold tabular-nums">
                    {formatINR(loanAmountLakhs * 100000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Interest Payable</span>
                  <span className="font-semibold tabular-nums">
                    {formatINR(emiStats.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-slate-200 font-medium">Total Repayment</span>
                  <span className="font-bold text-[#C59B65] tabular-nums">
                    {formatINR(emiStats.totalPayable)}
                  </span>
                </div>
              </div>

              <a
                href={getWhatsAppUrl(
                  `Hello Vadra Developer, I would like home loan assistance for an estimated loan of ${formatINR(
                    loanAmountLakhs * 100000
                  )}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#C59B65] text-[#112239] text-sm font-bold hover:bg-[#D4AE7C] transition-colors"
              >
                <span>Speak With Our Loan Desk</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <FaqSection surface="white" />
    </div>
  );
}
