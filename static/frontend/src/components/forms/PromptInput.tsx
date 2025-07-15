import React, { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, Sparkles } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

interface PromptInputProps {
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  value?: string;
  onGenerate?: () => void;
  isGenerating?: boolean;
  canGenerate?: boolean;
}

const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({ placeholder = "Describe what you want to create...", error, disabled, onGenerate, isGenerating, canGenerate, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const maxChars = 4000;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    useEffect(() => {
      if (props.value) {
        setCharCount(props.value.length);
      }
    }, [props.value]);

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2 mb-3">
            <Type className="h-4 w-4" />
            <span>Prompt</span>
            <Sparkles className="h-3 w-3 text-yellow-500" />
          </div>
        </label>
        
        <div className="relative">
          <motion.div
            animate={{
              scale: isFocused ? 1.02 : 1,
              boxShadow: isFocused 
                ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
                : '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <textarea
              ref={ref}
              {...props}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              disabled={disabled}
              placeholder={placeholder}
              maxLength={maxChars}
              rows={4}
              className={`
                w-full px-4 py-3 rounded-xl border transition-all duration-200
                resize-none focus:outline-none font-medium
                ${error 
                  ? 'border-red-300 focus:border-red-500 dark:border-red-600 dark:focus:border-red-400' 
                  : 'border-gray-300 focus:border-primary-500 dark:border-dark-600 dark:focus:border-primary-400'
                }
                ${disabled 
                  ? 'bg-gray-50 dark:bg-dark-800 cursor-not-allowed opacity-60' 
                  : 'bg-white dark:bg-dark-800 hover:border-gray-400 dark:hover:border-dark-500'
                }
                text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                text-base leading-relaxed
              `}
            />
            
            {/* Floating label effect */}
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-2 left-3 px-2 bg-white dark:bg-dark-800 text-xs font-medium text-primary-600 dark:text-primary-400"
              >
                Writing prompt...
              </motion.div>
            )}
          </motion.div>

          {/* Character counter */}
          <div className="flex justify-between items-center mt-2">
            <div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{error}</span>
                </motion.p>
              )}
            </div>
            
            <div className={`text-xs transition-colors ${
              charCount > maxChars * 0.9 
                ? 'text-orange-500' 
                : charCount > maxChars * 0.8 
                  ? 'text-yellow-500' 
                  : 'text-gray-400 dark:text-gray-500'
            }`}>
              {charCount}/{maxChars}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {onGenerate && (
          <div className="mt-4">
            <GradientButton
              type="button"
              onClick={onGenerate}
              disabled={!canGenerate}
              loading={isGenerating}
              fullWidth
              size="lg"
              className="py-3 sm:py-4 text-base sm:text-lg font-semibold"
            >
              {isGenerating ? (
                "Creating Magic..."
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Images
                </>
              )}
            </GradientButton>
          </div>
        )}
      </div>
    );
  }
);

PromptInput.displayName = 'PromptInput';

export default PromptInput;