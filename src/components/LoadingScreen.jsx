import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const bulbVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 1
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-blue-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <motion.div
        variants={bulbVariants}
        initial="hidden"
        animate="visible"
      >
        <svg width="128" height="128" viewBox="0 0 100 100">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d="M50,85 C40,85 35,80 35,75 L65,75 C65,80 60,85 50,85 Z"
            fill="#9ca3af"
          />
          <motion.path
            d="M40,75 L60,75 L60,70 L40,70 Z"
            fill="#6b7280"
          />
          <motion.path
            d="M50,10 C30,10 20,30 20,50 C20,70 35,70 35,70 L65,70 C65,70 80,70 80,50 C80,30 70,10 50,10 Z"
            stroke="#fde047"
            strokeWidth="3"
            fill="transparent"
          />
          <motion.path
            d="M50,10 C30,10 20,30 20,50 C20,70 35,70 35,70 L65,70 C65,70 80,70 80,50 C80,30 70,10 50,10 Z"
            fill="#fde047"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M40 50 L 45 55 L 55 45 M 45 55 L 50 60 L 60 50"
            fill="none"
            stroke="#fef08a"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </svg>
      </motion.div>
      <motion.h1
        className="text-3xl font-bold text-white mt-4 tracking-widest"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        Code_Craft
      </motion.h1>
    </motion.div>
  );
};

export default LoadingScreen;