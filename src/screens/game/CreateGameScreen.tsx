import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, CustomGame } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { apiService } from '../../utils/api';

type CreateGameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateGame'>;

interface Props {
  navigation: CreateGameScreenNavigationProp;
}

const gameIcons = [
  { emoji: '🃏', label: 'Cartas' },
  { emoji: '🎲', label: 'Dados' },
  { emoji: '🏆', label: 'Copa' },
  { emoji: '⚽', label: 'Deporte' },
  { emoji: '🎯', label: 'Diana' },
  { emoji: '🎮', label: 'Gaming' },
];

export const CreateGameScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🃏',
    rules: '',
    maxPlayers: 4,
    minPlayers: 2,
    hasRounds: true,
    hasTimeLimit: false,
    isPublic: true,
    customIcon: '',
    showCustomIcon: false,
    rulesType: 'text' // 'text' or 'pdf'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGame = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre del juego es obligatorio');
      return;
    }

    if (!formData.rules.trim()) {
      Alert.alert('Error', 'Las reglas del juego son obligatorias');
      return;
    }

    setIsLoading(true);

    try {
      const gameData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.showCustomIcon ? formData.customIcon : formData.icon,
        rules: formData.rules.trim(),
        max_players: formData.maxPlayers,
        min_players: formData.minPlayers,
        has_rounds: formData.hasRounds,
        has_time_limit: formData.hasTimeLimit,
        is_public: formData.isPublic,
      };

      const response = await apiService.createGame(gameData);

      if (response.success) {
        Alert.alert(
          '¡Juego Creado!',
          `${formData.name} ha sido creado exitosamente`,
          [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]
        );
      } else {
        const errorMessage = response.error || 'Error al crear el juego';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Create game network error:', error);
      Alert.alert(
        'Error de Conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const selectIcon = (emoji: string) => {
    updateFormData('icon', emoji);
    updateFormData('showCustomIcon', false);
  };

  const toggleCustomIcon = () => {
    updateFormData('showCustomIcon', !formData.showCustomIcon);
    if (!formData.showCustomIcon) {
      updateFormData('customIcon', '');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center py-4 mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-4"
          >
            <Text className="text-lg text-black">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black">Crear Juego</Text>
        </View>

        {/* Información Básica */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-black mb-5">
            Información Básica
          </Text>
          
          <View className="mb-5">
            <Text className="text-sm font-semibold text-black mb-2">
              Nombre del Juego
            </Text>
            <TextInput
              className="w-full px-5 py-4 bg-gray-100 rounded-xl text-base text-black"
              placeholder="Ej: UNO, Monopoly, Truco..."
              placeholderTextColor="#8E8E93"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-black mb-2">
              Descripción (Opcional)
            </Text>
            <TextInput
              className="w-full px-5 py-4 bg-gray-100 rounded-xl text-base text-black"
              placeholder="Describe las reglas o características especiales..."
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
            />
          </View>
        </View>

        {/* Icono del Juego */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-black mb-5">
            Icono del Juego
          </Text>
          
          <View className="flex-row flex-wrap gap-3 mb-4">
            {gameIcons.map((icon, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectIcon(icon.emoji)}
                className={`flex-1 min-w-[90px] max-w-[90px] bg-gray-100 rounded-2xl p-4 items-center ${
                  formData.icon === icon.emoji && !formData.showCustomIcon 
                    ? 'bg-black' 
                    : ''
                }`}
              >
                <Text className="text-3xl mb-2">{icon.emoji}</Text>
                <Text className={`text-sm font-semibold ${
                  formData.icon === icon.emoji && !formData.showCustomIcon 
                    ? 'text-white' 
                    : 'text-black'
                }`}>
                  {icon.label}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              onPress={toggleCustomIcon}
              className={`flex-1 min-w-[90px] max-w-[90px] bg-gray-100 border-2 border-dashed border-gray-400 rounded-2xl p-4 items-center ${
                formData.showCustomIcon ? 'border-black bg-gray-200' : ''
              }`}
            >
              <Text className="text-3xl mb-2">➕</Text>
              <Text className="text-sm font-semibold text-black">Personalizar</Text>
            </TouchableOpacity>
          </View>

          {formData.showCustomIcon && (
            <TextInput
              className="w-full px-5 py-4 bg-gray-100 rounded-xl text-2xl text-center"
              placeholder="Ingresa cualquier emoji 🎮"
              placeholderTextColor="#8E8E93"
              maxLength={2}
              value={formData.customIcon}
              onChangeText={(text) => {
                updateFormData('customIcon', text);
                updateFormData('icon', text);
              }}
            />
          )}
        </View>

        {/* Reglas del Juego */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-black mb-5">
            Reglas del Juego
          </Text>
          
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => updateFormData('rulesType', 'text')}
              className={`flex-1 py-4 px-6 rounded-xl mr-2 ${
                formData.rulesType === 'text' 
                  ? 'bg-black' 
                  : 'bg-gray-100'
              }`}
            >
              <Text className={`text-center font-semibold ${
                formData.rulesType === 'text' ? 'text-white' : 'text-black'
              }`}>
                📝 Escribir
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => updateFormData('rulesType', 'pdf')}
              className={`flex-1 py-4 px-6 rounded-xl ml-2 ${
                formData.rulesType === 'pdf' 
                  ? 'bg-black' 
                  : 'bg-gray-100'
              }`}
            >
              <Text className={`text-center font-semibold ${
                formData.rulesType === 'pdf' ? 'text-white' : 'text-black'
              }`}>
                📄 Subir PDF
              </Text>
            </TouchableOpacity>
          </View>

          {formData.rulesType === 'text' ? (
            <TextInput
              className="w-full px-5 py-4 bg-gray-100 rounded-xl text-base text-black"
              placeholder="Escribe las reglas del juego aquí..."
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={formData.rules}
              onChangeText={(text) => updateFormData('rules', text)}
            />
          ) : (
            <Card className="border-2 border-dashed border-gray-400 items-center" padding="large">
              <Text className="text-4xl mb-3">📄</Text>
              <Text className="text-base font-semibold text-black mb-1">
                Subir archivo PDF
              </Text>
              <Text className="text-sm text-gray-500">Máximo 10MB</Text>
            </Card>
          )}
        </View>

        {/* Configuración */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-black mb-5">
            Configuración
          </Text>
          
          {/* Número de Jugadores */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-black mb-2">
              Número de Jugadores
            </Text>
            <View className="flex-row items-center justify-between bg-gray-100 rounded-xl p-4">
              <Text className="text-base text-black">Mín: 2 - Máx: 8</Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => formData.maxPlayers > 2 && updateFormData('maxPlayers', formData.maxPlayers - 1)}
                  className="w-9 h-9 bg-black rounded-lg items-center justify-center"
                >
                  <Text className="text-white text-lg font-semibold">-</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-black mx-5 min-w-[30px] text-center">
                  {formData.maxPlayers}
                </Text>
                <TouchableOpacity
                  onPress={() => formData.maxPlayers < 8 && updateFormData('maxPlayers', formData.maxPlayers + 1)}
                  className="w-9 h-9 bg-black rounded-lg items-center justify-center"
                >
                  <Text className="text-white text-lg font-semibold">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Switches */}
          {[
            { key: 'hasRounds', label: 'Puntaje por rondas', value: formData.hasRounds },
            { key: 'hasTimeLimit', label: 'Límite de tiempo', value: formData.hasTimeLimit },
            { key: 'isPublic', label: 'Juego público', value: formData.isPublic },
          ].map((setting) => (
            <View key={setting.key} className="mb-4">
              <View className="flex-row items-center justify-between bg-gray-100 rounded-xl p-4">
                <Text className="text-base font-semibold text-black">
                  {setting.label}
                </Text>
                <TouchableOpacity
                  onPress={() => updateFormData(setting.key, !setting.value)}
                  className={`w-12 h-7 rounded-full relative ${
                    setting.value ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <View
                    className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                      setting.value ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <Button
          title={isLoading ? "Creando..." : "Crear Juego"}
          onPress={handleCreateGame}
          disabled={isLoading}
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
};