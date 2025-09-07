import React from 'react';
import { Home, DollarSign } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: { icon: 'w-5 h-5', text: 'text-sm', container: 'p-1', spacing: 'space-x-1.5' },
    md: { icon: 'w-8 h-8', text: 'text-xl', container: 'p-2', spacing: 'space-x-2' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', container: 'p-3', spacing: 'space-x-3' }
  };

  const { icon, text, container, spacing } = sizeClasses[size];

  return (
    <div className={`flex items-center ${spacing} ${className} flex-shrink-0`}>
      <div className={`bg-teal-700 text-white rounded-lg ${container} relative flex-shrink-0`}>
        <Home className={`${icon}`} />
        <DollarSign className={`absolute top-0.5 right-0.5 ${size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'} bg-white text-teal-700 rounded-full p-0.5`} />
      </div>
      {showText && (
        <div className="flex flex-col min-w-0 flex-shrink-0">
          <h1 className={`font-bold text-gray-900 dark:text-white ${text} leading-tight transition-colors duration-200 whitespace-nowrap`}>
            TERRA PRICE
          </h1>
          <p className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300 font-medium tracking-wide transition-colors duration-200 whitespace-nowrap`}>
            FLOORPLAN PREDICTION SYSTEM
          </p>
        </div>
      )}
    </div>
  );
};