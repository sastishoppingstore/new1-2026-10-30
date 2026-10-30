import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, MapPin, TrendingUp, Award, Building2, Sparkles, ArrowDown, Home as HomeIcon } from 'lucide-react';
import HeroScene3D from './HeroScene3D';

interface Props {
  onSearch: (q: string) => void;
  onExplore: () => void;
}

const stats = [
  { icon: Building2, label: 'Active Listings', value: '12,400+' },
  { icon: MapPin, label: 'Cities Covered', value: '32' },
  { icon: Award, label: 'Verified Agents', value: '850+' },
  { icon: TrendingUp, label: 'Happy Families', value: '24,000+' },
];

export default function Hero({ onSearch, onExplore }: Props) {
  const [q, setQ] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative min-h-screen pt-24 pb-20 overflow-hidden noise">
      {/* Background grid */}
      <div className="absolute inset-0 hero-grid pointer-events-none" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="particle absolute w-1.5 h-1.5 rounded-full bg-pak-gold/60"
            style={{
              left: `${(i * 8.3 + 5) % 100}%`,
              bottom: `-10px`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${10 + (i % 4) * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Crescent shape */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-pak-gold/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-pak-green/15 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div style={{ transform: `translateY(${scrollY * -0.15}px)` }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 bg-pak-green/10 border border-pak-green/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-pak-gold" />
            <span className="text-xs font-bold text-pak-green uppercase tracking-widest">
              Pakistan's #1 Premium Real Estate Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-pak-ink leading-[1.05] mb-6"
          >
            Discover Your
            <br />
            <span className="text-gold-grad">Dream Home</span>
            <br />
            <span className="text-pak-green">in Pakistan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-pak-ink/70 text-lg mb-3 max-w-xl"
          >
            From <span className="text-pak-green font-semibold">DHA Islamabad</span> to{' '}
            <span className="text-pak-green font-semibold">Bahria Town Karachi</span>, find NOC-approved
            properties across <span className="text-pak-green font-semibold">32 cities</span> with
            Pakistan's most trusted real-estate network.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-urdu text-2xl text-pak-green mb-8"
            dir="rtl"
          >
            پاکستان کا اپنا گھر، اپنی زمین
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={(e) => { e.preventDefault(); onSearch(q); onExplore(); }}
            className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2 max-w-xl mb-6"
            style={{ boxShadow: '0 25px 50px -12px rgba(1,65,28,0.3)' }}
          >
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-5 h-5 text-pak-green" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search DHA, Bahria, Gulberg, or any society..."
                className="w-full py-3 text-sm focus:outline-none placeholder:text-pak-ink/40"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-pak-green to-pak-green-light text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {['DHA Islamabad', 'Bahria Town Lahore', 'Gulberg Greens', 'Capital Smart City', 'CDA Sectors'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setQ(tag); onSearch(tag); onExplore(); }}
                className="text-xs px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-pak-gold/30 text-pak-ink hover:bg-pak-gold hover:text-pak-ink transition"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="absolute inset-0 perspective-1500">
            <div className="relative w-full h-full preserve-3d" style={{ transform: 'rotateY(-15deg) rotateX(5deg)' }}>
              <HeroScene3D variant="house" />
            </div>
          </div>

          {/* Floating UI badges over 3D scene */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute top-12 left-4 sm:left-0 glass rounded-2xl p-3 shadow-2xl"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pak-green flex items-center justify-center">
                <Award className="w-4 h-4 text-pak-gold" />
              </div>
              <div>
                <div className="text-[10px] text-pak-ink/60 font-semibold uppercase">Verified</div>
                <div className="text-sm font-bold text-pak-ink">NOC Approved</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-20 right-4 sm:right-0 glass-dark rounded-2xl p-3 shadow-2xl"
          >
            <div className="text-pak-gold text-[10px] font-bold uppercase tracking-widest">Live Market</div>
            <div className="text-white font-display text-2xl font-bold">PKR 3.5 Cr</div>
            <div className="text-white/70 text-xs">Avg. 10-Marla DHA</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-2 left-4 sm:left-0 glass rounded-2xl p-3 shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pak-gold flex items-center justify-center">
                <HomeIcon className="w-4 h-4 text-pak-ink" />
              </div>
              <div>
                <div className="text-[10px] text-pak-ink/60 font-semibold uppercase">This Week</div>
                <div className="text-sm font-bold text-pak-ink">+128 New Listings</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass rounded-2xl p-4 sm:p-5 text-center"
              >
                <Icon className="w-5 h-5 text-pak-green mx-auto mb-1" />
                <div className="font-display text-2xl sm:text-3xl font-bold text-pak-ink">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-pak-ink/60 uppercase tracking-wider font-semibold">{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-pak-green"
      >
        <ArrowDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}
