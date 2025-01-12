import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

interface ErrorMessageProps {
  isVisible: boolean;
}

export function ErrorMessage({ isVisible }: ErrorMessageProps) {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Error: Lost connection to secure server. Access denied.";

  useEffect(() => {
    if (isVisible) {
      let index = 0;
      const intervalId = setInterval(() => {
        setDisplayText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) {
          clearInterval(intervalId);
        }
      }, 50);

      return () => clearInterval(intervalId);
    } else {
      setDisplayText('');
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full bg-destructive text-destructive-foreground p-4 text-center z-50"
    >
      <p className="text-lg font-bold terminal-text">{displayText}</p>
    </motion.div>
  );
}

