import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, MapPin, Building2, TrendingUp, Sparkles, Clock, Phone } from 'lucide-react';

const values = [
  { icon: ShieldCheck, title: 'NOC Verified', desc: 'Every listing is checked for NOC approval and legal compliance with RDA, CDA, KDA, LDA authorities.' },
  { icon: Award, title: 'Trusted by 24,000+ Families', desc: 'Pakistan\'s most reviewed real estate network — 4.8/5 stars across Google, Facebook & Zameen.' },
  { icon: Users, title: '850+ Verified Agents', desc: 'Every agent is biometrically verified, trained, and rated by real customer transactions.' },
  { icon: Clock, title: '24/7 Customer Support', desc: 'Speak to a real person in Urdu, Punjabi, Sindhi, Pashto, Balochi or English — any time.' },
];

const cities = [
  { name: 'Islamabad', count: 3400 },
  { name: 'Lahore', count: 4100 },
  { name: 'Karachi', count: 2900 },
  { name: 'Rawalpindi', count: 1200 },
  { name: 'Multan', count: 540 },
  { name: 'Faisalabad', count: 380 },
  { name: 'Peshawar', count: 290 },
  { name: 'Gwadar', count: 110 },
];

export default function AboutSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-pak-gold/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-pak-green/5 blur-3xl" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-pak-green/10 border border-pak-green/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-pak-green" />
            <span className="text-xs font-bold text-pak-green uppercase tracking-widest">Why Pakistan Trusts Us</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-pak-ink mb-3 leading-tight">
            Pakistan's Most <span className="text-gold-grad">Trusted</span> Real Estate Network
          </h2>
          <p className="text-pak-ink/70 mb-3">
            From the foothills of <strong>Islamabad's Margallas</strong> to the coastal shores of <strong>Gwadar</strong>,
            Pak Property Point connects buyers, sellers, and renters with verified listings and trusted agents.
          </p>
          <p className="font-urdu text-xl text-pak-green mb-6" dir="rtl">
            پاکستان کا اپنا پلیٹ فارم
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="glass rounded-2xl p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pak-green to-pak-green-light flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-pak-gold" />
                  </div>
                  <h3 className="font-bold text-pak-ink text-sm mb-1">{v.title}</h3>
                  <p className="text-xs text-pak-ink/60 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right: City map visual */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-pak-ink rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 hero-grid opacity-40" />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-pak-gold/20 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-pak-gold" />
                <span className="text-xs uppercase tracking-widest text-pak-gold font-bold">Nationwide Coverage</span>
              </div>
              <h3 className="font-display text-3xl font-bold mb-1">
                32 Cities. <span className="text-pak-gold-light">One Platform.</span>
              </h3>
              <p className="text-white/60 text-sm mb-6">Active listings by city</p>

              <div className="space-y-2.5">
                {cities.map((c, i) => {
                  const max = Math.max(...cities.map((x) => x.count));
                  const pct = (c.count / max) * 100;
                  return (
                    <div key={c.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-white/90">{c.name}</span>
                        <span className="text-pak-gold font-bold">{c.count.toLocaleString('en-PK')}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-pak-gold to-pak-gold-light rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-pak-gold/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/60">Total Active</div>
                  <div className="font-display text-2xl font-bold text-pak-gold">12,400+</div>
                </div>
                <a
                  href="tel:+923467356250"
                  className="flex items-center gap-2 bg-pak-gold text-pak-ink px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition"
                >
                  <Phone className="w-4 h-4" /> Talk to Expert
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
