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
    bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
    border: 'border-yellow-200 dark:border-yellow-500/30',
    iconBg: 'bg-yellow-500/20 dark:bg-yellow-500/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    titleColor: 'text-yellow-700 dark:text-yellow-300',
    valueColor: 'text-yellow-900 dark:text-yellow-100',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
    border: 'border-green-200 dark:border-green-500/30',
    iconBg: 'bg-green-500/20 dark:bg-green-500/30',
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-700 dark:text-green-300',
    valueColor: 'text-green-900 dark:text-green-100',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
    border: 'border-red-200 dark:border-red-500/30',
    iconBg: 'bg-red-500/20 dark:bg-red-500/30',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-700 dark:text-red-300',
    valueColor: 'text-red-900 dark:text-red-100',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
    border: 'border-blue-200 dark:border-blue-500/30',
    iconBg: 'bg-blue-500/20 dark:bg-blue-500/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-700 dark:text-blue-300',
    valueColor: 'text-blue-900 dark:text-blue-100',
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
      ${colors.bg} border ${colors.border} rounded-xl p-4 lg:p-6
      transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl
      cursor-pointer group relative overflow-hidden
    `}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative flex items-center gap-3 lg:gap-4">
        <div className={`
          w-12 h-12 lg:w-14 lg:h-14 ${colors.iconBg} rounded-xl
          flex items-center justify-center flex-shrink-0
          transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
          shadow-lg
        `}>
          <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${colors.iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm lg:text-base font-semibold ${colors.titleColor} transition-colors duration-200 mb-1`}>
            {title}
          </p>
          <p className={`
            text-2xl lg:text-4xl font-bold ${colors.valueColor} transition-all duration-300
            ${isAnimating ? 'scale-110' : ''}
          `}>
            {count}
          </p>
        </div>
      </div>
    </div>
  );
};
