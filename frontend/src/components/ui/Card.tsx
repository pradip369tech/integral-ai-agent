import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = true }) => {
  return (
    <div className={`${glass ? 'glass-card' : ''} p-6 ${className}`} style={{ padding: '24px' }}>
      {children}
    </div>
  );
};
