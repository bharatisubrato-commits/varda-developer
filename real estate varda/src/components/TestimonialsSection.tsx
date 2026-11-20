import { Quote, Star } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  property: string;
  location: string;
  rating: number;
  handoverYear: string;
  quote: string;
}

const CLIENT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Dr. Anirban Mukherjee',
    role: 'Senior Consultant Cardiologist',
    organization: 'Mission Hospital Durgapur',
    property: 'Vadra Imperial Villa',
    location: 'Bidhannagar, Durgapur',
    rating: 5,
    handoverYear: 'Handover 2025',
    quote:
      'Before booking, we were concerned about hidden construction escalations and delayed possession. Vadra Developer shared the complete WBRERA dossier upfront, completed our villa three weeks ahead of schedule, and delivered spotless marble and waterproofing work.',
  },
  {
    id: 'rev-2',
    name: 'Sharmistha & Rajeev Sen',
    role: 'Principal Systems Architect',
    organization: 'London · NRI Homeowner',
    property: 'The Grandeur Skyline Towers',
    location: 'City Centre, Durgapur',
    rating: 5,
    handoverYear: 'Verified Buyer',
    quote:
      'Purchasing a home in West Bengal from the UK seemed daunting until Ananya and the NRI desk stepped in. From live video site inspections to SBI NRE loan coordination and Power of Attorney registration, every milestone arrived with clear documentation.',
  },
  {
    id: 'rev-3',
    name: 'Vikramaditya Roy',
    role: 'Managing Partner',
    organization: 'Eastern Precision Engineering LLP',
    property: 'Vadra One Exchange Plaza',
    location: 'Muchipara, NH-19',
    rating: 5,
    handoverYear: 'Occupied 2024',
    quote:
      'We consolidated two regional offices into a 3,200 sq ft suite at Vadra One Exchange Plaza. Highway visibility on NH-19, 100% redundant DG backup, and dedicated visitor parking improved our client meetings from day one.',
  },
];

interface TestimonialsSectionProps {
  surface?: 'white' | 'alabaster';
}

export function TestimonialsSection({ surface = 'alabaster' }: TestimonialsSectionProps) {
  const sectionBg =
    surface === 'white'
      ? 'bg-white border-t border-[#112239]/8'
      : 'bg-[#FAF8F5] border-t border-[#112239]/8';

  const cardBg = surface === 'white' ? 'bg-[#FAF8F5]' : 'bg-white';

  return (
    <section aria-labelledby="client-reviews-heading" className={`py-16 lg:py-20 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header + Verified Rating Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
              Homeowner &amp; Investor Reviews
            </p>
            <h2
              id="client-reviews-heading"
              className="mt-2 text-2xl sm:text-3xl font-bold text-[#112239] tracking-tight"
            >
              Trusted by Families &amp; Enterprises Across Durgapur
            </h2>
          </div>

          <div className="flex items-center gap-4 text-sm text-[#475569] shrink-0">
            <div className="flex items-center gap-1" aria-label="4.9 out of 5 stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className="w-4 h-4 text-[#B9915E] fill-[#B9915E]"
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="tabular-nums">
              <strong className="text-[#112239]">4.9 / 5.0</strong>
              <span className="mx-1.5 text-[#CBD5E1]" aria-hidden="true">
                ·
              </span>
              <span>420+ Verified Handover Surveys</span>
            </div>
          </div>
        </div>

        {/* 3-Column Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLIENT_REVIEWS.map((review) => {
            const initials = review.name
              .replace(/Dr\.\s*/i, '')
              .split(/\s+/)
              .filter((p) => p !== '&')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <article
                key={review.id}
                className={`${cardBg} rounded-2xl border border-[#112239]/10 p-6 sm:p-7 flex flex-col justify-between gap-6`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1" aria-label={`${review.rating} stars`}>
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 text-[#B9915E] fill-[#B9915E]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-[#64748B] tabular-nums">
                      {review.handoverYear}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#8A6B43]">
                    {review.property} · {review.location}
                  </div>

                  <blockquote className="text-sm text-[#334155] leading-relaxed relative">
                    <Quote
                      className="w-4 h-4 text-[#C59B65]/60 mb-2"
                      aria-hidden="true"
                    />
                    <p>&ldquo;{review.quote}&rdquo;</p>
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-[#112239]/8 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#112239] text-[#C59B65] flex items-center justify-center text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#112239] truncate">{review.name}</div>
                    <div className="text-xs text-[#64748B] truncate">
                      {review.role} · {review.organization}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
