import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default',
  size = 'md'
}) => {
  const Component = onClick ? motion.button : motion.div;
  
  const variants = {
    default: 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 shadow-sm',
    elevated: 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 shadow-lg',
    outlined: 'bg-transparent border-2 border-gray-200 dark:border-dark-600',
    glass: 'bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border border-white/20 dark:border-dark-600/20'
  };

  const sizes = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl'
  };

  const hoverEffects = hover || onClick ? {
    y: -2,
    scale: 1.01,
    transition: { duration: 0.2, ease: "easeOut" }
  } : {};

  const tapEffects = onClick ? { scale: 0.98 } : {};
  
  return (
    <Component
      whileHover={hoverEffects}
      whileTap={tapEffects}
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        transition-all duration-300 ease-out
        ${hover || onClick ? 'hover:shadow-lg hover:shadow-primary-500/10 dark:hover:shadow-primary-400/10' : ''}
        ${onClick ? 'cursor-pointer focus-ring' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default Card;