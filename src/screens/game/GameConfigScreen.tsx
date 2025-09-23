import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, GameSetupConfig } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

type GameConfigScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameConfig'>;
type GameConfigScreenRouteProp = RouteProp<RootStackParamList, 'GameConfig'>;

interface Props {
  navigation: GameConfigScreenNavigationProp;
  route: GameConfigScreenRouteProp;
}

export const GameConfigScreen: React.FC<Props> = ({ navigation, route }) => {
  const { selectedGame, players } = route.params;
  
  const [config, setConfig] = useState({
    gameName: `${selectedGame.name} con Amigos`,
    hasRounds: true,
    numberOfRounds: 5,
    hasTimeLimit: true,
    timePerTurn: 3,
    pointsToWin: 500,
    isPrivate: true,
  });

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleStartGame = () => {
    const gameConfig: GameSetupConfig = {
      gameName: config.gameName,
      players,
      numberOfRounds: config.hasRounds ? config.numberOfRounds : undefined,
      timePerTurn: config.hasTimeLimit ? config.timePerTurn : undefined,
      pointsToWin: config.pointsToWin,
      isPrivate: config.isPrivate,
      hasTimeLimit: config.hasTimeLimit,
      hasRounds: config.hasRounds,
    };

    navigation.navigate('Game', { config: gameConfig });
  };

  const handleSaveAsDraft = () => {
    Alert.alert('Guardado', 'La configuración se guardó como borrador');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center py-4 mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-4"
          >
            <Text className="text-lg text-black">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black">Configuración</Text>
        </View>

        {/* Resumen del Juego */}
        <Card className="bg-gray-50 mb-6" padding="large">
          <View className="flex-row items-center mb-4">
            <View 
              className="w-12 h-12 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: selectedGame.color }}
            >
              <Text className="text-2xl">{selectedGame.icon}</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-black">{selectedGame.name}</Text>
              <Text className="text-sm text-gray-500">
                {players.length} jugadores confirmados
              </Text>
            </View>
          </View>
          <View className="flex-row space-x-2">
            {players.map((player, index) => (
              <View
                key={player.id}
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: player.color }}
              >
                <Text className="text-white text-xs font-bold">{player.avatar}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Configuración de Partida */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-black mb-5">
            Configuración de Partida
          </Text>
          
          {/* Nombre de la Partida */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-black mb-2">
              Nombre de la Partida
            </Text>
            <TextInput
              className="w-full px-4 py-4 bg-gray-100 rounded-xl text-base text-black"
              placeholder="Nombre de la partida"
              placeholderTextColor="#8E8E93"
              value={config.gameName}
              onChangeText={(text) => updateConfig('gameName', text)}
            />
          </View>

          {/* Puntaje por Rondas */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between bg-gray-100 rounded-xl p-4">
              <View>
                <Text className="text-base font-semibold text-black">
                  Puntaje por Rondas
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Acumular puntos cada ronda
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => updateConfig('hasRounds', !config.hasRounds)}
                className={`w-12 h-7 rounded-full relative ${
                  config.hasRounds ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <View
                  className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                    config.hasRounds ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Número de Rondas (visible solo si hasRounds está activo) */}
          {config.hasRounds && (
            <View className="mb-5">
              <Text className="text-sm font-semibold text-black mb-2">
                Número de Rondas
              </Text>
              <View className="flex-row items-center justify-between bg-gray-100 rounded-xl p-4">
                <Text className="text-base text-black">Total de rondas</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => config.numberOfRounds > 1 && updateConfig('numberOfRounds', config.numberOfRounds - 1)}
                    className="w-9 h-9 bg-black rounded-lg items-center justify-center"
                  >
                    <Text className="text-white text-lg font-semibold">-</Text>
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-black mx-5 min-w-[30px] text-center">
                    {config.numberOfRounds}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateConfig('numberOfRounds', config.numberOfRounds + 1)}
                    className="w-9 h-9 bg-black rounded-lg items-center justify-center"
                  >
                    <Text className="text-white text-lg font-semibold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Límite de Tiempo */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between bg-gray-100 rounded-xl p-4">
              <View>
                <Text className="text-base font-semibold text-black">
                  Límite de Tiempo
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Tiempo máximo por turno
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => updateConfig('hasTimeLimit', !config.hasTimeLimit)}
                className={`w-12 h-7 rounded-full relative ${
                  config.hasTimeLimit ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <View
                  className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                    config.hasTimeLimit ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tiempo por Turno (visible solo si hasTimeLimit está activo) */}
          {config.hasTimeLimit && (
            <View className="mb-5">
              <Text className="text-sm font-semibold text-black mb-2">
                Tiempo por Turno (minutos)
              </Text>
              <View className="flex-row items-center justify-between bg-gray-100 rounded-xl p-4">
                <Text className="text-base text-black">Duración máxima</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => config.timePerTurn > 1 && updateConfig('timePerTurn', config.timePerTurn - 1)}
                    className="w-9 h-9 bg-black rounded-lg items-center justify-center"
                  >
                    <Text className="text-white text-lg font-semibold">-</Text>
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-black mx-5 min-w-[30px] text-center">
                    {config.timePerTurn}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateConfig('timePerTurn', config.timePerTurn + 1)}
                    className="w-9 h-9 bg-black rounded-lg items-center justify-center"
                  >
                    <Text className="text-white text-lg font-semibold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Puntos para Ganar */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-black mb-2">
              Puntos para Ganar
            </Text>
            <View className="flex-row items-center justify-between bg-gray-100 rounded-xl p-4">
              <Text className="text-base text-black">Puntos objetivo</Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => config.pointsToWin > 100 && updateConfig('pointsToWin', config.pointsToWin - 50)}
                  className="w-9 h-9 bg-black rounded-lg items-center justify-center"
                >
                  <Text className="text-white text-lg font-semibold">-</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-black mx-5 min-w-[50px] text-center">
                  {config.pointsToWin}
                </Text>
                <TouchableOpacity
                  onPress={() => updateConfig('pointsToWin', config.pointsToWin + 50)}
                  className="w-9 h-9 bg-black rounded-lg items-center justify-center"
                >
                  <Text className="text-white text-lg font-semibold">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Partida Privada */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between bg-gray-100 rounded-xl p-4">
              <View>
                <Text className="text-base font-semibold text-black">
                  Partida Privada
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Solo jugadores invitados
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => updateConfig('isPrivate', !config.isPrivate)}
                className={`w-12 h-7 rounded-full relative ${
                  config.isPrivate ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <View
                  className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                    config.isPrivate ? 'left-5.5' : 'left-0.5'
                  }`}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Button
          title="Iniciar Partida"
          onPress={handleStartGame}
          className="mb-4"
        />
        
        <Button
          title="Guardar como Borrador"
          onPress={handleSaveAsDraft}
          variant="secondary"
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
};