// src/components/common/SettingItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, CaretRight } from 'phosphor-react-native';
import { Card } from '../ui/Card';
import { ToggleSwitch } from './ToggleSwitch';
import { Counter } from './Counter';

interface SegmentedOption {
  label: string;
  value: string;
}

interface SettingItemProps {
  icon?: any;
  iconColor?: string;
  iconBgColor?: string;
  label: string;
  description?: string;
  type?: 'toggle' | 'counter' | 'button' | 'navigation' | 'segmented';
  value?: any;
  onValueChange?: (value: any) => void;
  counterMin?: number;
  counterMax?: number;
  counterStep?: number;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  segmentedOptions?: SegmentedOption[];
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon: IconComponent,
  iconColor = '#6b7280',
  iconBgColor = '#f3f4f6',
  label,
  description,
  type = 'button',
  value,
  onValueChange,
  counterMin,
  counterMax,
  counterStep = 1,
  onPress,
  rightElement,
  segmentedOptions = [],
}) => {
  const renderRight = () => {
    if (rightElement) return rightElement;

    switch (type) {
      case 'toggle':
        return (
          <ToggleSwitch
            value={value}
            onValueChange={onValueChange || (() => {})}
          />
        );
      case 'counter':
        return (
          <Counter
            value={value}
            onValueChange={onValueChange || (() => {})}
            min={counterMin}
            max={counterMax}
            step={counterStep}
          />
        );
      case 'navigation':
        return <CaretRight size={20} color="#9ca3af" weight="bold" />;
      default:
        return null;
    }
  };

  const renderSegmented = () => {
    if (type !== 'segmented') return null;

    return (
      <View className="mt-3 w-full">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          {segmentedOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => onValueChange?.(option.value)}
              className={`flex-1 px-4 py-2 rounded-md ${
                value === option.value ? 'bg-white' : ''
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-medium text-center ${
                  value === option.value ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const content = (
    <View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {IconComponent && (
            <View
              className="w-10 h-10 rounded-lg items-center justify-center mr-3"
              style={{ backgroundColor: iconBgColor }}
            >
              <IconComponent size={20} color={iconColor} weight="bold" />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-base font-semibold text-black">{label}</Text>
            {description && (
              <Text className="text-xs text-gray-500 mt-0.5">{description}</Text>
            )}
          </View>
        </View>
        {type !== 'segmented' && renderRight()}
      </View>
      {renderSegmented()}
    </View>
  );

  if ((type === 'button' || type === 'navigation') && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card padding="medium">{content}</Card>
      </TouchableOpacity>
    );
  }

  return <Card padding="medium">{content}</Card>;
};