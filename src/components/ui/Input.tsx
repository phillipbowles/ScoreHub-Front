import React, { useState } from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'filled';
}

export const Input: React.FC<InputProps> = ({
  variant = 'filled',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-xl px-5 text-base';

  const variantClasses = {
    default: 'border border-gray-200 bg-white',
    filled: 'bg-gray-100'
  };

  return (
    <TextInput
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      placeholderTextColor="#8E8E93"
      style={{ fontSize: 17, lineHeight: 24, paddingVertical: 16, minHeight: 56 }}
      {...props}
    />
  );
};

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  variant?: 'default' | 'filled';
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  variant = 'filled',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const variantClasses = {
    default: 'border border-gray-200 bg-white',
    filled: 'bg-gray-100'
  };

  return (
    <View className="relative">
      <TextInput
        className={`rounded-xl px-5 pr-14 text-base ${variantClasses[variant]} ${className}`}
        placeholderTextColor="#8E8E93"
        style={{ fontSize: 17, lineHeight: 24, paddingVertical: 16, minHeight: 56 }}
        secureTextEntry={!showPassword}
        {...props}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-0 bottom-0 justify-center"
        activeOpacity={0.7}
      >
        {showPassword ? (
          <EyeSlash size={22} color="#6b7280" weight="regular" />
        ) : (
          <Eye size={22} color="#6b7280" weight="regular" />
        )}
      </TouchableOpacity>
    </View>
  );
};