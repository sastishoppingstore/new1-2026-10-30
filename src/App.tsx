import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ListingsSection from './components/ListingsSection';
import ToolsSection from './components/ToolsSection';
import PostAdForm from './components/PostAdForm';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import SocietiesMarquee from './components/SocietiesMarquee';
import Toast from './components/Toast';
import { MessageCircle } from 'lucide-react';
import { api } from './lib/api';
import type { Property } from './lib/api';

export default function App() {
  const [active, setActive] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{ id: number; type: 'save' | 'unsave' | 'inquiry' | 'error'; message: string } | null>(null);

  // Generate persistent session id
  const sessionId = (() => {
    let id = localStorage.getItem('ppp_session');
    if (!id) {
      id = 'sess_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('ppp_session', id);
    }
    return id;
  })();

  // Load saved properties
  useEffect(() => {
    api.listSaved(sessionId)
      .then((list) => setSavedIds(list.map((s) => s.property_id)))
      .catch(() => {});
  }, [sessionId]);

  const showToast = (type: 'save' | 'unsave' | 'inquiry' | 'error', message: string) => {
    setToast({ id: Date.now(), type, message });
  };

  const handleSave = async (p: Property) => {
    try {
      await api.saveProperty(sessionId, p.id!, p.title);
      setSavedIds([...savedIds, p.id!]);
      showToast('save', `${p.title} saved to favorites`);
    } catch {
      showToast('error', 'Could not save. Try again.');
    }
  };

  const handleUnsave = async (id: number) => {
    try {
      const list = await api.listSaved(sessionId);
      const entry = list.find((s) => s.property_id === id);
      if (entry) {
        await api.unsaveProperty(entry.id);
        setSavedIds(savedIds.filter((x) => x !== id));
        showToast('unsave', 'Removed from favorites');
      }
    } catch {
      showToast('error', 'Could not remove. Try again.');
    }
  };

  const handleNavigate = (section: string) => {
    setActive(section);
    if (section === 'listings') {
      document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'tools') {
      document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'add') {
      document.getElementById('add')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchFromHero = (q: string) => {
    setSearchQuery(q);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} active={active} />
      <main>
        <Hero onSearch={handleSearchFromHero} onExplore={() => setActive('listings')} />
        <SocietiesMarquee />
        <ListingsSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          savedIds={savedIds}
          onSave={handleSave}
          onUnsave={handleUnsave}
        />
        <div id="about">
          <AboutSection />
        </div>
        <ToolsSection />
        <PostAdForm />
      </main>
      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/923467356250"
        target="_blank"
        rel="noreferrer"
        title="WhatsApp: 0346-7356250"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="font-semibold text-sm hidden sm:inline-block">WhatsApp</span>
      </a>
    </div>
  );
}
