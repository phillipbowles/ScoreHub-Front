// src/components/common/IconContainer.tsx
import React from 'react';
import { View } from 'react-native';

interface IconContainerProps {
  icon: any;
  color: string;
  bgColor: string;
  size?: 'small' | 'medium' | 'large';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const IconContainer: React.FC<IconContainerProps> = ({
  icon: IconComponent,
  color,
  bgColor,
  size = 'medium',
  rounded = 'lg',
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <View
      className={`${sizeClasses[size]} ${roundedClasses[rounded]} items-center justify-center`}
      style={{ backgroundColor: bgColor }}
    >
      <IconComponent size={iconSizes[size]} color={color} weight="bold" />
    </View>
  );
};