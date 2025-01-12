import React from 'react';
import { motion } from 'framer-motion';

interface ErrorOverlayProps {
  isVisible: boolean;
}

export function ErrorOverlay({ isVisible }: ErrorOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-center"
      >
        <p className="text-3xl text-red-500 font-bold mb-4">Access Denied</p>
        <p className="text-xl text-gray-400">Developer tools are not allowed on this page.</p>
      </motion.div>
    </motion.div>
  );
}

