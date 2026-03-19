'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useMessages } from '@/hooks/useMessages';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faThumbtack, faStar, faMagnifyingGlass, faShieldHalved, faLock, faCrown, faMessage, faHeart, faEnvelope, faChevronDown, faChevronUp, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar, faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { parseSupabaseDate } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { messages, replies, loading, addReply, toggleLove, togglePin, toggleHighlight } = useMessages();
  const [activeReplyId, setActiveReplyId] = useState<any | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedId, setExpandedId] = useState<any | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(i);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (password === adminPass) {
      setIsAuthenticated(true);
      Swal.fire({
        icon: 'success',
        title: 'Welcome Admin!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Password salah! Coba lagi ya.',
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      });
    }
  };

  const handleAdminReply = async (messageId: any) => {
    if (!replyContent.trim()) return;
    try {
      await addReply(messageId, replyContent, true);
      setReplyContent('');
      setActiveReplyId(null);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Balas',
        text: err.message,
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      });
    }
  };

  const handleDelete = async (id: any, table: 'messages' | 'replies' = 'messages') => {
    const result = await Swal.fire({
      title: 'Yakin mau hapus?',
      text: 'Data yang dihapus nggak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: 'var(--card-bg)',
      color: 'var(--text-primary)',
      customClass: { popup: 'rounded-3xl' },
    });

    if (result.isConfirmed) {
      if (!supabase) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Hapus',
          text: 'Supabase client tidak ditemukan. Cek environment variables ya.',
          background: 'var(--card-bg)',
          color: 'var(--text-primary)',
        });
        return;
      }
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Hapus',
          text: error.message,
          background: 'var(--card-bg)',
          color: 'var(--text-primary)',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Data berhasil dihapus dari server.',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--card-bg)',
          color: 'var(--text-primary)',
        });
      }
    }
  };

  const handleTogglePin = async (id: any, currentStatus: boolean) => {
    try {
      await togglePin(id, currentStatus);
      Swal.fire({
        icon: 'success',
        title: currentStatus ? 'Pin dilepas' : 'Pesan di-pin',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal update pin',
        text: err.message,
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      });
    }
  };

  const handleToggleHighlight = async (id: any, currentStatus: boolean) => {
    try {
      await toggleHighlight(id, currentStatus);
      Swal.fire({
        icon: 'success',
        title: currentStatus ? 'Highlight dilepas' : 'Pesan di-highlight',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal update highlight',
        text: err.message,
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      });
    }
  };

  const handleToggleLove = async (id: any, currentStatus: boolean) => {
    try {
      await toggleLove(id, currentStatus);
      Swal.fire({
        icon: 'success',
        title: currentStatus ? 'Unloved' : 'Loved ❤️',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
      });
    }
  };

  const filteredMessages = messages.filter(m =>
    m.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReplies = Object.values(replies).reduce((sum, arr) => sum + arr.length, 0);
  const pinnedCount = messages.filter(m => m.is_pinned).length;
  const lovedCount = messages.filter(m => m.is_loved).length;

  // ── Login Screen ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md z-10"
        >
          {/* Glass login card */}
          <div className="rounded-3xl p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
               style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="flex flex-col items-center text-center mb-10">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)]"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
              >
                <FontAwesomeIcon icon={faShieldHalved} className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                System Access
              </h1>
              <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                Authenticate to manage the board
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group/input">
                <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-indigo-500 rounded-xl blur opacity-20 group-hover/input:opacity-50 transition duration-500"></div>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-faint)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Access Key"
                    className="w-full rounded-xl py-4 pl-12 pr-4 text-sm font-mono focus:outline-none transition-all block backdrop-blur-sm shadow-inner"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--text-primary)',
                    } as React.CSSProperties}
                    required
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 20px 40px -10px rgba(14, 165, 233, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white text-sm shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Initialize Session
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}
          >
            <FontAwesomeIcon icon={faCrown} className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Command Center
            </h1>
            <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage incoming anonymous transmissions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Pesan', value: messages.length, icon: faEnvelope, gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' },
          { label: 'Total Balasan', value: totalReplies, icon: faMessage, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
          { label: 'Pesan Di-pin', value: pinnedCount, icon: faThumbtack, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
          { label: 'Pesan Di-love', value: lovedCount, icon: faHeart, gradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
        ].map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="rounded-2xl p-5 relative overflow-hidden group backdrop-blur-xl transition-all"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: stat.gradient, filter: 'blur(30px)' }} />
            <div className="flex items-center space-x-4 relative z-10">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                style={{ background: stat.gradient }}
              >
                <FontAwesomeIcon icon={stat.icon} className="w-5 h-5 text-white" />
              </div>
              <div>
                <p
                  className="text-3xl font-black leading-none mb-1 text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, var(--text-primary), var(--text-faint))'
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-8 group/search z-10">
        <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-indigo-500 rounded-2xl blur opacity-10 group-hover/search:opacity-30 transition duration-500 pointer-events-none"></div>
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-faint)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transmissions..."
            className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none transition-all block backdrop-blur-md shadow-inner"
            style={{
              backgroundColor: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--text-primary)',
            } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Message List */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 rounded-3xl animate-pulse" style={{ backgroundColor: 'var(--skeleton-bg)' }} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((m) => {
              const msgReplies = replies[m.id] || [];
              const isExpanded = expandedId === m.id;

              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-3xl overflow-hidden backdrop-blur-xl transition-shadow hover:shadow-2xl"
                  style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                >
                  {/* Main Row */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-br from-cyan-500 to-indigo-500 rounded-xl blur-sm opacity-30" />
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`}
                          className="relative w-12 h-12 rounded-xl shrink-0 object-cover"
                          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}
                          alt=""
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>#{m.id}</span>
                          <span style={{ color: 'var(--text-faint)' }}>•</span>
                          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            {format(parseSupabaseDate(m.created_at), 'd MMM yyyy, HH:mm', { locale: idLocale })}
                          </span>
                          {m.is_pinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              <FontAwesomeIcon icon={faThumbtack} className="w-2.5 h-2.5" /> Pinned
                            </span>
                          )}
                          {m.is_highlighted && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              <FontAwesomeIcon icon={faStar} className="w-2.5 h-2.5" /> Highlighted
                            </span>
                          )}
                          {m.is_loved && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                              <FontAwesomeIcon icon={faHeart} className="w-2.5 h-2.5 fill-current" /> Loved
                            </span>
                          )}
                        </div>
                        <p className="text-[15px] leading-relaxed wrap-break-word font-medium" style={{ color: 'var(--text-primary)' }}>
                          {m.message}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-5 flex-wrap pt-4 border-t border-white/5">
                      {/* Love Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleLove(m.id, m.is_loved)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          backgroundColor: m.is_loved ? 'rgba(236,72,153,0.15)' : 'var(--input-bg)',
                          color: m.is_loved ? '#ec4899' : 'var(--text-muted)',
                          border: `1px solid ${m.is_loved ? 'rgba(236,72,153,0.3)' : 'var(--card-border)'}`,
                        }}
                      >
                        {m.is_loved ? <FontAwesomeIcon icon={farHeart} className="w-4 h-4" /> : <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />}
                        <span className="hidden sm:inline">{m.is_loved ? 'Unlove' : 'Love'}</span>
                      </motion.button>

                      {/* Pin Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTogglePin(m.id, m.is_pinned)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          backgroundColor: m.is_pinned ? 'rgba(245,158,11,0.15)' : 'var(--input-bg)',
                          color: m.is_pinned ? '#f59e0b' : 'var(--text-muted)',
                          border: `1px solid ${m.is_pinned ? 'rgba(245,158,11,0.3)' : 'var(--card-border)'}`,
                        }}
                      >
                        {m.is_pinned ? <FontAwesomeIcon icon={faThumbtack} className="w-4 h-4" /> : <FontAwesomeIcon icon={faThumbtack} className="w-4 h-4" />}
                        <span className="hidden sm:inline">{m.is_pinned ? 'Unpin' : 'Pin'}</span>
                      </motion.button>

                      {/* Highlight Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleHighlight(m.id, m.is_highlighted)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          backgroundColor: m.is_highlighted ? 'rgba(99,102,241,0.15)' : 'var(--input-bg)',
                          color: m.is_highlighted ? '#818cf8' : 'var(--text-muted)',
                          border: `1px solid ${m.is_highlighted ? 'rgba(99,102,241,0.3)' : 'var(--card-border)'}`,
                        }}
                      >
                        {m.is_highlighted ? <FontAwesomeIcon icon={farStar} className="w-4 h-4" /> : <FontAwesomeIcon icon={faStar} className="w-4 h-4" />}
                        <span className="hidden sm:inline">{m.is_highlighted ? 'Unhighlight' : 'Highlight'}</span>
                      </motion.button>

                      {/* Reply Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveReplyId(activeReplyId === m.id ? null : m.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                        style={{
                          backgroundColor: activeReplyId === m.id ? 'rgba(14,165,233,0.15)' : 'var(--input-bg)',
                          color: activeReplyId === m.id ? '#38bdf8' : 'var(--text-muted)',
                          border: `1px solid ${activeReplyId === m.id ? 'rgba(14,165,233,0.3)' : 'var(--card-border)'}`,
                        }}
                      >
                        <FontAwesomeIcon icon={faMessage} className="w-4 h-4" />
                        <span className="hidden sm:inline">Reply</span>
                      </motion.button>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Expand Replies */}
                      {msgReplies.length > 0 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : m.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-white/5"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <span>{msgReplies.length} Replies</span>
                          {isExpanded ? <FontAwesomeIcon icon={faChevronUp} className="w-4 h-4" /> : <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />}
                        </button>
                      )}

                      {/* Delete Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(m.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-red-500/10 hover:text-red-400"
                        style={{
                          backgroundColor: 'transparent',
                          color: 'var(--text-faint)',
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Owner Reply Form */}
                  <AnimatePresence>
                    {activeReplyId === m.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="p-5 rounded-2xl relative group/input" style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)' }}>
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20"
                                style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
                              >
                                <FontAwesomeIcon icon={faCrown} className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-bold tracking-wide" style={{ color: '#38bdf8' }}>
                                Owner Response Mode
                              </span>
                            </div>
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Type your official response..."
                              className="w-full rounded-xl p-4 text-sm focus:outline-none resize-none transition-all block backdrop-blur-md"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-primary)',
                              } as React.CSSProperties}
                              rows={3}
                            />
                            <div className="flex justify-end mt-4">
                              <motion.button
                                whileHover={{ scale: 1.03, boxShadow: '0 10px 20px -5px rgba(14,165,233,0.3)' }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAdminReply(m.id)}
                                disabled={!replyContent.trim()}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', border: '1px solid rgba(255,255,255,0.1)' }}
                              >
                                <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                                Send Response
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reply History */}
                  <AnimatePresence>
                    {isExpanded && msgReplies.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 space-y-3">
                          <div
                            className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 mb-3"
                            style={{ color: 'var(--text-faint)' }}
                          >
                            <FontAwesomeIcon icon={faMessage} className="w-3.5 h-3.5" />
                            Transmission Logs ({msgReplies.length})
                          </div>
                          {msgReplies.map((r) => (
                            <div
                              key={r.id}
                              className="flex items-start gap-4 p-4 rounded-2xl group/reply transition-all"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.id}`}
                                className="w-8 h-8 rounded-lg shrink-0 object-cover"
                                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}
                                alt=""
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {r.is_owner ? (
                                    <span
                                      className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase inline-flex items-center tracking-wider shadow-sm"
                                      style={{
                                        backgroundColor: 'rgba(14,165,233,0.15)',
                                        color: '#38bdf8',
                                        border: '1px solid rgba(14,165,233,0.2)'
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faCrown} className="w-3 h-3 mr-1" />
                                      Owner
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Anonim</span>
                                  )}
                                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-faint)' }}>
                                    {format(parseSupabaseDate(r.created_at), 'd MMM, HH:mm', { locale: idLocale })}
                                  </span>
                                </div>
                                <p className="text-[14px] leading-relaxed wrap-break-word font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  {r.reply}
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(r.id, 'replies')}
                                className="opacity-0 group-hover/reply:opacity-100 p-2 rounded-xl transition-all hover:bg-red-500/10"
                                style={{ color: '#ef4444' }}
                                title="Delete Reply"
                              >
                                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMessages.length === 0 && (
        <div className="text-center py-24 rounded-3xl" style={{ backgroundColor: 'rgba(15,23,42,0.2)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-faint)' }} />
          <p className="text-base font-bold" style={{ color: 'var(--text-muted)' }}>
            {searchQuery ? 'No transmissions matched your query.' : 'Awaiting incoming transmissions.'}
          </p>
        </div>
      )}
    </div>
  );
}
