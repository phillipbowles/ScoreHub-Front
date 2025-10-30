import React from 'react';
import { TouchableOpacity, Text, View, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-xl items-center justify-center';

  const variantClasses = {
    primary: 'bg-black',
    secondary: 'bg-gray-100',
    ghost: 'bg-transparent'
  };

  const sizeClasses = {
    small: 'py-2 px-4',
    medium: 'py-4 px-6',
    large: 'py-5 px-8'
  };

  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-black',
    ghost: 'text-black',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon ? (
        <View className="flex-row items-center justify-center">
          {icon}
          <Text className={`font-semibold ${textVariantClasses[variant]} ${textSizeClasses[size]} ml-2`}>
            {title}
          </Text>
        </View>
      ) : (
        <Text className={`font-semibold ${textVariantClasses[variant]} ${textSizeClasses[size]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};