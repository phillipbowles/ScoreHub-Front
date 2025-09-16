import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'filled';
}

export const Input: React.FC<InputProps> = ({
  variant = 'filled',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-xl px-5 py-4 text-base';
  
  const variantClasses = {
    default: 'border border-gray-200 bg-white',
    filled: 'bg-gray-100'
  };

  return (
    <TextInput
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      placeholderTextColor="#8E8E93"
      {...props}
    />
  );
};