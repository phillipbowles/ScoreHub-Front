// src/components/common/Counter.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CounterProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  minWidth?: string;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  minWidth = '[30px]',
}) => {
  const canDecrement = min !== undefined ? value > min : true;
  const canIncrement = max !== undefined ? value < max : true;

  const handleDecrement = () => {
    if (canDecrement) {
      onValueChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (canIncrement) {
      onValueChange(value + step);
    }
  };

  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={handleDecrement}
        disabled={!canDecrement}
        className={`w-9 h-9 bg-black rounded-lg items-center justify-center ${
          !canDecrement ? 'opacity-30' : ''
        }`}
      >
        <Text className="text-white text-lg font-semibold">-</Text>
      </TouchableOpacity>
      
      <Text className={`text-lg font-bold text-black mx-4 min-w-${minWidth} text-center`}>
        {value}
      </Text>
      
      <TouchableOpacity
        onPress={handleIncrement}
        disabled={!canIncrement}
        className={`w-9 h-9 bg-black rounded-lg items-center justify-center ${
          !canIncrement ? 'opacity-30' : ''
        }`}
      >
        <Text className="text-white text-lg font-semibold">+</Text>
      </TouchableOpacity>
    </View>
  );
};