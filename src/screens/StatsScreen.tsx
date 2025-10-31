import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
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
import { apiService } from '../utils/api';
import { getIconComponent } from '../utils/iconMapper';

interface UserStats {
  total_matches: number;
  victories: number;
  defeats: number;
  current_streak: number;
  win_rate: number;
  favorite_games: Array<{
    id: number;
    name: string;
    icon: string;
    color: string;
    bg_color: string;
    matches_count: number;
  }>;
  recent_matches: Array<{
    id: number;
    match_name: string;
    game_name: string;
    icon: string;
    color: string;
    position: number;
    winner: string;
    date: string;
    won: boolean;
  }>;
}

export const StatsScreen: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await apiService.getUserStats();

      if (response.success && response.data?.data) {
        setStats(response.data.data);
      } else {
        Alert.alert(
          'Error',
          response.error || 'No se pudieron cargar las estadísticas',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert(
        'Error de Conexión',
        'No se pudo conectar al servidor. Verifica tu conexión.',
        [
          { text: 'Reintentar', onPress: () => loadStats() },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-500 mt-4">Cargando estadísticas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!stats) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <ChartBar size={64} color="#9ca3af" />
          <Text className="text-xl font-semibold text-black mt-4 mb-2">
            No hay estadísticas disponibles
          </Text>
          <Text className="text-gray-500 text-center">
            Juega algunas partidas para ver tus estadísticas
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-6 mb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadStats(true)}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-black mb-2">Estadísticas</Text>
          <Text className="text-base text-gray-500">Resumen de tu rendimiento</Text>
        </View>

        {/* Stats Header Card */}
        <Card className="mb-6" padding="large" style={{ backgroundColor: '#8b5cf6' }}>
          <View className="items-center">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <ChartBar size={40} color="#ffffff" weight="bold" />
            </View>
            <Text className="text-white text-lg font-semibold mb-2">
              Rendimiento Global
            </Text>
            <View className="flex-row items-center" style={{ gap: 16 }}>
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{stats.victories}</Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }} className="text-sm">Victorias</Text>
              </View>
              <View style={{ width: 1, height: 48, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{stats.win_rate}%</Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }} className="text-sm">Win Rate</Text>
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
                  {stats.total_matches}
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
                  {stats.victories}
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
                  {stats.current_streak}
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
                  {stats.win_rate}%
                </Text>
                <Text className="text-sm text-gray-500 font-medium">
                  Tasa de Victoria
                </Text>
              </Card>
            </View>
          </View>
        </View>

        {/* Top Games */}
        {stats.favorite_games && stats.favorite_games.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-black mb-4">
              Juegos Más Jugados
            </Text>
            <View className="space-y-3">
              {stats.favorite_games.map((game) => {
                const IconComponent = getIconComponent(game.icon);
                return (
                  <Card key={game.id} padding="medium">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View
                          className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                          style={{ backgroundColor: game.color }}
                        >
                          <IconComponent size={20} color="#ffffff" weight="bold" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-black mb-1">
                            {game.name}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {game.matches_count} partida{game.matches_count !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>
        )}

        {/* Recent Games */}
        {stats.recent_matches && stats.recent_matches.length > 0 && (
          <View className="mb-8">
            <Text className="text-lg font-semibold text-black mb-4">
              Partidas Recientes
            </Text>
            <View className="space-y-3">
              {stats.recent_matches.map((match) => {
                const IconComponent = getIconComponent(match.icon);
                return (
                  <Card key={match.id} padding="medium">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1 mr-3">
                        <View
                          className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                          style={{ backgroundColor: match.color }}
                        >
                          <IconComponent size={20} color="#ffffff" weight="bold" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-black mb-1">
                            {match.game_name}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {formatDate(match.date)} • Ganó: {match.winner}
                          </Text>
                        </View>
                      </View>
                      <View
                        className={`px-3 py-1.5 rounded-full ${
                          match.won ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            match.won ? 'text-green-700' : 'text-red-700'
                          }`}
                        >
                          {match.won ? 'Victoria' : `${match.position}°`}
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>
        )}

        {/* Empty state for matches */}
        {(!stats.recent_matches || stats.recent_matches.length === 0) && (
          <View className="mb-8 py-12 items-center">
            <GameController size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-4 text-center">
              No has jugado partidas aún.{'\n'}¡Empieza a jugar para ver tu historial!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
