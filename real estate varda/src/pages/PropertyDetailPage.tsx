import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
import { fetchPropertyDetail, submitPropertyInquiry } from '../services/api';
import type { Agent, Inquiry, Property } from '../types/realestate';
import { formatINR, getWhatsAppUrl } from '../types/realestate';
import { useSavedProperties } from '../hooks/useSavedProperties';
import { ImageWithFallback } from '../components/ImageWithFallback';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isSaved, toggleSaved } = useSavedProperties();

  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Inquiry form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visitType, setVisitType] = useState<Inquiry['visitType']>('Site Visit');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);
    setActiveImageIdx(0);

    fetchPropertyDetail(id)
      .then((res) => {
        if (active) {
          setProperty(res.property);
          setAgent(res.agent);
        }
      })
      .catch((err: Error) => {
        if (active) setError(err.message || 'Property could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleInquirySubmit(e: FormEvent) {
    e.preventDefault();
    if (!property) return;
    setSubmitError(null);

    if (name.trim().length < 2) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setSubmitError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      await submitPropertyInquiry({
        propertyId: property.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        visitType,
        message: message.trim() || `Interested in ${property.title} (${property.location}).`,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 animate-pulse">
        <div className="h-6 w-40 bg-[#EDE6DA] rounded" />
        <div className="h-[440px] bg-[#EDE6DA] rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-[#EDE6DA] rounded-2xl" />
          <div className="h-64 bg-[#EDE6DA] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#112239]">Property Not Found</h1>
        <p className="text-sm text-[#64748B]">
          {error || 'This development may have been sold out or removed.'}
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#112239] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Properties</span>
        </Link>
      </div>
    );
  }

  const images =
    property.images.length > 0
      ? property.images
      : ['/src/assets/images/tower_skyline_residences_1794943289945.jpg'];
  const currentImg = images[activeImageIdx] || images[0];
  const saved = isSaved(property.id);

  return (
    <div className="bg-[#FAF8F5] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#475569] hover:text-[#112239] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Properties</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleSaved(property.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                saved
                  ? 'bg-[#B9915E] text-white border-[#B9915E]'
                  : 'bg-white text-[#112239] border-[#112239]/15 hover:border-[#B9915E]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
              <span>{saved ? 'Saved' : 'Save Property'}</span>
            </button>

            <a
              href={getWhatsAppUrl(
                `Hello Vadra Developer, I would like details and a floor plan for ${property.title} (${property.location}).`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#112239] text-white text-xs font-semibold hover:bg-[#1C3557] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#C59B65]" aria-hidden="true" />
              <span>WhatsApp Advisor</span>
            </a>
          </div>
        </div>

        {/* Title & Pricing Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A6B43] font-semibold">
              <span>{property.developmentName}</span>
              <span aria-hidden="true">·</span>
              <span>{property.propertyType}</span>
              <span aria-hidden="true">·</span>
              <span>{property.constructionStatus}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#112239] tracking-tight">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-[#64748B]">
              <MapPin className="w-4 h-4 text-[#B9915E] shrink-0" aria-hidden="true" />
              <span>
                {property.address}, {property.city} - {property.pinCode}, West Bengal
              </span>
            </p>
          </div>

          <div className="lg:text-right">
            <div className="text-xs text-[#64748B] font-medium">{property.listingCategory}</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#112239] tabular-nums">
              {formatINR(property.price, property.listingCategory)}
            </div>
          </div>
        </div>

        {/* Interactive Multi-Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 relative rounded-2xl overflow-hidden bg-[#EDE6DA] aspect-[16/9] group">
            <ImageWithFallback
              src={currentImg}
              alt={`${property.title} view ${activeImageIdx + 1}`}
              fallbackTitle={property.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() =>
                    setActiveImageIdx((i) => (i - 1 + images.length) % images.length)
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#112239]/75 text-white flex items-center justify-center hover:bg-[#112239] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => setActiveImageIdx((i) => (i + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#112239]/75 text-white flex items-center justify-center hover:bg-[#112239] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 px-3.5 py-2 rounded-lg bg-[#112239]/85 text-white text-xs font-medium hover:bg-[#112239] transition-colors cursor-pointer"
            >
              View Fullscreen ({activeImageIdx + 1}/{images.length})
            </button>
          </div>

          <div className="lg:col-span-3 grid grid-cols-3 lg:grid-cols-1 gap-3">
            {images.map((imgUrl, idx) => (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative rounded-xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx
                    ? 'border-[#B9915E] opacity-100'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <ImageWithFallback
                  src={imgUrl}
                  alt={`${property.title} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content + Sticky Inquiry Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Architectural Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Specification Strip */}
            <div className="bg-white rounded-2xl border border-[#112239]/10 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {property.bedrooms > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <BedDouble className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
                    <span>Configuration</span>
                  </div>
                  <div className="text-base font-bold text-[#112239] tabular-nums">
                    {property.bedrooms} Bedrooms
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <Bath className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
                    <span>Bathrooms</span>
                  </div>
                  <div className="text-base font-bold text-[#112239] tabular-nums">
                    {property.bathrooms} Baths
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Maximize2 className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
                  <span>Super Built-Up</span>
                </div>
                <div className="text-base font-bold text-[#112239] tabular-nums">
                  {property.areaSqFt.toLocaleString('en-IN')} sq ft
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Car className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
                  <span>Parking Bays</span>
                </div>
                <div className="text-base font-bold text-[#112239] tabular-nums">
                  {property.parkingSpaces} Covered
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-[#112239]/10 p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-[#112239]">Architectural Overview</h2>
              <p className="text-base text-[#475569] leading-relaxed">{property.description}</p>

              <div className="pt-4 border-t border-[#112239]/8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2.5 text-[#475569]">
                  <ShieldCheck className="w-4 h-4 text-[#B9915E] shrink-0" aria-hidden="true" />
                  <span>
                    RERA ID:{' '}
                    <strong className="font-mono-tabular text-[#112239]">{property.reraId}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-[#475569]">
                  <Calendar className="w-4 h-4 text-[#B9915E] shrink-0" aria-hidden="true" />
                  <span>
                    Possession:{' '}
                    <strong className="text-[#112239]">{property.possessionDate}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Key Features & Amenities */}
            <div className="bg-white rounded-2xl border border-[#112239]/10 p-6 sm:p-8 space-y-5">
              <h2 className="text-xl font-bold text-[#112239]">Key Features &amp; Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {property.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#112239]/6 text-sm text-[#112239]"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#EADBC5] text-[#112239] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Relationship Advisor */}
            {agent && (
              <div className="bg-white rounded-2xl border border-[#112239]/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#8A6B43]">
                    Dedicated Project Advisor
                  </p>
                  <h3 className="text-lg font-bold text-[#112239]">{agent.name}</h3>
                  <p className="text-sm text-[#475569]">{agent.role}</p>
                  <p className="text-xs text-[#64748B]">
                    {agent.experienceYears} yrs experience · {agent.reraCert}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:+91${agent.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#112239]/15 text-xs font-semibold text-[#112239] hover:border-[#B9915E] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B9915E]" aria-hidden="true" />
                    <span className="tabular-nums">+91 {agent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#112239]/10 text-xs font-semibold text-[#112239] hover:bg-[#F2E9DB] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#B9915E]" aria-hidden="true" />
                    <span>Email Advisor</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Inquiry Form */}
          <aside className="lg:col-span-4 bg-white rounded-2xl border border-[#112239]/10 p-6 sm:p-7 space-y-5 lg:sticky lg:top-24">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#8A6B43]">
                Request Dossier or Tour
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#112239]">Inquire About This Unit</h2>
              <p className="mt-1 text-xs text-[#64748B]">
                Submit your preferences for floor plans, payment schedules, or a chauffeur-assisted
                site visit in Durgapur.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-xl bg-[#F4EFE6] border border-[#B9915E]/30 p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#112239] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" aria-hidden="true" />
                  <span>Inquiry Submitted Successfully</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Our Durgapur sales desk has logged your request for{' '}
                  <strong>{property.title}</strong> and will reach out shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-[#8A6B43] hover:text-[#112239] cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                {submitError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {submitError}
                  </div>
                )}

                <div>
                  <label htmlFor="inq-name" className="block text-xs font-semibold text-[#112239] mb-1">
                    Full Name
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Subrato Bharati"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
                  />
                </div>

                <div>
                  <label htmlFor="inq-email" className="block text-xs font-semibold text-[#112239] mb-1">
                    Email Address
                  </label>
                  <input
                    id="inq-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
                  />
                </div>

                <div>
                  <label htmlFor="inq-phone" className="block text-xs font-semibold text-[#112239] mb-1">
                    Mobile / WhatsApp Number
                  </label>
                  <input
                    id="inq-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98300 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
                  />
                </div>

                <div>
                  <label htmlFor="inq-type" className="block text-xs font-semibold text-[#112239] mb-1">
                    Request Type
                  </label>
                  <select
                    id="inq-type"
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value as Inquiry['visitType'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] bg-white focus:outline-none focus:border-[#B9915E]"
                  >
                    <option value="Site Visit">Private Site Visit</option>
                    <option value="Floor Plan & Brochure">Floor Plan &amp; Brochure</option>
                    <option value="Price Quotation">All-Inclusive Cost Sheet</option>
                    <option value="Virtual Tour">Video Walkthrough</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inq-msg" className="block text-xs font-semibold text-[#112239] mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="inq-msg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Preferred date, floor preference, or financing questions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[#112239] text-white text-sm font-semibold hover:bg-[#1C3557] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-[#112239]/8 text-center">
              <a
                href={getWhatsAppUrl(
                  `Hi Vadra Developer, I'm interested in ${property.title} (${formatINR(
                    property.price,
                    property.listingCategory
                  )}). Please share availability.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#8A6B43] hover:text-[#112239] transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Or chat directly on WhatsApp (+91 83889 22869)</span>
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Property image lightbox"
        >
          <button
            type="button"
            aria-label="Close fullscreen view"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous fullscreen image"
                onClick={() =>
                  setActiveImageIdx((i) => (i - 1 + images.length) % images.length)
                }
                className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                aria-label="Next fullscreen image"
                onClick={() => setActiveImageIdx((i) => (i + 1) % images.length)}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-5xl w-full max-h-[85vh] overflow-hidden rounded-xl">
            <ImageWithFallback
              src={currentImg}
              alt={`${property.title} fullscreen view`}
              className="w-full h-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
