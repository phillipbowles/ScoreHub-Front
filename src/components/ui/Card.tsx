import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'medium',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'rounded-2xl';
  
  const variantClasses = {
    default: 'bg-white',
    elevated: 'bg-white shadow-sm',
    outlined: 'bg-white border border-gray-200'
  };
  
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-5',
    large: 'p-6'
  };

  return (
    <View
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};