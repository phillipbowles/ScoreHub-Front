import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  GameController,
  Globe,
  PaintBrush,
  Coffee,
  Plus,
  CaretRight,
  Sparkle,
} from 'phosphor-react-native';
import { RootStackParamList } from '../../types';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { IconContainer } from '../../components/common/IconContainer';
import { apiService } from '../../utils/api';

type SelectGameTypeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectGameType'>;

interface Props {
  navigation: SelectGameTypeScreenNavigationProp;
}

interface GameType {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
  badge?: string;
}

export const SelectGameTypeScreen: React.FC<Props> = ({ navigation }) => {
  const [gamesCount, setGamesCount] = useState({
    existing: 0,
    community: 0,
    custom: 0,
  });

  useEffect(() => {
    loadGamesCount();
  }, []);

  const loadGamesCount = async () => {
    try {
      const response = await apiService.getGames();
      if (response.success && response.data) {
        setGamesCount({
          existing: response.data.length,
          community: 12,
          custom: 5,
        });
      }
    } catch (error) {
      console.error('Error loading games count:', error);
    }
  };

  const gameTypes: GameType[] = [
    {
      id: 'basic',
      title: 'Juegos Básicos',
      subtitle: `${gamesCount.existing} juegos cargados`,
      icon: GameController,
      color: '#3b82f6',
      bgColor: '#dbeafe',
      badge: gamesCount.existing > 0 ? `${gamesCount.existing}` : undefined,
    },
    {
      id: 'community',
      title: 'Juegos de la Comunidad',
      subtitle: 'Creados por otros usuarios',
      icon: Globe,
      color: '#10b981',
      bgColor: '#d1fae5',
      badge: 'Nuevo',
    },
    {
      id: 'custom',
      title: 'Mis Juegos Personalizados',
      subtitle: 'Tus creaciones únicas',
      icon: PaintBrush,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      badge: gamesCount.custom > 0 ? `${gamesCount.custom}` : undefined,
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      subtitle: 'Tus juegos guardados',
      icon: Coffee,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      badge: 'Premium',
    },
    {
      id: 'create',
      title: 'Crear Juego Nuevo',
      subtitle: 'Diseña desde cero',
      icon: Plus,
      color: '#ef4444',
      bgColor: '#fee2e2',
    },
  ];

  const handleSelectGameType = async (typeId: string) => {
    switch (typeId) {
      case 'create':
        navigation.navigate('CreateGame');
        break;
      case 'basic':
      case 'community':
      case 'custom':
      case 'favorites':
        navigation.navigate('GameList', { gameType: typeId as 'basic' | 'community' | 'custom' | 'favorites' });
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 mb-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ScreenHeader
          title="Nueva Partida"
          subtitle="Selecciona el tipo de juego que quieres jugar"
          rightIcon={<Sparkle size={24} color="#3b82f6" weight="bold" />}
        />

        {/* Game Types */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-black mb-4">Opciones de Juego</Text>
          
          <View className="space-y-3">
            {gameTypes.map((gameType) => {
              const IconComponent = gameType.icon;
              return (
                <TouchableOpacity
                  key={gameType.id}
                  onPress={() => handleSelectGameType(gameType.id)}
                  activeOpacity={0.7}
                >
                  <Card padding="medium">
                    <View className="flex-row items-center">
                      <IconContainer
                        icon={IconComponent}
                        color={gameType.color}
                        bgColor={gameType.bgColor}
                        size="large"
                        rounded="lg"
                      />
                      
                      <View className="flex-1 ml-4">
                        <View className="flex-row items-center mb-1">
                          <Text className="text-base font-bold text-black">
                            {gameType.title}
                          </Text>
                          {gameType.badge && (
                            <View 
                              className="ml-2 px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: gameType.bgColor }}
                            >
                              <Text 
                                className="text-xs font-semibold"
                                style={{ color: gameType.color }}
                              >
                                {gameType.badge}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-sm text-gray-500">
                          {gameType.subtitle}
                        </Text>
                      </View>
                      
                      <CaretRight size={24} color="#9ca3af" weight="bold" />
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Tip */}
        <Card className="bg-blue-50 border border-blue-200 mb-8" padding="medium">
          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3 mt-0.5">
              <Text className="text-white font-bold">💡</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-blue-900 mb-1">
                Consejo Rápido
              </Text>
              <Text className="text-sm text-blue-700">
                Crea tus propios juegos personalizados para adaptar las reglas a tu grupo de amigos.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};