import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Search, Calculator, Plus, Building2, Phone, MessageCircle } from 'lucide-react';

interface Props {
  onNavigate: (section: string) => void;
  active: string;
}

export default function Navbar({ onNavigate, active }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'listings', label: 'Listings', icon: Search },
    { id: 'tools', label: 'Tools', icon: Calculator },
    { id: 'add', label: 'Post Ad', icon: Plus },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'glass-dark shadow-2xl py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-pak-gold rounded-lg blur-md opacity-50 group-hover:opacity-100 transition" />
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-pak-green to-pak-green-light flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-pak-gold" />
              </div>
            </div>
            <div className="hidden sm:block leading-tight">
              <div className={`font-display text-xl font-bold ${scrolled ? 'text-white' : 'text-pak-ink'}`}>
                Pak Property <span className="text-gold-grad">Point</span>
              </div>
              <div className={`text-[10px] uppercase tracking-widest ${scrolled ? 'text-pak-gold-light' : 'text-pak-green'} font-bold`}>
                حصہ ِ پاکستان کا
              </div>
            </div>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((it) => {
              const Icon = it.icon;
              const isActive = active === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => onNavigate(it.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'text-pak-ink'
                      : scrolled
                        ? 'text-white hover:text-pak-gold-light'
                        : 'text-pak-ink hover:text-pak-green'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-pak-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{it.label}</span>
                </button>
              );
            })}
            <a
              href="tel:+923467356250"
              className="ml-3 flex items-center gap-2 bg-pak-green text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-pak-green-light transition btn-pulse"
            >
              <Phone className="w-4 h-4" />
              <span>0346-7356250</span>
            </a>
            <a
              href="https://wa.me/923467356250"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp: 0346-7356250"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition hover:scale-105 shadow"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-white' : 'text-pak-ink'}`}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass-dark overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <button
                      key={it.id}
                      onClick={() => { onNavigate(it.id); setOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        active === it.id ? 'bg-pak-gold text-pak-ink' : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {it.label}
                    </button>
                  );
                })}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:+923467356250"
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold bg-pak-green text-white"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a
                    href="https://wa.me/923467356250"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold bg-emerald-600 text-white"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
