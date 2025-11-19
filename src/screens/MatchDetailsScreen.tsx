import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Trophy,
  Calendar,
  Users,
  ArrowLeft,
  Medal,
  Target,
} from 'phosphor-react-native';
import { Card } from '../components/ui/Card';
import { IconContainer } from '../components/common/IconContainer';
import { apiService } from '../utils/api';
import { getIconComponent } from '../utils/iconMapper';
import { RootStackParamList, MatchDetails } from '../types';

type MatchDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MatchDetails'>;
type MatchDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MatchDetails'>;

export const MatchDetailsScreen: React.FC = () => {
  const navigation = useNavigation<MatchDetailsScreenNavigationProp>();
  const route = useRoute<MatchDetailsScreenRouteProp>();
  const { matchId } = route.params;

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchDetails();
  }, [matchId]);

  const loadMatchDetails = async () => {
    setLoading(true);
    try {
      const response = await apiService.getMatch(matchId);

      if (response.success && response.data?.data) {
        setMatch(response.data.data);
      }
    } catch (error) {
      console.error('Error loading match details:', error);
    } finally {
      setLoading(false);
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
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPositionMedal = (position: number) => {
    switch (position) {
      case 1:
        return { icon: '🥇', color: '#f59e0b', bgColor: '#fef3c7' };
      case 2:
        return { icon: '🥈', color: '#6b7280', bgColor: '#f3f4f6' };
      case 3:
        return { icon: '🥉', color: '#d97706', bgColor: '#fed7aa' };
      default:
        return { icon: `${position}°`, color: '#6b7280', bgColor: '#f3f4f6' };
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-500 mt-4">Cargando detalles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!match) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Trophy size={64} color="#9ca3af" weight="duotone" />
          <Text className="text-xl font-semibold text-black mt-4 mb-2">
            No se encontró la partida
          </Text>
          <Text className="text-gray-500 text-center">
            Esta partida no existe o fue eliminada
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const GameIcon = getIconComponent(match.game.icon);
  const winner = match.results.find(r => r.position === 1);
  const sortedResults = [...match.results].sort((a, b) => a.position - b.position);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center mb-4"
          >
            <ArrowLeft size={24} color="#6b7280" />
            <Text className="text-gray-600 ml-2 text-base">Volver</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-black mb-2">
            Detalles de Partida
          </Text>
          <Text className="text-base text-gray-500">{match.name}</Text>
        </View>

        {/* Game Info Card */}
        <View className="px-6 mb-6">
          <Card padding="large" style={{ backgroundColor: match.game.color }}>
            <View className="flex-row items-center mb-4">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <GameIcon size={32} color="#ffffff" weight="bold" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold mb-1">
                  {match.game.name}
                </Text>
                <View className="flex-row items-center">
                  <Calendar size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text className="text-white ml-2 opacity-80">
                    {formatDate(match.created_at)}
                  </Text>
                </View>
              </View>
            </View>

            {winner && (
              <View
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Trophy size={24} color="#ffffff" weight="fill" />
                    <Text className="text-white ml-3 text-base font-semibold">
                      Ganador: {winner.player.name}
                    </Text>
                  </View>
                  <View
                    className="px-4 py-2 rounded-full"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <Text className="text-white font-bold text-lg">
                      {winner.points} pts
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Card>
        </View>

        {/* Match Info */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Información de la Partida
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Card padding="medium" className="items-center">
                <IconContainer
                  icon={Users}
                  color="#3b82f6"
                  bgColor="#dbeafe"
                  size="medium"
                  rounded="full"
                />
                <Text className="text-2xl font-bold text-black mt-3 mb-1">
                  {match.results.length}
                </Text>
                <Text className="text-sm text-gray-500 font-medium text-center">
                  Jugadores
                </Text>
              </Card>
            </View>
            <View className="flex-1">
              <Card padding="medium" className="items-center">
                <IconContainer
                  icon={Target}
                  color="#10b981"
                  bgColor="#d1fae5"
                  size="medium"
                  rounded="full"
                />
                <Text className="text-2xl font-bold text-black mt-3 mb-1">
                  {match.game.number_of_players}
                </Text>
                <Text className="text-sm text-gray-500 font-medium text-center">
                  Máx. Jugadores
                </Text>
              </Card>
            </View>
          </View>
        </View>

        {/* Results */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-black mb-4">
            Resultados
          </Text>
          <View className="space-y-3">
            {sortedResults.map((result, index) => {
              const medal = getPositionMedal(result.position);
              return (
                <Card key={result.id} padding="medium">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: medal.bgColor }}
                      >
                        <Text className="text-xl font-bold" style={{ color: medal.color }}>
                          {medal.icon}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-black mb-1">
                          {result.player.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          @{result.player.username}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-2xl font-bold text-black">
                        {result.points}
                      </Text>
                      <Text className="text-sm text-gray-500">puntos</Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>

        {/* Creator Info */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-black mb-4">
            Creador de la Partida
          </Text>
          <Card padding="medium">
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3 bg-blue-100"
              >
                <Text className="text-xl font-bold text-blue-600">
                  {match.creator.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text className="text-base font-semibold text-black mb-1">
                  {match.creator.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  @{match.creator.username}
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
