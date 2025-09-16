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
import { Input } from '../../components/ui/Input';
import { RootStackParamList, RegisterFormData } from '../../types';

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
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('¡Éxito!', 'Cuenta creada correctamente', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
          <View className="items-center mt-10 mb-12">
            <Text className="text-4xl font-bold text-black mb-2">
              Crear Cuenta
            </Text>
            <Text className="text-base text-gray-500">
              Únete a Score Hub
            </Text>
          </View>

          <View className="mb-8">
            <View className="mb-5">
              <Input
                placeholder="Nombre completo"
                value={formData.name}
                onChangeText={(name) => setFormData({ ...formData, name })}
                autoCapitalize="words"
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
              />
            </View>

            <View className="mb-5">
              <Input
                placeholder="Contraseña"
                value={formData.password}
                onChangeText={(password) => setFormData({ ...formData, password })}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View className="mb-6">
              <Input
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChangeText={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
                secureTextEntry
                autoCapitalize="none"
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