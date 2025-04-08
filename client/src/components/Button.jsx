import React from 'react';
import theme from '../utils/theme';

/**
 * Button component with different variants
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional className
 * @returns {JSX.Element} Button component
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  disabled = false, 
  onClick, 
  children, 
  className = '',
  ...props 
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary hover:bg-primaryHover text-white',
    secondary: 'bg-secondary hover:bg-secondaryLight text-white',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primaryLight',
    text: 'bg-transparent text-primary hover:text-primaryHover underline',
  };

  // Base button classes
  const baseClasses = 'font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50';
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Handle click with keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick && onClick(e);
    }
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${widthClasses} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={0}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 