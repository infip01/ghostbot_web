import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Link as LinkIcon,
  Check,
  AlertCircle
} from 'lucide-react';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  onClear: () => void;
  uploadedFile?: File | null;
  imageUrl?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  onUrlSubmit,
  onClear,
  uploadedFile,
  imageUrl,
  disabled = false
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlError, setUrlError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled
  });

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setUrlError('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      onUrlSubmit(urlInput);
      setUrlError('');
      setIsUrlMode(false);
    } catch {
      setUrlError('Please enter a valid URL');
    }
  };

  const hasImage = uploadedFile || imageUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4" />
            <span>Reference Image</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
          </div>
        </label>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsUrlMode(!isUrlMode)}
            disabled={disabled}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              isUrlMode 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-gray-400'
            }`}
          >
            <LinkIcon className="h-3 w-3 mr-1" />
            URL
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {hasImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20">
              <img
                src={imageUrl || (uploadedFile ? URL.createObjectURL(uploadedFile) : '')}
                alt="Uploaded reference"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClear}
                  className="p-2 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2 text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              <span>Image uploaded successfully</span>
            </div>
          </motion.div>
        ) : isUrlMode ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex space-x-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError('');
                }}
                placeholder="https://example.com/image.jpg"
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUrlSubmit}
                disabled={disabled || !urlInput.trim()}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </motion.button>
            </div>
            {urlError && (
              <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{urlError}</span>
              </div>
            )}
          </motion.div>
        ) : (
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${isDragActive 
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-300 dark:border-dark-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-dark-700'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <motion.div
              animate={{ 
                y: isDragActive ? -5 : 0,
                scale: isDragActive ? 1.05 : 1 
              }}
              className="space-y-4"
            >
              <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center">
                <Upload className={`h-6 w-6 ${isDragActive ? 'text-primary-500' : 'text-gray-400'}`} />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {isDragActive ? 'Drop your image here' : 'Upload reference image'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Drag & drop or click to browse • PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">ℹ️</span>
          <span>Reference images help guide the AI to create images in a similar style or composition</span>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;