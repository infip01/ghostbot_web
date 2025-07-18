import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default',
  size = 'md',
  interactive = false
}) => {
  const Component = onClick ? motion.button : motion.div;
  
  const variants = {
    default: 'bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border border-gray-100 dark:border-dark-700 shadow-sm',
    elevated: 'bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-lg shadow-gray-900/5 dark:shadow-black/20',
    outlined: 'bg-transparent border-2 border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600',
    glass: 'bg-white/60 dark:bg-dark-800/60 backdrop-blur-xl border border-white/20 dark:border-dark-600/20 shadow-xl',
    minimal: 'bg-transparent hover:bg-gray-50/50 dark:hover:bg-dark-800/50 border-0'
  };

  const sizes = {
    sm: 'rounded-lg p-3',
    md: 'rounded-xl p-4 sm:p-6',
    lg: 'rounded-2xl p-6 sm:p-8'
  };

  const hoverEffects = hover || onClick || interactive ? {
    y: -1,
    scale: 1.005,
    transition: { duration: 0.15, ease: "easeOut" }
  } : {};

  const tapEffects = onClick ? { scale: 0.995 } : {};
  
  return (
    <Component
      whileHover={hoverEffects}
      whileTap={tapEffects}
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        transition-all duration-200 ease-out
        ${hover || onClick || interactive ? 'hover:shadow-md hover:shadow-primary-500/5 dark:hover:shadow-primary-400/10' : ''}
        ${onClick ? 'cursor-pointer focus-ring' : ''}
        ${interactive ? 'group' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default EnhancedCard;