'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './common/logo';

export default function Preloader({ visible }) {

  if (typeof document === 'undefined') return null;


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
            style={{ padding: '0 1rem', display: 'flex', justifyContent: 'center' }}
          >
            <div style={{ filter: 'brightness(0) invert(1)' }}>
              <Logo size="hero" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
