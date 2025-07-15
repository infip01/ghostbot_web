import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import {
  Image as ImageIcon,
  Download,
  Loader2,
  Wand2,
  Zap,
  Star,
  RefreshCw
} from 'lucide-react';

// Components
import ImageGrid from '../components/image/ImageGrid';
import ModelSelector from '../components/forms/ModelSelector';
import ImageUpload from '../components/forms/ImageUpload';
import PromptInput from '../components/forms/PromptInput';
import GenerationSettings from '../components/forms/GenerationSettings';
import GradientButton from '../components/ui/GradientButton';
import Card from '../components/ui/Card';

// Services
import { generateImages } from '../services/api';

// Types
import { GenerationParams, GeneratedImage } from '../types';

interface FormData {
  prompt: string;
  model: string;
  numImages: number;
  aspectRatio: string;
  imageUrl?: string;
}

const HomePage: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      prompt: '',
      model: 'img4',
      numImages: 4,
      aspectRatio: 'IMAGE_ASPECT_RATIO_LANDSCAPE',
    }
  });

  const selectedModel = watch('model');
  const numImages = watch('numImages');

  const generateMutation = useMutation(generateImages, {
    onSuccess: (data) => {
      if (data.success && data.image_urls) {
        const images: GeneratedImage[] = data.image_urls.map((url: string, index: number) => ({
          id: `${Date.now()}-${index}`,
          url,
          seed: data.seeds_used?.[index] || Math.floor(Math.random() * 1000000),
          model: selectedModel,
          prompt: watch('prompt'),
        }));
        setGeneratedImages(images);
        toast.success(`Generated ${images.length} image${images.length > 1 ? 's' : ''} successfully!`);
      } else {
        toast.error(data.error || 'Failed to generate images');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'An error occurred while generating images');
    }
  });

  const onSubmit = useCallback(async (data: FormData) => {
    if (!data.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    const params: GenerationParams = {
      prompt: data.prompt,
      model: data.model,
      num_images: data.numImages,
      aspect_ratio: data.aspectRatio,
      time_elapsed: 3, // Simulate human interaction
    };

    if (imageUrl) {
      params.image_url = imageUrl;
    }

    generateMutation.mutate(params);
  }, [imageUrl, generateMutation]);

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file);
    // You would upload the file here and get back a URL
    // For now, we'll create a local URL
    setImageUrl(URL.createObjectURL(file));
  }, []);

  const clearUpload = useCallback(() => {
    setUploadedFile(null);
    setImageUrl('');
  }, []);

  const suggestedPrompts = [
    "A majestic dragon soaring through clouds at sunset",
    "Futuristic cyberpunk cityscape with neon lights",
    "Serene Japanese garden with cherry blossoms",
    "Abstract cosmic nebula with vibrant colors",
    "Steampunk mechanical clockwork creature",
    "Underwater coral reef teeming with life"
  ];

  const isGenerating = generateMutation.isLoading;

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Main Creation Interface */}
        <div className="grid lg:grid-cols-10 gap-6 lg:gap-8">
          {/* Left Sidebar - Controls in 2x1 Grid */}
          <div className="lg:col-span-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Row 1: Prompt Input + Model Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Prompt Input */}
                <Card className="p-4 sm:p-5" variant="elevated" hover>
                  <PromptInput
                    {...register('prompt', { required: 'Prompt is required' })}
                    error={errors.prompt?.message}
                    placeholder="Describe what you want to create..."
                    disabled={isGenerating}
                    onGenerate={() => handleSubmit(onSubmit)()}
                    isGenerating={isGenerating}
                    canGenerate={!!watch('prompt')?.trim()}
                  />
                </Card>

                {/* Model Selection */}
                <Card className="p-4 sm:p-5" variant="elevated" hover>
                  <ModelSelector
                    value={selectedModel}
                    onChange={(value) => setValue('model', value)}
                    disabled={isGenerating}
                    suggestedPrompts={suggestedPrompts}
                    onPromptSelect={(prompt) => setValue('prompt', prompt)}
                  />
                </Card>
              </div>

              {/* Row 2: Generation Settings + Image Upload (if Kontext) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Generation Settings */}
                <Card className="p-4 sm:p-5" variant="elevated" hover>
                  <GenerationSettings
                    model={selectedModel}
                    numImages={numImages}
                    onNumImagesChange={(value) => setValue('numImages', value)}
                    aspectRatio={watch('aspectRatio')}
                    onAspectRatioChange={(value) => setValue('aspectRatio', value)}
                    disabled={isGenerating}
                  />
                </Card>

                {/* Image Upload (for Kontext models only) */}
                {(selectedModel === 'kontext-max' || selectedModel === 'kontext-pro') && (
                  <Card className="p-4 sm:p-5" variant="elevated" hover>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Reference Image
                    </h3>
                    <ImageUpload
                      onFileSelect={handleFileUpload}
                      onUrlSubmit={setImageUrl}
                      onClear={clearUpload}
                      uploadedFile={uploadedFile}
                      imageUrl={imageUrl}
                      disabled={isGenerating}
                    />
                  </Card>
                )}
              </div>

            </form>
          </div>

          {/* Right Side - Image Results */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <Card className="p-6 sm:p-8 text-center" variant="glass">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block p-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-400 mb-4"
                    >
                      <Wand2 className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Creating Your Masterpiece
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our AI is working hard to bring your vision to life...
                    </p>
                  </Card>
                  
                  {/* Generation Preview Grid */}
                  <div className={`grid gap-3 sm:gap-4 ${
                    numImages === 1 ? 'grid-cols-1' :
                    numImages === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                    'grid-cols-1 sm:grid-cols-2'
                  }`}>
                    {Array.from({ length: numImages }).map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-800 dark:to-dark-700 rounded-xl overflow-hidden"
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full animate-pulse" />
                            <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full animate-ping opacity-30" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : generatedImages.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Your Creations
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setGeneratedImages([])}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Clear</span>
                    </motion.button>
                  </div>
                  <ImageGrid images={generatedImages} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center"
                >
                  <Card className="p-8 sm:p-12 text-center max-w-md mx-auto" variant="elevated" hover>
                    <div className="mb-6">
                      <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Ready to Create?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Enter a prompt and select your preferred AI model to start generating amazing images.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>High-quality results</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span>Lightning fast generation</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Download className="h-4 w-4 text-green-500" />
                        <span>Instant downloads</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;