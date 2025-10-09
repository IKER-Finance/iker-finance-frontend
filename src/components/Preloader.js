'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Preloader overlay rendered into document.body via a portal.
 * Props:
 *   - visible (boolean): whether the overlay is shown
 */
export default function Preloader({ visible }) {
  // avoid referencing document during SSR
  if (typeof document === 'undefined') return null;

  // You can keep the timeout in the page component; this file is only responsible
  // for the overlay rendering and animations.
  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.98 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            color: '#ffffff',
            textAlign: 'center',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ padding: '0 1rem' }}
          >
            <h1 style={{
              margin: 0,
              fontSize: '4rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textShadow: '0 6px 18px rgba(0,0,0,0.25)'
            }}>
              IKER Finance
            </h1>

            <p style={{ marginTop: '0.5rem', fontSize: '1.125rem', opacity: 0.95 }}>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
