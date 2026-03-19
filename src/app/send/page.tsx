'use client';

import MessageForm from '@/components/MessageForm';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function SendPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link href="/">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center space-x-2 mb-6 transition-colors text-sm font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            <span>Balik ke Feed</span>
          </motion.button>
        </Link>

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Kirim Pesan Anonim ✉️
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base"
            style={{ color: 'var(--text-muted)' }}
          >
            Bebas mau bilang apa aja. Tanpa nama, tanpa identitas~
          </motion.p>
        </div>

        <MessageForm />
      </div>
    </div>
  );
}
