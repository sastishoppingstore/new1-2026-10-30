import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Sliders, Sparkles, Grid3x3, List, ArrowDownAZ } from 'lucide-react';
import type { Property } from '../lib/api';
import { api, formatPKR } from '../lib/api';
import { FALLBACK_PROPERTIES } from '../lib/defaultProperties';
import PropertyCard3D from './PropertyCard3D';
import PropertyDetailsModal from './PropertyDetailsModal';

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedIds: number[];
  onSave: (p: Property) => void;
  onUnsave: (id: number) => void;
}

const CITIES = ['All', 'Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Multan', 'Gwadar', 'Faisalabad', 'Peshawar'];
const SOCIETIES: Record<string, string[]> = {
  All: ['All', 'DHA', 'Bahria Town', 'Gulberg', 'Capital Smart City', 'CDA Sector', 'Park View City', 'Lake City', 'Bahria Orchard', 'Emaar', 'Saima'],
  Islamabad: ['All', 'DHA', 'Bahria Town', 'Gulberg Greens', 'F-11', 'F-10', 'E-11', 'CDA Sector'],
  Lahore: ['All', 'DHA', 'Bahria Town', 'Gulberg', 'Park View City', 'Lake City', 'Emaar', 'CDA Sector'],
  Karachi: ['All', 'DHA', 'Bahria Town', 'Gulshan-e-Iqbal', 'Clifton', 'PECHS', 'Bahria Orchard'],
  Rawalpindi: ['All', 'DHA', 'Bahria Town', 'Saddar', 'Bahria Orchard'],
  Multan: ['All', 'DHA', 'Bahria Town', 'Wapda Town'],
};
const TYPES = ['All', 'House', 'Plot', 'Apartment', 'Commercial', 'Farmhouse'];
const PURPOSES = ['All', 'Sale', 'Rent'];
const SORTS = [
  { id: 'featured', label: 'Featured First' },
  { id: 'price-asc', label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
  { id: 'newest', label: 'Newest First' },
];

export default function ListingsSection({ searchQuery, onSearchChange, savedIds, onSave, onUnsave }: Props) {
  const [properties, setProperties] = useState<Property[]>(FALLBACK_PROPERTIES);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('All');
  const [society, setSociety] = useState('All');
  const [type, setType] = useState('All');
  const [purpose, setPurpose] = useState('All');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(500000000); // 50 Cr
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Property | null>(null);

  useEffect(() => {
    setLoading(true);
    api.listProperties()
      .then((d) => setProperties(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  // Reset society when city changes
  useEffect(() => {
    setSociety('All');
  }, [city]);

  const filtered = useMemo(() => {
    let list = [...properties];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.society.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => p.price_pkr <= maxPrice);

    // Sort
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price_pkr - b.price_pkr); break;
      case 'price-desc': list.sort((a, b) => b.price_pkr - a.price_pkr); break;
      case 'newest': list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)); break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [properties, searchQuery, maxPrice, sort]);

  const handleInquiry = async (p: Property) => {
    try {
      await api.createInquiry({
        property_id: p.id!,
        property_title: p.title,
        name: (document.querySelector('input[placeholder*="Your Name"]') as HTMLInputElement)?.value || 'Guest',
        phone: (document.querySelector('input[placeholder*="Phone"]') as HTMLInputElement)?.value || '',
        email: (document.querySelector('input[placeholder*="Email"]') as HTMLInputElement)?.value || '',
        message: (document.querySelector('textarea[placeholder*="interested"]') as HTMLTextAreaElement)?.value || 'Inquiry via website',
      });
    } catch (e) {
      console.error('Inquiry failed', e);
    }
  };

  return (
    <section id="listings" className="relative py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pak-gold/15 border border-pak-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-pak-gold" />
            <span className="text-xs font-bold text-pak-ink uppercase tracking-widest">Premium Inventory</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-pak-ink mb-3">
            Explore <span className="text-gold-grad">Properties</span>
          </h2>
          <p className="text-pak-ink/60 max-w-2xl mx-auto">
            Handpicked NOC-approved homes, plots, and commercial spaces across Pakistan's most prestigious societies
          </p>
        </div>

        {/* Filter bar */}
        <div className="glass rounded-3xl p-4 sm:p-5 mb-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* City */}
            <FilterSelect label="City" value={city} onChange={setCity} options={CITIES} />
            {/* Society */}
            <FilterSelect label="Society" value={society} onChange={setSociety} options={SOCIETIES[city] ?? ['All']} />
            {/* Type */}
            <FilterSelect label="Type" value={type} onChange={setType} options={TYPES} />
            {/* Purpose */}
            <FilterSelect label="Purpose" value={purpose} onChange={setPurpose} options={PURPOSES} />
            {/* Sort */}
            <FilterSelect label="Sort" value={sort} onChange={setSort} options={SORTS.map((s) => s.label)} valueMap={SORTS} />
            {/* Search clear */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-pak-ink/60 font-semibold mb-1.5 block">Search</label>
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="DHA Phase 2..."
                  className="w-full px-3 py-2.5 pr-8 rounded-xl bg-white border border-pak-gold/30 text-sm focus:outline-none focus:ring-2 focus:ring-pak-gold"
                />
                {searchQuery && (
                  <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-pak-ink/50">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Price slider */}
          <div className="mt-4 pt-4 border-t border-pak-gold/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-pak-ink uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 inline mr-1" />
                Max Price
              </div>
              <div className="text-sm font-bold text-gold-grad">{formatPKR(maxPrice)}</div>
            </div>
            <input
              type="range"
              min={5000000}
              max={500000000}
              step={5000000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-pak-ink/50 mt-1">
              <span>PKR 50 Lac</span>
              <span>PKR 50 Crore</span>
            </div>
          </div>
        </div>

        {/* View toggles + count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-pak-ink/70">
            <span className="font-bold text-pak-ink text-lg">{filtered.length}</span> properties found
          </div>
          <div className="flex gap-1 glass rounded-full p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-full transition ${view === 'grid' ? 'bg-pak-green text-white' : 'text-pak-ink'}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-full transition ${view === 'list' ? 'bg-pak-green text-white' : 'text-pak-ink'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Listings grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow animate-pulse">
                <div className="h-56 bg-gradient-to-br from-pak-green/10 to-pak-gold/10" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-pak-gold/10 rounded-full w-1/2" />
                  <div className="h-5 bg-pak-green/10 rounded-lg w-3/4" />
                  <div className="h-3 bg-pak-ink/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl">
            <Filter className="w-10 h-10 text-pak-ink/30 mx-auto mb-3" />
            <h3 className="font-display text-2xl font-bold text-pak-ink mb-1">No properties match your filters</h3>
            <p className="text-pak-ink/60 text-sm">Try adjusting your search criteria or clearing the search</p>
          </div>
        ) : (
          <motion.div
            layout
            className={view === 'grid'
              ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            }
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <PropertyCard3D
                  key={p.id}
                  property={p}
                  index={i}
                  onView={setSelected}
                  onSave={(prop) => {
                    if (savedIds.includes(prop.id!)) onUnsave(prop.id!);
                    else onSave(prop);
                  }}
                  saved={savedIds.includes(p.id!)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <PropertyDetailsModal
        property={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onInquiry={handleInquiry}
      />
    </section>
  );
}

function FilterSelect({
  label, value, onChange, options, valueMap,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  valueMap?: { id: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-pak-ink/60 font-semibold mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl bg-white border border-pak-gold/30 text-sm focus:outline-none focus:ring-2 focus:ring-pak-gold font-semibold text-pak-ink"
      >
        {options.map((o) => (
          <option key={o} value={valueMap ? valueMap.find((v) => v.label === o)?.id ?? o : o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
