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
import { Input, PasswordInput } from '../../components/ui/Input';
import { apiService } from '../../utils/api';
import { RootStackParamList, LoginFormData } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    console.log('🔐 Attempting login for:', formData.email);

    const response = await apiService.login({
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
    });

    console.log('📥 Login response:', JSON.stringify(response, null, 2));

    if (response.success && response.data) {
      // Guardar token del formato de respuesta del backend
      const token = response.data.data?.access_token;

      if (token) {
        try {
          console.log('💾 Saving token to AsyncStorage...');
          await AsyncStorage.setItem('userToken', token);
          console.log('✅ Token saved successfully');
          console.log('🔑 Token preview:', token.substring(0, 30) + '...');

          // Navegar a Home
          console.log('🚀 Navigating to Home...');
          navigation.navigate('Home');
        } catch (storageError) {
          console.error('❌ Error saving token:', storageError);
          Alert.alert(
            'Error',
            'No se pudo guardar la sesión. Intenta nuevamente.'
          );
        }
      } else {
        console.error('❌ No token in response:', response.data);
        Alert.alert('Error', 'No se recibió el token de autenticación');
      }
    } else {
      // Manejar errores específicos del backend
      console.error('❌ Login failed:', response.error);

      // El error puede ser un objeto con estructura { message, fields, code }
      let errorMessage = 'Credenciales incorrectas';

      if (response.error) {
        if (typeof response.error === 'string') {
          errorMessage = response.error;
        } else if (typeof response.error === 'object' && response.error !== null) {
          // Usar una variable con tipo seguro para evitar errores de TS
          const errObj = response.error as { message?: unknown; fields?: unknown };

          const mainMessage = typeof errObj.message === 'string'
            ? errObj.message
            : 'Error en el inicio de sesión';

          let fieldMessages = '';
          if (errObj.fields && typeof errObj.fields === 'object') {
            try {
              // Intentar extraer mensajes de campo como array de strings
              const values = Object.values(errObj.fields as Record<string, unknown>);
              const flattened: string[] = values
                .flatMap(v => Array.isArray(v) ? v : [v])
                .map(v => (v === null || v === undefined) ? '' : String(v));

              const nonEmpty = flattened.filter(s => s && s.trim().length > 0);
              if (nonEmpty.length > 0) {
                fieldMessages = '\n' + nonEmpty.join('\n');
              }
            } catch (e) {
              // Si falla la extracción, no romper la app
              console.warn('Could not parse field errors', e);
            }
          }

          errorMessage = mainMessage + fieldMessages;
        }
      }

      Alert.alert('Error de Login', errorMessage);
    }
  } catch (error) {
    console.error('💥 Login exception:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');

    const errorMessage = error instanceof Error
      ? error.message
      : 'Error de conexión al servidor';

    Alert.alert(
      'Error de Conexión',
      `No se pudo conectar al servidor. Verifica tu conexión a internet.\n\nDetalle: ${errorMessage}`
    );
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
          <View
            className="mb-8"
            nativeID="login-form"
          >
            <View className="mb-5">
              <Input
                placeholder="Email"
                value={formData.email}
                onChangeText={(email) => setFormData({ ...formData, email })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                textContentType="username"
                importantForAutofill="yes"
                returnKeyType="next"
                onSubmitEditing={() => {}}
              />
            </View>

            <View className="mb-8">
              <PasswordInput
                placeholder="Contraseña"
                value={formData.password}
                onChangeText={(password) => setFormData({ ...formData, password })}
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
                importantForAutofill="yes"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
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