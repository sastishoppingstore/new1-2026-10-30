import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Heart } from 'lucide-react';

interface ToastState {
  id: number;
  type: 'save' | 'unsave' | 'inquiry' | 'error';
  message: string;
}

interface Props {
  toast: ToastState | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: Props) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          onAnimationComplete={() => setTimeout(onClose, 3000)}
        >
          <div className="glass-dark text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              toast.type === 'save' ? 'bg-red-500' : toast.type === 'inquiry' ? 'bg-pak-green' : 'bg-pak-gold'
            }`}>
              {toast.type === 'save' || toast.type === 'unsave' ? <Heart className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            </div>
            <span className="text-sm font-semibold">{toast.message}</span>
            <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
