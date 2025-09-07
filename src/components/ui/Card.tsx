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
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:-translate-y-2 hover:shadow-gray-200/20 dark:hover:shadow-gray-900/40 transition-all duration-300 cursor-pointer group' 
    : '';

  const animatedClasses = animated
    ? 'animate-fadeInUp opacity-0 [animation-fill-mode:forwards]'
    : '';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700 transition-colors duration-200 ${paddingClasses[padding]} ${hoverClasses} ${animatedClasses} ${className}`}>
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
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);