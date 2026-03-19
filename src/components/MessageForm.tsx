'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faFaceSmile, faCircleInfo, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function MessageForm() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.length > 500) return;

    const lastSent = localStorage.getItem('last_message_sent');
    if (lastSent && Date.now() - parseInt(lastSent) < 30000) {
      setError('Sabar ya bestie~ Tunggu 30 detik dulu sebelum kirim lagi ⏳');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase.from('messages').insert([
        {
          message: message,
          is_pinned: false,
          is_highlighted: false,
        },
      ]);

      if (supabaseError) throw supabaseError;

      localStorage.setItem('last_message_sent', Date.now().toString());
      setMessage('');
      setSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Waduh, ada yang error nih. Coba lagi ya!');
    } finally {
      setLoading(false);
    }
  };

  const charPercent = (message.length / 500) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto glass rounded-2xl p-6 sm:p-10 relative overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
        <FontAwesomeIcon icon={faPaperPlane} className="w-24 h-24 rotate-12" style={{ color: 'var(--text-primary)' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2.5" style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
            <FontAwesomeIcon icon={faFaceSmile} className="w-full h-full text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Mau curhat apa nih? 🤫
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Tenang, identitas kamu aman kok~
            </p>
          </div>
        </div>

        {/* Success State */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-14 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 p-4"
                style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}
              >
                <FontAwesomeIcon icon={faCircleCheck} className="w-full h-full" style={{ color: 'var(--accent-green)' }} />
              </motion.div>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Pesan terkirim! 🎉
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Redirecting ke feed...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan anonim kamu di sini..."
                className="w-full min-h-[160px] rounded-xl p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 transition-all resize-none"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--input-focus)',
                } as React.CSSProperties}
                maxLength={500}
                required
              />
              {/* Character counter */}
              <div className="absolute bottom-3 right-4 flex items-center space-x-1.5">
                <div className="w-4 h-4 rounded-full relative" style={{ backgroundColor: 'var(--skeleton-bg)' }}>
                  <svg className="w-4 h-4 -rotate-90" viewBox="0 0 20 20">
                    <circle
                      cx="10" cy="10" r="8"
                      fill="none"
                      stroke={charPercent > 90 ? 'var(--accent-red)' : 'var(--accent-purple)'}
                      strokeWidth="3"
                      strokeDasharray={`${charPercent * 0.503} 50.3`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span
                  className="text-[10px] font-mono font-medium"
                  style={{ color: charPercent > 90 ? 'var(--accent-red)' : 'var(--text-faint)' }}
                >
                  {message.length}/500
                </span>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 rounded-lg text-xs flex items-center space-x-2"
                  style={{
                    backgroundColor: 'rgba(220,38,38,0.06)',
                    border: '1px solid rgba(220,38,38,0.15)',
                    color: 'var(--accent-red)',
                  }}
                >
                  <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !message.trim()}
              className="w-full text-white py-3.5 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-shadow"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 6px 24px rgba(124,58,237,0.25)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                  <span>Kirim Anonim</span>
                </>
              )}
            </motion.button>
          </form>
        )}

        <p className="mt-6 text-center text-[10px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
          Dengan mengirim pesan, kamu setuju buat jaga vibes tetap positif ✨
          <br />Keep it chill & respectful ya!
        </p>
      </div>
    </motion.div>
  );
}
