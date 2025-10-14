// src/components/common/ScreenHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightIcon?: React.ReactNode;
  onBackPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightIcon,
  onBackPress,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-row items-center py-4 mb-6">
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4"
        >
          <CaretLeft size={24} color="#1c1c1e" weight="bold" />
        </TouchableOpacity>
      )}
      
      <View className="flex-1">
        <Text className="text-2xl font-bold text-black">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
        )}
      </View>
      
      {rightIcon && <View>{rightIcon}</View>}
    </View>
  );
};