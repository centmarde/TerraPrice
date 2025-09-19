import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  animated = false
}) => {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  const hoverClasses = hover 
    ? 'hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-blue-200/30 dark:hover:shadow-blue-900/40 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300 cursor-pointer group' 
    : '';

  const animatedClasses = animated
    ? 'animate-fadeInUp opacity-0 [animation-fill-mode:forwards]'
    : '';

  return (
    <div className={`bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-lg dark:shadow-gray-900/30 border border-gray-200/70 dark:border-gray-700/70 backdrop-blur-sm transition-all duration-300 ${paddingClasses[padding]} ${hoverClasses} ${animatedClasses} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className = ''
}) => (
  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 ${className}`}>
    <div className="min-w-0">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200 truncate">{title}</h3>
      {subtitle && <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);