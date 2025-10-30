import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { X, UserPlus, Crown } from 'phosphor-react-native';
import { Card } from '../ui/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';

interface Player {
  id: string;
  name: string;
  isGuest: boolean;
  userId?: number;
  teamId?: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  players: Player[];
}

interface Props {
  teams: Team[];
  minTeamLength: number;
  maxTeamLength: number;
  onAddPlayerToTeam: (teamId: string) => void;
  onRemovePlayer: (playerId: string, teamId: string) => void;
  currentUserId?: number;
}

const TEAM_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
];

export const TeamPlayerManager: React.FC<Props> = ({
  teams,
  minTeamLength,
  maxTeamLength,
  onAddPlayerToTeam,
  onRemovePlayer,
  currentUserId,
}) => {
  const canAddPlayer = (team: Team) => {
    return team.players.length < maxTeamLength;
  };

  const isCurrentUserHost = (player: Player) => {
    return player.userId === currentUserId && !player.isGuest;
  };

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-black">Equipos</Text>
        <View className="bg-gray-200 px-3 py-1 rounded-full">
          <Text className="text-gray-700 text-sm font-semibold">
            {minTeamLength}-{maxTeamLength} por equipo
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
        <View className="flex-row gap-4 pr-6">
          {teams.map((team, index) => (
            <View key={team.id} className="w-80">
              <Card padding="medium">
                {/* Team Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: team.color }}
                    />
                    <Text className="text-lg font-bold text-black">
                      {team.name}
                    </Text>
                  </View>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${team.color}20` }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: team.color }}
                    >
                      {team.players.length}/{maxTeamLength}
                    </Text>
                  </View>
                </View>

                {/* Players List */}
                <View className="space-y-2 mb-3">
                  {team.players.length === 0 ? (
                    <View className="py-8 items-center">
                      <Text className="text-gray-400 text-sm">
                        Sin jugadores
                      </Text>
                    </View>
                  ) : (
                    team.players.map((player) => {
                      const isHost = isCurrentUserHost(player);
                      return (
                        <View
                          key={player.id}
                          className="flex-row items-center bg-gray-50 rounded-lg p-3"
                        >
                          <PlayerAvatar
                            avatar={player.name.charAt(0).toUpperCase()}
                            color={team.color}
                            size="small"
                          />
                          <View className="flex-1 ml-3">
                            <View className="flex-row items-center">
                              <Text className="text-sm font-semibold text-black">
                                {player.name}
                              </Text>
                              {isHost && (
                                <View className="ml-2 bg-yellow-100 px-2 py-0.5 rounded-full flex-row items-center">
                                  <Crown size={10} color="#f59e0b" weight="fill" />
                                  <Text className="text-xs font-semibold text-yellow-700 ml-1">
                                    Tú
                                  </Text>
                                </View>
                              )}
                            </View>
                            <Text className="text-xs text-gray-500 mt-0.5">
                              {player.isGuest ? 'Invitado' : 'Usuario'}
                            </Text>
                          </View>
                          {!isHost && (
                            <TouchableOpacity
                              onPress={() => onRemovePlayer(player.id, team.id)}
                              className="w-7 h-7 bg-red-500 rounded-lg items-center justify-center"
                            >
                              <X size={14} color="#ffffff" weight="bold" />
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })
                  )}
                </View>

                {/* Add Player Button */}
                {canAddPlayer(team) && (
                  <TouchableOpacity
                    onPress={() => onAddPlayerToTeam(team.id)}
                    className="border-2 border-dashed rounded-lg py-3"
                    style={{ borderColor: team.color }}
                  >
                    <View className="flex-row items-center justify-center">
                      <UserPlus size={18} color={team.color} weight="bold" />
                      <Text
                        className="font-semibold ml-2"
                        style={{ color: team.color }}
                      >
                        Agregar Jugador
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {/* Team Full Message */}
                {!canAddPlayer(team) && (
                  <View className="bg-gray-100 rounded-lg py-3">
                    <Text className="text-gray-500 text-sm text-center font-medium">
                      Equipo completo
                    </Text>
                  </View>
                )}
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Teams Status Info */}
      <Card className="bg-blue-50 border border-blue-200 mt-2" padding="small">
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
          <Text className="text-xs text-blue-800 flex-1">
            Cada equipo debe tener entre {minTeamLength} y {maxTeamLength} jugadores
          </Text>
        </View>
      </Card>
    </View>
  );
};
