'use client';

import { useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import MessageCard from '@/components/MessageCard';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCommentDots, faPaperPlane, faArrowTrendUp, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function HomePage() {
  const { messages, replies, loading, addReply } = useMessages();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
  const currentMessages = messages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };

  const typewriterVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200 } },
  };

  const titlePart1 = "Kirim Pesan ";
  const titlePart2 = "Anonim.";

  return (
    <div className="container mx-auto px-4 py-8 sm:py-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="text-center mb-20 sm:mb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-8 shadow-lg shadow-indigo-500/10"
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: '#0ea5e9',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <FontAwesomeIcon icon={faBolt} className="w-4 h-4" />
          <span>Realtime Anonymous Board</span>
        </motion.div>

        {/* Typewriter H1 */}
        <motion.h1
          variants={typewriterVariants}
          initial="hidden"
          animate="show"
          className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tighter"
          style={{ color: 'var(--text-primary)' }}
        >
          {titlePart1.split("").map((char, i) => (
            <motion.span key={`p1-${i}`} variants={charVariants} className="inline-block whitespace-pre">
              {char}
            </motion.span>
          ))}
          <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text relative inline-block" style={{ backgroundImage: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
            {titlePart2.split("").map((char, i) => (
              <motion.span key={`p2-${i}`} variants={charVariants} className="inline-block">
                {char}
              </motion.span>
            ))}
            {/* Animated Underline */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.8, ease: "circOut" }}
              className="absolute -bottom-2 left-0 w-full h-1.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, #0ea5e9, #6366f1)', transformOrigin: 'left' }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          Ungkapkan apa pun tanpa batas, tanpa identitas. Berbagi cerita, curhat rahasia, atau sekadar menyapa dunia. 🤫
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <Link href="/send">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="text-white px-8 py-4 rounded-2xl font-bold text-base shadow-2xl flex items-center space-x-3 mx-auto transition-all"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <FontAwesomeIcon icon={faCommentDots} className="w-5 h-5" />
              <span>Kirim Pesan Sekarang</span>
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Feed Header */}
      <section className="relative z-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl sm:text-2xl font-black flex items-center space-x-3" style={{ color: 'var(--text-primary)' }}>
            <div className="w-1.5 h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, #0ea5e9, #6366f1)' }} />
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5" style={{ color: '#0ea5e9' }} />
            <span>Live Feed</span>
          </h2>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-xs font-bold px-3 py-1.5 rounded-full shadow-inner" 
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            {messages.length} Total Pesan
          </motion.div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-56 rounded-3xl animate-pulse"
                style={{ backgroundColor: 'var(--skeleton-bg)' }}
              />
            ))}
          </div>
        ) : (
          /* Message Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentMessages.map((message) => (
              <motion.div key={message.id} variants={itemVariants}>
                <MessageCard
                  message={message}
                  replies={replies[message.id] || []}
                  onReply={(content) => addReply(message.id, content)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination Controls */}
        {!loading && messages.length > ITEMS_PER_PAGE && (
          <div className="mt-12 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={currentPage > 1 ? { scale: 1.1 } : {}}
                whileTap={currentPage > 1 ? { scale: 0.9 } : {}}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed group/prev"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                <FontAwesomeIcon 
                  icon={faChevronLeft} 
                  className={`w-4 h-4 transition-colors ${currentPage > 1 ? 'text-cyan-500 group-hover/prev:text-indigo-500' : 'text-gray-500'}`} 
                />
              </motion.button>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>Page</span>
                <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{currentPage}</span>
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>of {totalPages}</span>
              </div>

              <motion.button
                whileHover={currentPage < totalPages ? { scale: 1.1 } : {}}
                whileTap={currentPage < totalPages ? { scale: 0.9 } : {}}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed group/next"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                <FontAwesomeIcon 
                  icon={faChevronRight} 
                  className={`w-4 h-4 transition-colors ${currentPage < totalPages ? 'text-cyan-500 group-hover/next:text-indigo-500' : 'text-gray-500'}`} 
                />
              </motion.button>
            </div>
            
            {/* Visual Page dots */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                const pageNum = totalPages > 5 && currentPage > 3 
                  ? currentPage - 2 + idx 
                  : idx + 1;
                
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: currentPage === pageNum ? '#0ea5e9' : 'var(--text-faint)',
                      transform: currentPage === pageNum ? 'scale(1.5)' : 'scale(1)'
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 rounded-3xl backdrop-blur-md"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px dashed var(--card-border)',
            }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-inner" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(99, 102, 241, 0.1))' }}>
              <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <p className="text-base font-bold" style={{ color: 'var(--text-secondary)' }}>
              Belum ada pesan nih!
            </p>
            <FontAwesomeIcon icon={faCommentDots} className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-faint)' }} />
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              Jadilah yang pertama membuka obrolan anonim hari ini.
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
