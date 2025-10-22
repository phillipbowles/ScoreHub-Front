import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { 
  ChartBar, 
  Trophy, 
  GameController, 
  Fire, 
  TrendUp,
  Clock,
  Users,
  Target
} from 'phosphor-react-native';
import { Card } from '../components/ui/Card';
import { IconContainer } from '../components/common/IconContainer';

export const StatsScreen: React.FC = () => {
  const [stats, setStats] = useState({
    totalGames: 47,
    wins: 23,
    winRate: 49,
    currentStreak: 5,
    bestStreak: 8,
    totalPlayTime: 12.5,
    avgGameDuration: 25,
    favoriteGame: 'UNO'
  });

  const topGames = [
    { id: '1', name: 'UNO', games: 15, winRate: 73, color: '#ff6b35' },
    { id: '2', name: 'Dardos', games: 12, winRate: 58, color: '#9b59b6' },
    { id: '3', name: 'Truco', games: 8, winRate: 50, color: '#e74c3c' },
  ];

  const recentGames = [
    { id: '1', name: 'UNO', result: 'win', time: '2 horas', players: 4 },
    { id: '2', name: 'Dardos', result: 'win', time: 'Ayer', players: 2 },
    { id: '3', name: 'Truco', result: 'lose', time: 'Hace 3 días', players: 6 },
    { id: '4', name: 'Monopoly', result: 'win', time: 'Hace 5 días', players: 4 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 mb-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-black mb-2">Estadísticas</Text>
          <Text className="text-base text-gray-500">Resumen de tu rendimiento</Text>
        </View>

        {/* Stats Header Card */}
        <Card className="bg-gradient-to-br from-purple-600 to-blue-600 mb-6" padding="large">
          <View className="items-center">
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
              <ChartBar size={40} color="#ffffff" weight="bold" />
            </View>
            <Text className="text-white text-lg font-semibold mb-2">
              Rendimiento Global
            </Text>
            <View className="flex-row items-center space-x-4">
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{stats.wins}</Text>
                <Text className="text-white/80 text-sm">Victorias</Text>
              </View>
              <View className="w-px h-12 bg-white/30" />
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{stats.winRate}%</Text>
                <Text className="text-white/80 text-sm">Win Rate</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Main Stats Grid */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Estadísticas Principales
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%]">
              <Card className="items-center" padding="large">
                <IconContainer
                  icon={GameController}
                  color="#3b82f6"
                  bgColor="#dbeafe"
                  size="large"
                  rounded="full"
                />
                <Text className="text-2xl font-bold text-black mt-3 mb-1">
                  {stats.totalGames}
                </Text>
                <Text className="text-sm text-gray-500 font-medium">
                  Partidas Jugadas
                </Text>
              </Card>
            </View>

            <View className="flex-1 min-w-[45%]">
              <Card className="items-center" padding="large">
                <IconContainer
                  icon={Trophy}
                  color="#f59e0b"
                  bgColor="#fef3c7"
                  size="large"
                  rounded="full"
                />
                <Text className="text-2xl font-bold text-black mt-3 mb-1">
                  {stats.wins}
                </Text>
                <Text className="text-sm text-gray-500 font-medium">Victorias</Text>
              </Card>
            </View>

            <View className="flex-1 min-w-[45%]">
              <Card className="items-center" padding="large">
                <IconContainer
                  icon={Fire}
                  color="#ef4444"
                  bgColor="#fee2e2"
                  size="large"
                  rounded="full"
                />
                <Text className="text-2xl font-bold text-black mt-3 mb-1">
                  {stats.currentStreak}
                </Text>
                <Text className="text-sm text-gray-500 font-medium">Racha Actual</Text>
              </Card>
            </View>

            <View className="flex-1 min-w-[45%]">
              <Card className="items-center" padding="large">
                <IconContainer
                  icon={TrendUp}
                  color="#10b981"
                  bgColor="#d1fae5"
                  size="large"
                  rounded="full"
                />
                <Text className="text-2xl font-bold text-black mt-3 mb-1">
                  {stats.winRate}%
                </Text>
                <Text className="text-sm text-gray-500 font-medium">
                  Tasa de Victoria
                </Text>
              </Card>
            </View>
          </View>
        </View>

        {/* Additional Stats */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Datos Adicionales
          </Text>
          <Card padding="none">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <IconContainer
                  icon={Target}
                  color="#9333ea"
                  bgColor="#f3e8ff"
                  size="medium"
                  rounded="md"
                />
                <Text className="text-base font-medium text-black ml-3">
                  Mejor Racha
                </Text>
              </View>
              <Text className="text-base font-bold text-black">
                {stats.bestStreak} victorias
              </Text>
            </View>

            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <IconContainer
                  icon={Clock}
                  color="#3b82f6"
                  bgColor="#dbeafe"
                  size="medium"
                  rounded="md"
                />
                <Text className="text-base font-medium text-black ml-3">
                  Tiempo Total
                </Text>
              </View>
              <Text className="text-base font-bold text-black">
                {stats.totalPlayTime}h
              </Text>
            </View>

            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <IconContainer
                  icon={Users}
                  color="#10b981"
                  bgColor="#d1fae5"
                  size="medium"
                  rounded="md"
                />
                <Text className="text-base font-medium text-black ml-3">
                  Duración Promedio
                </Text>
              </View>
              <Text className="text-base font-bold text-black">
                {stats.avgGameDuration} min
              </Text>
            </View>
          </Card>
        </View>

        {/* Top Games */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Juegos Más Jugados
          </Text>
          <View className="space-y-3">
            {topGames.map((game, index) => (
              <Card key={game.id} padding="medium">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                      style={{ backgroundColor: game.color }}
                    >
                      <GameController size={20} color="#ffffff" weight="bold" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-black mb-1">
                        {game.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {game.games} partidas
                      </Text>
                    </View>
                  </View>
                  <Text className="text-lg font-bold text-black">{game.winRate}%</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Recent Games */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-black mb-4">
            Partidas Recientes
          </Text>
          <View className="space-y-3">
            {recentGames.map((game) => (
              <Card key={game.id} padding="medium">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-black mb-1">
                      {game.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {game.time} • {game.players} jugadores
                    </Text>
                  </View>
                  <View 
                    className={`px-3 py-1.5 rounded-full ${
                      game.result === 'win' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <Text 
                      className={`text-xs font-semibold ${
                        game.result === 'win' ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {game.result === 'win' ? 'Victoria' : 'Derrota'}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};