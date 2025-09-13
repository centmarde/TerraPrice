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
    sm: { container: 'w-8 h-8', iconInner: 'w-3.5 h-3.5', text: 'text-sm', spacing: 'space-x-1.5' },
    md: { container: 'w-10 h-10', iconInner: 'w-5 h-5', text: 'text-xl', spacing: 'space-x-2' },
    lg: { container: 'w-14 h-14', iconInner: 'w-6 h-6', text: 'text-2xl', spacing: 'space-x-3' }
  };

  const { iconInner, text, container, spacing } = sizeClasses[size];

  return (
    <div className={`flex items-center ${spacing} ${className} flex-none`}> 
      <div className={`bg-teal-700 text-white rounded-lg ${container} relative flex-none flex items-center justify-center`}> 
        <Home className={`${iconInner}`} />
        <DollarSign className={`absolute -top-1 -right-1 ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} bg-white text-teal-700 rounded-full flex items-center justify-center`} />
      </div>
      {showText && (
        <div className="flex flex-col min-w-0 ml-2"> 
          <h1 className={`font-bold text-gray-900 dark:text-white ${text} leading-tight transition-colors duration-200 truncate`}> 
            TERRA PRICE
          </h1>
        </div>
      )}
    </div>
  );
};