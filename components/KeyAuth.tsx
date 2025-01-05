import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

interface KeyAuthProps {
  onAuthenticate: () => void;
}

export function KeyAuth({ onAuthenticate }: KeyAuthProps) {
  const [keyPresses, setKeyPresses] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'g') {
        setKeyPresses(prev => [...prev, 'g']);
      } else {
        setKeyPresses([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (keyPresses.length === 2) {
      onAuthenticate();
    }
  }, [keyPresses, onAuthenticate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4"
    >
      <motion.h2
        className="text-4xl font-bold mb-2 terminal-text"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        404 Error
      </motion.h2>
      <motion.p
        className="text-lg text-muted-foreground"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Access Denied: You don't have permission to use this site.
      </motion.p>
      <motion.div
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        [ERR_CODE: 0x8007045D]
      </motion.div>
    </motion.div>
  );
}

