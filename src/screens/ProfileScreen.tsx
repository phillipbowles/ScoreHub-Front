import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  User,
  Bell,
  Palette,
  Lock,
  Question,
  FileText,
  Info,
  SignOut,
  Trophy,
  GameController,
  Fire,
} from 'phosphor-react-native';
import { RootStackParamList } from '../types';
import { Card } from '../components/ui/Card';
import { SettingItem } from '../components/common/SettingItem';
import { PlayerAvatar } from '../components/common/PlayerAvatar';
import { apiService } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Ana García',
    email: 'ana.garcia@email.com',
    avatar: 'A',
    stats: {
      wins: 23,
      games: 47,
      streak: 5,
    }
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await apiService.getMe();
      if (response.success && response.data?.data) {
        setUserData({
          name: response.data.data.name || 'Usuario',
          email: response.data.data.email || '',
          avatar: response.data.data.name?.charAt(0).toUpperCase() || 'U',
          stats: userData.stats,
        });
      } else {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const user = JSON.parse(storedData);
          setUserData({
            name: user.name || 'Usuario',
            email: user.email || '',
            avatar: user.name?.charAt(0).toUpperCase() || 'U',
            stats: userData.stats,
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.logout();
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              navigation.navigate('Login');
            } catch (error) {
              console.error('Logout error:', error);
              navigation.navigate('Login');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 mb-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-black mb-2">Perfil</Text>
          <Text className="text-base text-gray-500">Gestiona tu cuenta</Text>
        </View>

        {/* Profile Header */}
        <Card className="mb-6" padding="large">
          <View className="items-center">
            <View className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-4xl font-bold">{userData.avatar}</Text>
            </View>
            <Text className="text-2xl font-bold text-black mb-1">{userData.name}</Text>
            <Text className="text-base text-gray-500 mb-4">{userData.email}</Text>

            {/* Quick Stats */}
            <View className="flex-row items-center space-x-6 mt-2">
              <View className="items-center">
                <View className="flex-row items-center mb-1">
                  <Trophy size={16} color="#f59e0b" weight="bold" />
                  <Text className="text-lg font-bold text-black ml-1">
                    {userData.stats.wins}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">Victorias</Text>
              </View>

              <View className="w-px h-10 bg-gray-200" />

              <View className="items-center">
                <View className="flex-row items-center mb-1">
                  <GameController size={16} color="#3b82f6" weight="bold" />
                  <Text className="text-lg font-bold text-black ml-1">
                    {userData.stats.games}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">Partidas</Text>
              </View>

              <View className="w-px h-10 bg-gray-200" />

              <View className="items-center">
                <View className="flex-row items-center mb-1">
                  <Fire size={16} color="#ef4444" weight="bold" />
                  <Text className="text-lg font-bold text-black ml-1">
                    {userData.stats.streak}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">Racha</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Configuración */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">Configuración</Text>
          <View className="space-y-3">
            <SettingItem
              icon={User}
              iconColor="#3b82f6"
              iconBgColor="#dbeafe"
              label="Editar Perfil"
              type="button"
              onPress={() => Alert.alert('Editar Perfil', 'Función en desarrollo')}
            />

            <SettingItem
              icon={Bell}
              iconColor="#f59e0b"
              iconBgColor="#fef3c7"
              label="Notificaciones"
              type="button"
              onPress={() => Alert.alert('Notificaciones', 'Función en desarrollo')}
            />

            <SettingItem
              icon={Palette}
              iconColor="#8b5cf6"
              iconBgColor="#ede9fe"
              label="Apariencia"
              type="button"
              onPress={() => Alert.alert('Apariencia', 'Función en desarrollo')}
            />

            <SettingItem
              icon={Lock}
              iconColor="#ef4444"
              iconBgColor="#fee2e2"
              label="Privacidad"
              type="button"
              onPress={() => Alert.alert('Privacidad', 'Función en desarrollo')}
            />
          </View>
        </View>

        {/* Soporte */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">Soporte</Text>
          <View className="space-y-3">
            <SettingItem
              icon={Question}
              iconColor="#10b981"
              iconBgColor="#d1fae5"
              label="Ayuda y Soporte"
              type="button"
              onPress={() => Alert.alert('Ayuda', 'Función en desarrollo')}
            />

            <SettingItem
              icon={FileText}
              iconColor="#6b7280"
              iconBgColor="#f3f4f6"
              label="Términos y Condiciones"
              type="button"
              onPress={() => Alert.alert('Términos', 'Función en desarrollo')}
            />

            <SettingItem
              icon={Info}
              iconColor="#6b7280"
              iconBgColor="#f3f4f6"
              label="Acerca de Score Hub"
              type="button"
              onPress={() => Alert.alert('Score Hub', 'Versión 1.0.0')}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white border border-gray-200 rounded-2xl p-4 mb-8"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-center">
            <SignOut size={20} color="#ef4444" weight="bold" />
            <Text className="text-base font-semibold text-red-500 ml-2">
              Cerrar Sesión
            </Text>
          </View>
        </TouchableOpacity>

        {/* Version */}
        <Text className="text-center text-sm text-gray-400 mb-8">
          Versión 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};