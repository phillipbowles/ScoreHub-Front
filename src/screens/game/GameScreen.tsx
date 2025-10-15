// src/screens/game/GameScreen.tsx
import React, { useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { User, Users, Trophy, Clock } from 'phosphor-react-native';
import { RootStackParamList } from '../../types';
import { GameHeader } from '../../components/game/GameHeader';
import { ScoreBoard } from '../../components/game/ScoreBoard';
import { RoundsView } from '../../components/game/RoundsView';
import { TimerView } from '../../components/game/TimerView';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface Props {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

interface Team {
  id: string;
  name: string;
  players: Player[];
  score: number;
  color: string;
}

interface RoundScore {
  [id: string]: number;
}

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

export const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  // Obtener configuración del juego desde route.params
  const gameConfig = route.params?.gameConfig || {
    name: 'Truco',
    hasTeams: false,
    hasRounds: true,
    totalRounds: 5,
    hasTimer: false,
    timerDuration: 120,
  };

  const [activeTab, setActiveTab] = useState<'score' | 'rounds' | 'timer'>('score');
  const [currentRound, setCurrentRound] = useState(1);
  
  // Estado para modo INDIVIDUAL
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Alice', score: 21, color: PLAYER_COLORS[0] },
    { id: '2', name: 'Bob', score: 18, color: PLAYER_COLORS[1] },
    { id: '3', name: 'Charlie', score: 15, color: PLAYER_COLORS[2] },
    { id: '4', name: 'Diana', score: 12, color: PLAYER_COLORS[3] },
  ]);

  // Estado para modo EQUIPOS
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 't1',
      name: 'Equipo Rojo',
      players: [
        { id: '1', name: 'Alice', score: 0, color: '' },
        { id: '2', name: 'Bob', score: 0, color: '' },
      ],
      score: 21,
      color: PLAYER_COLORS[0],
    },
    {
      id: 't2',
      name: 'Equipo Azul',
      players: [
        { id: '3', name: 'Charlie', score: 0, color: '' },
        { id: '4', name: 'Diana', score: 0, color: '' },
      ],
      score: 18,
      color: PLAYER_COLORS[1],
    },
  ]);

  // Estado de rondas (guardar puntajes por ronda)
  const [rounds, setRounds] = useState<RoundScore[]>([
    gameConfig.hasTeams 
      ? { 't1': 10, 't2': 8 }
      : { '1': 5, '2': 5, '3': 5, '4': 5 },
    gameConfig.hasTeams
      ? { 't1': 11, 't2': 10 }
      : { '1': 7, '2': 4, '3': 6, '4': 3 },
  ]);

  const handleScoreChange = (id: string, newScore: number) => {
    if (gameConfig.hasTeams) {
      setTeams(prev =>
        prev.map(team =>
          team.id === id ? { ...team, score: newScore } : team
        )
      );
    } else {
      setPlayers(prev =>
        prev.map(player =>
          player.id === id ? { ...player, score: newScore } : player
        )
      );
    }
  };

  const handleEndRound = () => {
    // Guardar puntos de la ronda actual
    const roundScores: RoundScore = {};
    
    if (gameConfig.hasTeams) {
      teams.forEach(team => {
        roundScores[team.id] = team.score;
      });
    } else {
      players.forEach(player => {
        roundScores[player.id] = player.score;
      });
    }
    
    setRounds(prev => [...prev, roundScores]);
    setCurrentRound(prev => prev + 1);

    // Podríamos resetear los scores aquí si el juego lo requiere
    // if (gameConfig.hasTeams) {
    //   setTeams(prev => prev.map(t => ({ ...t, score: 0 })));
    // } else {
    //   setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    // }
  };

//   const handleEndGame = () => {
//     // Navegar a pantalla de resultados o mostrar ganador
//     navigation.navigate('GameResults', {
//       mode: gameConfig.hasTeams ? 'teams' : 'individual',
//       players: gameConfig.hasTeams ? undefined : players,
//       teams: gameConfig.hasTeams ? teams : undefined,
//       rounds,
//     });
//   };

  const tabs = [
    { 
      id: 'score' as const, 
      icon: gameConfig.hasTeams ? Users : User, 
      label: 'Puntos',
      show: true 
    },
    { 
      id: 'rounds' as const, 
      icon: Trophy, 
      label: 'Rondas',
      show: gameConfig.hasRounds 
    },
    { 
      id: 'timer' as const, 
      icon: Clock, 
      label: 'Timer',
      show: gameConfig.hasTimer 
    },
  ].filter(tab => tab.show);

  const renderContent = () => {
    switch (activeTab) {
      case 'score':
        return (
          <ScoreBoard
            mode={gameConfig.hasTeams ? 'teams' : 'individual'}
            players={gameConfig.hasTeams ? undefined : players}
            teams={gameConfig.hasTeams ? teams : undefined}
            onScoreChange={handleScoreChange}
            onEndRound={handleEndRound}
            // onEndGame={handleEndGame}
            hasRounds={gameConfig.hasRounds}
            currentRound={currentRound}
            totalRounds={gameConfig.totalRounds}
          />
        );
      case 'rounds':
        return (
          <RoundsView
            mode={gameConfig.hasTeams ? 'teams' : 'individual'}
            players={gameConfig.hasTeams ? undefined : players}
            teams={gameConfig.hasTeams ? teams : undefined}
            rounds={rounds}
            currentRound={currentRound}
          />
        );
      case 'timer':
        return (
          <TimerView
            initialDuration={gameConfig.timerDuration}
            onTimerEnd={() => {
              // Acción cuando termina el timer
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <GameHeader
        gameName={gameConfig.name}
        onBack={() => navigation.goBack()}
        onMenu={() => {
          // Mostrar menú de opciones
        }}
      />

      {/* Tabs */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#1a1d2e',
        paddingTop: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#2d3248',
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 3,
                borderBottomColor: isActive ? '#10b981' : 'transparent',
              }}
            >
              <Icon 
                size={24} 
                color={isActive ? '#10b981' : '#6b7280'} 
                weight={isActive ? 'fill' : 'regular'}
              />
              <Text style={{
                fontSize: 12,
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#10b981' : '#6b7280',
                marginTop: 4,
              }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Contenido */}
      {renderContent()}
    </SafeAreaView>
  );
};