// src/screens/game/GameScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Alert } from 'react-native';
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

export const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  // Obtener configuración del juego desde route.params
  const gameConfig = route.params?.gameConfig || {
    name: 'Juego',
    gameName: 'Juego',
    hasTeams: false,
    hasRounds: true,
    totalRounds: 5,
    hasTimer: false,
    timerDuration: 120,
    players: [],
    teams: [],
  };

  console.log('🎮 GameScreen received config:', gameConfig);

  const [activeTab, setActiveTab] = useState<'score' | 'rounds' | 'timer'>('score');
  const [currentRound, setCurrentRound] = useState(1);
  
  // Estado para modo INDIVIDUAL - usar datos reales o fallback
  const [players, setPlayers] = useState<Player[]>(
    gameConfig.players && gameConfig.players.length > 0
      ? gameConfig.players
      : [
          { id: '1', name: 'Jugador 1', score: 0, color: '#ff9999' },
          { id: '2', name: 'Jugador 2', score: 0, color: '#99ccff' },
        ]
  );

  // Estado para modo EQUIPOS - usar datos reales o fallback
  const [teams, setTeams] = useState<Team[]>(
    gameConfig.teams && gameConfig.teams.length > 0
      ? gameConfig.teams
      : [
          {
            id: 't1',
            name: 'Equipo 1',
            players: [
              { id: '1', name: 'Jugador 1', score: 0, color: '' },
              { id: '2', name: 'Jugador 2', score: 0, color: '' },
            ],
            score: 0,
            color: '#ef4444',
          },
          {
            id: 't2',
            name: 'Equipo 2',
            players: [
              { id: '3', name: 'Jugador 3', score: 0, color: '' },
              { id: '4', name: 'Jugador 4', score: 0, color: '' },
            ],
            score: 0,
            color: '#3b82f6',
          },
        ]
  );

  // Estado de rondas (guardar puntajes por ronda)
  const [rounds, setRounds] = useState<RoundScore[]>([]);

  const handleScoreChange = (id: string, newScore: number) => {
    if (gameConfig.hasTeams) {
      setTeams(prev => {
        const updated = prev.map(team =>
          team.id === id ? { ...team, score: newScore } : team
        );
        checkGameEnd(updated, true);
        return updated;
      });
    } else {
      setPlayers(prev => {
        const updated = prev.map(player =>
          player.id === id ? { ...player, score: newScore } : player
        );
        checkGameEnd(updated, false);
        return updated;
      });
    }
  };

  const checkGameEnd = (data: Player[] | Team[], isTeams: boolean) => {
    const { finishingPoints, isWinning, hasRounds } = gameConfig;

    // Solo verificar fin de juego por puntos si NO es un juego por rondas
    if (hasRounds) return;

    if (isWinning) {
      // Termina cuando alguien ALCANZA o SUPERA finishing_points y GANA
      const winner = data.find(item => item.score >= finishingPoints);
      if (winner) {
        setTimeout(() => {
          Alert.alert(
            '¡Partida Terminada!',
            `${winner.name} ha alcanzado ${finishingPoints} puntos y ganó la partida!`,
            [
              {
                text: 'Ver Resultados',
                onPress: () => handleEndGame(data, isTeams),
              },
            ],
            { cancelable: false }
          );
        }, 100);
      }
    } else {
      // Termina cuando alguien LLEGA o BAJA a finishing_points y PIERDE
      const loser = data.find(item => item.score <= finishingPoints);
      if (loser) {
        setTimeout(() => {
          Alert.alert(
            '¡Partida Terminada!',
            `${loser.name} ha llegado a ${finishingPoints} puntos y perdió la partida!`,
            [
              {
                text: 'Ver Resultados',
                onPress: () => handleEndGame(data, isTeams),
              },
            ],
            { cancelable: false }
          );
        }, 100);
      }
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

  const handlePreviousRound = () => {
    if (currentRound > 1) {
      setCurrentRound(prev => prev - 1);
      // Cargar los puntajes de la ronda anterior
      const previousRoundScores = rounds[currentRound - 2]; // -2 porque el array empieza en 0
      if (previousRoundScores) {
        if (gameConfig.hasTeams) {
          setTeams(prev => prev.map(team => ({
            ...team,
            score: previousRoundScores[team.id] || team.score
          })));
        } else {
          setPlayers(prev => prev.map(player => ({
            ...player,
            score: previousRoundScores[player.id] || player.score
          })));
        }
      }
    }
  };

  const handleNextRound = () => {
    if (currentRound < gameConfig.totalRounds) {
      // Si ya existe la siguiente ronda, cargarla
      const nextRoundScores = rounds[currentRound]; // currentRound porque el array empieza en 0
      if (nextRoundScores) {
        setCurrentRound(prev => prev + 1);
        if (gameConfig.hasTeams) {
          setTeams(prev => prev.map(team => ({
            ...team,
            score: nextRoundScores[team.id] || team.score
          })));
        } else {
          setPlayers(prev => prev.map(player => ({
            ...player,
            score: nextRoundScores[player.id] || player.score
          })));
        }
      } else {
        // Si no existe, es como terminar la ronda actual
        handleEndRound();
      }
    }
  };

  const handleEndGameButton = () => {
    Alert.alert(
      'Terminar Partida',
      '¿Estás seguro que quieres terminar la partida?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: () => handleEndGame(),
          style: 'destructive'
        }
      ]
    );
  };

  const handleEndGame = (finalData?: Player[] | Team[], isTeamsMode?: boolean) => {
    // Usar los datos pasados como parámetro o el estado actual
    const finalPlayers = finalData && !isTeamsMode ? finalData as Player[] : players;
    const finalTeams = finalData && isTeamsMode ? finalData as Team[] : teams;
    
    // Navegar a pantalla de resultados
    navigation.navigate('GameResults', {
      mode: gameConfig.hasTeams ? 'teams' : 'individual',
      players: gameConfig.hasTeams ? undefined : finalPlayers,
      teams: gameConfig.hasTeams ? finalTeams : undefined,
      rounds,
      isWinning: gameConfig.isWinning,
      hasRounds: gameConfig.hasRounds,
      gameName: gameConfig.gameName || gameConfig.name,
    });
  };

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
            onEndGame={handleEndGameButton}
            hasRounds={gameConfig.hasRounds}
            currentRound={currentRound}
            totalRounds={gameConfig.totalRounds}
            onPreviousRound={handlePreviousRound}
            onNextRound={handleNextRound}
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
            totalRounds={gameConfig.totalRounds}
          />
        );
      case 'timer':
        return (
          <TimerView
            initialDuration={gameConfig.timerDuration || 120}
            onTimerEnd={() => {
              // Acción cuando termina el timer
              handleEndRound();
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
        gameName={gameConfig.gameName || gameConfig.name}
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