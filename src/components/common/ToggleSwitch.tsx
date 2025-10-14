// src/components/common/ToggleSwitch.tsx
import React from 'react';
import { Switch, Platform } from 'react-native';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ 
        false: '#d1d5db', 
        true: '#1c1c1e' 
      }}
      thumbColor={Platform.OS === 'ios' ? '#ffffff' : value ? '#ffffff' : '#f3f4f6'}
      ios_backgroundColor="#d1d5db"
    />
  );
};