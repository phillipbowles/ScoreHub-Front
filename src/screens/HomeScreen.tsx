import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row justify-between items-center py-4 mt-2">
          <View>
            <Text className="text-2xl font-bold text-black">Hola, Ana 👋</Text>
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
            <Card className="flex-1 mr-2 items-center" padding="large">
              <Text className="text-3xl mb-2">🎲</Text>
              <Text className="text-sm font-medium text-black">Nueva Partida</Text>
            </Card>
            <Card className="flex-1 mx-2 items-center" padding="large">
              <Text className="text-3xl mb-2">📚</Text>
              <Text className="text-sm font-medium text-black">Explorar</Text>
            </Card>
            <Card className="flex-1 ml-2 items-center" padding="large">
              <Text className="text-3xl mb-2">👥</Text>
              <Text className="text-sm font-medium text-black">Invitar</Text>
            </Card>
          </View>
        </View>

        {/* Popular Games */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Populares Esta Semana
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              <Card className="w-36 items-center" padding="medium">
                <View className="w-12 h-12 bg-orange-500 rounded-xl items-center justify-center mb-3">
                  <Text className="text-2xl">🃏</Text>
                </View>
                <Text className="font-semibold text-black mb-1">UNO</Text>
                <Text className="text-xs text-gray-500 mb-2">2-10 jugadores</Text>
                <View className="flex-row mb-3">
                  <Text className="text-orange-500">⭐⭐⭐⭐⭐</Text>
                </View>
                <Button title="Jugar" size="small" className="w-full" />
              </Card>

              <Card className="w-36 items-center" padding="medium">
                <View className="w-12 h-12 bg-teal-500 rounded-xl items-center justify-center mb-3">
                  <Text className="text-2xl">🏠</Text>
                </View>
                <Text className="font-semibold text-black mb-1">Monopoly</Text>
                <Text className="text-xs text-gray-500 mb-2">2-8 jugadores</Text>
                <View className="flex-row mb-3">
                  <Text className="text-teal-500">⭐⭐⭐⭐⭐</Text>
                </View>
                <Button title="Jugar" size="small" className="w-full" />
              </Card>

              <Card className="w-36 items-center" padding="medium">
                <View className="w-12 h-12 bg-purple-500 rounded-xl items-center justify-center mb-3">
                  <Text className="text-2xl">🎯</Text>
                </View>
                <Text className="font-semibold text-black mb-1">Dardos</Text>
                <Text className="text-xs text-gray-500 mb-2">2-4 jugadores</Text>
                <View className="flex-row mb-3">
                  <Text className="text-purple-500">⭐⭐⭐⭐⭐</Text>
                </View>
                <Button title="Jugar" size="small" className="w-full" />
              </Card>
            </View>
          </ScrollView>
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