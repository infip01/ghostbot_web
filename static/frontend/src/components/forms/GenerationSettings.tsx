import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Image as ImageIcon, Maximize } from 'lucide-react';

interface GenerationSettingsProps {
  model: string;
  numImages: number;
  onNumImagesChange: (value: number) => void;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  disabled?: boolean;
}

const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  model,
  numImages,
  onNumImagesChange,
  aspectRatio,
  onAspectRatioChange,
  disabled = false
}) => {
  const imageOptions = [1, 2, 4];
  
  const aspectRatioOptions = [
    { value: 'IMAGE_ASPECT_RATIO_SQUARE', label: 'Square (1:1)', icon: '⬜' },
    { value: 'IMAGE_ASPECT_RATIO_LANDSCAPE', label: 'Landscape (16:9)', icon: '🖼️' },
    { value: 'IMAGE_ASPECT_RATIO_PORTRAIT', label: 'Portrait (9:16)', icon: '📱' },
  ];

  // Some models have limitations
  const getMaxImages = () => {
    if (['uncen', 'flux-1-1-pro', 'flux-pro'].includes(model)) {
      return 1;
    }
    return 4;
  };

  const getAvailableAspectRatios = () => {
    if (['kontext-max', 'kontext-pro', 'flux-dev', 'flux-schnell'].includes(model)) {
      return aspectRatioOptions.filter(option => option.value === 'IMAGE_ASPECT_RATIO_SQUARE');
    }
    return aspectRatioOptions;
  };

  const maxImages = getMaxImages();
  const availableAspectRatios = getAvailableAspectRatios();

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Generation Settings</span>
        </div>

        {/* Number of Images */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <ImageIcon className="h-4 w-4 inline mr-2" />
              Number of Images
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {numImages} image{numImages > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {imageOptions.map((option) => (
              <motion.button
                key={option}
                whileHover={!disabled && option <= maxImages ? { scale: 1.05 } : {}}
                whileTap={!disabled && option <= maxImages ? { scale: 0.95 } : {}}
                type="button"
                onClick={() => option <= maxImages && onNumImagesChange(option)}
                disabled={disabled || option > maxImages}
                className={`
                  p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm
                  ${numImages === option
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : option <= maxImages
                      ? 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 bg-gray-50 dark:bg-gray-700'
                  }
                `}
              >
                {option}
              </motion.button>
            ))}
          </div>
          
          {maxImages < 4 && (
            <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center space-x-1">
              <span>⚠️</span>
              <span>This model is limited to {maxImages} image{maxImages > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <Maximize className="h-4 w-4 inline mr-2" />
              Aspect Ratio
            </span>
          </div>
          
          <div className="space-y-2">
            {availableAspectRatios.map((option) => (
              <motion.button
                key={option.value}
                whileHover={!disabled ? { scale: 1.01 } : {}}
                whileTap={!disabled ? { scale: 0.99 } : {}}
                type="button"
                onClick={() => onAspectRatioChange(option.value)}
                disabled={disabled}
                className={`
                  w-full p-3 rounded-lg border-2 transition-all duration-200 text-left
                  ${aspectRatio === option.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
                  }
                `}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="text-lg flex-shrink-0">{option.icon}</span>
                  <span className="font-medium truncate">{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
          
          {availableAspectRatios.length === 1 && (
            <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center space-x-1">
              <span>⚠️</span>
              <span>This model only supports square format</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GenerationSettings;