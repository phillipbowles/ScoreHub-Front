// src/components/common/PlayerAvatar.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface PlayerAvatarProps {
  avatar: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  avatar,
  color,
  size = 'medium',
  showBorder = false,
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-lg',
    large: 'text-2xl',
  };

  return (
    <View
      className={`${sizeClasses[size]} rounded-full items-center justify-center ${
        showBorder ? 'border-2 border-white' : ''
      }`}
      style={{ backgroundColor: color }}
    >
      <Text className={`text-white ${textSizeClasses[size]} font-bold`}>
        {avatar}
      </Text>
    </View>
  );
};