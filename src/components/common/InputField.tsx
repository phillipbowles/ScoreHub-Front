// src/components/common/InputField.tsx
import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  required = false,
  ...props
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-black mb-2">
        {label}
        {required && <Text className="text-red-500"> *</Text>}
      </Text>
      <TextInput
        className={`w-full px-5 py-4 bg-white rounded-xl text-base text-black border ${
          error ? 'border-red-500' : 'border-gray-200'
        }`}
        placeholderTextColor="#8E8E93"
        {...props}
      />
      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
};