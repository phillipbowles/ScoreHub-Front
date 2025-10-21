import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../components/ui/Button';
import { Input, PasswordInput } from '../../components/ui/Input';
import { apiService } from '../../utils/api';
import { RootStackParamList, RegisterFormData } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // const clearStorage = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     Alert.alert('✅ Storage Limpiado', 'Token antiguo eliminado. Ahora puedes registrarte.');
  //     console.log('✅ AsyncStorage cleared');
  //   } catch (error) {
  //     console.error('Error clearing storage:', error);
  //     Alert.alert('Error', 'No se pudo limpiar el storage');
  //   }
  // };

  const handleRegister = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!formData.acceptTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.register({
        name: formData.name.trim(),
        email_address: formData.email.toLowerCase().trim(),
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      if (response.success) {
        console.log('✅ Registration successful:', response.data);

        // Guardar credenciales para que el sistema las recuerde
        try {
          await AsyncStorage.setItem('lastEmail', formData.email.toLowerCase().trim());
        } catch (e) {
          console.log('Could not save email for autofill');
        }

        Alert.alert('¡Éxito!', 'Cuenta creada correctamente', [
          {
            text: 'OK',
            onPress: () => {
              console.log('Navigating to Home screen');
              navigation.navigate('Home');
            }
          }
        ]);
      } else {
        console.log('❌ Registration failed:', response.error);

        // El error puede ser un objeto con estructura { message, fields, code }
        let errorMessage = 'Error al crear la cuenta';

        if (response.error) {
          if (typeof response.error === 'string') {
            errorMessage = response.error;
          } else if (typeof response.error === 'object' && response.error !== null) {
            // Usar una variable con tipo seguro para evitar errores de TS
            const errObj = response.error as { message?: unknown; fields?: unknown };

            const mainMessage = typeof errObj.message === 'string'
              ? errObj.message
              : 'Error al crear la cuenta';

            let fieldMessages = '';
            if (errObj.fields && typeof errObj.fields === 'object') {
              try {
                const values = Object.values(errObj.fields as Record<string, unknown>);
                const flattened: string[] = values
                  .flatMap(v => Array.isArray(v) ? v : [v])
                  .map(v => (v === null || v === undefined) ? '' : String(v));

                const nonEmpty = flattened.filter(s => s && s.trim().length > 0);
                if (nonEmpty.length > 0) {
                  fieldMessages = '\n' + nonEmpty.join('\n');
                }
              } catch (e) {
                console.warn('Could not parse field errors', e);
              }
            }

            errorMessage = mainMessage + fieldMessages;
          }
        }

        Alert.alert('Error de Registro', errorMessage);
      }
    } catch (error) {
      console.error('💥 Register exception:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : 'Error desconocido';

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
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
          <View className="items-center mt-10 mb-8">
            <Text className="text-4xl font-bold text-black mb-2">
              Crear Cuenta
            </Text>
            <Text className="text-base text-gray-500">
              Únete a Score Hub
            </Text>
          </View>

          <View className="mb-8" nativeID="register-form">
            <View className="mb-5">
              <Input
                placeholder="Nombre completo"
                value={formData.name}
                onChangeText={(name) => setFormData({ ...formData, name })}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
              />
            </View>

            <View className="mb-5">
              <Input
                placeholder="Email"
                value={formData.email}
                onChangeText={(email) => setFormData({ ...formData, email })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username-new"
                textContentType="username"
                importantForAutofill="yes"
                returnKeyType="next"
              />
            </View>

            <View className="mb-5">
              <PasswordInput
                placeholder="Contraseña"
                value={formData.password}
                onChangeText={(password) => {
                  setFormData({ ...formData, password, confirmPassword: password });
                }}
                autoCapitalize="none"
                autoComplete="password-new"
                textContentType="newPassword"
                importantForAutofill="yes"
                passwordRules="minlength: 8; required: lower; required: upper; required: digit;"
                returnKeyType="next"
              />
            </View>

            <View className="mb-6">
              <PasswordInput
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChangeText={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
                autoCapitalize="none"
                autoComplete="off"
                textContentType="none"
                importantForAutofill="no"
                editable={formData.password.length > 0}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>

            {/* Checkbox personalizado */}
            <View className="flex-row items-start mb-8">
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
                className="mr-3 mt-1"
              >
                <View className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  formData.acceptTerms ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                }`}>
                  {formData.acceptTerms && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>
              </TouchableOpacity>
              <Text className="text-sm text-gray-500 flex-1">
                Acepto los{' '}
                <Text className="text-blue-500">términos y condiciones</Text>
                {' '}y la{' '}
                <Text className="text-blue-500">política de privacidad</Text>
              </Text>
            </View>

            <Button
              title={isLoading ? 'Creando Cuenta...' : 'Crear Cuenta'}
              onPress={handleRegister}
              disabled={isLoading}
              className="mb-5"
            />

            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              className="items-center"
            >
              <Text className="text-base text-blue-500 font-medium">
                ¿Ya tienes cuenta? Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};