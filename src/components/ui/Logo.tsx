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
    sm: { icon: 'w-8 h-8', text: 'text-xl', container: 'p-2' },
    md: { icon: 'w-12 h-12', text: 'text-2xl', container: 'p-3' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl', container: 'p-4' }
  };

  const { icon, text, container } = sizeClasses[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`bg-teal-700 text-white rounded-lg ${container} relative`}>
        <Home className={`${icon}`} />
        <DollarSign className="absolute top-1 right-1 w-4 h-4 bg-white text-teal-700 rounded-full p-0.5" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`font-bold text-gray-900 ${text} leading-tight`}>
            TERRA PRICE
          </h1>
          <p className="text-sm text-gray-600 font-medium tracking-wide">
            FLOORPLAN PREDICTION SYSTEM
          </p>
        </div>
      )}
    </div>
  );
};