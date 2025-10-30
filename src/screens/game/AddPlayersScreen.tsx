import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  UserPlus,
  User,
  UserCircle,
  X,
  Crown,
  Check,
  Users,
} from 'phosphor-react-native';
import { RootStackParamList, GamePlayer } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { PlayerAvatar } from '../../components/common/PlayerAvatar';
import { InputField } from '../../components/common/InputField';

type AddPlayersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPlayers'>;
type AddPlayersScreenRouteProp = RouteProp<RootStackParamList, 'AddPlayers'>;

interface Props {
  navigation: AddPlayersScreenNavigationProp;
  route: AddPlayersScreenRouteProp;
}

const playerColors = [
  '#1c1c1e', '#3b82f6', '#10b981', '#f59e0b', 
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'
];

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

    navigation.navigate('GameConfig', { selectedGame, players });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Agregar Jugadores"
          subtitle="Selecciona quién jugará"
          rightIcon={<Users size={24} color="#3b82f6" weight="fill" />}
        />

        {/* Juego Seleccionado */}
        <Card className="bg-white mb-6" padding="medium">
          <View className="flex-row items-center">
            <View 
              className="w-12 h-12 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: selectedGame.color }}
            >
              <Text className="text-2xl">{selectedGame.icon}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-black">{selectedGame.name}</Text>
              <View className="flex-row items-center mt-1">
                <Users size={14} color="#6b7280" weight="bold" />
                <Text className="text-sm text-gray-500 ml-1">
                  {selectedGame.minPlayers}-{selectedGame.maxPlayers} jugadores
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Lista de Jugadores */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-black">Jugadores</Text>
            <View className="bg-black px-3 py-1 rounded-full">
              <Text className="text-white text-sm font-semibold">
                {players.length}/{selectedGame.maxPlayers}
              </Text>
            </View>
          </View>
          
          <View className="space-y-3">
            {players.map((player) => (
              <Card key={player.id} padding="medium">
                <View className="flex-row items-center">
                  <PlayerAvatar
                    avatar={player.avatar}
                    color={player.color}
                    size="medium"
                  />
                  
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center">
                      <Text className="text-base font-semibold text-black">
                        {player.name}
                      </Text>
                      {player.isHost && (
                        <View className="ml-2 bg-yellow-100 px-2 py-0.5 rounded-full flex-row items-center">
                          <Crown size={12} color="#f59e0b" weight="fill" />
                          <Text className="text-xs font-semibold text-yellow-700 ml-1">
                            Anfitrión
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-row items-center mt-1">
                      {player.isGuest ? (
                        <>
                          <UserCircle size={14} color="#6b7280" weight="fill" />
                          <Text className="text-sm text-gray-500 ml-1">Invitado</Text>
                        </>
                      ) : (
                        <>
                          <Check size={14} color="#10b981" weight="bold" />
                          <Text className="text-sm text-gray-500 ml-1">Confirmado</Text>
                        </>
                      )}
                    </View>
                  </View>
                  
                  {!player.isHost && (
                    <TouchableOpacity
                      onPress={() => removePlayer(player.id)}
                      className="w-8 h-8 bg-red-500 rounded-lg items-center justify-center"
                    >
                      <X size={18} color="#ffffff" weight="bold" />
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Agregar Jugador */}
        {players.length < selectedGame.maxPlayers && (
          <View className="mb-6">
            {!showAddOptions ? (
              <TouchableOpacity
                onPress={() => setShowAddOptions(true)}
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
            ) : (
              <View className="space-y-3">
                <Card padding="none">
                  <TouchableOpacity
                    onPress={() => setNewPlayerType('user')}
                    className={`flex-row items-center p-4 border-b border-gray-100 ${
                      newPlayerType === 'user' ? 'bg-blue-50' : ''
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="w-10 h-10 bg-blue-500 rounded-lg items-center justify-center mr-3">
                      <User size={20} color="#ffffff" weight="bold" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-black">
                        Usuario Registrado
                      </Text>
                      <Text className="text-sm text-gray-500">Ingresa nombre de usuario</Text>
                    </View>
                    {newPlayerType === 'user' && (
                      <Check size={24} color="#3b82f6" weight="bold" />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setNewPlayerType('guest')}
                    className={`flex-row items-center p-4 ${
                      newPlayerType === 'guest' ? 'bg-green-50' : ''
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="w-10 h-10 bg-green-500 rounded-lg items-center justify-center mr-3">
                      <UserCircle size={20} color="#ffffff" weight="bold" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-black">Invitado</Text>
                      <Text className="text-sm text-gray-500">Sin registro necesario</Text>
                    </View>
                    {newPlayerType === 'guest' && (
                      <Check size={24} color="#10b981" weight="bold" />
                    )}
                  </TouchableOpacity>
                </Card>

                <InputField
                  label="Nombre del jugador"
                  placeholder={newPlayerType === 'user' ? 'Nombre de usuario' : 'Nombre del invitado'}
                  value={newPlayerName}
                  onChangeText={setNewPlayerName}
                />
                
                <View className="flex-row gap-3">
                  <Button title="Agregar" onPress={addPlayer} className="flex-1" />
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