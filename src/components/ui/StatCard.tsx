import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useCountAnimation } from '../../hooks/useCountAnimation';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'yellow' | 'green' | 'red' | 'blue';
  delay?: number;
}

const colorClasses = {
  yellow: {
    border: 'border-yellow-500',
    iconBg: 'bg-yellow-500/20',
    iconColor: 'text-yellow-400',
    textColor: 'text-yellow-400',
  },
  green: {
    border: 'border-green-500',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    textColor: 'text-green-400',
  },
  red: {
    border: 'border-red-500',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    textColor: 'text-red-400',
  },
  blue: {
    border: 'border-blue-500',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-400',
  },
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  delay = 0 
}) => {
  const { count, isAnimating } = useCountAnimation({ 
    end: value, 
    duration: 1500,
    delay 
  });

  const colors = colorClasses[color];

  return (
    <div className={`
      bg-gray-800 border-2 ${colors.border} rounded-xl p-4 lg:p-6
      transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg
      cursor-pointer group
    `}>
      <div className="flex items-center gap-2 lg:gap-3">
        <div className={`
          w-8 h-8 lg:w-10 lg:h-10 ${colors.iconBg} rounded-lg 
          flex items-center justify-center flex-shrink-0
          transition-transform duration-300 group-hover:scale-110
        `}>
          <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${colors.iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className={`text-xs lg:text-sm font-medium ${colors.textColor} transition-colors duration-200`}>
            {title}
          </p>
          <p className={`
            text-2xl lg:text-3xl font-bold text-white transition-all duration-300
            ${isAnimating ? 'text-shadow-glow' : ''}
          `}>
            {count}
          </p>
        </div>
      </div>
    </div>
  );
};
