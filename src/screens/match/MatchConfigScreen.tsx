import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  Trophy,
  Users,
  UserPlus,
  Play,
  X,
  Crown,
  Check,
} from 'phosphor-react-native';
import { RootStackParamList } from '../../types';
import { BackendGame } from '../../types/backend.types';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/common/InputField';
import { PlayerAvatar } from '../../components/common/PlayerAvatar';
import { PlayerSearchModal } from '../../components/match/PlayerSearchModal';
import { TeamPlayerManager } from '../../components/match/TeamPlayerManager';
import { apiService } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getIconComponent } from '../../utils/iconMapper';

type MatchConfigScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MatchConfig'>;
type MatchConfigScreenRouteProp = RouteProp<RootStackParamList, 'MatchConfig'>;

interface Props {
  navigation: MatchConfigScreenNavigationProp;
  route: MatchConfigScreenRouteProp;
}

interface Player {
  id: string;
  name: string;
  username?: string; // Username del usuario o 'guest' para invitados
  isGuest: boolean;
  userId?: number;
  teamId?: string;
  isHost?: boolean;
}

interface Team {
  id: string;
  name: string;
  color: string;
  players: Player[];
}

const TEAM_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#8b5cf6', // Purple
  '#ec4899', // Pink
];

const TEAM_NAMES = [
  'Equipo Rojo',
  'Equipo Azul',
  'Equipo Verde',
  'Equipo Naranja',
  'Equipo Morado',
  'Equipo Rosa',
];

const PLAYER_COLORS = [
  '#ff9999', // coral suave
  '#99ccff', // azul suave
  '#99ff99', // verde suave
  '#ffcc99', // naranja suave
  '#cc99ff', // morado suave
  '#ffff99', // amarillo suave
  '#ff99cc', // rosa suave
  '#99ffff', // cyan suave
];

export const MatchConfigScreen: React.FC<Props> = ({ navigation, route }) => {
  const { selectedGame } = route.params as { selectedGame: BackendGame };

  const [matchName, setMatchName] = useState(`Partida de ${selectedGame.name}`);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);

  // Estados para modo individual
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Estados para modo equipos
  const [teams, setTeams] = useState<Team[]>([]);

  // Cargar usuario actual
  useEffect(() => {
    const loadCurrentUser = async () => {
      const userDataStr = await AsyncStorage.getItem('userData');
      const userData = userDataStr ? JSON.parse(userDataStr) : null;

      if (userData) {
        setCurrentUser(userData);

        // Agregar usuario actual como anfitrión automáticamente
        const hostPlayer: Player = {
          id: `user-${userData.id}-host`,
          name: userData.name,
          username: userData.username, // Guardar el username para enviarlo al backend
          isGuest: false,
          userId: userData.id,
          isHost: true,
        };

        if (!selectedGame.has_teams) {
          setPlayers([hostPlayer]);
        }
      }
    };

    loadCurrentUser();
  }, []);

  // Inicializar equipos si el juego los requiere
  useEffect(() => {
    if (selectedGame.has_teams) {
      const initialTeams: Team[] = [];
      for (let i = 0; i < selectedGame.number_of_players; i++) {
        initialTeams.push({
          id: `team-${i}`,
          name: TEAM_NAMES[i] || `Equipo ${i + 1}`,
          color: TEAM_COLORS[i] || '#6b7280',
          players: [],
        });
      }
      setTeams(initialTeams);
    }
  }, [selectedGame]);

  const handleAddPlayer = () => {
    if (selectedGame.has_teams) {
      // No hacer nada, el botón debe especificar el equipo
      return;
    }
    setSelectedTeamId(null);
    setShowPlayerModal(true);
  };

  const handleAddPlayerToTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setShowPlayerModal(true);
    console.log(players);
  };

  const handleSelectUser = (user: any) => {
    const newPlayer: Player = {
      id: `user-${user.id}-${Date.now()}`,
      name: user.name,
      username: user.username, // Guardar el username del usuario
      isGuest: false,
      userId: user.id,
      teamId: selectedTeamId || undefined,
    };

    if (selectedGame.has_teams && selectedTeamId) {
      // Agregar a equipo
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === selectedTeamId
            ? { ...team, players: [...team.players, newPlayer] }
            : team
        )
      );
    } else {
      // Agregar como jugador individual
      setPlayers(prev => [...prev, newPlayer]);
    }
  };

  const handleSelectGuest = (name: string) => {
    const newPlayer: Player = {
      id: `guest-${Date.now()}`,
      name,
      username: 'guest', // Los invitados usan el username especial 'guest'
      isGuest: true,
      teamId: selectedTeamId || undefined,
    };

    if (selectedGame.has_teams && selectedTeamId) {
      // Agregar a equipo
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === selectedTeamId
            ? { ...team, players: [...team.players, newPlayer] }
            : team
        )
      );
    } else {
      // Agregar como jugador individual
      setPlayers(prev => [...prev, newPlayer]);
    }
  };

  const handleRemovePlayer = (playerId: string, teamId?: string) => {
    // Verificar si el jugador a eliminar es el anfitrión
    if (selectedGame.has_teams && teamId) {
      const playerToRemove = teams
        .find(t => t.id === teamId)
        ?.players.find(p => p.id === playerId);

      if (playerToRemove?.isHost) {
        Alert.alert('Error', 'No puedes eliminar al anfitrión de la partida');
        return;
      }

      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === teamId
            ? { ...team, players: team.players.filter(p => p.id !== playerId) }
            : team
        )
      );
    } else {
      const playerToRemove = players.find(p => p.id === playerId);

      if (playerToRemove?.isHost) {
        Alert.alert('Error', 'No puedes eliminar al anfitrión de la partida');
        return;
      }

      setPlayers(prev => prev.filter(p => p.id !== playerId));
    }
  };

  const validateAndStartMatch = async () => {
    // Validar nombre de la partida
    if (!matchName.trim()) {
      Alert.alert('Error', 'Ingresa un nombre para la partida');
      return;
    }

    if (selectedGame.has_teams) {
      // Validar equipos
      const minPlayers = selectedGame.min_team_length || 1;
      const maxPlayers = selectedGame.max_team_length || 10;

      for (const team of teams) {
        if (team.players.length < minPlayers) {
          Alert.alert(
            'Error',
            `${team.name} necesita al menos ${minPlayers} jugador${minPlayers > 1 ? 'es' : ''}`
          );
          return;
        }
        if (team.players.length > maxPlayers) {
          Alert.alert(
            'Error',
            `${team.name} puede tener máximo ${maxPlayers} jugadores`
          );
          return;
        }
      }
    } else {
      // Validar jugadores individuales
      if (players.length < selectedGame.number_of_players) {
        Alert.alert(
          'Error',
          `Necesitas ${selectedGame.number_of_players} jugadores para comenzar`
        );
        return;
      }
    }

    // Crear la partida en el backend
    setIsCreatingMatch(true);
    try {
      // Obtener el ID del usuario actual
      const userDataStr = await AsyncStorage.getItem('userData');
      const userData = userDataStr ? JSON.parse(userDataStr) : null;

      if (!userData?.id) {
        Alert.alert('Error', 'No se pudo obtener la información del usuario. Intenta iniciar sesión nuevamente.');
        setIsCreatingMatch(false);
        return;
      }

      // Preparar la lista de jugadores (enviar usernames, no names)
      const playerUsernames = selectedGame.has_teams
        ? teams.flatMap(team => team.players.map(p => p.username || 'guest'))
        : players.map(p => p.username || 'guest');

      const response = await apiService.createMatch({
        name: matchName.trim(),
        creator_id: userData.id,
        game_id: Number(selectedGame.id),
        players: playerUsernames,
      });

      console.log('📦 Create match response:', JSON.stringify(response, null, 2));

      if (response.success) {
        // Preparar la configuración del juego para GameScreen
        const gameConfig = {
          matchId: response.data?.data?.id || response.data?.id,
          gameId: Number(selectedGame.id),
          name: matchName.trim(),
          gameName: selectedGame.name,
          hasTeams: selectedGame.has_teams,
          hasRounds: selectedGame.rounds > 1,
          totalRounds: selectedGame.rounds,
          hasTimer: selectedGame.has_turns && selectedGame.turn_duration > 0,
          timerDuration: selectedGame.turn_duration,
          roundDuration: selectedGame.round_duration,
          startingPoints: selectedGame.starting_points,
          finishingPoints: selectedGame.finishing_points,
          isWinning: selectedGame.is_winning,
          // Convertir datos para el GameScreen
          ...(selectedGame.has_teams
            ? {
                teams: teams.map((team, index) => ({
                  id: team.id,
                  name: team.name,
                  players: team.players.map(p => ({
                    id: p.id,
                    name: p.name,
                    userId: p.userId, // Preservar userId
                    isGuest: p.isGuest,
                    score: selectedGame.starting_points,
                    color: '',
                  })),
                  score: selectedGame.starting_points,
                  color: team.color,
                })),
              }
            : {
                players: players.map((player, index) => ({
                  id: player.id,
                  name: player.name,
                  userId: player.userId, // Preservar userId
                  isGuest: player.isGuest,
                  score: selectedGame.starting_points,
                  color: PLAYER_COLORS[index % PLAYER_COLORS.length],
                })),
              }),
        };

        console.log('🎮 Game Config:', gameConfig);
        console.log('🆔 Match ID:', gameConfig.matchId);
        console.log('🎯 Game ID:', gameConfig.gameId);

        // Navegar a GameScreen con la configuración
        navigation.navigate('Game', { gameConfig });
      } else {
        // Manejar errores del backend de forma segura
        let errorMessage = 'No se pudo crear la partida';

        if (typeof response.error === 'string') {
          errorMessage = response.error;
        } else if (typeof response.error === 'object' && response.error !== null) {
          const err: any = response.error;
          if (err && typeof err === 'object') {
            if ('message' in err) {
              errorMessage = String(err.message);
            }
            // Si hay errores de validación de campos
            if (err.fields && typeof err.fields === 'object') {
              const fieldErrors = Object.values(err.fields as Record<string, string[]>).flat();
              if (fieldErrors.length > 0) {
                errorMessage = fieldErrors.join('\n');
              }
            }
          }
        }

        Alert.alert('Error al crear partida', errorMessage);
      }
    } catch (error) {
      console.error('💥 Exception creating match:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : 'Error desconocido al conectar con el servidor';

      Alert.alert(
        'Error de Conexión',
        `No se pudo conectar al servidor.\n\n${errorMessage}`
      );
    } finally {
      setIsCreatingMatch(false);
    }
  };

  const getExcludedUserIds = (): number[] => {
    // Siempre excluir al usuario actual (anfitrión)
    const excludedIds: number[] = currentUser?.id ? [currentUser.id] : [];

    if (selectedGame.has_teams) {
      const teamPlayerIds = teams
        .flatMap(team => team.players)
        .filter(p => !p.isGuest && p.userId)
        .map(p => p.userId!);
      return [...excludedIds, ...teamPlayerIds];
    }

    const playerIds = players
      .filter(p => !p.isGuest && p.userId)
      .map(p => p.userId!);
    return [...excludedIds, ...playerIds];
  };

  const getTotalPlayers = () => {
    if (selectedGame.has_teams) {
      return teams.reduce((sum, team) => sum + team.players.length, 0);
    }
    return players.length;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Configurar Partida"
          subtitle="Define los detalles de tu partida"
          rightIcon={<Trophy size={24} color="#3b82f6" weight="fill" />}
        />

        {/* Game Summary */}
        <Card className="mb-6 bg-white" padding="large">
          <View className="flex-row items-start">
            <View
              className="w-14 h-14 rounded-xl items-center justify-center"
              style={{
                backgroundColor: selectedGame.bg_color || '#dbeafe',
              }}
            >
              {(() => {
                const IconComponent = getIconComponent(selectedGame.icon);
                return <IconComponent size={28} color={selectedGame.color || '#3b82f6'} weight="fill" />;
              })()}
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold text-black mb-1">
                {selectedGame.name}
              </Text>
              {selectedGame.description && (
                <Text className="text-sm text-gray-600 mb-2">
                  {selectedGame.description}
                </Text>
              )}
              <Text className="text-sm text-gray-500">
                {selectedGame.has_teams
                  ? `${selectedGame.number_of_players} equipos • ${selectedGame.min_team_length}-${selectedGame.max_team_length} jugadores/equipo`
                  : `${selectedGame.number_of_players} jugadores`}
              </Text>
            </View>
          </View>
        </Card>

        {/* Match Name */}
        <InputField
          label="Nombre de la Partida"
          placeholder="Ej: Partida del Viernes"
          value={matchName}
          onChangeText={setMatchName}
          required
        />

        {/* Players/Teams Section */}
        {selectedGame.has_teams ? (
          <TeamPlayerManager
            teams={teams}
            minTeamLength={selectedGame.min_team_length || 1}
            maxTeamLength={selectedGame.max_team_length || 10}
            onAddPlayerToTeam={handleAddPlayerToTeam}
            onRemovePlayer={handleRemovePlayer}
          />
        ) : (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-black">Jugadores</Text>
              <View className="bg-black px-3 py-1 rounded-full">
                <Text className="text-white text-sm font-semibold">
                  {players.length}/{selectedGame.number_of_players}
                </Text>
              </View>
            </View>

            {/* Players List */}
            <View className="space-y-3 mb-4">
              {players.map((player) => (
                <Card key={player.id} padding="medium" className={player.isHost ? "border-2 border-amber-500" : ""}>
                  <View className="flex-row items-center">
                    <PlayerAvatar
                      avatar={player.name.charAt(0).toUpperCase()}
                      color={player.isHost ? "#f59e0b" : player.isGuest ? "#10b981" : "#3b82f6"}
                      size="medium"
                    />
                    <View className="flex-1 ml-3">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base font-semibold text-black">
                          {player.name}
                        </Text>
                      </View>
                      <View className="flex-row items-center mt-1">
                        {player.isHost ? (
                          <>
                            <Crown size={14} color="#f59e0b" weight="bold" />
                            <Text className="text-sm text-amber-600 ml-1 font-semibold">Anfitrión</Text>
                          </>
                        ) : player.isGuest ? (
                          <>
                            <Text className="text-sm text-gray-500">Invitado</Text>
                          </>
                        ) : (
                          <>
                            <Check size={14} color="#10b981" weight="bold" />
                            <Text className="text-sm text-gray-500 ml-1">Usuario</Text>
                          </>
                        )}
                      </View>
                    </View>
                    {!player.isHost && (
                      <TouchableOpacity
                        onPress={() => handleRemovePlayer(player.id)}
                        className="w-8 h-8 bg-red-500 rounded-lg items-center justify-center"
                      >
                        <X size={18} color="#ffffff" weight="bold" />
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              ))}
            </View>

            {/* Add Player Button */}
            {players.length < selectedGame.number_of_players && (
              <TouchableOpacity
                onPress={handleAddPlayer}
                className="w-full"
                activeOpacity={0.7}
              >
                <Card className="border-2 border-dashed border-blue-500 bg-blue-50" padding="medium">
                  <View className="flex-row items-center justify-center">
                    <UserPlus size={20} color="#3b82f6" weight="bold" />
                    <Text className="text-blue-500 text-base font-semibold ml-2">
                      Agregar Jugador
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Game Details Info */}
        <Card className="bg-gray-100 mb-6" padding="medium">
          <Text className="text-sm font-semibold text-gray-900 mb-3">
            Detalles del Juego
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Rondas:</Text>
              <Text className="text-sm font-semibold text-gray-900">
                {selectedGame.rounds}
              </Text>
            </View>
            {selectedGame.has_turns && selectedGame.turn_duration > 0 && (
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">Tiempo por turno:</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {selectedGame.turn_duration}s
                </Text>
              </View>
            )}
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Duración de ronda:</Text>
              <Text className="text-sm font-semibold text-gray-900">
                {selectedGame.round_duration}s
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Puntos iniciales:</Text>
              <Text className="text-sm font-semibold text-gray-900">
                {selectedGame.starting_points}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Termina por:</Text>
              <Text className="text-sm font-semibold text-gray-900">
                {selectedGame.rounds > 1
                  ? `${selectedGame.rounds} rondas`
                  : selectedGame.is_winning
                  ? `Alcanzar ${selectedGame.finishing_points} pts (ganar)`
                  : `Alcanzar ${selectedGame.finishing_points} pts (perder)`}
              </Text>
            </View>
          </View>
        </Card>

        {/* Start Match Button */}
        <Button
          title={isCreatingMatch ? "Creando Partida..." : "Iniciar Partida"}
          onPress={validateAndStartMatch}
          icon={<Play size={20} color="#ffffff" weight="fill" />}
          disabled={isCreatingMatch}
          className="mb-8"
        />
      </ScrollView>

      {/* Player Search Modal */}
      <PlayerSearchModal
        visible={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        onSelectUser={handleSelectUser}
        onSelectGuest={handleSelectGuest}
        excludeUserIds={getExcludedUserIds()}
      />
    </SafeAreaView>
  );
};