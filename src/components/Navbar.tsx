'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faChartLine, faPaperPlane, faMoon, faSun, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!mounted) return (
    <nav className="sticky top-0 z-50 w-full h-16 border-b" style={{ borderColor: 'var(--nav-border)', backgroundColor: 'var(--nav-bg)' }} />
  );

  const navLinks = [
    { href: '/send', label: 'Kirim Pesan', icon: faPaperPlane, accent: true },
    { href: '/dashboard', label: 'Dashboard', icon: faChartLine, accent: false },
  ];

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
      style={{
        backgroundColor: 'var(--nav-bg)',
        borderColor: 'var(--nav-border)',
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <motion.div
            whileHover={{ rotate: 12 }}
            className="p-2 rounded-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
          >
            <FontAwesomeIcon icon={faMessage} className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Anon<span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>Board</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  link.accent
                    ? 'text-white shadow-lg'
                    : pathname === link.href
                      ? ''
                      : ''
                }`}
                style={
                  link.accent
                    ? { background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }
                    : {
                        backgroundColor: pathname === link.href ? 'var(--badge-owner-bg)' : 'transparent',
                        color: pathname === link.href ? 'var(--accent-purple)' : 'var(--btn-icon-idle)',
                      }
                }
              >
                <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />
                <span>{link.label}</span>
              </motion.button>
            </Link>
          ))}

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-lg transition-colors"
            style={{ color: 'var(--btn-icon-idle)' }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <FontAwesomeIcon icon={faSun} className="w-5 h-5 text-amber-400" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <FontAwesomeIcon icon={faMoon} className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden items-center space-x-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg"
            style={{ color: 'var(--btn-icon-idle)' }}
          >
            {theme === 'dark' ? <FontAwesomeIcon icon={faSun} className="w-5 h-5 text-amber-400" /> : <FontAwesomeIcon icon={faMoon} className="w-5 h-5" />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg"
            style={{ color: 'var(--text-primary)' }}
          >
            {mobileOpen ? <FontAwesomeIcon icon={faXmark} className="w-5 h-5" /> : <FontAwesomeIcon icon={faBars} className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden border-t"
            style={{
              backgroundColor: 'var(--nav-bg)',
              borderColor: 'var(--nav-border)',
            }}
          >
            <div className="p-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all"
                    style={
                      link.accent
                        ? { background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: 'white' }
                        : {
                            backgroundColor: pathname === link.href ? 'var(--badge-owner-bg)' : 'transparent',
                            color: pathname === link.href ? 'var(--accent-purple)' : 'var(--text-secondary)',
                          }
                    }
                  >
                    <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
