import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BackgroundAnimation from './components/ui/BackgroundAnimation';

// Pages
import HomePage from './pages/HomePage';
import ModelsPage from './pages/ModelsPage';
import ApiPage from './pages/ApiPage';
import GalleryPage from './pages/GalleryPage';

// Hooks
import { useTheme } from './hooks/useTheme';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 transition-colors duration-500">
          <BackgroundAnimation />
          
          <Router>
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              
              <main className="flex-1 relative">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={
                      <motion.div
                        key="home"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <HomePage />
                      </motion.div>
                    } />
                    <Route path="/models" element={
                      <motion.div
                        key="models"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <ModelsPage />
                      </motion.div>
                    } />
                    <Route path="/api" element={
                      <motion.div
                        key="api"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <ApiPage />
                      </motion.div>
                    } />
                    <Route path="/gallery" element={
                      <motion.div
                        key="gallery"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <GalleryPage />
                      </motion.div>
                    } />
                  </Routes>
                </AnimatePresence>
              </main>
              
              <Footer />
            </div>
          </Router>
          
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#1e293b' : '#ffffff',
                color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(10px)',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
                style: {
                  background: theme === 'dark' ? '#064e3b' : '#ecfdf5',
                  color: theme === 'dark' ? '#6ee7b7' : '#065f46',
                  border: `1px solid ${theme === 'dark' ? '#059669' : '#a7f3d0'}`,
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  background: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
                  color: theme === 'dark' ? '#fca5a5' : '#991b1b',
                  border: `1px solid ${theme === 'dark' ? '#dc2626' : '#fecaca'}`,
                },
              },
              loading: {
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#ffffff',
                },
                style: {
                  background: theme === 'dark' ? '#1e3a8a' : '#eff6ff',
                  color: theme === 'dark' ? '#93c5fd' : '#1e40af',
                  border: `1px solid ${theme === 'dark' ? '#2563eb' : '#bfdbfe'}`,
                },
              },
            }}
          />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;