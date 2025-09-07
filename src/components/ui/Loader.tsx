import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  centerScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text,
  className = '',
  centerScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderBouncingDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} rounded-full bg-teal-500 animate-bounce`}
          style={{ 
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {renderBouncingDots()}
      {text && (
        <span className={`font-medium text-teal-600 dark:text-teal-400 ${textSizeClasses[size]} transition-colors duration-200`}>
          {text}
        </span>
      )}
    </div>
  );

  if (centerScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center space-y-4 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Simplified preset components
export const LoadingSpinner: React.FC<{ 
  size?: LoaderProps['size']; 
  text?: string; 
}> = ({ 
  size = 'md', 
  text = 'Loading...'
}) => (
  <Loader size={size} text={text} />
);

export const LoadingDots: React.FC<{ 
  size?: LoaderProps['size']; 
  text?: string;
}> = ({ 
  size = 'md', 
  text
}) => (
  <Loader size={size} text={text} />
);

export const FullScreenLoader: React.FC<{ 
  text?: string;
}> = ({ 
  text = 'Loading...'
}) => (
  <Loader size="lg" text={text} centerScreen />
);

// Loading overlay for specific sections
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  text?: string;
  children: React.ReactNode;
}> = ({ 
  isVisible, 
  text = 'Loading...', 
  children 
}) => (
  <div className="relative">
    {children}
    {isVisible && (
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg z-10">
        <Loader size="lg" text={text} />
      </div>
    )}
  </div>
);

export default Loader;