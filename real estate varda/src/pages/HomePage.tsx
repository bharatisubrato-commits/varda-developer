import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Building,
  CheckCircle2,
  Headphones,
  Home,
  IndianRupee,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { fetchProperties } from '../services/api';
import type { Property } from '../types/realestate';
import { getWhatsAppUrl } from '../types/realestate';
import { useSavedProperties } from '../hooks/useSavedProperties';
import { PropertyCard } from '../components/PropertyCard';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { FaqSection } from '../components/FaqSection';
import { TestimonialsSection } from '../components/TestimonialsSection';

export function HomePage() {
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useSavedProperties();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero Search Bar state
  const [location, setLocation] = useState('All');
  const [propertyType, setPropertyType] = useState('All');
  const [budget, setBudget] = useState('All');

  useEffect(() => {
    let active = true;
    fetchProperties({ featured: true })
      .then((list) => {
        if (active) setFeatured(list.slice(0, 3));
      })
      .catch(() => {
        if (active) setFeatured([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function handleHeroSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location !== 'All') params.set('location', location);
    if (propertyType !== 'All') params.set('type', propertyType);
    if (budget !== 'All') params.set('maxPrice', budget);
    const qs = params.toString();
    navigate(`/properties${qs ? `?${qs}` : ''}`);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#FAF8F5]">
        {/* Architectural Hero Canvas */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
          <div className="relative rounded-3xl overflow-hidden bg-[#F3EFE9] border border-[#112239]/8">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[520px] lg:min-h-[580px]">
              {/* Left Copy Column */}
              <div className="lg:col-span-6 relative z-10 p-7 sm:p-10 lg:p-14 flex flex-col justify-center bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/95 to-[#FAF8F5]/80 lg:to-transparent">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43] mb-4">
                  Durgapur · PIN 713217 · West Bengal
                </p>

                <h1 className="text-[clamp(2.25rem,4vw,3.75rem)] font-bold text-[#112239] leading-[1.08] tracking-tight max-w-xl">
                  Find Your Dream Residence{' '}
                  <span className="font-serif-editorial italic font-semibold text-[#B9915E] block sm:inline">
                    with Vadra
                  </span>
                </h1>

                <p className="mt-5 text-base sm:text-lg text-[#475569] leading-relaxed max-w-lg">
                  Discover master-planned residential townships, luxury villas, and Grade-A
                  commercial landmarks across Durgapur — engineered with institutional precision.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#112239] text-white text-sm font-semibold hover:bg-[#1C3557] transition-colors whitespace-nowrap"
                  >
                    <span>Explore Developments</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#112239]/15 text-[#112239] text-sm font-semibold hover:border-[#B9915E] transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
                    <span>WhatsApp Desk</span>
                  </a>
                </div>
              </div>

              {/* Right Hero Architectural Photo */}
              <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-full">
                <ImageWithFallback
                  src="/src/assets/images/hero_luxury_villa_1794943289766.jpg"
                  alt="Vadra Developer luxury concrete and glass architectural villa at golden hour"
                  fallbackTitle="Vadra Imperial Residences"
                  className="w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/65 to-transparent"
                />
              </div>
            </div>
          </div>

          {/* Integrated Floating Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="relative z-20 -mt-8 mx-3 sm:mx-8 lg:mx-14 bg-white rounded-2xl border border-[#112239]/10 shadow-[0_18px_40px_-15px_rgba(17,34,57,0.16)] p-3 sm:p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-4 px-3 py-1.5 md:border-r border-[#112239]/10">
                <label
                  htmlFor="hero-location"
                  className="flex items-center gap-2 text-xs font-semibold text-[#112239] mb-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#B9915E]" aria-hidden="true" />
                  <span>Location</span>
                </label>
                <select
                  id="hero-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#475569] focus:outline-none cursor-pointer"
                >
                  <option value="All">All Durgapur Micro-Markets</option>
                  <option value="Bidhannagar">Bidhannagar (PIN 713217)</option>
                  <option value="City Centre">City Centre (PIN 713217)</option>
                  <option value="Fuljhore">Fuljhore (PIN 713217)</option>
                  <option value="Benachity">Benachity (PIN 713217)</option>
                  <option value="Muchipara">Muchipara · NH-19</option>
                  <option value="Arrah">Arrah Estate Corridor</option>
                </select>
              </div>

              <div className="md:col-span-3 px-3 py-1.5 md:border-r border-[#112239]/10">
                <label
                  htmlFor="hero-type"
                  className="flex items-center gap-2 text-xs font-semibold text-[#112239] mb-1"
                >
                  <Home className="w-3.5 h-3.5 text-[#B9915E]" aria-hidden="true" />
                  <span>Property Type</span>
                </label>
                <select
                  id="hero-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#475569] focus:outline-none cursor-pointer"
                >
                  <option value="All">Any Type</option>
                  <option value="Villa">Luxury Villa</option>
                  <option value="Apartment">High-Rise Apartment</option>
                  <option value="Bungalow">Executive Bungalow</option>
                  <option value="Penthouse">Sky Penthouse</option>
                  <option value="Commercial">Commercial Plaza</option>
                  <option value="Plot">Freehold Plot</option>
                </select>
              </div>

              <div className="md:col-span-3 px-3 py-1.5">
                <label
                  htmlFor="hero-budget"
                  className="flex items-center gap-2 text-xs font-semibold text-[#112239] mb-1"
                >
                  <IndianRupee className="w-3.5 h-3.5 text-[#B9915E]" aria-hidden="true" />
                  <span>Budget</span>
                </label>
                <select
                  id="hero-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#475569] focus:outline-none cursor-pointer"
                >
                  <option value="All">Any Budget</option>
                  <option value="10000000">Up to ₹ 1 Cr</option>
                  <option value="25000000">Up to ₹ 2.5 Cr</option>
                  <option value="50000000">Up to ₹ 5 Cr</option>
                  <option value="100000">Rentals up to ₹ 1 Lakh/mo</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#112239] text-white text-sm font-semibold hover:bg-[#1C3557] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 4-Column Trust Pillars Band */}
      <section className="bg-[#F4EFE6] border-y border-[#112239]/6 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2.5 px-2">
              <div className="w-12 h-12 rounded-full bg-[#EADBC5] text-[#112239] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#112239]">RERA Registered</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                100% West Bengal RERA-compliant titles with clear legal documentation.
              </p>
            </div>

            <div className="text-center space-y-2.5 px-2">
              <div className="w-12 h-12 rounded-full bg-[#EADBC5] text-[#112239] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#112239]">Trusted &amp; Secure</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Milestone-linked payments, escrow transparency, and major bank approvals.
              </p>
            </div>

            <div className="text-center space-y-2.5 px-2">
              <div className="w-12 h-12 rounded-full bg-[#EADBC5] text-[#112239] flex items-center justify-center mx-auto">
                <Headphones className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#112239]">Dedicated Advisory</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                End-to-end site visits, home loan structuring, and registry assistance.
              </p>
            </div>

            <div className="text-center space-y-2.5 px-2">
              <div className="w-12 h-12 rounded-full bg-[#EADBC5] text-[#112239] flex items-center justify-center mx-auto">
                <Building className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#112239]">Durgapur Landmarks</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Prime corridors across Bidhannagar, City Centre, and NH-19.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 lg:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
                Featured Developments
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#112239] tracking-tight">
                Handpicked Residences for You
              </h2>
            </div>

            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#112239] hover:text-[#8A6B43] transition-colors whitespace-nowrap"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl border border-[#112239]/8 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-[#EDE6DA]" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-1/3 bg-[#EDE6DA] rounded" />
                    <div className="h-5 w-2/3 bg-[#EDE6DA] rounded" />
                    <div className="h-3 w-1/2 bg-[#EDE6DA] rounded" />
                    <div className="h-6 w-1/3 bg-[#EDE6DA] rounded pt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#112239]/10 p-10 text-center">
              <p className="text-sm text-[#64748B] mb-4">
                Featured developments are currently being updated.
              </p>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#112239] text-white text-xs font-semibold"
              >
                Browse Full Portfolio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  saved={isSaved(property.id)}
                  onToggleSave={toggleSaved}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Vadra Developer Split Showcase */}
      <section className="py-16 lg:py-20 bg-white border-y border-[#112239]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Image Frame */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-[#EDE6DA] min-h-[320px]">
              <ImageWithFallback
                src="/src/assets/images/sunlit_living_interior_1794943290438.jpg"
                alt="Sunlit luxury residence interior crafted by Vadra Developer"
                fallbackTitle="Vadra Interior Craftsmanship"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-[#FAF8F5]/95 backdrop-blur-sm rounded-xl px-4 py-3 border border-[#112239]/10">
                <p className="font-serif-editorial italic text-lg text-[#112239] leading-snug">
                  More Than Just a Home
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  IGBC Green-certified architectural planning in Durgapur
                </p>
              </div>
            </div>

            {/* Right Narrative + Proof Metrics */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
                  Why Choose Vadra Developer
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#112239] tracking-tight">
                  More Than Properties. We Build Generational Landmarks.
                </h2>
                <p className="mt-4 text-base text-[#475569] leading-relaxed">
                  Headquartered in Durgapur (PIN 713217), Vadra Developer delivers large-scale
                  residential enclaves and Grade-A commercial hubs built to national institutional
                  standards — combining seismic engineering, abundant open green cover, and
                  transparent handover timelines.
                </p>
              </div>

              {/* 4-Column Quantitative Proof Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-4 border-t border-[#112239]/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#112239] tabular-nums">
                    18+
                  </div>
                  <div className="text-xs text-[#64748B] mt-1">Years in Bengal</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#112239] tabular-nums">
                    14
                  </div>
                  <div className="text-xs text-[#64748B] mt-1">Delivered Projects</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#112239] tabular-nums">
                    4,500+
                  </div>
                  <div className="text-xs text-[#64748B] mt-1">Happy Families</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#112239] tabular-nums">
                    99.2%
                  </div>
                  <div className="text-xs text-[#64748B] mt-1">On-Time Handover</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#112239] hover:text-[#8A6B43] transition-colors"
                >
                  <span>Meet Our Leadership Team</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <span className="text-[#CBD5E1]" aria-hidden="true">
                  |
                </span>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#112239] transition-colors"
                >
                  <Award className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
                  <span>Buyer &amp; NRI Services</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Reviews & Homeowner Stories */}
      <TestimonialsSection surface="alabaster" />

      {/* Frequently Asked Questions */}
      <FaqSection surface="white" />

      {/* Dark Navy Pre-Footer Call to Action */}
      <section className="py-14 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-[#112239] text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-5 relative z-10">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C59B65]">
                  Ready to Find Your Next Address?
                </p>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                  Let&apos;s Make It Happen in Durgapur
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Speak directly with our Durgapur advisory desk for private site tours, RERA
                  dossiers, and customized payment schedules.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C59B65] text-[#112239] text-sm font-bold hover:bg-[#D4AE7C] transition-colors whitespace-nowrap"
                  >
                    <span>Schedule a Site Visit</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#C59B65]" aria-hidden="true" />
                    <span>WhatsApp +91 83889 22869</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
                <ImageWithFallback
                  src="/src/assets/images/tower_skyline_residences_1794943289945.jpg"
                  alt="Vadra Developer illuminated residential skyline towers"
                  fallbackTitle="Vadra Skyline Towers"
                  className="w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#112239] to-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
