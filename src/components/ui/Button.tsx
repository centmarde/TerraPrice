import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 relative overflow-hidden group transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation';
  
  const variantClasses = {
    primary: 'bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 focus:ring-teal-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:shadow-lg hover:shadow-teal-500/25',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 focus:ring-gray-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:shadow-lg hover:shadow-gray-500/25',
    success: 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:ring-green-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:shadow-lg hover:shadow-green-500/25',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:ring-red-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:shadow-lg hover:shadow-red-500/25',
    outline: 'border-2 border-teal-700 text-teal-700 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20 focus:ring-teal-500 disabled:border-gray-300 disabled:text-gray-300 dark:disabled:border-gray-600 dark:disabled:text-gray-600 hover:shadow-lg hover:shadow-teal-500/10'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-[44px]'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {Icon && <Icon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${children ? 'mr-2' : ''} transition-transform duration-200 group-hover:scale-110`} />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};