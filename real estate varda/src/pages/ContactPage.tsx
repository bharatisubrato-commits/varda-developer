import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from 'lucide-react';
import { submitContactForm } from '../services/api';
import { COMPANY_INFO, getWhatsAppUrl } from '../types/realestate';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Property Purchase Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Interactive Map Landmark Focus
  const [selectedLandmark, setSelectedLandmark] = useState<string>('hq');

  const landmarks = [
    {
      id: 'hq',
      label: 'Vadra Developer HQ',
      detail: 'Sector II, City Centre, Durgapur · PIN 713217',
      distance: 'Corporate Office',
      x: '52%',
      y: '46%',
    },
    {
      id: 'bidhan',
      label: 'Bidhannagar Enclave',
      detail: 'Vadra Crest Enclave & Serviced Residences',
      distance: '6 mins drive',
      x: '28%',
      y: '34%',
    },
    {
      id: 'nh19',
      label: 'NH-19 Business Corridor',
      detail: 'Vadra One Exchange Plaza · Muchipara',
      distance: '9 mins drive',
      x: '78%',
      y: '28%',
    },
    {
      id: 'station',
      label: 'Durgapur Railway Station',
      detail: 'Direct express rail connectivity to Howrah',
      distance: '12 mins drive',
      x: '68%',
      y: '74%',
    },
  ];

  const activeLandmark = landmarks.find((l) => l.id === selectedLandmark) || landmarks[0];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (message.trim().length < 8) {
      setError('Please enter a brief message (at least 8 characters).');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactForm({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject,
        message: message.trim(),
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send message.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#FAF8F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
            Contact &amp; Corporate Office
          </p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-[#112239] tracking-tight">
            Visit Our Durgapur Headquarters
          </h1>
          <p className="mt-3 text-base text-[#475569] leading-relaxed">
            Schedule an architectural consultation, request project dossiers, or connect with our
            relationship team directly via WhatsApp.
          </p>
        </div>

        {/* Contact Grid: Form + Office Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#112239]/10 p-6 sm:p-9">
            <h2 className="text-xl font-bold text-[#112239] mb-1">Send Us a Message</h2>
            <p className="text-sm text-[#64748B] mb-6">
              All inquiries are routed directly to our Durgapur executive desk.
            </p>

            {submitted ? (
              <div className="rounded-2xl bg-[#F4EFE6] border border-[#B9915E]/30 p-6 space-y-3">
                <div className="flex items-center gap-2 text-[#112239] font-bold">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" aria-hidden="true" />
                  <span>Thank You for Reaching Out</span>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Your message has been logged in our system. A Vadra Developer relationship manager
                  will respond within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-[#8A6B43] hover:text-[#112239] cursor-pointer"
                >
                  Submit another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cnt-name"
                      className="block text-xs font-semibold text-[#112239] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="cnt-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cnt-phone"
                      className="block text-xs font-semibold text-[#112239] mb-1.5"
                    >
                      Phone / WhatsApp
                    </label>
                    <input
                      id="cnt-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 83889 22869"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cnt-email"
                      className="block text-xs font-semibold text-[#112239] mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="cnt-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cnt-subject"
                      className="block text-xs font-semibold text-[#112239] mb-1.5"
                    >
                      Department
                    </label>
                    <select
                      id="cnt-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] bg-white focus:outline-none focus:border-[#B9915E]"
                    >
                      <option value="Property Purchase Inquiry">Property Purchase Inquiry</option>
                      <option value="Schedule a Site Visit">Schedule a Site Visit</option>
                      <option value="Commercial Leasing">Commercial Leasing</option>
                      <option value="NRI Investment Desk">NRI Investment Desk</option>
                      <option value="Land / Joint Venture Proposal">
                        Land / Joint Venture Proposal
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cnt-message"
                    className="block text-xs font-semibold text-[#112239] mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="cnt-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your requirements, preferred configuration, or timeline..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#112239]/15 text-sm text-[#112239] focus:outline-none focus:border-[#B9915E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 rounded-xl bg-[#112239] text-white text-sm font-semibold hover:bg-[#1C3557] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Office Details & Direct WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#112239]/10 p-6 sm:p-7 space-y-5">
              <h2 className="text-lg font-bold text-[#112239]">Corporate Headquarters</h2>
              <ul className="space-y-4 text-sm text-[#475569]">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B9915E] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-[#112239]">{COMPANY_INFO.name}</div>
                    <div>{COMPANY_INFO.addressLine}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#B9915E] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <a
                      href={`tel:+91${COMPANY_INFO.phoneRaw}`}
                      className="font-semibold text-[#112239] hover:text-[#B9915E] tabular-nums"
                    >
                      {COMPANY_INFO.phoneDisplay}
                    </a>
                    <div className="text-xs text-[#64748B]">Phone &amp; WhatsApp Direct</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#B9915E] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="font-semibold text-[#112239] hover:text-[#B9915E]"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#B9915E] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>{COMPANY_INFO.hours}</div>
                </li>
              </ul>

              <div className="pt-4 border-t border-[#112239]/8">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#112239] text-white text-sm font-semibold hover:bg-[#1C3557] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#C59B65]" aria-hidden="true" />
                  <span>Chat on WhatsApp (+91 83889 22869)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Durgapur PIN 713217 Map Placeholder */}
        <section className="bg-white rounded-2xl border border-[#112239]/10 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#112239]/8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#112239]">
                Durgapur Master-Plan &amp; Office Location Map
              </h2>
              <p className="text-xs text-[#64748B]">
                PIN - 713217 · West Bengal · Click a landmark pin to view distance from HQ
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Durgapur+713217+West+Bengal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FAF8F5] border border-[#112239]/12 text-xs font-semibold text-[#112239] hover:bg-[#F2E9DB] transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#B9915E]" aria-hidden="true" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Architectural Vector Map Surface */}
            <div className="lg:col-span-8 relative h-[340px] sm:h-[380px] bg-[#EDE7DC] overflow-hidden">
              <svg
                viewBox="0 0 800 400"
                className="w-full h-full object-cover"
                aria-label="Schematic map of Durgapur 713217 showing Vadra Developer HQ and developments"
              >
                <rect width="800" height="400" fill="#EFEAE0" />
                {/* Subtle street grid */}
                <g stroke="#DFD7C8" strokeWidth="1.5">
                  <line x1="0" y1="80" x2="800" y2="80" />
                  <line x1="0" y1="180" x2="800" y2="180" />
                  <line x1="0" y1="280" x2="800" y2="280" />
                  <line x1="160" y1="0" x2="160" y2="400" />
                  <line x1="360" y1="0" x2="360" y2="400" />
                  <line x1="560" y1="0" x2="560" y2="400" />
                </g>
                {/* NH-19 Arterial Corridor */}
                <path
                  d="M 0 130 Q 280 95 540 120 T 800 90"
                  fill="none"
                  stroke="#C59B65"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                <text x="610" y="75" fill="#8A6B43" fontSize="11" fontWeight="600">
                  NH-19 EXPRESSWAY
                </text>
                {/* City Centre Arterial */}
                <path
                  d="M 120 380 L 420 185 L 700 220"
                  fill="none"
                  stroke="#112239"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  opacity="0.35"
                />
                {/* Green Belts */}
                <ellipse cx="220" cy="240" rx="75" ry="42" fill="#DCE4D5" />
                <ellipse cx="640" cy="270" rx="65" ry="38" fill="#DCE4D5" />
              </svg>

              {/* Interactive Landmark Pins */}
              {landmarks.map((lm) => {
                const isSelected = lm.id === selectedLandmark;
                return (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => setSelectedLandmark(lm.id)}
                    style={{ left: lm.x, top: lm.y }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-transform cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#112239] text-white scale-105 z-10'
                        : 'bg-white text-[#112239] border border-[#112239]/15 hover:scale-105'
                    }`}
                  >
                    {lm.label}
                  </button>
                );
              })}
            </div>

            {/* Landmark Directory Side Panel */}
            <div className="lg:col-span-4 p-6 bg-[#FAF8F5] border-t lg:border-t-0 lg:border-l border-[#112239]/8 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8A6B43]">
                  Selected Location
                </div>
                <h3 className="text-lg font-bold text-[#112239]">{activeLandmark.label}</h3>
                <p className="text-sm text-[#475569]">{activeLandmark.detail}</p>
                <div className="text-xs font-semibold text-[#112239] tabular-nums">
                  {activeLandmark.distance}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#112239]/10">
                <div className="text-xs font-semibold text-[#64748B]">Quick Landmarks</div>
                {landmarks.map((lm) => (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => setSelectedLandmark(lm.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      lm.id === selectedLandmark
                        ? 'bg-[#112239] text-white'
                        : 'bg-white text-[#475569] hover:text-[#112239]'
                    }`}
                  >
                    <span>{lm.label}</span>
                    <span className="opacity-75">{lm.distance}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
