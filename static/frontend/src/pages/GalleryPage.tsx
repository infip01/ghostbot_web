import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as Images,
  Search, 
  Filter, 
  Grid3X3, 
  Grid2X2,
  Heart,
  Download,
  Eye,
  Calendar,
  User,
  Sparkles
} from 'lucide-react';
import { useQuery } from 'react-query';
import Card from '../components/ui/Card';
import ImageGrid from '../components/image/ImageGrid';
import { getGallery } from '../services/api';
import { GeneratedImage } from '../types';

const GalleryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [gridSize, setGridSize] = useState<'small' | 'large'>('small');
  const [page, setPage] = useState(1);

  const { data: galleryData, isLoading, error } = useQuery(
    ['gallery', page, selectedModel, sortBy, searchTerm],
    () => getGallery(page, 20),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  // Mock data for demonstration
  const mockImages: GeneratedImage[] = [
    {
      id: '1',
      url: 'https://picsum.photos/512/512?random=1',
      seed: 12345,
      model: 'img4',
      prompt: 'A majestic dragon soaring through clouds at sunset',
      created_at: '2024-01-15T10:30:00Z',
      liked: true
    },
    {
      id: '2',
      url: 'https://picsum.photos/512/512?random=2',
      seed: 67890,
      model: 'flux-pro',
      prompt: 'Futuristic cyberpunk cityscape with neon lights',
      created_at: '2024-01-14T15:45:00Z',
      liked: false
    },
    {
      id: '3',
      url: 'https://picsum.photos/512/512?random=3',
      seed: 11111,
      model: 'kontext-max',
      prompt: 'Serene Japanese garden with cherry blossoms',
      created_at: '2024-01-13T09:20:00Z',
      liked: true
    },
    {
      id: '4',
      url: 'https://picsum.photos/512/512?random=4',
      seed: 22222,
      model: 'img3',
      prompt: 'Abstract cosmic nebula with vibrant colors',
      created_at: '2024-01-12T14:10:00Z',
      liked: false
    },
    {
      id: '5',
      url: 'https://picsum.photos/512/512?random=5',
      seed: 33333,
      model: 'flux-schnell',
      prompt: 'Steampunk mechanical clockwork creature',
      created_at: '2024-01-11T11:55:00Z',
      liked: true
    },
    {
      id: '6',
      url: 'https://picsum.photos/512/512?random=6',
      seed: 44444,
      model: 'uncen',
      prompt: 'Underwater coral reef teeming with life',
      created_at: '2024-01-10T16:30:00Z',
      liked: false
    }
  ];

  const images = galleryData?.images || mockImages;

  const models = [
    { id: 'all', name: 'All Models' },
    { id: 'img3', name: 'Imagen 3' },
    { id: 'img4', name: 'Imagen 4' },
    { id: 'flux-pro', name: 'Flux Pro' },
    { id: 'kontext-max', name: 'Kontext Max' },
    { id: 'flux-schnell', name: 'Flux Schnell' },
    { id: 'uncen', name: 'Uncensored' }
  ];

  const sortOptions = [
    { id: 'newest', name: 'Newest First' },
    { id: 'oldest', name: 'Oldest First' },
    { id: 'most_liked', name: 'Most Liked' },
    { id: 'trending', name: 'Trending' }
  ];

  const filteredImages = images.filter(image => {
    const matchesSearch = image.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModel = selectedModel === 'all' || image.model === selectedModel;
    return matchesSearch && matchesModel;
  });

  const stats = [
    { label: 'Total Images', value: '12,847', icon: Images },
    { label: 'Artists', value: '2,341', icon: User },
    { label: 'Likes', value: '89,234', icon: Heart },
    { label: 'Downloads', value: '156,789', icon: Download }
  ];

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
              <Images className="h-12 w-12 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-500 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore amazing AI-generated artwork from our community of creators around the world.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-4 text-center">
                  <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-4">
                {/* Model Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                {/* Grid Size Toggle */}
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGridSize('small')}
                    className={`p-2 rounded-md transition-colors ${
                      gridSize === 'small'
                        ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGridSize('large')}
                    className={`p-2 rounded-md transition-colors ${
                      gridSize === 'large'
                        ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredImages.length} Images
            </h2>
            {searchTerm && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Searching for:</span>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
                  "{searchTerm}"
                </span>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 dark:bg-dark-700 rounded-lg animate-pulse" />
                ))}
              </motion.div>
            ) : filteredImages.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ImageGrid images={filteredImages} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="mb-6">
                  <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No images found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Create Your Own Masterpiece
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Join thousands of creators and bring your imagination to life with our powerful AI models.
              </p>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="h-5 w-5" />
                <span>Start Creating</span>
              </motion.a>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryPage;