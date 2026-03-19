'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faThumbtack, faHeart, faPaperPlane, faStar } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Message, Reply } from '@/types';
import ReplyCard from '@/components/ReplyCard';
import { parseSupabaseDate } from '@/lib/dateUtils';

interface MessageCardProps {
  message: Message;
  replies?: Reply[];
  onReply?: (content: string, parentId?: any) => void;
}

export default function MessageCard({ message, replies = [], onReply }: MessageCardProps) {
  const [isExpanding, setIsExpanding] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply?.(replyText);
    setReplyText('');
  };

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)' }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative rounded-3xl p-6 transition-all duration-300 flex flex-col backdrop-blur-xl"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 24px -8px rgba(0,0,0,0.2)',
        borderColor: message.is_pinned
          ? 'rgba(217,119,6,0.35)'
          : message.is_loved
            ? 'rgba(219,39,119,0.25)'
            : 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Background glow for highlighted messages */}
      {message.is_highlighted && (
        <div className="absolute inset-0 rounded-3xl bg-indigo-500/5 blur-xl pointer-events-none" />
      )}

      {/* Status Badges */}
      {message.is_pinned && (
        <div className="absolute -top-3 -right-3 p-2 bg-linear-to-br from-amber-400 to-amber-600 rounded-full shadow-lg shadow-amber-500/30 z-10 border border-white/20">
            <FontAwesomeIcon icon={faThumbtack} className="w-3 h-3 text-white" />
        </div>
      )}
      {message.is_loved && (
        <div className="absolute -top-3 -left-3 p-2 bg-linear-to-br from-pink-400 to-pink-600 rounded-full shadow-lg shadow-pink-500/30 z-10 border border-white/20">
            <FontAwesomeIcon icon={faHeart} className="w-3 h-3 text-white" />
        </div>
      )}
      {message.is_highlighted && (
        <div className="absolute inset-0 rounded-3xl ring-2 ring-indigo-500/30 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-start space-x-4 relative z-10">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500 to-indigo-500 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
          <img
            src={avatarUrl}
            alt="Avatar"
            className="relative w-11 h-11 rounded-xl p-0.5 object-cover"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span
              className="font-black text-sm text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
            >
              Anonim
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">•</span>
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
              {format(parseSupabaseDate(message.created_at), 'd MMM yyyy, HH:mm', { locale: idLocale })}
            </span>
          </div>
          <p
            className="mt-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {message.message}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-auto pt-5 relative z-10">
        <div
          className="flex items-center pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <button
            onClick={() => setIsExpanding(!isExpanding)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              backgroundColor: isExpanding ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
              color: isExpanding ? '#6366f1' : 'var(--text-muted)',
              border: isExpanding ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
            }}
          >
              <FontAwesomeIcon icon={faMessage} className="w-4 h-4" />
            <span>{replies.length} Balasan</span>
          </button>
        </div>
      </div>

      {/* Reply Thread */}
      <AnimatePresence>
        {isExpanding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden relative z-10"
          >
            <div
              className="mt-4 space-y-4 pl-4"
              style={{ borderLeft: '2px solid rgba(99,102,241,0.2)' }}
            >
              {replies.length === 0 && (
                <p className="text-xs py-3 font-medium" style={{ color: 'var(--text-faint)' }}>
                  Belum ada balasan. Jadi yang pertama! 🚀
                </p>
              )}

              {replies.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}

              {/* Reply Input */}
              <div className="relative mt-3 group/input">
                <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover/input:opacity-50 transition duration-500"></div>
                <div className="relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan kamu..."
                    className="w-full rounded-2xl p-4 pr-14 text-sm focus:outline-none transition-all resize-none block backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-primary)',
                    } as React.CSSProperties}
                    rows={2}
                  />
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
