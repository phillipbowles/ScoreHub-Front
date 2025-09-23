import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui/Button';

type SelectGameTypeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectGameType'>;

interface Props {
  navigation: SelectGameTypeScreenNavigationProp;
}

const gameTypes = [
  {
    id: 'existing',
    title: 'Cargar Juegos Existentes',
    subtitle: 'Tus juegos guardados',
    icon: '💾',
    color: 'bg-blue-500',
  },
  {
    id: 'community',
    title: 'Cargar Juegos Comunidad',
    subtitle: 'Creados por otros usuarios',
    icon: '🌍',
    color: 'bg-green-500',
  },
  {
    id: 'custom',
    title: 'Cargar Juego Personalizado',
    subtitle: 'Tus creaciones personales',
    icon: '🎮',
    color: 'bg-orange-500',
  },
  {
    id: 'cafovitos',
    title: 'Cargar Juegos Cafovitos',
    subtitle: 'Colección especial',
    icon: '☕',
    color: 'bg-purple-500',
  },
  {
    id: 'create',
    title: 'Crear Juego Personalizado',
    subtitle: 'Nuevo juego desde cero',
    icon: '➕',
    color: 'bg-red-500',
  },
];

export const SelectGameTypeScreen: React.FC<Props> = ({ navigation }) => {
  const handleSelectGameType = (typeId: string) => {
    switch (typeId) {
      case 'create':
        navigation.navigate('CreateGame');
        break;
      case 'existing':
      case 'community':
      case 'custom':
      case 'cafovitos':
        // Por ahora simular selección de juego UNO
        const mockGame = {
          id: '1',
          name: 'UNO',
          icon: '🃏',
          minPlayers: 2,
          maxPlayers: 10,
          color: '#ff6b35'
        };
        navigation.navigate('AddPlayers', { selectedGame: mockGame });
        break;
      default:
        break;
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
          <Text className="text-2xl font-bold text-black">Nueva Partida</Text>
        </View>

        {/* Sección */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-black mb-5">
            Seleccionar Tipo de Juego
          </Text>
          
          <View className="space-y-4">
            {gameTypes.map((gameType) => (
              <TouchableOpacity
                key={gameType.id}
                onPress={() => handleSelectGameType(gameType.id)}
                className="bg-white border-2 border-gray-100 rounded-2xl p-5 flex-row items-center"
              >
                <View className={`w-12 h-12 ${gameType.color} rounded-xl items-center justify-center mr-4`}>
                  <Text className="text-2xl">{gameType.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-black mb-1">
                    {gameType.title}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {gameType.subtitle}
                  </Text>
                </View>
                <Text className="text-gray-400 text-lg">→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title="Siguiente"
          onPress={() => {}}
          className="mb-8"
          disabled={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};