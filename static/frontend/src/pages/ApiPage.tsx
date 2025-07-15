import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Copy, 
  Check, 
  Terminal, 
  Book, 
  Zap,
  Key,
  Globe,
  Shield,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import GradientButton from '../components/ui/GradientButton';

const ApiPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateApiKey = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-key');
      const data = await response.json();
      
      if (data.api_key) {
        setApiKey(data.api_key);
        toast.success('API key generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate API key');
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast.success('API key copied to clipboard!');
    }
  };

  const codeExamples = {
    curl: `curl -X POST "https://api.infip.pro/v1/images/generations" \\
  -H "accept: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "img4",
    "n": 1,
    "prompt": "A beautiful sunset over mountains",
    "response_format": "url",
    "size": "1792x1024"
  }'`,
    
    python: `import requests

url = "https://api.infip.pro/v1/images/generations"
headers = {
    "accept": "application/json",
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "img4",
    "n": 1,
    "prompt": "A beautiful sunset over mountains",
    "response_format": "url",
    "size": "1792x1024"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

print("Generated images:", [item["url"] for item in result["data"]])`,

    javascript: `const response = await fetch('https://api.infip.pro/v1/images/generations', {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'img4',
    n: 1,
    prompt: 'A beautiful sunset over mountains',
    response_format: 'url',
    size: '1792x1024'
  })
});

const result = await response.json();
console.log('Generated images:', result.data.map(item => item.url));`,

    response: `{
  "created": 1752609790,
  "data": [
    {
      "url": "https://api.infip.pro/generated_images/e7b...e1.png",
      "b64_json": null,
      "model": null
    }
  ],
  "usage": null
}`
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/v1/images/generations',
      description: 'Generate images from text prompts (OpenAI compatible)',
      params: ['model', 'prompt', 'n', 'size', 'response_format']
    },
    {
      method: 'GET',
      path: '/v1/models',
      description: 'List available AI models (OpenAI compatible)',
      params: []
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Fast image generation with optimized processing'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime'
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Worldwide content delivery for fast image access'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock technical support and monitoring'
    }
  ];

  const CodeBlock: React.FC<{ code: string; language: string; id: string }> = ({ code, language, id }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
        <span className="text-sm text-gray-300 font-medium">{language}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="text-sm">{copiedCode === id ? 'Copied!' : 'Copy'}</span>
        </motion.button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );

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
              <Code className="h-12 w-12 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-500 bg-clip-text text-transparent">
              API Documentation
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Integrate AI image generation into your applications with our powerful and easy-to-use REST API.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="inline-flex p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 mb-4">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Terminal className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Start</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Get Your API Key</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-gray-500" />
                      <GradientButton
                        size="sm"
                        onClick={generateApiKey}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Generating...' : 'Generate API Key'}
                      </GradientButton>
                    </div>
                    
                    {apiKey && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">Your API Key</h4>
                        <div className="flex items-center space-x-2">
                          <code className="flex-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
                            {apiKey}
                          </code>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyApiKey}
                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            title="Copy API Key"
                          >
                            <Copy className="h-4 w-4" />
                          </motion.button>
                        </div>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                          Store this key securely. It will not be shown again.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Make Your First Request</h3>
                  <CodeBlock 
                    code={codeExamples.curl} 
                    language="cURL" 
                    id="curl-example"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. Handle the Response</h3>
                  <CodeBlock 
                    code={codeExamples.response} 
                    language="JSON Response" 
                    id="response-example"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Endpoints */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Book className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Endpoints</h2>
              </div>

              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <motion.div
                    key={endpoint.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 border border-gray-200 dark:border-dark-600 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        endpoint.method === 'GET' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {endpoint.description}
                    </p>
                    {endpoint.params.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {endpoint.params.map((param) => (
                          <span 
                            key={param}
                            className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                          >
                            {param}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Code Examples
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Python</h3>
                <CodeBlock 
                  code={codeExamples.python} 
                  language="Python" 
                  id="python-example"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">JavaScript</h3>
                <CodeBlock 
                  code={codeExamples.javascript} 
                  language="JavaScript" 
                  id="javascript-example"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Rate Limits & Pricing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">100</div>
                <div className="text-gray-600 dark:text-gray-400">Requests per minute</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">$0.02</div>
                <div className="text-gray-600 dark:text-gray-400">Per image generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">99.9%</div>
                <div className="text-gray-600 dark:text-gray-400">Uptime guarantee</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ApiPage;