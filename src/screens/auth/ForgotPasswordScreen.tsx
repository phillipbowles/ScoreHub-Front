import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EnvelopeSimple, ArrowLeft, PaperPlaneRight } from 'phosphor-react-native';
import { RootStackParamList } from '../../types';
import { Card } from '../../components/ui/Card';
import { InputField } from '../../components/common/InputField';
import { Button } from '../../components/ui/Button';
import { apiService } from '../../utils/api';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetLink = async () => {
    // Validaciones
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.forgotPassword(email);

      if (response.success) {
        setEmailSent(true);
        Alert.alert(
          'Correo Enviado',
          'Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          response.error || 'No se pudo enviar el correo de recuperación. Verifica que el correo esté registrado.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
      Alert.alert(
        'Error de Conexión',
        'No se pudo conectar al servidor. Verifica tu conexión a internet.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header con botón de regresar */}
          <View className="px-6 pt-6 pb-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex-row items-center mb-6"
            >
              <ArrowLeft size={24} color="#000" weight="bold" />
              <Text className="text-base font-semibold text-black ml-2">Volver</Text>
            </TouchableOpacity>

            <Text className="text-3xl font-bold text-black mb-2">
              Recuperar Contraseña
            </Text>
            <Text className="text-base text-gray-500">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </Text>
          </View>

          {/* Formulario */}
          <View className="px-6 flex-1">
            {!emailSent ? (
              <>
                {/* Ícono decorativo */}
                <View className="items-center my-8">
                  <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center">
                    <EnvelopeSimple size={48} color="#3b82f6" weight="fill" />
                  </View>
                </View>

                {/* Campo de email */}
                <Card className="mb-6" padding="none">
                  <InputField
                    label="Correo Electrónico"
                    placeholder="tu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </Card>

                {/* Botón de enviar */}
                <Button
                  onPress={handleSendResetLink}
                  disabled={isLoading}
                  className="mb-4"
                >
                  {isLoading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="#fff" />
                      <Text className="text-white font-semibold text-base ml-2">
                        Enviando...
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center justify-center">
                      <PaperPlaneRight size={20} color="#fff" weight="fill" />
                      <Text className="text-white font-semibold text-base ml-2">
                        Enviar Enlace
                      </Text>
                    </View>
                  )}
                </Button>

                {/* Información adicional */}
                <Card className="bg-blue-50" padding="medium">
                  <Text className="text-sm text-gray-700 text-center">
                    💡 Si no recibes el correo en unos minutos, revisa tu carpeta de spam
                  </Text>
                </Card>
              </>
            ) : (
              /* Estado de éxito */
              <>
                <View className="items-center my-8">
                  <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-4">
                    <PaperPlaneRight size={48} color="#10b981" weight="fill" />
                  </View>
                  <Text className="text-2xl font-bold text-black mb-2">
                    ¡Correo Enviado!
                  </Text>
                  <Text className="text-base text-gray-500 text-center px-4">
                    Hemos enviado un enlace de recuperación a
                  </Text>
                  <Text className="text-base font-semibold text-black mt-2">
                    {email}
                  </Text>
                </View>

                <Card className="mb-6" padding="large">
                  <Text className="text-sm text-gray-700 text-center mb-4">
                    Sigue las instrucciones en el correo para restablecer tu contraseña.
                  </Text>
                  <Text className="text-sm text-gray-500 text-center">
                    El enlace expirará en 60 minutos por seguridad.
                  </Text>
                </Card>

                <Button
                  onPress={() => navigation.navigate('Login')}
                  variant="secondary"
                  className="mb-4"
                >
                  <View className="flex-row items-center justify-center">
                    <ArrowLeft size={20} color="#3b82f6" />
                    <Text className="text-blue-600 font-semibold text-base ml-2">
                      Volver al Login
                    </Text>
                  </View>
                </Button>

                {/* Reenviar correo */}
                <TouchableOpacity
                  onPress={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="py-3"
                >
                  <Text className="text-gray-500 text-center">
                    ¿No recibiste el correo?{' '}
                    <Text className="text-blue-600 font-semibold">Reenviar</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
