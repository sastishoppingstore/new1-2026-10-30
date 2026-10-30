import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Home, Ruler, Sparkles, TrendingUp, Building2 } from 'lucide-react';

export default function ToolsSection() {
  return (
    <section id="tools" className="relative py-20 px-4 sm:px-6 bg-gradient-to-br from-pak-ink via-pak-green to-pak-green-light text-white overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-30" />
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-pak-gold/20 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-pak-gold/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-pak-gold/20 border border-pak-gold/40 rounded-full px-4 py-1.5 mb-4">
            <Calculator className="w-3.5 h-3.5 text-pak-gold" />
            <span className="text-xs font-bold text-pak-gold-light uppercase tracking-widest">Pakistani Property Tools</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-3">
            Smart <span className="text-pak-gold-light">Calculators</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Free tools designed specifically for Pakistan's property market — Marla to Sq Ft, EMI planning, and more
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <UnitConverter />
          <EMICalculator />
        </div>
      </div>
    </section>
  );
}

function UnitConverter() {
  const [marla, setMarla] = useState(10);

  const result = useMemo(() => {
    // 1 Marla = 272.25 sq ft (in most of Pakistan)
    // 1 Kanal = 20 Marla = 5445 sq ft
    // 1 Kanal = 1/8 acre
    // 1 acre = 8 Kanal = 160 Marla
    const sqft = marla * 272.25;
    const kanal = marla / 20;
    const sqyd = sqft / 9;
    const acre = marla / 160;
    return { sqft, kanal, sqyd, acre };
  }, [marla]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-dark rounded-3xl p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-pak-gold flex items-center justify-center">
          <Ruler className="w-6 h-6 text-pak-ink" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-white">Marla / Kanal Converter</h3>
          <p className="text-white/60 text-xs">Pakistan's standard property units</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-bold text-pak-gold-light uppercase tracking-wider mb-2 block">Enter Size (Marla)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={200}
              value={marla}
              onChange={(e) => setMarla(Number(e.target.value))}
              className="flex-1"
            />
            <div className="w-24 px-3 py-2 rounded-xl bg-white/10 text-center font-display text-xl font-bold text-white border border-pak-gold/40">
              {marla}
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-white/50 mt-1">
            <span>1 Marla</span>
            <span>200 Marla (10 Kanal)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ResultCard label="Square Feet" value={result.sqft.toLocaleString('en-PK', { maximumFractionDigits: 0 })} unit="sq ft" />
          <ResultCard label="Square Yards" value={result.sqyd.toLocaleString('en-PK', { maximumFractionDigits: 0 })} unit="sq yd" />
          <ResultCard label="Kanal" value={result.kanal.toFixed(2)} unit="kanal" />
          <ResultCard label="Acres" value={result.acre.toFixed(4)} unit="acre" />
        </div>

        <div className="text-[11px] text-white/50 bg-white/5 rounded-xl p-3 leading-relaxed">
          <Sparkles className="w-3 h-3 inline mr-1 text-pak-gold" />
          Standard Pakistani conversion: <strong>1 Marla = 272.25 sq ft</strong> (Punjab & Sindh) · 1 Kanal = 20 Marla · 1 Acre = 8 Kanal = 160 Marla
        </div>
      </div>
    </motion.div>
  );
}

function ResultCard({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className={`bg-white/5 border rounded-2xl p-4 ${highlight ? 'border-pak-gold ring-1 ring-pak-gold/50' : 'border-pak-gold/20'}`}
    >
      <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">{label}</div>
      <div className="font-display text-2xl font-bold text-pak-gold-light mt-1">{value}</div>
      <div className="text-[10px] text-white/50">{unit}</div>
    </motion.div>
  );
}

function EMICalculator() {
  const [amount, setAmount] = useState(15000000); // 1.5 Crore
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(14.5); // Pakistani bank rate ~13-17%

  const calc = useMemo(() => {
    const P = amount;
    const r = rate / 12 / 100;
    const n = years * 12;
    const EMI = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = EMI * n;
    const interest = total - P;
    return { EMI, total, interest, monthlyRate: r * 100 };
  }, [amount, years, rate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="glass-dark rounded-3xl p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-pak-gold flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-pak-ink" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-white">Home Loan EMI</h3>
          <p className="text-white/60 text-xs">Pakistani bank rates (HBL, UBL, Meezan, NBP)</p>
        </div>
      </div>

      <div className="space-y-4">
        <SliderInput label="Loan Amount" min={1000000} max={100000000} step={1000000} value={amount} onChange={setAmount} format={(v) => `PKR ${(v / 10000000).toFixed(2)} Cr`} />
        <SliderInput label="Tenure" min={1} max={30} step={1} value={years} onChange={setYears} format={(v) => `${v} Years`} />
        <SliderInput label="Interest Rate" min={5} max={25} step={0.5} value={rate} onChange={setRate} format={(v) => `${v.toFixed(1)} %`} />

        <div className="grid grid-cols-3 gap-3 pt-2">
          <ResultCard label="Monthly EMI" value={`PKR ${(calc.EMI / 1000).toFixed(0)}K`} unit="/ month" highlight />
          <ResultCard label="Total Payable" value={`PKR ${(calc.total / 10000000).toFixed(2)} Cr`} unit="over loan" />
          <ResultCard label="Total Interest" value={`PKR ${(calc.interest / 10000000).toFixed(2)} Cr`} unit="interest" />
        </div>

        <div className="text-[11px] text-white/50 bg-white/5 rounded-xl p-3 leading-relaxed">
          <Building2 className="w-3 h-3 inline mr-1 text-pak-gold" />
          Approximate rates: HBL @ 14-16%, UBL @ 13.5-15.5%, Meezan Islamic @ 13-16%, NBP @ 13-15%. Final rate depends on salary, age &amp; property location.
        </div>
      </div>
    </motion.div>
  );
}

function SliderInput({ label, min, max, step, value, onChange, format }: {
  label: string; min: number; max: number; step: number; value: number;
  onChange: (v: number) => void; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs font-bold text-pak-gold-light uppercase tracking-wider">{label}</label>
        <span className="text-sm font-display font-bold text-white">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
