import { motion } from 'framer-motion';

const SOCIETIES = [
  'DHA Islamabad', 'DHA Lahore', 'DHA Karachi', 'DHA Multan', 'Bahria Town Rawalpindi',
  'Bahria Town Karachi', 'Bahria Orchard', 'Bahria Town Lahore', 'Gulberg Greens Islamabad',
  'Gulberg Lahore', 'Capital Smart City', 'Blue World City', 'Park View City', 'Lake City Lahore',
  'Emaar Downtown', 'Saima Arabian', 'CDA Sectors', 'F-11 Markaz', 'Cantonment Living',
];

export default function SocietiesMarquee() {
  return (
    <section className="py-10 overflow-hidden border-y border-pak-gold/20 bg-pak-cream">
      <div className="text-center mb-4">
        <div className="text-[10px] uppercase tracking-widest text-pak-green font-bold">Trusted Across Pakistan's Finest Societies</div>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-pak-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-pak-cream to-transparent z-10 pointer-events-none" />
        <div className="flex marquee gap-8 whitespace-nowrap">
          {[...SOCIETIES, ...SOCIETIES].map((s, i) => (
            <span
              key={i}
              className="font-display text-2xl sm:text-3xl font-bold text-pak-ink/30 hover:text-pak-gold transition flex-shrink-0"
            >
              ✦ {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
