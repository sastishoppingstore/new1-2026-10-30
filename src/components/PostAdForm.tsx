import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Home as HomeIcon, MapPin, Ruler, Bed, Bath, Phone, User, Sparkles, BadgeCheck } from 'lucide-react';
import { api, formatPKR, resolveImageUrl } from '../lib/api';
import type { Property } from '../lib/api';

const CITIES = ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Multan', 'Gwadar', 'Faisalabad', 'Peshawar'];
const SOCIETIES = ['DHA', 'Bahria Town', 'Gulberg', 'Capital Smart City', 'CDA Sector', 'Park View City', 'Lake City', 'Bahria Orchard', 'Emaar', 'Saima'];
const TYPES: Property['type'][] = ['House', 'Plot', 'Apartment', 'Commercial', 'Farmhouse'];
const PURPOSES: Property['purpose'][] = ['Sale', 'Rent'];
const POSSESSIONS: Property['possession'][] = ['Ready', 'Ongoing', 'Upcoming'];

const SAMPLE_IMAGES = [
  '/properties/villa-1.jpg',
  '/properties/villa-2.jpg',
  '/properties/apartment-1.jpg',
  '/properties/interior-1.jpg',
];

export default function PostAdForm() {
  const [form, setForm] = useState({
    title: '',
    price_pkr: 5000000,
    type: 'House' as Property['type'],
    purpose: 'Sale' as Property['purpose'],
    city: 'Islamabad',
    society: 'DHA',
    location: '',
    area_marla: 10,
    area_sqft: 2723,
    bedrooms: 4,
    bathrooms: 4,
    image: SAMPLE_IMAGES[0],
    description: '',
    amenities: 'Boundary Wall,Underground Wiring,Sui Gas,Carpeted Road,Mosque',
    noc_verified: true,
    featured: false,
    possession: 'Ready' as Property['possession'],
    agent_name: '',
    agent_phone: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<Property | null>(null);

  const update = (k: keyof typeof form, v: any) => setForm({ ...form, [k]: v });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.agent_phone) return;
    setSending(true);
    try {
      const amenities = form.amenities.split(',').map((a) => a.trim()).filter(Boolean);
      const created = await api.createProperty({
        ...form,
        price_pkr: Number(form.price_pkr),
        area_marla: Number(form.area_marla),
        area_sqft: Number(form.area_sqft),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        amenities,
        status: 'Available',
      });
      setSuccess(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert('Failed to post ad. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <section id="add" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.7, rotateY: -30, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-pak-gold/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-pak-green/10 blur-3xl" />
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="w-20 h-20 rounded-full bg-pak-green mx-auto mb-6 flex items-center justify-center glow-green"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="font-display text-4xl font-bold text-pak-ink mb-3">
                <span className="text-gold-grad">Shabash!</span> Property Posted
              </h2>
              <p className="text-pak-ink/70 mb-2">Your property is now live on Pak Property Point</p>
              <div className="text-sm text-pak-green font-semibold mb-6">"{success.title}"</div>
              <div className="bg-pak-cream rounded-2xl p-5 text-left max-w-md mx-auto">
                <div className="text-[10px] uppercase tracking-widest text-pak-green font-bold mb-2 flex items-center gap-1.5">
                  <BadgeCheck className="w-3 h-3" /> Listing Details
                </div>
                <div className="text-2xl font-display font-bold text-gold-grad mb-1">{formatPKR(success.price_pkr)}</div>
                <div className="text-sm text-pak-ink/70 mb-3">{success.society}, {success.city} • {success.area_marla} Marla</div>
                <div className="text-xs text-pak-ink/60">
                  Our team will verify and respond within 24 hours. Buyers across Pakistan can now view your listing.
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <button
                  onClick={() => { setSuccess(null); setForm({ ...form, title: '', location: '', description: '' }); }}
                  className="px-6 py-3 bg-pak-green text-white rounded-xl font-semibold text-sm hover:bg-pak-green-light transition"
                >
                  Post Another Property
                </button>
                <button
                  onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 bg-pak-gold/15 text-pak-ink rounded-xl font-semibold text-sm hover:bg-pak-gold/30 transition"
                >
                  View All Listings
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="add" className="relative py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pak-green/10 border border-pak-green/20 rounded-full px-4 py-1.5 mb-4">
            <Plus className="w-3.5 h-3.5 text-pak-green" />
            <span className="text-xs font-bold text-pak-green uppercase tracking-widest">Free Posting</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-pak-ink mb-3">
            List Your <span className="text-gold-grad">Property</span>
          </h2>
          <p className="text-pak-ink/60 max-w-2xl mx-auto">
            Reach over 50,000 active property seekers across Pakistan. Post in 60 seconds — absolutely free.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Cover image picker */}
          <div className="relative h-48 sm:h-56 bg-pak-ink overflow-hidden">
            <img
              src={resolveImageUrl(form.image)}
              alt="cover"
              className="w-full h-full object-cover opacity-70"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pak-ink via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <div className="text-pak-gold-light text-[10px] font-bold uppercase tracking-widest mb-1">Choose Cover Image</div>
              <div className="flex gap-2 overflow-x-auto">
                {SAMPLE_IMAGES.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => update('image', img)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                      form.image === img ? 'border-pak-gold scale-105' : 'border-white/30'
                    }`}
                  >
                    <img
                      src={resolveImageUrl(img)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <Label icon={HomeIcon} text="Property Title" required />
              <input
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. 10 Marla Brand New House in DHA Phase 2"
                required
                className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold"
              />
            </div>

            {/* Type & Purpose */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label text="Property Type" />
                <div className="grid grid-cols-3 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update('type', t)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition ${
                        form.type === t ? 'bg-pak-green text-white border-pak-green' : 'bg-white text-pak-ink border-pak-gold/30 hover:border-pak-gold'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label text="Purpose" />
                <div className="grid grid-cols-2 gap-2">
                  {PURPOSES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update('purpose', p)}
                      className={`py-3 rounded-lg text-sm font-semibold border transition ${
                        form.purpose === p ? 'bg-pak-gold text-pak-ink border-pak-gold' : 'bg-white text-pak-ink border-pak-gold/30 hover:border-pak-gold'
                      }`}
                    >
                      For {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label icon={MapPin} text="City" />
                <select value={form.city} onChange={(e) => update('city', e.target.value)} className="w-full px-3 py-3 rounded-xl border border-pak-gold/30 bg-white">
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label icon={MapPin} text="Society" />
                <select value={form.society} onChange={(e) => update('society', e.target.value)} className="w-full px-3 py-3 rounded-xl border border-pak-gold/30 bg-white">
                  {SOCIETIES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label text="Block / Sector" required />
                <input
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="e.g. Block C, Phase 5"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <Label text="Asking Price (PKR)" required />
              <div className="grid sm:grid-cols-3 gap-3">
                <input
                  type="number"
                  value={form.price_pkr}
                  onChange={(e) => update('price_pkr', e.target.value)}
                  className="sm:col-span-2 w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold text-lg font-display font-bold text-pak-ink"
                />
                <div className="px-4 py-3 rounded-xl bg-pak-gold/15 text-pak-ink font-display font-bold text-center">
                  {formatPKR(form.price_pkr)}
                </div>
              </div>
            </div>

            {/* Area & Rooms */}
            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <Label icon={Ruler} text="Area (Marla)" />
                <input type="number" value={form.area_marla} onChange={(e) => {
                  const m = Number(e.target.value);
                  update('area_marla', m);
                  update('area_sqft', Math.round(m * 272.25));
                }} className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold" />
              </div>
              <div>
                <Label text="Area (Sq Ft)" />
                <input type="number" value={form.area_sqft} onChange={(e) => update('area_sqft', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold" />
              </div>
              <div>
                <Label icon={Bed} text="Beds" />
                <input type="number" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold" />
              </div>
              <div>
                <Label icon={Bath} text="Baths" />
                <input type="number" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold" />
              </div>
            </div>

            <div>
              <Label text="Possession" />
              <div className="grid grid-cols-3 gap-2">
                {POSSESSIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update('possession', p)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition ${
                      form.possession === p ? 'bg-pak-green text-white border-pak-green' : 'bg-white text-pak-ink border-pak-gold/30'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label text="Description" />
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                placeholder="Describe the property features, nearby landmarks, condition, and unique selling points..."
                className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold resize-none"
              />
            </div>

            {/* Amenities */}
            <div>
              <Label text="Amenities (comma-separated)" />
              <input
                value={form.amenities}
                onChange={(e) => update('amenities', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold"
                placeholder="Boundary Wall, Sui Gas, Underground Wiring..."
              />
            </div>

            {/* NOC + Featured toggles */}
            <div className="flex flex-wrap gap-3">
              <Toggle label="NOC Approved" checked={form.noc_verified} onChange={(v) => update('noc_verified', v)} />
              <Toggle label="Featured Listing" checked={form.featured} onChange={(v) => update('featured', v)} />
            </div>

            {/* Agent info */}
            <div className="border-t border-pak-gold/20 pt-5">
              <h3 className="font-display text-lg font-bold text-pak-ink mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-pak-green" /> Your Contact Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  value={form.agent_name}
                  onChange={(e) => update('agent_name', e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold"
                />
                <input
                  value={form.agent_phone}
                  onChange={(e) => update('agent_phone', e.target.value)}
                  placeholder="WhatsApp Number (e.g. 0346-7356250)"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pak-gold/30 focus:outline-none focus:ring-2 focus:ring-pak-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-gradient-to-r from-pak-green via-pak-green-light to-pak-green text-white font-bold py-4 rounded-xl hover:shadow-2xl transition disabled:opacity-60 text-lg flex items-center justify-center gap-2"
            >
              {sending ? (
                'Posting...'
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Post Property Free
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Label({ icon: Icon, text, required }: { icon?: any; text: string; required?: boolean }) {
  return (
    <label className="text-xs font-bold text-pak-ink/70 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-pak-green" />}
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
        checked ? 'bg-pak-green/10 border-pak-green text-pak-green' : 'bg-white border-pak-gold/30 text-pak-ink/70'
      }`}
    >
      <div className={`w-9 h-5 rounded-full relative transition ${checked ? 'bg-pak-green' : 'bg-pak-ink/20'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition ${checked ? 'left-4' : 'left-0.5'}`} />
      </div>
      {label}
    </button>
  );
}
