import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiService } from '../../utils/api';
import { RootStackParamList, LoginFormData } from '../../types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
  if (!formData.email.trim() || !formData.password.trim()) {
    Alert.alert('Error', 'Por favor completa todos los campos');
    return;
  }

  setIsLoading(true);
  
  try {
    const response = await apiService.login({
      email: formData.email,
      password: formData.password,
    });

    if (response.success) {
      // Guardar token si es necesario
      // await AsyncStorage.setItem('userToken', response.data.access_token);
      console.log('Login exitoso:', response.data);
      navigation.navigate('Home');
    } else {
      navigation.navigate('Home');
      Alert.alert('Error', response.error || 'Error al iniciar sesión');
    }
  } catch (error) {
    Alert.alert('Error', 'Error de conexión');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-8">
          {/* Logo Section */}
          <View className="items-center mt-20 mb-16">
            <Text className="text-4xl font-bold text-black mb-2">
              Score Hub
            </Text>
            <Text className="text-base text-gray-500">
              Tu marcador digital
            </Text>
          </View>

          {/* Form */}
          <View className="mb-8">
            <View className="mb-5">
              <Input
                placeholder="Email"
                value={formData.email}
                onChangeText={(email) => setFormData({ ...formData, email })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="mb-8">
              <Input
                placeholder="Contraseña"
                value={formData.password}
                onChangeText={(password) => setFormData({ ...formData, password })}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <Button
              title={isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              onPress={handleLogin}
              disabled={isLoading}
              className="mb-5"
            />

            <TouchableOpacity 
              onPress={() => navigation.navigate('Register')}
              className="items-center"
            >
              <Text className="text-base text-blue-500 font-medium">
                ¿No tienes cuenta? Regístrate
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <View className="items-center mt-8">
            <TouchableOpacity>
              <Text className="text-sm text-gray-500">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};