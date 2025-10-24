import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Trophy,
  Clock,
  Users,
  Sparkle,
  Target,
  Flag,
  Crosshair,
  Skull
} from 'phosphor-react-native';
import { RootStackParamList } from '../../types';
import { CreateGameRequest } from '../../types/backend.types';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { InputField } from '../../components/common/InputField';
import { SettingItem } from '../../components/common/SettingItem';
import { IconSelectorModal } from '../../components/game/IconSelectorModal';
import { apiService } from '../../utils/api';
import { getIconComponent } from '../../utils/iconMapper';

type CreateGameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateGame'>;

interface Props {
  navigation: CreateGameScreenNavigationProp;
}

export const CreateGameScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedIcon: 'CardsThree',
    selectedColor: '#3b82f6',
    selectedBgColor: '#dbeafe',
    rules: '',
    hasTeams: false,
    minTeamLength: 2,
    maxTeamLength: 4,
    numberOfPlayers: 4,
    rounds: 1,
    startingPoints: 0,
    showTimer: false,
    defaultTimerDuration: 60,
    endingType: 'end_rounds' as 'end_rounds' | 'win' | 'lose',
    pointsToWin: 100,
    pointsToLose: 0,
  });
  
  const [showIconModal, setShowIconModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleIconSelect = (iconName: string, color: string, bgColor: string) => {
    setFormData(prev => ({
      ...prev,
      selectedIcon: iconName,
      selectedColor: color,
      selectedBgColor: bgColor,
    }));
    setShowIconModal(false);
  };

  const handleCreateGame = async () => {
    // Validaciones
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre del juego es obligatorio');
      return;
    }

    if (!formData.rules.trim()) {
      Alert.alert('Error', 'Las reglas del juego son obligatorias');
      return;
    }

    // Validación de equipos
    if (formData.hasTeams && formData.minTeamLength > formData.maxTeamLength) {
      Alert.alert('Error', 'El mínimo de jugadores por equipo no puede ser mayor al máximo');
      return;
    }

    // Validación de puntos según el tipo de finalización
    if (formData.endingType === 'win') {
      if (formData.pointsToWin === formData.startingPoints) {
        Alert.alert('Error', 'Los puntos para ganar no pueden ser iguales a los puntos iniciales');
        return;
      }
    }

    if (formData.endingType === 'lose') {
      if (formData.pointsToLose === formData.startingPoints) {
        Alert.alert('Error', 'Los puntos para perder no pueden ser iguales a los puntos iniciales');
        return;
      }
    }

    setIsLoading(true);
    try {
      const gameData: CreateGameRequest = {
        name: formData.name.trim(),
        number_of_players: formData.numberOfPlayers,
        has_teams: formData.hasTeams,
        min_team_length: formData.hasTeams ? formData.minTeamLength : 0,
        max_team_length: formData.hasTeams ? formData.maxTeamLength : 0,
        has_turns: formData.showTimer,
        turn_duration: formData.showTimer ? formData.defaultTimerDuration : 0,
        round_duration: formData.showTimer ? formData.defaultTimerDuration : 0,
        rounds: formData.rounds,
        starting_points: formData.startingPoints,
        finishing_points: formData.endingType === 'win'
          ? formData.pointsToWin
          : formData.endingType === 'lose'
          ? formData.pointsToLose
          : formData.startingPoints, // Si es por rondas, no importa el finishing_points
        is_winning: formData.endingType === 'win', // true si es 'win', false si es 'lose' o 'end_rounds'
        rules: formData.rules.trim() || undefined,
        description: formData.description.trim() || undefined,
        icon: formData.selectedIcon,
        color: formData.selectedColor,
        bg_color: formData.selectedBgColor,
      };

      console.log('📤 Creating game with data:', gameData);
      const response = await apiService.createGame(gameData);

      if (response.success) {
        Alert.alert(
          'Juego Creado',
          `${formData.name} ha sido creado exitosamente`,
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      } else {
        console.error('❌ Error creating game:', response.error);

        // El error puede ser un objeto con estructura { message, fields, code }
        let errorMessage = 'Error al crear el juego';

        if (response.error) {
          if (typeof response.error === 'string') {
            errorMessage = response.error;
          } else if (typeof response.error === 'object') {
            // Extraer el mensaje del objeto de error
            errorMessage = (typeof response.error === 'object' && response.error !== null && 'message' in response.error)
              ? (response.error as { message?: string }).message || 'Error al crear el juego'
              : 'Error al crear el juego';

            // Si hay errores de campos específicos, agregarlos
            if (
              typeof response.error === 'object' &&
              response.error !== null &&
              'fields' in response.error &&
              typeof (response.error as any).fields === 'object'
            ) {
              const fieldErrors = Object.values((response.error as any).fields).flat();
              if (fieldErrors.length > 0) {
                errorMessage = fieldErrors.join('\n');
              }
            }
          }
        }

        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('💥 Exception creating game:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : 'Error desconocido';

      Alert.alert(
        'Error de Conexión',
        `No se pudo conectar al servidor. Verifica tu conexión a internet.\n\nDetalle: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Crear Juego"
          subtitle="Personaliza tu juego"
          rightIcon={<Sparkle size={24} color="#3b82f6" weight="fill" />}
        />

        {/* Nombre */}
        <InputField
          label="Nombre del Juego"
          placeholder="Ej: UNO, Monopoly, Truco..."
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
          required
        />

        {/* Selector de Icono */}
        <SettingItem
          icon={getIconComponent(formData.selectedIcon)}
          iconColor={formData.selectedColor}
          iconBgColor={formData.selectedBgColor}
          label="Icono y Color"
          description="Toca para elegir"
          type="navigation"
          onPress={() => setShowIconModal(true)}
        />

        {/* Descripción - OPCIONAL */}
        <InputField
          label="Descripción"
          placeholder="Describe las características especiales... (opcional)"
          value={formData.description}
          onChangeText={(text) => updateFormData('description', text)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Reglas */}
        <InputField
          label="Reglas del Juego"
          placeholder="Escribe las reglas del juego aquí..."
          value={formData.rules}
          onChangeText={(text) => updateFormData('rules', text)}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          required
        />

        {/* Equipos o Individual */}
        <SettingItem
          icon={Users}
          iconColor="#8b5cf6"
          iconBgColor="#ede9fe"
          label="Juego por Equipos"
          description={formData.hasTeams ? 'Los jugadores juegan en equipos' : 'Cada jugador juega individualmente'}
          type="toggle"
          value={formData.hasTeams}
          onValueChange={(val) => updateFormData('hasTeams', val)}
        />

        {/* Si es por equipos */}
        {formData.hasTeams && (
          <>
            <SettingItem
              icon={Users}
              iconColor="#6b7280"
              iconBgColor="#f3f4f6"
              label="Jugadores mínimos por equipo"
              type="counter"
              value={formData.minTeamLength}
              onValueChange={(val) => updateFormData('minTeamLength', val)}
              counterMin={1}
              counterMax={10}
            />
            
            <SettingItem
              icon={Users}
              iconColor="#6b7280"
              iconBgColor="#f3f4f6"
              label="Jugadores máximos por equipo"
              type="counter"
              value={formData.maxTeamLength}
              onValueChange={(val) => updateFormData('maxTeamLength', val)}
              counterMin={formData.minTeamLength}
              counterMax={20}
            />
          </>
        )}

        {/* Cantidad de jugadores */}
        <SettingItem
          icon={Users}
          iconColor="#6b7280"
          iconBgColor="#f3f4f6"
          label={formData.hasTeams ? 'Número de equipos' : 'Número de jugadores'}
          type="counter"
          value={formData.numberOfPlayers}
          onValueChange={(val) => updateFormData('numberOfPlayers', val)}
          counterMin={2}
          counterMax={20}
        />

        {/* Número de Rondas */}
        <SettingItem
          icon={Trophy}
          iconColor="#f59e0b"
          iconBgColor="#fef3c7"
          label="Número de Rondas"
          description="Si no quieres rondas, dejá 1"
          type="counter"
          value={formData.rounds}
          onValueChange={(val) => updateFormData('rounds', val)}
          counterMin={1}
          counterMax={50}
        />

        {/* Puntos Iniciales */}
        <SettingItem
          icon={Target}
          iconColor="#10b981"
          iconBgColor="#d1fae5"
          label="Puntos Iniciales"
          description="Puntos con los que arranca cada jugador"
          type="counter"
          value={formData.startingPoints}
          onValueChange={(val) => updateFormData('startingPoints', val)}
          counterMin={-100}
          counterMax={1000}
          counterStep={5}
        />

        {/* Mostrar Timer */}
        <SettingItem
          icon={Clock}
          iconColor="#3b82f6"
          iconBgColor="#dbeafe"
          label="Mostrar Timer"
          description={formData.showTimer ? 'Se mostrará un timer durante el juego' : 'Sin timer visible'}
          type="toggle"
          value={formData.showTimer}
          onValueChange={(val) => updateFormData('showTimer', val)}
        />

        {/* Tiempo Predeterminado del Timer */}
        {formData.showTimer && (
          <SettingItem
            icon={Clock}
            iconColor="#3b82f6"
            iconBgColor="#dbeafe"
            label="Tiempo Predeterminado (segundos)"
            description="Duración del timer"
            type="counter"
            value={formData.defaultTimerDuration}
            onValueChange={(val) => updateFormData('defaultTimerDuration', val)}
            counterMin={5}
            counterMax={600}
            counterStep={5}
          />
        )}

        {/* Termina por */}
        <SettingItem
          icon={Flag}
          iconColor="#ef4444"
          iconBgColor="#fee2e2"
          label="El Juego Termina por"
          description={
            formData.endingType === 'end_rounds'
              ? 'Rondas completadas'
              : formData.endingType === 'win'
              ? 'Alcanzar puntos para ganar'
              : 'Bajar a puntos para perder'
          }
          type="segmented"
          value={formData.endingType}
          onValueChange={(val) => updateFormData('endingType', val)}
          segmentedOptions={[
            { label: 'Rondas', value: 'end_rounds' },
            { label: 'Win', value: 'win' },
            { label: 'Lose', value: 'lose' },
          ]}
        />

        {/* Puntos para Ganar - solo si endingType === 'win' */}
        {formData.endingType === 'win' && (
          <SettingItem
            icon={Crosshair}
            iconColor="#10b981"
            iconBgColor="#d1fae5"
            label="Puntos para Ganar"
            description="Alcanzar estos puntos para ganar"
            type="counter"
            value={formData.pointsToWin}
            onValueChange={(val) => updateFormData('pointsToWin', val)}
            counterMin={-10000}
            counterMax={10000}
            counterStep={5}
          />
        )}

        {/* Puntos para Perder - solo si endingType === 'lose' */}
        {formData.endingType === 'lose' && (
          <SettingItem
            icon={Skull}
            iconColor="#ef4444"
            iconBgColor="#fee2e2"
            label="Puntos para Perder"
            description="Llegar a estos puntos para perder"
            type="counter"
            value={formData.pointsToLose}
            onValueChange={(val) => updateFormData('pointsToLose', val)}
            counterMin={-10000}
            counterMax={10000}
            counterStep={5}
          />
        )}

        <Button
          title={isLoading ? "Creando..." : "Crear Juego"}
          onPress={handleCreateGame}
          disabled={isLoading}
          className="mb-8 mt-4"
        />
      </ScrollView>

      {/* Modal de selección de icono */}
      <IconSelectorModal
        visible={showIconModal}
        onClose={() => setShowIconModal(false)}
        onSelect={handleIconSelect}
        currentIcon={formData.selectedIcon}
        currentColor={formData.selectedColor}
      />
    </SafeAreaView>
  );
};