import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs - responsive sizes */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-r from-primary-400/15 to-secondary-400/15 dark:from-primary-400/25 dark:to-secondary-400/25 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute top-3/4 right-1/4 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-gradient-to-r from-purple-400/15 to-pink-400/15 dark:from-purple-400/25 dark:to-pink-400/25 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10
        }}
        className="absolute top-1/2 right-1/3 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 dark:from-blue-400/25 dark:to-cyan-400/25 rounded-full blur-3xl"
      />

      {/* Additional smaller orbs for more depth */}
      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/3 right-1/2 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-full blur-2xl"
      />

      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }}
        className="absolute bottom-1/4 left-1/3 w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 bg-gradient-to-r from-orange-400/10 to-red-400/10 dark:from-orange-400/20 dark:to-red-400/20 rounded-full blur-2xl"
      />

      {/* Floating particles - responsive count */}
      {Array.from({ length: window.innerWidth > 768 ? 25 : 15 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-primary-400/30 dark:bg-primary-400/50 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;