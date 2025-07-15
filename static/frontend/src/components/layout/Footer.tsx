import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@ghostbot.ai', label: 'Email' },
  ];

  return (
    <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-400 shadow-lg"
              >
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                  Ghostbot
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  AI Image Studio
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
              Transform your imagination into stunning visuals with our advanced AI models. 
              Create, explore, and discover the limitless possibilities of AI-generated art.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Create', 'Models', 'API', 'Gallery'].map((item) => (
                <li key={item}>
                  <motion.a
                    whileHover={{ x: 4 }}
                    href={item === 'Create' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex space-x-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-dark-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span>© {currentYear} Ghostbot. Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              </motion.div>
              <span>for creators</span>
            </div>
            
            <div className="flex items-center space-x-4 sm:space-x-6">
              <a href="#" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;