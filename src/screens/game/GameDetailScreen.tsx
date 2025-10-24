import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  Play,
  Users,
  Trophy,
  Clock,
  Target,
  Flag,
} from 'phosphor-react-native';
import { RootStackParamList } from '../../types';
import { BackendGame } from '../../types/backend.types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getIconComponent } from '../../utils/iconMapper';

type GameDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameDetail'>;
type GameDetailScreenRouteProp = RouteProp<RootStackParamList, 'GameDetail'>;

interface Props {
  navigation: GameDetailScreenNavigationProp;
  route: GameDetailScreenRouteProp;
}

export const GameDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { game } = route.params as { game: BackendGame };

  const handleStartMatch = () => {
    navigation.navigate('MatchConfig', { selectedGame: game });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getEndingText = () => {
    if (game.rounds > 1) {
      return `${game.rounds} rondas`;
    } else if (game.is_winning) {
      return `Alcanzar ${game.finishing_points} pts (ganar)`;
    } else {
      return `Alcanzar ${game.finishing_points} pts (perder)`;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header con icono grande */}
        <View
          className="px-6 pt-6 pb-8"
          style={{
            backgroundColor: game.bg_color || '#dbeafe',
          }}
        >
          {/* Botón volver */}
          <Button
            title=""
            icon={<ArrowLeft size={24} color="#000" weight="bold" />}
            onPress={handleGoBack}
            variant="ghost"
            className="self-start mb-4 -ml-2"
          />

          {/* Icono y nombre */}
          <View className="items-center">
            <View
              className="w-24 h-24 rounded-3xl items-center justify-center mb-4"
              style={{
                backgroundColor: '#ffffff',
              }}
            >
              {(() => {
                const IconComponent = getIconComponent(game.icon);
                return <IconComponent size={56} color={game.color || '#3b82f6'} weight="fill" />;
              })()}
            </View>
            <Text className="text-3xl font-bold text-black mb-2">
              {game.name}
            </Text>
            {game.description && (
              <Text className="text-base text-gray-700 text-center px-4">
                {game.description}
              </Text>
            )}
          </View>
        </View>

        <View className="px-6 py-6">
          {/* Detalles del juego */}
          <Card className="mb-4" padding="large">
            <Text className="text-lg font-bold text-black mb-4">
              Configuración
            </Text>

            {/* Jugadores */}
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mr-3">
                <Users size={20} color="#3b82f6" weight="bold" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Jugadores</Text>
                <Text className="text-base font-semibold text-black">
                  {game.has_teams
                    ? `${game.number_of_players} equipos (${game.min_team_length}-${game.max_team_length} jugadores/equipo)`
                    : `${game.number_of_players} jugadores`}
                </Text>
              </View>
            </View>

            {/* Rondas */}
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-xl bg-yellow-50 items-center justify-center mr-3">
                <Trophy size={20} color="#f59e0b" weight="bold" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Rondas</Text>
                <Text className="text-base font-semibold text-black">
                  {game.rounds}
                </Text>
              </View>
            </View>

            {/* Timer */}
            {game.has_turns && game.turn_duration > 0 && (
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center mr-3">
                  <Clock size={20} color="#8b5cf6" weight="bold" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-500">Tiempo por turno</Text>
                  <Text className="text-base font-semibold text-black">
                    {game.turn_duration} segundos
                  </Text>
                </View>
              </View>
            )}

            {/* Puntos iniciales */}
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-xl bg-green-50 items-center justify-center mr-3">
                <Target size={20} color="#10b981" weight="bold" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Puntos iniciales</Text>
                <Text className="text-base font-semibold text-black">
                  {game.starting_points}
                </Text>
              </View>
            </View>

            {/* Termina por */}
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-red-50 items-center justify-center mr-3">
                <Flag size={20} color="#ef4444" weight="bold" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Termina por</Text>
                <Text className="text-base font-semibold text-black">
                  {getEndingText()}
                </Text>
              </View>
            </View>
          </Card>

          {/* Reglas */}
          {game.rules && (
            <Card className="mb-6" padding="large">
              <Text className="text-lg font-bold text-black mb-3">
                Reglas
              </Text>
              <Text className="text-base text-gray-700 leading-6">
                {game.rules}
              </Text>
            </Card>
          )}

          {/* Botón iniciar partida */}
          <Button
            title="Iniciar Partida"
            onPress={handleStartMatch}
            icon={<Play size={20} color="#ffffff" weight="fill" />}
            className="mb-4"
          />

          {/* Botón volver */}
          <Button
            title="Volver"
            onPress={handleGoBack}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
