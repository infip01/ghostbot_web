import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Cpu, 
  Zap, 
  Crown, 
  Shield, 
  Sparkles,
  Rocket,
  Code,
  Gem,
  Wind,
  Brain,
  Star
} from 'lucide-react';

interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  badge?: {
    text: string;
    color: string;
  };
  features: string[];
  limitations?: string[];
  speed: 1 | 2 | 3 | 4 | 5;
  quality: 1 | 2 | 3 | 4 | 5;
}

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  suggestedPrompts?: string[];
  onPromptSelect?: (prompt: string) => void;
}

const models: Model[] = [
  {
    id: 'img3',
    name: 'Imagen 3',
    description: 'Versatile model for high-quality image generation',
    icon: Sparkles,
    badge: { text: 'Stable', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    features: ['Fast generation', 'Multiple styles', 'Customizable', 'Batch processing'],
    speed: 4,
    quality: 4,
  },
  {
    id: 'img4',
    name: 'Imagen 4',
    description: 'Most advanced model with enhanced capabilities',
    icon: Crown,
    badge: { text: 'Latest', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    features: ['High detail', 'AI enhanced', 'Premium quality', 'Professional results'],
    speed: 3,
    quality: 5,
  },
  {
    id: 'uncen',
    name: 'Uncensored',
    description: 'Unrestricted content creation with maximum freedom',
    icon: Shield,
    badge: { text: 'Unrestricted', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    features: ['No restrictions', 'Creative freedom', 'Unlimited content'],
    limitations: ['Limited to 1 image', 'Square format only'],
    speed: 4,
    quality: 4,
  },
  {
    id: 'kontext-max',
    name: 'Kontext Max',
    description: 'FLUX model optimized for maximum context understanding',
    icon: Brain,
    badge: { text: 'Advanced', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    features: ['Context aware', 'Maximum detail', 'Complex scenes', 'Image-to-image'],
    limitations: ['Square format only'],
    speed: 2,
    quality: 5,
  },
  {
    id: 'kontext-pro',
    name: 'Kontext Pro',
    description: 'Professional-grade FLUX model with superior context handling',
    icon: Gem,
    badge: { text: 'Professional', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
    features: ['Pro quality', 'Precision control', 'Enhanced output', 'Image-to-image'],
    limitations: ['Square format only'],
    speed: 2,
    quality: 5,
  },
  {
    id: 'flux-1-1-pro',
    name: 'Flux 1.1 Pro',
    description: 'Newest FLUX model with enhanced performance',
    icon: Rocket,
    badge: { text: 'Latest', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    features: ['Enhanced performance', 'Latest technology', 'Optimized speed'],
    limitations: ['Limited to 1 image', 'Square format only'],
    speed: 3,
    quality: 5,
  },
  {
    id: 'flux-dev',
    name: 'Flux Dev',
    description: 'Development version with experimental features',
    icon: Code,
    badge: { text: 'Development', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
    features: ['Experimental', 'Advanced features', 'Developer focused'],
    limitations: ['Square format only'],
    speed: 2,
    quality: 4,
  },
  {
    id: 'flux-pro',
    name: 'Flux Pro',
    description: 'Professional-grade model for commercial use',
    icon: Star,
    badge: { text: 'Professional', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
    features: ['Commercial grade', 'Reliable', 'High quality'],
    limitations: ['Limited to 1 image', 'Square format only'],
    speed: 3,
    quality: 5,
  },
  {
    id: 'flux-schnell',
    name: 'Flux Schnell',
    description: 'Ultra-fast model for rapid image generation',
    icon: Wind,
    badge: { text: 'Fast', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    features: ['Ultra fast', 'Optimized efficiency', 'Quick results'],
    limitations: ['Square format only'],
    speed: 5,
    quality: 3,
  },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange, disabled, suggestedPrompts = [], onPromptSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModel = models.find(m => m.id === value) || models[1]; // Default to img4

  const handleSelect = (modelId: string) => {
    onChange(modelId);
    setIsOpen(false);
  };

  const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'sm' }) => {
    const starSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
    return (
      <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        <div className="flex items-center space-x-2 mb-3">
          <Cpu className="h-4 w-4" />
          <span>AI Model</span>
        </div>
      </label>

      <div className="relative">
        <motion.button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.01 } : {}}
          whileTap={!disabled ? { scale: 0.99 } : {}}
          className={`
            w-full p-4 rounded-xl border text-left transition-all duration-200
            ${disabled 
              ? 'bg-gray-50 dark:bg-dark-800 cursor-not-allowed opacity-60' 
              : 'bg-white dark:bg-dark-800 hover:border-gray-400 dark:hover:border-dark-500 cursor-pointer'
            }
            ${isOpen 
              ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800' 
              : 'border-gray-300 dark:border-dark-600'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-400">
                <selectedModel.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedModel.name}
                </span>
                {selectedModel.badge && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${selectedModel.badge.color}`}>
                    {selectedModel.badge.text}
                  </span>
                )}
              </div>
            </div>
            
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </motion.div>
          </div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-2">
                {models.map((model, index) => {
                  const Icon = model.icon;
                  return (
                    <motion.button
                      key={model.id}
                      type="button"
                      onClick={() => handleSelect(model.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        w-full p-3 rounded-lg text-left transition-all duration-200 group
                        ${value === model.id 
                          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' 
                          : 'hover:bg-gray-50 dark:hover:bg-dark-700'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          p-2 rounded-lg transition-all duration-200
                          ${value === model.id
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-400'
                            : 'bg-gray-100 dark:bg-dark-700 group-hover:bg-gray-200 dark:group-hover:bg-dark-600'
                          }
                        `}>
                          <Icon className={`h-4 w-4 ${
                            value === model.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {model.name}
                            </span>
                            {model.badge && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${model.badge.color}`}>
                                {model.badge.text}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Try these suggestions - Show when not selecting model */}
        {!isOpen && suggestedPrompts.length > 0 && onPromptSelect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Try these:</p>
            <div className="space-y-2">
              {suggestedPrompts.slice(0, 2).map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => onPromptSelect(prompt)}
                  className="w-full text-left text-sm px-3 py-2 bg-gray-50 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors border border-gray-200 dark:border-dark-600"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
            
            {/* Quick tips */}
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">💡</span>
                <span>Tip: Be specific about style, colors, and composition for better results</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">🎨</span>
                <span>Include art styles like "photorealistic", "oil painting", or "digital art"</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

export default ModelSelector;