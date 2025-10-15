import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  GameController,
  MagnifyingGlass,
  Sparkle,
  Users,
  Clock,
  Trophy,
} from 'phosphor-react-native';
import { RootStackParamList } from '../../types';
import { BackendGame } from '../../types/backend.types';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { IconContainer } from '../../components/common/IconContainer';
import { apiService } from '../../utils/api';

type GameListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameList'>;
type GameListScreenRouteProp = RouteProp<RootStackParamList, 'GameList'>;

interface Props {
  navigation: GameListScreenNavigationProp;
  route: GameListScreenRouteProp;
}

export const GameListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameType } = route.params;
  const [games, setGames] = useState<BackendGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGames();
  }, [gameType]);

  const loadGames = async () => {
    setLoading(true);
    try {
      const response = await apiService.getGames();
      if (response.success && response.data) {
        // El backend puede devolver { data: [...games] } o directamente [...games]
        const gamesList = Array.isArray(response.data)
          ? response.data
          : (response.data as any).data || [];
        // TODO: Filtrar por tipo de juego cuando el backend lo soporte
        setGames(gamesList);
      }
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGame = (game: BackendGame) => {
    navigation.navigate('MatchConfig', { selectedGame: game });
  };

  const getTypeTitle = () => {
    switch (gameType) {
      case 'basic':
        return 'Juegos Básicos';
      case 'community':
        return 'Juegos de la Comunidad';
      case 'custom':
        return 'Mis Juegos Personalizados';
      case 'favorites':
        return 'Favoritos';
      default:
        return 'Juegos';
    }
  };

  const getTypeSubtitle = () => {
    switch (gameType) {
      case 'basic':
        return 'Juegos predefinidos del sistema';
      case 'community':
        return 'Creados por otros usuarios';
      case 'custom':
        return 'Tus creaciones únicas';
      case 'favorites':
        return 'Tus juegos guardados';
      default:
        return 'Selecciona un juego para comenzar';
    }
  };

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-500 mt-4">Cargando juegos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title={getTypeTitle()}
          subtitle={getTypeSubtitle()}
          rightIcon={<GameController size={24} color="#3b82f6" weight="fill" />}
        />

        {/* Search Bar */}
        <View className="mb-6">
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
            <MagnifyingGlass size={20} color="#6b7280" weight="bold" />
            <Text className="flex-1 ml-3 text-base text-gray-900">
              Buscar juegos...
            </Text>
          </View>
        </View>

        {/* Games Count */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-black">
            {filteredGames.length} {filteredGames.length === 1 ? 'Juego' : 'Juegos'}
          </Text>
          {gameType === 'custom' && (
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateGame')}
              className="flex-row items-center bg-blue-500 px-4 py-2 rounded-lg"
            >
              <Sparkle size={16} color="#ffffff" weight="fill" />
              <Text className="text-white font-semibold ml-2">Crear Nuevo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Games List */}
        {filteredGames.length === 0 ? (
          <Card className="bg-white items-center py-12" padding="large">
            <GameController size={64} color="#d1d5db" weight="light" />
            <Text className="text-gray-500 text-base mt-4">
              No hay juegos disponibles
            </Text>
            {gameType === 'custom' && (
              <TouchableOpacity
                onPress={() => navigation.navigate('CreateGame')}
                className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold">Crear tu Primer Juego</Text>
              </TouchableOpacity>
            )}
          </Card>
        ) : (
          <View className="space-y-3 mb-8">
            {filteredGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                onPress={() => handleSelectGame(game)}
                activeOpacity={0.7}
              >
                <Card padding="medium">
                  <View className="flex-row items-start">
                    {/* Game Icon */}
                    <View
                      className="w-16 h-16 rounded-2xl items-center justify-center"
                      style={{
                        backgroundColor: '#dbeafe',
                      }}
                    >
                      <GameController size={32} color="#3b82f6" weight="fill" />
                    </View>

                    {/* Game Info */}
                    <View className="flex-1 ml-4">
                      <Text className="text-lg font-bold text-black mb-1">
                        {game.name}
                      </Text>
                      {game.description && (
                        <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
                          {game.description}
                        </Text>
                      )}

                      {/* Game Details */}
                      <View className="flex-row items-center flex-wrap gap-2">
                        {/* Players/Teams */}
                        <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded-md">
                          <Users size={12} color="#3b82f6" weight="bold" />
                          <Text className="text-xs font-semibold text-blue-700 ml-1">
                            {game.has_teams
                              ? `${game.number_of_players} equipos (${game.min_team_length}-${game.max_team_length})`
                              : `${game.number_of_players} jugadores`}
                          </Text>
                        </View>

                        {/* Rounds */}
                        {game.rounds > 1 && (
                          <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-md">
                            <Trophy size={12} color="#f59e0b" weight="bold" />
                            <Text className="text-xs font-semibold text-yellow-700 ml-1">
                              {game.rounds} rondas
                            </Text>
                          </View>
                        )}

                        {/* Timer */}
                        {game.has_turns && game.turn_duration > 0 && (
                          <View className="flex-row items-center bg-purple-50 px-2 py-1 rounded-md">
                            <Clock size={12} color="#8b5cf6" weight="bold" />
                            <Text className="text-xs font-semibold text-purple-700 ml-1">
                              {game.turn_duration}s/turno
                            </Text>
                          </View>
                        )}

                        {/* Ending Type */}
                        <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-md">
                          <Text className="text-xs font-semibold text-green-700">
                            {game.ending === 'end_rounds'
                              ? 'Por rondas'
                              : game.ending === 'reach_max_score'
                              ? `Máx ${game.max_points} pts`
                              : `Mín ${game.min_points} pts`}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
