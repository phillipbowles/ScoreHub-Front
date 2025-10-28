import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  DiceFive,
  BookOpen,
  Users,
  Trophy,
  Fire,
  GameController,
  Play,
} from 'phosphor-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconContainer } from '../components/common/IconContainer';
import { RootStackParamList } from '../types';
import { BackendGame } from '../types/backend.types';
import { apiService } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getIconComponent } from '../utils/iconMapper';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface QuickAction {
  id: string;
  icon: any;
  label: string;
  color: string;
  bgColor: string;
  onPress: () => void;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [games, setGames] = useState<BackendGame[]>([]);
  const [userName, setUserName] = useState('Usuario');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
    loadUserName();
  }, []);

  const loadGames = async () => {
    try {
      const response = await apiService.getGames();
      if (response.success && response.data) {
        const gamesList = Array.isArray(response.data)
          ? response.data
          : (response.data as any).data || [];
        setGames(gamesList);
      }
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserName = async () => {
    try {
      const response = await apiService.getMe();
      if (response.success && response.data?.data) {
        setUserName(response.data.data.name || 'Usuario');
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
      } else {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || 'Usuario');
        }
      }
    } catch (error) {
      console.error('Error loading user name:', error);
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || 'Usuario');
        }
      } catch (fallbackError) {
        console.error('Error loading fallback user data:', fallbackError);
      }
    }
  };

  const handleNewGame = () => {
    navigation.navigate('SelectGameType');
  };

  const quickActions: QuickAction[] = [
    {
      id: 'new-game',
      icon: DiceFive,
      label: 'Nueva Partida',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      onPress: handleNewGame,
    },
    {
      id: 'explore',
      icon: BookOpen,
      label: 'Explorar',
      color: '#10b981',
      bgColor: '#d1fae5',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center py-6">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-black">Hola, {userName} 👋</Text>
            <Text className="text-base text-gray-500 mt-1">
              ¿Listo para una nueva partida?
            </Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full items-center justify-center">
            <Text className="text-white text-xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">Inicio Rápido</Text>
          <View className="flex-row justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id}
                onPress={action.onPress}
                className="flex-1 mx-1"
                activeOpacity={0.7}
              >
                <Card className="items-center" padding="large">
                  <IconContainer
                    icon={action.icon}
                    color={action.color}
                    bgColor={action.bgColor}
                    size="large"
                    rounded="lg"
                  />
                  <Text className="text-sm font-medium text-black text-center mt-2">
                    {action.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Games */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Juegos Básicos
          </Text>
          {loading ? (
            <Text className="text-center text-gray-500 py-8">Cargando juegos...</Text>
          ) : games.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3">
                {games.map((game) => (
                  <TouchableOpacity
                    key={game.id}
                    onPress={() => navigation.navigate('GameDetail', { game })}
                    activeOpacity={0.7}
                  >
                    <Card className="w-32" padding="medium">
                      <View className="items-center">
                        <View
                          className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                          style={{
                            backgroundColor: game.bg_color || '#dbeafe',
                          }}
                        >
                          {(() => {
                            const IconComponent = getIconComponent(game.icon);
                            return <IconComponent size={32} color={game.color || '#3b82f6'} weight="fill" />;
                          })()}
                        </View>
                        <Text className="font-semibold text-black text-center" numberOfLines={2}>
                          {game.name}
                        </Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <Card className="items-center" padding="large">
              <IconContainer
                icon={GameController}
                color="#6b7280"
                bgColor="#f3f4f6"
                size="large"
                rounded="full"
              />
              <Text className="text-base text-gray-600 mb-4 mt-3">
                No hay juegos disponibles
              </Text>
              <Button
                title="Crear Primer Juego"
                onPress={() => navigation.navigate('CreateGame')}
                size="small"
              />
            </Card>
          )}
        </View>

        {/* Stats */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-black mb-4">
            Estadísticas
          </Text>
          <View className="flex-row">
            <Card className="flex-1 mr-2 items-center" padding="large">
              <IconContainer
                icon={GameController}
                color="#3b82f6"
                bgColor="#dbeafe"
                size="large"
                rounded="full"
              />
              <Text className="text-2xl font-bold text-black mt-2">47</Text>
              <Text className="text-xs text-gray-500 font-medium">Partidas</Text>
            </Card>
            <Card className="flex-1 ml-2 items-center" padding="large">
              <IconContainer
                icon={Trophy}
                color="#f59e0b"
                bgColor="#fef3c7"
                size="large"
                rounded="full"
              />
              <Text className="text-2xl font-bold text-black mt-2">23</Text>
              <Text className="text-xs text-gray-500 font-medium">Victorias</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};