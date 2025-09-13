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
    sm: { icon: 'w-4 h-4', text: 'text-sm', container: 'p-1.5', subtitle: 'text-[8px]' },
    md: { icon: 'w-5 h-5', text: 'text-base', container: 'p-2', subtitle: 'text-[9px]' },
    lg: { icon: 'w-6 h-6', text: 'text-lg', container: 'p-2.5', subtitle: 'text-[10px]' }
  };

  const { icon, text, container, subtitle } = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 flex-shrink-0 ${className}`}>
      <div className={`bg-teal-700 text-white rounded-lg ${container} relative flex-shrink-0`}>
        <Home className={`${icon} flex-shrink-0`} />
        <DollarSign className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white text-teal-700 rounded-full p-0.5 flex-shrink-0" />
      </div>
      {showText && (
        <div className="flex flex-col flex-shrink-0">
          <h1 className={`font-bold text-gray-800 dark:text-white ${text} leading-tight transition-colors duration-200 whitespace-nowrap`}>
            TERRA PRICE
          </h1>
          <span className={`${subtitle} text-gray-700 dark:text-gray-300 font-medium tracking-wide transition-colors duration-200 whitespace-nowrap`}
            title="FLOORPLAN PREDICTION SYSTEM"
          >
            FLOORPLAN PREDICTION SYSTEM
          </span>
        </div>
      )}
    </div>
  );
};