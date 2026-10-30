import { motion } from 'framer-motion';
import { Building2, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className="relative bg-pak-ink text-white overflow-hidden">
      {/* Top crescent */}
      <div className="absolute -top-px left-0 right-0 h-20 bg-gradient-to-b from-pak-cream to-transparent" />

      <div className="relative pt-20 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-pak-green via-pak-green-light to-pak-green rounded-3xl p-6 sm:p-8 mb-12 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-pak-gold/30 blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="text-pak-gold text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Weekly Newsletter
                </div>
                <h3 className="font-display text-3xl font-bold text-white mb-1">
                  New Listings, Hot Deals
                </h3>
                <p className="text-white/80 text-sm">Get handpicked NOC-approved properties every Friday.</p>
              </div>
              <form onSubmit={subscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pak-gold"
                />
                <button
                  type="submit"
                  className="bg-pak-gold text-pak-ink px-5 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> {subscribed ? 'Sent!' : 'Subscribe'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Footer columns */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pak-green to-pak-green-light flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-pak-gold" />
                </div>
                <div>
                  <div className="font-display text-lg font-bold">Pak Property <span className="text-pak-gold">Point</span></div>
                  <div className="text-[9px] uppercase tracking-widest text-pak-gold-light font-bold">حصہ ِ پاکستان کا</div>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Pakistan's most trusted real estate platform. NOC-verified listings across 32 cities, 850+ verified agents, and 24/7 customer support.
              </p>
              <div className="flex gap-2">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full glass-dark flex items-center justify-center hover:bg-pak-gold hover:text-pak-ink transition"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-pak-gold-light text-sm uppercase tracking-wider mb-4">Top Cities</h4>
              <ul className="space-y-2 text-sm text-white/70">
                {['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Multan', 'Faisalabad', 'Peshawar', 'Gwadar'].map((c) => (
                  <li key={c}>
                    <a href="#listings" className="hover:text-pak-gold transition flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {c}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-pak-gold-light text-sm uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                {[
                  { l: 'Home', h: '#home' },
                  { l: 'All Listings', h: '#listings' },
                  { l: 'Marla Converter', h: '#tools' },
                  { l: 'Home Loan EMI', h: '#tools' },
                  { l: 'Post Free Ad', h: '#add' },
                  { l: 'About Us', h: '#about' },
                ].map((l) => (
                  <li key={l.l}>
                    <a href={l.h} className="hover:text-pak-gold transition">{l.l}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-pak-gold-light text-sm uppercase tracking-wider mb-4">Get in Touch</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-pak-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <a href="tel:+923467356250" className="text-white font-semibold hover:text-pak-gold transition">0346-7356250</a>
                    <div className="text-xs">Mon-Sat, 9am-9pm PKT</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <a href="https://wa.me/923467356250" target="_blank" rel="noreferrer" className="text-white font-semibold hover:text-emerald-400 transition">0346-7356250</a>
                    <div className="text-xs">24/7 WhatsApp Chat</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-pak-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white">info@pakpropertypoint.pk</div>
                    <div className="text-xs">24/7 email support</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-pak-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white">Blue Area, Islamabad</div>
                    <div className="text-xs">Pakistan Office</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-pak-gold/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
            <div>© 2026 Pak Property Point. All rights reserved. SECP Registered.</div>
            <div className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-pak-gold fill-pak-gold" /> in Islamabad, Pakistan
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
