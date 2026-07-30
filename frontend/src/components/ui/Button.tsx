import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading,
  className = '',
  ...props 
}) => {
  const baseClass = `btn btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''} ${className}`;
  
  return (
    <button className={baseClass} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <span className="loader"></span> : children}
    </button>
  );
};
