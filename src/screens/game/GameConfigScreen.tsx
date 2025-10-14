import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, Alert, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  Trophy,
  Clock,
  Target,
  Lock,
  Globe,
  GameController,
  Checks,
} from 'phosphor-react-native';
import { RootStackParamList, GameSetupConfig } from '../../types';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { InputField } from '../../components/common/InputField';
import { SettingItem } from '../../components/common/SettingItem';
import { Card } from '../../components/ui/Card';
import { PlayerAvatar } from '../../components/common/PlayerAvatar';

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

    // TODO: Guardar la configuración del juego
    // Por ahora, volver a Home con navbar
    navigation.navigate('Home');
  };

  const handleSaveAsDraft = () => {
    Alert.alert('Guardado', 'La configuración se guardó como borrador');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Configuración"
          subtitle="Ajusta las reglas del juego"
          rightIcon={<Checks size={24} color="#10b981" weight="bold" />}
        />

        {/* Resumen del Juego */}
        <Card className="bg-white mb-6" padding="large">
          <View className="flex-row items-center mb-4">
            <View 
              className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: selectedGame.color }}
            >
              <Text className="text-3xl">{selectedGame.icon}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-black mb-1">
                {selectedGame.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {players.length} jugadores confirmados
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center gap-2">
            {players.map((player) => (
              <PlayerAvatar
                key={player.id}
                avatar={player.avatar}
                color={player.color}
                size="small"
                showBorder
              />
            ))}
          </View>
        </Card>

        <InputField
          label="Nombre de la Partida"
          placeholder="Nombre de la partida"
          value={config.gameName}
          onChangeText={(text) => updateConfig('gameName', text)}
        />

        <SettingItem
          icon={Trophy}
          iconColor="#f59e0b"
          iconBgColor="#fef3c7"
          label="Puntaje por Rondas"
          description="Acumular puntos cada ronda"
          type="toggle"
          value={config.hasRounds}
          onValueChange={(val) => updateConfig('hasRounds', val)}
        />

        {config.hasRounds && (
          <SettingItem
            icon={GameController}
            iconColor="#6b7280"
            iconBgColor="#f3f4f6"
            label="Número de rondas"
            type="counter"
            value={config.numberOfRounds}
            onValueChange={(val) => updateConfig('numberOfRounds', val)}
            counterMin={1}
          />
        )}

        <SettingItem
          icon={Clock}
          iconColor="#3b82f6"
          iconBgColor="#dbeafe"
          label="Límite de Tiempo"
          description="Tiempo máximo por turno"
          type="toggle"
          value={config.hasTimeLimit}
          onValueChange={(val) => updateConfig('hasTimeLimit', val)}
        />

        {config.hasTimeLimit && (
          <SettingItem
            icon={Clock}
            iconColor="#6b7280"
            iconBgColor="#f3f4f6"
            label="Minutos por turno"
            type="counter"
            value={config.timePerTurn}
            onValueChange={(val) => updateConfig('timePerTurn', val)}
            counterMin={1}
          />
        )}

        <SettingItem
          icon={Target}
          iconColor="#6b7280"
          iconBgColor="#f3f4f6"
          label="Puntos para ganar"
          type="counter"
          value={config.pointsToWin}
          onValueChange={(val) => updateConfig('pointsToWin', val)}
          counterMin={100}
          counterStep={50}
        />

        <SettingItem
          icon={config.isPrivate ? Lock : Globe}
          iconColor={config.isPrivate ? '#ef4444' : '#10b981'}
          iconBgColor={config.isPrivate ? '#fee2e2' : '#d1fae5'}
          label={config.isPrivate ? 'Partida Privada' : 'Partida Pública'}
          description={config.isPrivate ? 'Solo jugadores invitados' : 'Cualquiera puede unirse'}
          type="toggle"
          value={config.isPrivate}
          onValueChange={(val) => updateConfig('isPrivate', val)}
        />

        <View className="mb-8 mt-4 space-y-3">
          <Button title="Iniciar Partida" onPress={handleStartGame} />
          <Button title="Guardar Borrador" onPress={handleSaveAsDraft} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};