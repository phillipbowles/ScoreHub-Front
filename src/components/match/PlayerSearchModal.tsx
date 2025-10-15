import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  MagnifyingGlass,
  User,
  UserCircle,
  Check,
} from 'phosphor-react-native';
import { Card } from '../ui/Card';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { apiService } from '../../utils/api';

interface User {
  id: number;
  name: string;
  email_address: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
  onSelectGuest: (name: string) => void;
  excludeUserIds?: number[];
}

export const PlayerSearchModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelectUser,
  onSelectGuest,
  excludeUserIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'user' | 'guest'>('user');

  useEffect(() => {
    if (visible && selectedTab === 'user') {
      searchUsers();
    }
  }, [visible, searchQuery, selectedTab]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsers();
      if (response.success && response.data) {
        const allUsers = response.data.data || response.data;
        // Filtrar usuarios excluidos y por búsqueda
        const filtered = allUsers.filter(
          (user: User) =>
            !excludeUserIds.includes(user.id) &&
            (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email_address.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setUsers(filtered);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = () => {
    if (searchQuery.trim()) {
      onSelectGuest(searchQuery.trim());
      setSearchQuery('');
      onClose();
    }
  };

  const handleSelectUser = (user: User) => {
    onSelectUser(user);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: '85%' }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-black">Agregar Jugador</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <X size={24} color="#6b7280" weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View className="flex-row px-6 pt-4 gap-3">
            <TouchableOpacity
              onPress={() => setSelectedTab('user')}
              className={`flex-1 py-3 rounded-lg border-2 ${
                selectedTab === 'user'
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <View className="flex-row items-center justify-center">
                <User
                  size={20}
                  color={selectedTab === 'user' ? '#3b82f6' : '#6b7280'}
                  weight="bold"
                />
                <Text
                  className={`ml-2 font-semibold ${
                    selectedTab === 'user' ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Usuario
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedTab('guest')}
              className={`flex-1 py-3 rounded-lg border-2 ${
                selectedTab === 'guest'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <View className="flex-row items-center justify-center">
                <UserCircle
                  size={20}
                  color={selectedTab === 'guest' ? '#10b981' : '#6b7280'}
                  weight="bold"
                />
                <Text
                  className={`ml-2 font-semibold ${
                    selectedTab === 'guest' ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  Invitado
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View className="px-6 pt-4 pb-3">
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
              <MagnifyingGlass size={20} color="#6b7280" weight="bold" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                placeholder={
                  selectedTab === 'user'
                    ? 'Buscar por nombre o email...'
                    : 'Nombre del invitado...'
                }
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
          </View>

          {/* Content */}
          {selectedTab === 'user' ? (
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
              {loading ? (
                <View className="py-12 items-center">
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text className="text-gray-500 mt-4">Buscando usuarios...</Text>
                </View>
              ) : users.length === 0 ? (
                <View className="py-12 items-center">
                  <User size={64} color="#d1d5db" weight="light" />
                  <Text className="text-gray-500 text-base mt-4">
                    {searchQuery ? 'No se encontraron usuarios' : 'Escribe para buscar'}
                  </Text>
                </View>
              ) : (
                <View className="space-y-2 pb-6">
                  {users.map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      onPress={() => handleSelectUser(user)}
                      activeOpacity={0.7}
                    >
                      <Card padding="medium">
                        <View className="flex-row items-center">
                          <PlayerAvatar
                            avatar={user.name.charAt(0).toUpperCase()}
                            color="#3b82f6"
                            size="medium"
                          />
                          <View className="flex-1 ml-3">
                            <Text className="text-base font-semibold text-black">
                              {user.name}
                            </Text>
                            <Text className="text-sm text-gray-500">
                              {user.email_address}
                            </Text>
                          </View>
                          <Check size={24} color="#10b981" weight="bold" />
                        </View>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          ) : (
            <View className="flex-1 px-6 pb-6">
              <Card className="bg-blue-50 border border-blue-200 mb-4" padding="medium">
                <Text className="text-sm text-blue-800">
                  Ingresa el nombre del invitado y presiona "Agregar Invitado"
                </Text>
              </Card>

              <TouchableOpacity
                onPress={handleAddGuest}
                disabled={!searchQuery.trim()}
                className={`py-4 rounded-xl items-center ${
                  searchQuery.trim() ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <Text className="text-white font-bold text-base">
                  Agregar Invitado
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
