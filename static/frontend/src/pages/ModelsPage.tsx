import React from 'react';
import { motion } from 'framer-motion';
import { 
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
  Star,
  Clock,
  Award
} from 'lucide-react';
import Card from '../components/ui/Card';

const models = [
  {
    id: 'img3',
    name: 'Imagen 3',
    description: 'Versatile model for high-quality image generation with fast processing and multiple style support.',
    icon: Sparkles,
    badge: { text: 'Stable', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    features: ['Fast generation', 'Multiple styles', 'Customizable', 'Batch processing'],
    speed: 4,
    quality: 4,
    category: 'General Purpose'
  },
  {
    id: 'img4',
    name: 'Imagen 4',
    description: 'Most advanced model with enhanced capabilities and premium quality output for professional use.',
    icon: Crown,
    badge: { text: 'Latest', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    features: ['High detail', 'AI enhanced', 'Premium quality', 'Professional results'],
    speed: 3,
    quality: 5,
    category: 'Premium'
  },
  {
    id: 'uncen',
    name: 'Uncensored',
    description: 'Unrestricted content creation with maximum creative freedom and no content limitations.',
    icon: Shield,
    badge: { text: 'Unrestricted', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    features: ['No restrictions', 'Creative freedom', 'Unlimited content'],
    limitations: ['Limited to 1 image', 'Square format only'],
    speed: 4,
    quality: 4,
    category: 'Specialized'
  },
  {
    id: 'kontext-max',
    name: 'Kontext Max',
    description: 'FLUX model optimized for maximum context understanding and complex scene generation.',
    icon: Brain,
    badge: { text: 'Advanced', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    features: ['Context aware', 'Maximum detail', 'Complex scenes', 'Image-to-image'],
    limitations: ['Square format only'],
    speed: 2,
    quality: 5,
    category: 'FLUX'
  },
  {
    id: 'kontext-pro',
    name: 'Kontext Pro',
    description: 'Professional-grade FLUX model with superior context handling and precision control.',
    icon: Gem,
    badge: { text: 'Professional', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
    features: ['Pro quality', 'Precision control', 'Enhanced output', 'Image-to-image'],
    limitations: ['Square format only'],
    speed: 2,
    quality: 5,
    category: 'FLUX'
  },
  {
    id: 'flux-1-1-pro',
    name: 'Flux 1.1 Pro',
    description: 'Newest FLUX model with enhanced performance and latest technology improvements.',
    icon: Rocket,
    badge: { text: 'Latest', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    features: ['Enhanced performance', 'Latest technology', 'Optimized speed'],
    limitations: ['Limited to 1 image', 'Square format only'],
    speed: 3,
    quality: 5,
    category: 'FLUX'
  },
  {
    id: 'flux-dev',
    name: 'Flux Dev',
    description: 'Development version with experimental features and advanced capabilities for developers.',
    icon: Code,
    badge: { text: 'Development', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
    features: ['Experimental', 'Advanced features', 'Developer focused'],
    limitations: ['Square format only'],
    speed: 2,
    quality: 4,
    category: 'FLUX'
  },
  {
    id: 'flux-pro',
    name: 'Flux Pro',
    description: 'Professional-grade model for commercial use with reliable and high-quality output.',
    icon: Star,
    badge: { text: 'Professional', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
    features: ['Commercial grade', 'Reliable', 'High quality'],
    limitations: ['Limited to 1 image', 'Square format only'],
    speed: 3,
    quality: 5,
    category: 'FLUX'
  },
  {
    id: 'flux-schnell',
    name: 'Flux Schnell',
    description: 'Ultra-fast model for rapid image generation with optimized efficiency and quick results.',
    icon: Wind,
    badge: { text: 'Fast', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    features: ['Ultra fast', 'Optimized efficiency', 'Quick results'],
    limitations: ['Square format only'],
    speed: 5,
    quality: 3,
    category: 'FLUX'
  },
];

const categories = ['All', 'General Purpose', 'Premium', 'FLUX', 'Specialized'];

const ModelsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredModels = selectedCategory === 'All' 
    ? models 
    : models.filter(model => model.category === selectedCategory);

  const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
      <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="p-4 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-400 shadow-xl"
            >
              <Cpu className="h-12 w-12 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-500 bg-clip-text text-transparent">
              AI Models
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore our collection of cutting-edge AI models, each optimized for different use cases and creative needs.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Models Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredModels.map((model, index) => {
            const Icon = model.icon;
            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-400">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {model.name}
                        </h3>
                        {model.badge && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${model.badge.color}`}>
                            {model.badge.text}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {model.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {model.description}
                  </p>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Speed</span>
                      </div>
                      <StarRating rating={model.speed} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality</span>
                      </div>
                      <StarRating rating={model.quality} />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {model.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Limitations */}
                  {model.limitations && model.limitations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Limitations</h4>
                      <div className="flex flex-wrap gap-1">
                        {model.limitations.map((limitation, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-md"
                          >
                            {limitation}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">9</div>
                <div className="text-gray-600 dark:text-gray-400">AI Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">4</div>
                <div className="text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
                <div className="text-gray-600 dark:text-gray-400">Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">∞</div>
                <div className="text-gray-600 dark:text-gray-400">Possibilities</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ModelsPage;