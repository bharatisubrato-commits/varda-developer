import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { COMPANY_INFO, getWhatsAppUrl } from '../types/realestate';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#112239]/10 text-[#475569]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-[#112239]">
              <span className="w-9 h-9 rounded-lg bg-[#F2E9DB] border border-[#B9915E]/30 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4 text-[#112239]"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 21V13.5H14.5V21"
                    stroke="#B9915E"
                    strokeWidth="1.75"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <div className="text-lg font-bold tracking-tight leading-none">
                  {COMPANY_INFO.name}
                </div>
                <div className="text-[11px] tracking-[0.18em] uppercase text-[#8A6B43] mt-1">
                  {COMPANY_INFO.shortTag}
                </div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-[#64748B] max-w-sm">
              Crafting RERA-registered residential townships, bespoke villas, and Grade-A commercial
              landmarks in Durgapur, West Bengal with institutional engineering rigor.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#112239]">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#112239] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-[#112239] transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#112239] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#112239] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#112239] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-semibold text-[#112239]">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#B9915E] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <a
                    href={`tel:+91${COMPANY_INFO.phoneRaw}`}
                    className="font-medium text-[#112239] hover:text-[#B9915E] transition-colors tabular-nums"
                  >
                    {COMPANY_INFO.phoneDisplay}
                  </a>
                  <span className="text-xs text-[#64748B] block">Direct &amp; WhatsApp Desk</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#B9915E] mt-0.5 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="hover:text-[#112239] transition-colors"
                >
                  {COMPANY_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B9915E] mt-0.5 shrink-0" aria-hidden="true" />
                <span className="leading-relaxed">{COMPANY_INFO.addressLine}</span>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Concierge */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#112239]">Direct Desk</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Connect instantly with our Durgapur site advisory team for floor plans and private
              visits.
            </p>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#112239] text-white text-xs font-semibold hover:bg-[#1C3557] transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#C59B65]" aria-hidden="true" />
              <span>WhatsApp Advisory</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-[#112239]/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} Vadra Developer. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/services" className="hover:text-[#112239] transition-colors">
              RERA Disclosures
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/contact" className="hover:text-[#112239] transition-colors">
              Privacy &amp; Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-[#112239] transition-colors font-medium">
              Admin Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
