import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  icon: Icon,
  error,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200" />
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 ${Icon ? 'pl-10' : ''} 
            border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
            hover:border-gray-400 dark:hover:border-gray-500
            transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {/* Focus ring enhancement */}
        <div className="absolute inset-0 rounded-lg bg-teal-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-slideInLeft">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';