import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Maximize2, 
  Copy, 
  Heart, 
  Share2,
  X,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

interface GeneratedImage {
  id: string;
  url: string;
  seed: number;
  model: string;
  prompt: string;
}

interface ImageGridProps {
  images: GeneratedImage[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  const handleDownload = async (image: GeneratedImage, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Use the server-side download endpoint
      const downloadUrl = `/download/${encodeURIComponent(image.url)}`;
      
      // Create download link using server endpoint
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `ghostbot-${image.model}-${image.seed}.png`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Ensure it opens in new tab/window
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image. Please try again.');
    }
  };

  const handleCopyPrompt = (prompt: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Use manual method as primary (more reliable)
      const textArea = document.createElement('textarea');
      textArea.value = prompt;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success('Prompt copied to clipboard!');
      } else {
        throw new Error('Copy command failed');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      // Ultimate fallback - show the prompt in a toast so user can manually copy
      toast.success(`Prompt: ${prompt.substring(0, 50)}...`, {
        duration: 5000,
        icon: '📋'
      });
    }
  };

  const handleShare = async (image: GeneratedImage, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('Share button clicked for image:', image.id);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Image',
          text: `Check out this AI-generated image: ${image.prompt}`,
          url: image.url
        });
        toast.success('Image shared!');
      } catch (error) {
        console.log('Share cancelled or failed:', error);
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(image.url);
        toast.success('Image URL copied to clipboard!');
      } catch (err) {
        console.error('Clipboard failed:', err);
        // Manual fallback
        const textArea = document.createElement('textarea');
        textArea.value = image.url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Image URL copied!');
      }
    }
  };

  const toggleLike = (imageId: string) => {
    const newLikedImages = new Set(likedImages);
    if (newLikedImages.has(imageId)) {
      newLikedImages.delete(imageId);
    } else {
      newLikedImages.add(imageId);
    }
    setLikedImages(newLikedImages);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mr-[5%]">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src={image.url}
                alt={`Generated: ${image.prompt.slice(0, 50)}...`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedImage(image)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleDownload(image, e)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleShare(image, e)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Image Info */}
            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    {image.prompt}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1 space-y-1 sm:space-y-0">
                    <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full w-fit">
                      {image.model}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Seed: {image.seed}
                    </span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleLike(image.id)}
                  className={`p-1 rounded-full transition-colors ${
                    likedImages.has(image.id)
                      ? 'text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${likedImages.has(image.id) ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleCopyPrompt(image.prompt, e)}
                  className="flex-1 px-3 py-2 text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <Copy className="h-3 w-3" />
                  <span className="hidden sm:inline">Copy Prompt</span>
                  <span className="sm:hidden">Copy</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleDownload(image, e)}
                  className="sm:flex-shrink-0 px-3 py-2 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Save</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedImage(null)}
                className="absolute -top-8 sm:-top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.button>

              {/* Image */}
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
              />

              {/* Image details */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white p-3 sm:p-4 rounded-b-lg">
                <p className="text-xs sm:text-sm mb-2 line-clamp-2">{selectedImage.prompt}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs space-y-1 sm:space-y-0">
                    <span>Model: {selectedImage.model}</span>
                    <span>Seed: {selectedImage.seed}</span>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleDownload(selectedImage, e)}
                      className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(selectedImage.url, '_blank')}
                      className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Open</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGrid;