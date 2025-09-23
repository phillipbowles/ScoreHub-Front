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
import { RootStackParamList, GamePlayer } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

type AddPlayersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPlayers'>;
type AddPlayersScreenRouteProp = RouteProp<RootStackParamList, 'AddPlayers'>;

interface Props {
  navigation: AddPlayersScreenNavigationProp;
  route: AddPlayersScreenRouteProp;
}

const playerColors = ['#1c1c1e', '#ff6b35', '#34c759', '#007aff', '#ff3b30', '#8e44ad', '#f39c12', '#e74c3c'];

export const AddPlayersScreen: React.FC<Props> = ({ navigation, route }) => {
  const { selectedGame } = route.params;
  
  const [players, setPlayers] = useState<GamePlayer[]>([
    {
      id: '1',
      name: 'Ana',
      isHost: true,
      avatar: 'A',
      color: playerColors[0],
      isGuest: false,
    }
  ]);

  const [showAddOptions, setShowAddOptions] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerType, setNewPlayerType] = useState<'user' | 'guest'>('user');

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      Alert.alert('Error', 'Ingresa un nombre para el jugador');
      return;
    }

    if (players.length >= selectedGame.maxPlayers) {
      Alert.alert('Error', `Máximo ${selectedGame.maxPlayers} jugadores para ${selectedGame.name}`);
      return;
    }

    const newPlayer: GamePlayer = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      isHost: false,
      avatar: newPlayerName.charAt(0).toUpperCase(),
      color: playerColors[players.length % playerColors.length],
      isGuest: newPlayerType === 'guest',
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    setShowAddOptions(false);
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const handleNext = () => {
    if (players.length < selectedGame.minPlayers) {
      Alert.alert('Error', `Mínimo ${selectedGame.minPlayers} jugadores para ${selectedGame.name}`);
      return;
    }

    navigation.navigate('GameConfig', { 
      selectedGame, 
      players 
    });
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
          <Text className="text-2xl font-bold text-black">Agregar Jugadores</Text>
        </View>

        {/* Juego Seleccionado */}
        <Card className="bg-gray-50 mb-6 flex-row items-center" padding="medium">
          <View 
            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
            style={{ backgroundColor: selectedGame.color }}
          >
            <Text className="text-2xl">{selectedGame.icon}</Text>
          </View>
          <View>
            <Text className="text-base font-semibold text-black">{selectedGame.name}</Text>
            <Text className="text-sm text-gray-500">
              {selectedGame.minPlayers}-{selectedGame.maxPlayers} jugadores
            </Text>
          </View>
        </Card>

        {/* Lista de Jugadores */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            Jugadores ({players.length}/{selectedGame.maxPlayers})
          </Text>
          
          {players.map((player) => (
            <View key={player.id} className="flex-row items-center bg-gray-100 rounded-xl p-4 mb-3">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: player.color }}
              >
                <Text className="text-white text-lg font-bold">{player.avatar}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-black">
                  {player.name}{player.isHost ? ' (Tú)' : ''}
                </Text>
                <Text className="text-sm text-gray-500">
                  {player.isHost ? 'Anfitrión' : player.isGuest ? 'Invitado' : 'Confirmado'}
                </Text>
              </View>
              {!player.isHost && (
                <TouchableOpacity
                  onPress={() => removePlayer(player.id)}
                  className="w-8 h-8 bg-red-500 rounded-lg items-center justify-center"
                >
                  <Text className="text-white font-bold">×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Agregar Jugador */}
        {players.length < selectedGame.maxPlayers && (
          <View className="mb-6">
            {!showAddOptions ? (
              <TouchableOpacity
                onPress={() => setShowAddOptions(true)}
                className="w-full py-4 border-2 border-dashed border-blue-500 rounded-xl"
              >
                <Text className="text-center text-blue-500 text-base font-semibold">
                  + Agregar Jugador
                </Text>
              </TouchableOpacity>
            ) : (
              <Card className="border-2 border-gray-100" padding="none">
                <TouchableOpacity
                  onPress={() => setNewPlayerType('user')}
                  className={`flex-row items-center p-4 border-b border-gray-100 ${
                    newPlayerType === 'user' ? 'bg-blue-50' : ''
                  }`}
                >
                  <View className="w-10 h-10 bg-blue-500 rounded-lg items-center justify-center mr-4">
                    <Text className="text-white text-lg">👤</Text>
                  </View>
                  <View>
                    <Text className="text-base font-semibold text-black">
                      Ingresar Nombre de Usuario
                    </Text>
                    <Text className="text-sm text-gray-500">Usuario registrado</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setNewPlayerType('guest')}
                  className={`flex-row items-center p-4 ${
                    newPlayerType === 'guest' ? 'bg-green-50' : ''
                  }`}
                >
                  <View className="w-10 h-10 bg-green-500 rounded-lg items-center justify-center mr-4">
                    <Text className="text-white text-lg">🎭</Text>
                  </View>
                  <View>
                    <Text className="text-base font-semibold text-black">
                      Ingresar como Invitado
                    </Text>
                    <Text className="text-sm text-gray-500">Sin registro necesario</Text>
                  </View>
                </TouchableOpacity>
              </Card>
            )}

            {showAddOptions && (
              <View className="mt-4 space-y-3">
                <TextInput
                  className="w-full px-4 py-4 bg-gray-100 rounded-xl text-base text-black"
                  placeholder={newPlayerType === 'user' ? 'Nombre de usuario' : 'Nombre del invitado'}
                  placeholderTextColor="#8E8E93"
                  value={newPlayerName}
                  onChangeText={setNewPlayerName}
                />
                <View className="flex-row space-x-3">
                  <Button
                    title="Agregar"
                    onPress={addPlayer}
                    className="flex-1"
                  />
                  <Button
                    title="Cancelar"
                    onPress={() => {
                      setShowAddOptions(false);
                      setNewPlayerName('');
                    }}
                    variant="secondary"
                    className="flex-1"
                  />
                </View>
              </View>
            )}
          </View>
        )}

        <Button
          title="Siguiente"
          onPress={handleNext}
          disabled={players.length < selectedGame.minPlayers}
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
};