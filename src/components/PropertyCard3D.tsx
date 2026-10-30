import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bed, Bath, Maximize2, MapPin, BadgeCheck, Heart, Sparkles, Building2, Eye, MessageCircle } from 'lucide-react';
import type { Property } from '../lib/api';
import { formatPKR, formatPKRShort, resolveImageUrl } from '../lib/api';

interface Props {
  property: Property;
  index: number;
  onView: (p: Property) => void;
  onSave: (p: Property) => void;
  saved: boolean;
}

export default function PropertyCard3D({ property, index, onView, onSave, saved }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const rx = (py - 0.5) * -10;
    const ry = (px - 0.5) * 10;
    setTransform(`perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02) translateZ(10px)`);
    setGlare({ x: px * 100, y: py * 100, opacity: 1 });
  };

  const handleLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative preserve-3d"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="card-3d relative bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
        style={{
          transform,
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px -12px rgba(1,65,28,0.25)',
        }}
        onClick={() => onView(property)}
      >
        {/* Image area with parallax depth */}
        <div className="relative h-56 overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
          <motion.img
            src={resolveImageUrl(property.image)}
            alt={property.title}
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.08)' }}
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.7 }}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top badges row */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between" style={{ transform: 'translateZ(40px)' }}>
            <div className="flex flex-col gap-1.5">
              {property.noc_verified && (
                <span className="inline-flex items-center gap-1 bg-pak-green text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  <BadgeCheck className="w-3 h-3" /> NOC Approved
                </span>
              )}
              {property.featured && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-pak-gold to-pak-gold-light text-pak-ink text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <span className="inline-flex items-center gap-1 bg-pak-gold/95 text-pak-ink text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                {property.purpose}
              </span>
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur text-pak-ink text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {property.possession}
              </span>
            </div>
          </div>

          {/* Price chip floating at bottom of image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between" style={{ transform: 'translateZ(50px)' }}>
            <div>
              <div className="text-pak-gold-light text-[10px] font-bold uppercase tracking-widest mb-0.5">Asking Price</div>
              <div className="text-white font-display text-2xl font-bold leading-none drop-shadow-lg">
                {formatPKRShort(property.price_pkr)}
              </div>
              <div className="text-white/80 text-[11px] mt-1">{formatPKR(property.price_pkr)}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onSave(property); }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
              style={{ transform: 'translateZ(30px)' }}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : 'text-pak-ink'}`} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5" style={{ transform: 'translateZ(15px)' }}>
          <div className="flex items-center gap-1.5 text-pak-green text-[11px] font-semibold uppercase tracking-wider mb-1.5">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{property.society}, {property.city}</span>
          </div>
          <h3 className="font-display text-xl font-bold text-pak-ink leading-snug mb-2 line-clamp-2 group-hover:text-pak-green transition-colors">
            {property.title}
          </h3>
          <p className="text-xs text-pak-ink/60 mb-4 line-clamp-2">{property.description}</p>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-pak-gold/15">
            {property.bedrooms !== undefined && (
              <div className="flex flex-col items-center gap-0.5">
                <Bed className="w-4 h-4 text-pak-green" />
                <span className="text-[11px] text-pak-ink/70 font-semibold">{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex flex-col items-center gap-0.5">
                <Bath className="w-4 h-4 text-pak-green" />
                <span className="text-[11px] text-pak-ink/70 font-semibold">{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex flex-col items-center gap-0.5">
              <Maximize2 className="w-4 h-4 text-pak-green" />
              <span className="text-[11px] text-pak-ink/70 font-semibold">{property.area_marla} Marla</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={(e) => { e.stopPropagation(); onView(property); }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-pak-green hover:bg-pak-green-light text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> View Details
            </button>
            <a
              href={`https://wa.me/${(property.agent_phone || '03467356250').replace(/\D/g, '').replace(/^0/, '92')}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-pak-gold/15 hover:bg-pak-gold text-pak-ink transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Sheen */}
        <span className="sheen" />
        {/* Glare */}
        <span
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.45), transparent 50%)`,
            opacity: glare.opacity,
            mixBlendMode: 'soft-light',
          }}
        />
      </div>
    </motion.div>
  );
}
