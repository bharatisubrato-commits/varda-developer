import { Link } from 'react-router-dom';
import { ArrowRight, Bath, BedDouble, Heart, MapPin, Maximize2 } from 'lucide-react';
import type { Property } from '../types/realestate';
import { formatINR } from '../types/realestate';
import { ImageWithFallback } from './ImageWithFallback';

interface PropertyCardProps {
  property: Property;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

export function PropertyCard({ property, saved, onToggleSave }: PropertyCardProps) {
  const isCommercialOrPlot =
    property.propertyType === 'Commercial' || property.propertyType === 'Plot';

  return (
    <article className="group bg-white rounded-2xl border border-[#112239]/8 overflow-hidden transition-all duration-200 hover:shadow-[0_14px_34px_-14px_rgba(17,34,57,0.16)] flex flex-col">
      {/* Property Media */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE6DA]">
        <Link to={`/properties/${property.id}`} className="block w-full h-full">
          <ImageWithFallback
            src={property.images[0]}
            alt={`${property.title} in ${property.location}`}
            fallbackTitle={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Listing Category Overlay */}
        <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#112239]/90 backdrop-blur-sm text-white text-xs font-medium tracking-wide">
          {property.listingCategory}
        </span>

        {/* Save / Bookmark Action */}
        <button
          type="button"
          onClick={() => onToggleSave(property.id)}
          aria-label={saved ? `Remove ${property.title} from saved` : `Save ${property.title}`}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-150 ${
            saved
              ? 'bg-[#B9915E] text-white'
              : 'bg-[#112239]/45 text-white hover:bg-[#112239]/75'
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8A6B43] font-medium">
            <span>{property.developmentName}</span>
            <span aria-hidden="true">·</span>
            <span>{property.constructionStatus}</span>
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="block text-lg font-bold text-[#112239] group-hover:text-[#8A6B43] transition-colors leading-snug"
          >
            {property.title}
          </Link>

          <p className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <MapPin className="w-3.5 h-3.5 text-[#B9915E] shrink-0" aria-hidden="true" />
            <span className="truncate">
              {property.location} · {property.pinCode}
            </span>
          </p>

          {/* Architectural Specs */}
          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#475569]">
            {!isCommercialOrPlot && property.bedrooms > 0 && (
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <BedDouble className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <Bath className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                {property.bathrooms} Baths
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Maximize2 className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
              {property.areaSqFt.toLocaleString('en-IN')} sq ft
            </span>
          </div>
        </div>

        {/* Footer Price + Detail Link */}
        <div className="pt-3.5 border-t border-[#112239]/8 flex items-center justify-between">
          <div className="text-lg font-bold text-[#112239] tabular-nums">
            {formatINR(property.price, property.listingCategory)}
          </div>
          <Link
            to={`/properties/${property.id}`}
            aria-label={`View details for ${property.title}`}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#112239] hover:bg-[#F2E9DB] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
