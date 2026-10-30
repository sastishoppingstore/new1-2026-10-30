import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Bed, Bath, Maximize2, MessageCircle, Phone, BadgeCheck, Building2, Sparkles, Camera, Compass } from 'lucide-react';
import * as THREE from 'three';
import type { Property } from '../lib/api';
import { formatPKR, resolveImageUrl } from '../lib/api';

interface Props {
  property: Property | null;
  open: boolean;
  onClose: () => void;
  onInquiry: (p: Property) => void;
}

function VirtualTour3D({ property }: { property: Property }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth, h = mount.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1f14);
    scene.fog = new THREE.Fog(0x0a1f14, 8, 25);
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.set(6, 4, 6);
    camera.lookAt(0, 1, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffe5a0, 1.2);
    dir.position.set(5, 8, 5);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0x66ffaa, 0.4);
    dir2.position.set(-5, 4, -3);
    scene.add(dir2);

    // Floor with checkerboard
    const floorTex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#1a3322';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#243f2c';
      for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) {
        if ((x + y) % 2 === 0) ctx.fillRect(x * 32, y * 32, 32, 32);
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(4, 4);
      return t;
    })();
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.4, metalness: 0.2 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Property based on type
    const grp = new THREE.Group();
    const isHouse = property.type === 'House' || property.type === 'Farmhouse';
    const isTower = property.type === 'Apartment' || property.type === 'Commercial';
    const isPlot = property.type === 'Plot';

    if (isPlot) {
      // Just a plot: walls, ground, pillars
      const plot = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.1, 4),
        new THREE.MeshStandardMaterial({ color: 0xc9a85a, metalness: 0.3, roughness: 0.5 })
      );
      plot.position.y = 0.05;
      grp.add(plot);
      // 4 corner markers
      for (let i = 0; i < 4; i++) {
        const m = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.5, 12),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: 0xd4af37, emissiveIntensity: 0.5 })
        );
        const ang = (i / 4) * Math.PI * 2;
        m.position.set(Math.cos(ang) * 2, 0.3, Math.sin(ang) * 2);
        grp.add(m);
      }
    } else if (isHouse) {
      // Walls
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xfbfaef, roughness: 0.6 });
      grp.add(new THREE.Mesh(new THREE.BoxGeometry(4, 2.4, 0.1), wallMat).translateX(0).translateY(1.2).translateZ(2));
      grp.add(new THREE.Mesh(new THREE.BoxGeometry(4, 2.4, 0.1), wallMat).translateX(0).translateY(1.2).translateZ(-2));
      grp.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 4), wallMat).translateX(2).translateY(1.2).translateZ(0));
      grp.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 4), wallMat).translateX(-2).translateY(1.2).translateZ(0));
      // Roof
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3, 1.2, 4),
        new THREE.MeshStandardMaterial({ color: 0x01411c, flatShading: true })
      );
      roof.position.y = 3;
      roof.rotation.y = Math.PI / 4;
      grp.add(roof);
      // Windows
      const winMat = new THREE.MeshStandardMaterial({ color: 0xffe88a, emissive: 0xffd700, emissiveIntensity: 0.7 });
      for (let i = -1; i <= 1; i++) {
        const w = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.05), winMat);
        w.position.set(i * 1.2, 1.2, 2.01);
        grp.add(w);
      }
      // Door
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 1.3, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x8c6e1a, metalness: 0.4, roughness: 0.4 })
      );
      door.position.set(0, 0.65, 2.01);
      grp.add(door);
    } else if (isTower) {
      const heights = [1.4, 1.2, 1.0];
      const colors = [0xfbfaef, 0x046a38, 0x01411c];
      let y = 0;
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(2, heights[i], 2),
          new THREE.MeshStandardMaterial({ color: colors[i], metalness: 0.2, roughness: 0.5 })
        );
        b.position.y = y + heights[i] / 2;
        grp.add(b);
        const trim = new THREE.Mesh(
          new THREE.BoxGeometry(2.1, 0.05, 2.1),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.15 })
        );
        trim.position.y = y;
        grp.add(trim);
        y += heights[i];
      }
    } else {
      // Default block
      grp.add(new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 3),
        new THREE.MeshStandardMaterial({ color: 0x046a38, metalness: 0.3, roughness: 0.4 })
      )).translateY(1);
    }
    scene.add(grp);

    // Camera orbit
    let rad = 9, theta = Math.PI / 4, phi = Math.PI / 3;
    let dragging = false, lastX = 0, lastY = 0;
    const onDown = (e: PointerEvent) => { dragging = true; setAutoRotate(false); lastX = e.clientX; lastY = e.clientY; };
    const onUp = () => { dragging = false; setTimeout(() => setAutoRotate(true), 2000); };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      theta -= (e.clientX - lastX) * 0.008;
      phi = Math.max(0.2, Math.min(Math.PI / 2, phi - (e.clientY - lastY) * 0.008));
      lastX = e.clientX; lastY = e.clientY;
    };
    mount.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onMove);

    let raf = 0;
    const start = performance.now();
    const animate = (t: number) => {
      const elapsed = (t - start) / 1000;
      if (autoRotate) theta = elapsed * 0.3;
      camera.position.x = rad * Math.sin(phi) * Math.cos(theta);
      camera.position.y = rad * Math.cos(phi);
      camera.position.z = rad * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 1.2, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      mount.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointermove', onMove);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          const mat = m.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat.dispose();
        }
      });
    };
  }, [property.id, property.type, autoRotate]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
      <div className="absolute top-3 left-3 glass-dark text-white text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
        <Compass className="w-3 h-3 text-pak-gold" />
        Drag to rotate • Auto-tour ON
      </div>
    </div>
  );
}

export default function PropertyDetailsModal({ property, open, onClose, onInquiry }: Props) {
  const [tab, setTab] = useState<'tour' | 'gallery' | 'amenities'>('tour');
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) { setSent(false); setForm({ name: '', phone: '', email: '', message: '' }); }
  }, [open]);

  if (!property) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSending(true);
    try {
      await onInquiry(property);
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  const gallery = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image, property.image, property.image];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-pak-ink/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, rotateY: -20, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="bg-pak-cream rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Hero with 3D tour */}
            <div className="relative h-72 sm:h-96 bg-pak-ink overflow-hidden">
              <VirtualTour3D property={property} />
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={onClose}
                  className="w-10 h-10 glass-dark rounded-full flex items-center justify-center text-white hover:bg-pak-gold hover:text-pak-ink transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Tabs */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 glass-dark rounded-full p-1 z-10">
                {(['tour', 'gallery', 'amenities'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                      tab === t ? 'bg-pak-gold text-pak-ink' : 'text-white hover:text-pak-gold-light'
                    }`}
                  >
                    {t === 'tour' ? '🎮 3D Tour' : t === 'gallery' ? '📸 Gallery' : '✨ Amenities'}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Details */}
                <div className="lg:col-span-2">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {property.noc_verified && (
                      <span className="inline-flex items-center gap-1 bg-pak-green text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <BadgeCheck className="w-3 h-3" /> NOC Approved
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 bg-pak-gold/20 text-pak-ink text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {property.purpose}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-pak-cream border border-pak-gold/40 text-pak-ink text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {property.possession}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-pak-ink mb-2">
                    {property.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-pak-green mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">{property.location} • {property.society}, {property.city}</span>
                  </div>
                  <div className="flex items-end gap-3 mb-6 pb-6 border-b border-pak-gold/20">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-pak-ink/60 font-semibold">Asking Price</div>
                      <div className="font-display text-4xl font-bold text-gold-grad">{formatPKR(property.price_pkr)}</div>
                    </div>
                    <span className="text-xs text-pak-ink/50 mb-2">({property.purpose === 'Rent' ? 'per year' : 'transferable'})</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {property.bedrooms !== undefined && (
                      <div className="glass rounded-2xl p-4 text-center">
                        <Bed className="w-5 h-5 text-pak-green mx-auto mb-1" />
                        <div className="text-lg font-bold text-pak-ink">{property.bedrooms}</div>
                        <div className="text-[11px] text-pak-ink/60">Bedrooms</div>
                      </div>
                    )}
                    {property.bathrooms !== undefined && (
                      <div className="glass rounded-2xl p-4 text-center">
                        <Bath className="w-5 h-5 text-pak-green mx-auto mb-1" />
                        <div className="text-lg font-bold text-pak-ink">{property.bathrooms}</div>
                        <div className="text-[11px] text-pak-ink/60">Bathrooms</div>
                      </div>
                    )}
                    <div className="glass rounded-2xl p-4 text-center">
                      <Maximize2 className="w-5 h-5 text-pak-green mx-auto mb-1" />
                      <div className="text-lg font-bold text-pak-ink">{property.area_marla}</div>
                      <div className="text-[11px] text-pak-ink/60">Marla</div>
                    </div>
                    <div className="glass rounded-2xl p-4 text-center">
                      <Building2 className="w-5 h-5 text-pak-green mx-auto mb-1" />
                      <div className="text-lg font-bold text-pak-ink">{property.area_sqft?.toLocaleString('en-PK')}</div>
                      <div className="text-[11px] text-pak-ink/60">Sq. Ft.</div>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-pak-ink mb-2">Description</h3>
                  <p className="text-sm text-pak-ink/75 leading-relaxed mb-6">{property.description}</p>

                  {tab === 'gallery' && (
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {gallery.map((g, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img
                            src={resolveImageUrl(g)}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-pak-ink/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === 'amenities' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                      {(property.amenities ?? ['Boundary Wall', 'Underground Wiring', 'Sui Gas', 'Sewerage', 'Wide Carpeted Road', 'Mosque Nearby', 'Park Access', 'School Nearby', 'Hospital Nearby']).map((a) => (
                        <div key={a} className="flex items-center gap-2 text-sm text-pak-ink/80 py-2 px-3 rounded-lg bg-white">
                          <Sparkles className="w-3.5 h-3.5 text-pak-gold" /> {a}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="rounded-2xl overflow-hidden border border-pak-gold/30 bg-pak-ink text-white p-6 text-center">
                    <div className="text-pak-gold text-xs font-bold uppercase tracking-widest mb-1">Society Location</div>
                    <div className="font-display text-2xl font-bold mb-2">{property.society}, {property.city}</div>
                    <div className="text-sm text-white/70 mb-3">{property.location}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-white/5 rounded-lg p-2"><div className="text-pak-gold font-bold">2 km</div>Airport</div>
                      <div className="bg-white/5 rounded-lg p-2"><div className="text-pak-gold font-bold">5 min</div>School</div>
                      <div className="bg-white/5 rounded-lg p-2"><div className="text-pak-gold font-bold">3 min</div>Hospital</div>
                    </div>
                  </div>
                </div>

                {/* Right: Contact form */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4 glass rounded-3xl p-6">
                    <div className="text-pak-green text-xs font-bold uppercase tracking-widest mb-1">Schedule Visit</div>
                    <h3 className="font-display text-2xl font-bold text-pak-ink mb-4">Book a Tour</h3>
                    {sent ? (
                      <div className="bg-pak-green/10 border border-pak-green/30 text-pak-green rounded-2xl p-4 text-center">
                        <BadgeCheck className="w-8 h-8 mx-auto mb-2" />
                        <div className="font-semibold">Inquiry sent!</div>
                        <div className="text-xs mt-1">Agent will contact you shortly via call/WhatsApp.</div>
                      </div>
                    ) : (
                      <form onSubmit={submit} className="space-y-3">
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your Name *"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-pak-gold/30 text-sm focus:outline-none focus:ring-2 focus:ring-pak-gold"
                        />
                        <input
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="Phone (e.g. 0346-7356250) *"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-pak-gold/30 text-sm focus:outline-none focus:ring-2 focus:ring-pak-gold"
                        />
                        <input
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="Email (optional)"
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-pak-gold/30 text-sm focus:outline-none focus:ring-2 focus:ring-pak-gold"
                        />
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="I'm interested in this property..."
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-pak-gold/30 text-sm focus:outline-none focus:ring-2 focus:ring-pak-gold resize-none"
                        />
                        <button
                          type="submit"
                          disabled={sending}
                          className="w-full bg-gradient-to-r from-pak-green to-pak-green-light text-white font-semibold py-3 rounded-xl hover:shadow-lg transition disabled:opacity-60"
                        >
                          {sending ? 'Sending...' : 'Send Inquiry'}
                        </button>
                      </form>
                    )}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <a
                        href={`tel:${property.agent_phone}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-pak-gold/15 text-pak-ink text-xs font-semibold hover:bg-pak-gold/30 transition"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a
                        href={`https://wa.me/${(property.agent_phone || '03467356250').replace(/\D/g, '').replace(/^0/, '92')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-500/15 text-green-700 text-xs font-semibold hover:bg-green-500/30 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </div>
                    <div className="mt-4 pt-4 border-t border-pak-gold/20 text-xs text-pak-ink/70 text-center">
                      <div className="font-semibold text-pak-ink">{property.agent_name}</div>
                      <div>Verified Agent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
