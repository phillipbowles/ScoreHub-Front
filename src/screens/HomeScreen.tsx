import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RootStackParamList } from '../types';
import { apiService } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [games, setGames] = useState<any[]>([]);
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
        setGames(response.data);
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
        // Guardar los datos actualizados del usuario
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
      } else {
        // Fallback a datos locales si falla el API
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || 'Usuario');
        }
      }
    } catch (error) {
      console.error('Error loading user name:', error);
      // Fallback a datos locales si hay error
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

  const handleLogout = async () => {
    try {
      await apiService.logout();
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      // Aún así navegamos al login para limpiar la sesión local
      navigation.navigate('Login');
    }
  };

  const handleNewGame = () => {
    navigation.navigate('SelectGameType');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row justify-between items-center py-4 mt-2">
          <View>
            <Text className="text-2xl font-bold text-black">Hola, {userName} 👋</Text>
            <Text className="text-sm text-gray-500 mt-1">
              ¿Listo para una nueva partida?
            </Text>
          </View>
          <TouchableOpacity 
            onPress={handleLogout}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Text className="text-lg text-gray-600">A</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Game Banner */}
        <Card className="bg-black mb-6 overflow-hidden" padding="large">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-white mb-1">
                Partida en Curso
              </Text>
              <Text className="text-sm text-gray-300 mb-2">
                UNO • 3 jugadores • Ronda 2
              </Text>
              <Text className="text-xs text-gray-400">
                Tu turno • 2:30 restantes
              </Text>
            </View>
            <Button 
              title="Continuar" 
              variant="secondary"
              size="small"
            />
          </View>
        </Card>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Inicio Rápido
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity 
              onPress={handleNewGame}
              className="flex-1 mr-2"
            >
              <Card className="items-center" padding="large">
                <Text className="text-3xl mb-2">🎲</Text>
                <Text className="text-sm font-medium text-black">Nueva Partida</Text>
              </Card>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 mx-2">
              <Card className="items-center" padding="large">
                <Text className="text-3xl mb-2">📚</Text>
                <Text className="text-sm font-medium text-black">Explorar</Text>
              </Card>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 ml-2">
              <Card className="items-center" padding="large">
                <Text className="text-3xl mb-2">👥</Text>
                <Text className="text-sm font-medium text-black">Invitar</Text>
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Games */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Juegos Disponibles
          </Text>
          {loading ? (
            <Text className="text-center text-gray-500 py-8">Cargando juegos...</Text>
          ) : games.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3">
                {games.map((game, index) => (
                  <Card key={game.id || index} className="w-36 items-center" padding="medium">
                    <View className="w-12 h-12 bg-blue-500 rounded-xl items-center justify-center mb-3">
                      <Text className="text-2xl">{game.icon || '🎲'}</Text>
                    </View>
                    <Text className="font-semibold text-black mb-1" numberOfLines={1}>
                      {game.name || 'Sin nombre'}
                    </Text>
                    <Text className="text-xs text-gray-500 mb-2">
                      {game.min_players || 2}-{game.max_players || 4} jugadores
                    </Text>
                    <Button title="Jugar" size="small" className="w-full" />
                  </Card>
                ))}
              </View>
            </ScrollView>
          ) : (
            <Card className="items-center" padding="large">
              <Text className="text-3xl mb-2">🎮</Text>
              <Text className="text-base text-gray-600 mb-4">No hay juegos disponibles</Text>
              <Button
                title="Crear Primer Juego"
                onPress={() => navigation.navigate('CreateGame')}
                size="small"
              />
            </Card>
          )}
        </View>

        {/* Stats */}
        <View className="flex-row mb-6">
          <Card className="flex-1 mr-2 items-center" padding="large">
            <Text className="text-2xl mb-2">🏆</Text>
            <Text className="text-xl font-bold text-black">23</Text>
            <Text className="text-xs text-gray-500 font-medium">Victorias</Text>
          </Card>
          <Card className="flex-1 ml-2 items-center" padding="large">
            <Text className="text-2xl mb-2">🔥</Text>
            <Text className="text-xl font-bold text-black">5</Text>
            <Text className="text-xs text-gray-500 font-medium">Racha</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};