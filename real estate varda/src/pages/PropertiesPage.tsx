import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { fetchProperties } from '../services/api';
import type { Property } from '../types/realestate';
import { useSavedProperties } from '../hooks/useSavedProperties';
import { PropertyCard } from '../components/PropertyCard';

export function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { savedIds, isSaved, toggleSaved } = useSavedProperties();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'All');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [savedOnly, setSavedOnly] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchProperties({
      search: search.trim() || undefined,
      location,
      type,
      category,
      bedrooms,
      maxPrice: maxPrice || undefined,
      sort,
    })
      .then((list) => {
        if (active) setProperties(list);
      })
      .catch((err: Error) => {
        if (active) setError(err.message || 'Unable to load properties.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, location, type, category, bedrooms, maxPrice, sort]);

  // Sync active filters to URL query string
  useEffect(() => {
    const next = new URLSearchParams();
    if (search.trim()) next.set('search', search.trim());
    if (location !== 'All') next.set('location', location);
    if (type !== 'All') next.set('type', type);
    if (category !== 'All') next.set('category', category);
    if (bedrooms !== 'All') next.set('bedrooms', bedrooms);
    if (maxPrice) next.set('maxPrice', maxPrice);
    if (sort !== 'featured') next.set('sort', sort);
    setSearchParams(next, { replace: true });
  }, [search, location, type, category, bedrooms, maxPrice, sort, setSearchParams]);

  const visibleProperties = useMemo(() => {
    if (!savedOnly) return properties;
    return properties.filter((p) => savedIds.includes(p.id));
  }, [properties, savedOnly, savedIds]);

  function resetFilters() {
    setSearch('');
    setLocation('All');
    setType('All');
    setCategory('All');
    setBedrooms('All');
    setMaxPrice('');
    setSort('featured');
    setSavedOnly(false);
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#112239]/10 pb-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8A6B43]">
              Vadra Portfolio · Durgapur 713217
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-[#112239] tracking-tight">
              Residential &amp; Commercial Properties
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#475569] max-w-2xl">
              Explore RERA-registered villas, high-rise residences, executive rentals, and Grade-A
              commercial corridors across Durgapur, West Bengal.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSavedOnly((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                savedOnly
                  ? 'bg-[#B9915E] text-white border-[#B9915E]'
                  : 'bg-white text-[#112239] border-[#112239]/15 hover:border-[#B9915E]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${savedOnly ? 'fill-current' : ''}`} />
              <span>Saved ({savedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl border border-[#112239]/10 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#112239]">
              <SlidersHorizontal className="w-4 h-4 text-[#B9915E]" aria-hidden="true" />
              <span>Filter Developments</span>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#112239] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Keyword Search */}
            <div className="lg:col-span-2 relative">
              <Search
                className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search project, area, or keyword..."
                aria-label="Search properties"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#112239]/12 text-sm text-[#112239] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#B9915E]"
              />
            </div>

            {/* Location */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Filter by location"
              className="px-3.5 py-2.5 rounded-xl border border-[#112239]/12 text-sm text-[#112239] bg-white focus:outline-none focus:border-[#B9915E]"
            >
              <option value="All">All Locations</option>
              <option value="Bidhannagar">Bidhannagar</option>
              <option value="City Centre">City Centre</option>
              <option value="Fuljhore">Fuljhore</option>
              <option value="Benachity">Benachity</option>
              <option value="Muchipara">Muchipara · NH-19</option>
              <option value="Arrah">Arrah</option>
            </select>

            {/* Property Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Filter by property type"
              className="px-3.5 py-2.5 rounded-xl border border-[#112239]/12 text-sm text-[#112239] bg-white focus:outline-none focus:border-[#B9915E]"
            >
              <option value="All">All Types</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Commercial">Commercial</option>
              <option value="Plot">Plot</option>
            </select>

            {/* Bedrooms */}
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              aria-label="Filter by minimum bedrooms"
              className="px-3.5 py-2.5 rounded-xl border border-[#112239]/12 text-sm text-[#112239] bg-white focus:outline-none focus:border-[#B9915E]"
            >
              <option value="All">Any Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>

            {/* Max Budget */}
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              aria-label="Filter by maximum budget"
              className="px-3.5 py-2.5 rounded-xl border border-[#112239]/12 text-sm text-[#112239] bg-white focus:outline-none focus:border-[#B9915E]"
            >
              <option value="">Any Budget</option>
              <option value="100000">Rent ≤ ₹ 1 Lakh/mo</option>
              <option value="10000000">Up to ₹ 1 Cr</option>
              <option value="20000000">Up to ₹ 2 Cr</option>
              <option value="30000000">Up to ₹ 3 Cr</option>
              <option value="50000000">Up to ₹ 5 Cr</option>
            </select>
          </div>

          {/* Category Segmented Filter + Sort */}
          <div className="pt-2 border-t border-[#112239]/8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F4EFE6]">
              {(['All', 'For Sale', 'For Rent'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    category === cat
                      ? 'bg-white text-[#112239] shadow-xs'
                      : 'text-[#64748B] hover:text-[#112239]'
                  }`}
                >
                  {cat === 'All' ? 'All Listings' : cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <span className="tabular-nums font-medium">
                {visibleProperties.length}{' '}
                {visibleProperties.length === 1 ? 'property' : 'properties'} shown
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort properties"
                className="px-3 py-1.5 rounded-lg border border-[#112239]/12 bg-white text-xs font-medium text-[#112239] focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-desc">Area: Largest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg bg-[#112239] text-white text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-[#112239]/8 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-[#EDE6DA]" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-1/3 bg-[#EDE6DA] rounded" />
                  <div className="h-5 w-2/3 bg-[#EDE6DA] rounded" />
                  <div className="h-3 w-1/2 bg-[#EDE6DA] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#112239]/10 p-12 text-center space-y-4">
            <h2 className="text-lg font-bold text-[#112239]">No matching developments found</h2>
            <p className="text-sm text-[#64748B] max-w-md mx-auto">
              Adjust your location, budget, or bedroom filters to view available Vadra Developer
              properties in Durgapur.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#112239] text-white text-xs font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProperties.map((property) => (
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
    </div>
  );
}
