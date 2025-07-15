import React from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  loading?: boolean;
  fullWidth?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  size = 'md',
  variant = 'primary',
  className = '',
  loading = false,
  fullWidth = false
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const gradientClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-400 hover:from-primary-600 hover:to-secondary-500 shadow-primary-500/25',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-gray-500/25',
    success: 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 shadow-green-500/25',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 shadow-yellow-500/25',
    danger: 'bg-gradient-to-r from-red-500 to-pink-400 hover:from-red-600 hover:to-pink-500 shadow-red-500/25'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? {
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${sizeClasses[size]}
        ${gradientClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        text-white font-semibold rounded-xl shadow-lg
        transition-all duration-300 ease-out flex items-center justify-center
        relative overflow-hidden btn-enhanced
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        focus:ring-offset-white dark:focus:ring-offset-gray-900
        ${className}
      `}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl"
        >
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </motion.button>
  );
};

export default GradientButton;