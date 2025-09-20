import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Loader, 
  LoadingSpinner, 
  LoadingDots, 
  LoadingBars, 
  LoadingRipple,
  LoadingWave,
  FullScreenLoader,
  LoadingOverlay 
} from '../components/ui/Loader';

const LoaderShowcase: React.FC = () => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const loaderVariants: Array<{
    variant: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring' | 'ripple' | 'wave' | 'glow' | 'rainbow' | 'dancing' | 'floating';
    name: string;
    description: string;
    color?: 'primary' | 'secondary' | 'white' | 'gray' | 'rainbow' | 'vibrant';
  }> = [
    { variant: 'spinner', name: '🌀 Spinner', description: 'Classic spinning circle', color: 'primary' },
    { variant: 'dots', name: '🔵 Bouncing Dots', description: 'Three bouncing dots with rainbow effects', color: 'vibrant' },
    { variant: 'pulse', name: '💓 Heartbeat', description: 'Pulsing circle animation', color: 'primary' },
    { variant: 'bars', name: '📊 Sound Bars', description: 'Dancing sound equalizer bars', color: 'vibrant' },
    { variant: 'ring', name: '💍 Ring', description: 'Ring with spinning border', color: 'primary' },
    { variant: 'ripple', name: '🌊 Ripple Wave', description: 'Colorful ripple effect', color: 'rainbow' },
    { variant: 'wave', name: '🌈 Rainbow Wave', description: 'Color-shifting wave bars', color: 'rainbow' },
    { variant: 'glow', name: '✨ Magical Glow', description: 'Glowing pulse with shadows', color: 'vibrant' },
    { variant: 'rainbow', name: '🦄 Rainbow Spin', description: 'Color-changing rainbow spinner', color: 'rainbow' },
    { variant: 'dancing', name: '💃 Dancing Bars', description: 'Gradient bars dancing to the beat', color: 'rainbow' },
    { variant: 'floating', name: '🎈 Floating Orbs', description: 'Multiple floating gradient orbs', color: 'rainbow' }
  ];

  const sizes: Array<{ size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; name: string }> = [
    { size: 'xs', name: 'Extra Small' },
    { size: 'sm', name: 'Small' },
    { size: 'md', name: 'Medium' },
    { size: 'lg', name: 'Large' },
    { size: 'xl', name: 'Extra Large' }
  ];

  const colors: Array<{ color: 'primary' | 'secondary' | 'white' | 'gray' | 'rainbow' | 'vibrant'; name: string }> = [
    { color: 'primary', name: '🎯 Primary (Teal)' },
    { color: 'vibrant', name: '🌸 Vibrant (Pink)' },
    { color: 'rainbow', name: '🌈 Rainbow Magic' },
    { color: 'secondary', name: '⚫ Secondary (Gray)' }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-4xl font-bold mb-3 animate-pulse">
          🎨✨ Lively Loader Showcase ✨🎨
        </h1>
        <p className="text-xl opacity-90 animate-bounce">
          Experience the most vibrant and engaging loading animations! 
          <span className="inline-block ml-2">🌟</span>
        </p>
        <div className="flex gap-2 mt-4">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Loader Variants */}
      <Card className="border-2 border-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800">
        <CardHeader title="🎪 Lively Loader Variants" subtitle="Vibrant animations that bring joy to waiting!" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loaderVariants.map((variant) => (
            <div key={variant.variant} className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="h-24 flex items-center justify-center mb-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-transparent group-hover:border-purple-300 dark:group-hover:border-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                <Loader variant={variant.variant} size="lg" color={variant.color || 'primary'} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{variant.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{variant.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Size Variations */}
      <Card>
        <CardHeader title="📏 Size Variations" subtitle="Same loader in different sizes" />
        
        <div className="grid grid-cols-5 gap-6">
          {sizes.map((size) => (
            <div key={size.size} className="text-center">
              <div className="h-16 flex items-center justify-center mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Loader variant="spinner" size={size.size} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{size.name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{size.size}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Color Variations */}
      <Card>
        <CardHeader title="🎨 Color Variations" subtitle="Different color themes" />
        
        <div className="grid grid-cols-3 gap-6">
          {colors.map((color) => (
            <div key={color.color} className="text-center">
              <div className="h-16 flex items-center justify-center mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Loader variant="ring" size="lg" color={color.color} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{color.name}</h3>
            </div>
          ))}
        </div>
      </Card>

      {/* With Text Examples */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <CardHeader title="💬✨ Loaders with Personality" subtitle="Loaders that speak to your users with style and flair!" />
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow duration-300">
              <LoadingSpinner text="🚀 Loading data..." color="primary" />
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl border border-pink-200 dark:border-pink-700 hover:shadow-lg transition-shadow duration-300">
              <Loader variant="dancing" text="🎵 Vibing..." color="vibrant" />
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow duration-300">
              <Loader variant="floating" text="🎈 Floating away..." color="rainbow" />
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow duration-300">
              <Loader variant="rainbow" text="🌈 Rainbow magic..." color="rainbow" />
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700 hover:shadow-lg transition-shadow duration-300">
              <Loader variant="ripple" text="🌊 Making waves..." color="rainbow" />
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl border border-teal-200 dark:border-teal-700 hover:shadow-lg transition-shadow duration-300">
              <Loader variant="glow" text="✨ Sparkling..." color="vibrant" />
            </div>
          </div>
        </div>
      </Card>

      {/* Special Loaders */}
      <Card>
        <CardHeader title="✨ Special Loaders" subtitle="Full screen and overlay loaders" />
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowFullScreen(true)}
              variant="primary"
            >
              Show Full Screen Loader
            </Button>
            <Button 
              onClick={() => setShowOverlay(true)}
              variant="secondary"
            >
              Show Loading Overlay
            </Button>
          </div>

          <LoadingOverlay isVisible={showOverlay} variant="ripple" text="Loading overlay demo...">
            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Sample Content
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This content is covered by a loading overlay when active
                </p>
                <Button 
                  onClick={() => setShowOverlay(false)}
                  variant="outline"
                  className="mt-4"
                >
                  Hide Overlay
                </Button>
              </div>
            </div>
          </LoadingOverlay>
        </div>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader title="📝 Usage Examples" subtitle="Code examples for implementing loaders" />
        
        <div className="space-y-4">
          <div className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="text-green-400">// Basic usage</div>
            <div className="mt-1">&lt;Loader variant="spinner" size="md" /&gt;</div>
            <div className="mt-3 text-green-400">// With text</div>
            <div className="mt-1">&lt;LoadingSpinner text="Loading..." /&gt;</div>
            <div className="mt-3 text-green-400">// Full screen</div>
            <div className="mt-1">&lt;FullScreenLoader variant="ring" text="Please wait..." /&gt;</div>
            <div className="mt-3 text-green-400">// With overlay</div>
            <div className="mt-1">&lt;LoadingOverlay isVisible={"{loading}"} variant="dots"&gt;</div>
            <div className="ml-4">  &lt;YourContent /&gt;</div>
            <div>&lt;/LoadingOverlay&gt;</div>
          </div>
        </div>
      </Card>

      {/* Full Screen Loader */}
      {showFullScreen && (
        <FullScreenLoader 
          variant="glow" 
          text="This is a full screen loader demo..."
        />
      )}

      {/* Auto-hide full screen loader */}
      {showFullScreen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={() => setShowFullScreen(false)}
            variant="danger"
            size="sm"
          >
            Close Demo
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoaderShowcase;
