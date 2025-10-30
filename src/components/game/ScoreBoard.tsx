// src/components/game/ScoreBoard.tsx
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { PlayerScoreCard } from './PlayerScoreCard';
import { TeamScoreCard } from './TeamScoreCard';
import { CheckCircle, ArrowRight, CaretLeft, CaretRight } from 'phosphor-react-native';

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

interface ScoreBoardProps {
  mode: 'individual' | 'teams';
  players?: Player[];
  teams?: Team[];
  onScoreChange: (id: string, newScore: number) => void;
  onEndRound?: () => void;
  onEndGame?: () => void;
  hasRounds: boolean;
  currentRound: number;
  totalRounds: number;
  onPreviousRound?: () => void;
  onNextRound?: () => void;
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

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  mode,
  players = [],
  teams = [],
  onScoreChange,
  onEndRound,
  onEndGame,
  hasRounds,
  currentRound,
  totalRounds,
  onPreviousRound,
  onNextRound,
}) => {
  const isLastRound = hasRounds && currentRound >= totalRounds;
  const itemCount = mode === 'teams' ? teams.length : players.length;

  // Hacer las cards más compactas cuando hay más de 4 jugadores
  const isCompact = itemCount > 4;

  // Calcular si podemos navegar entre rondas
  const canGoBack = hasRounds && currentRound > 1;
  const canGoForward = hasRounds && currentRound < totalRounds;

  // Si totalRounds es 1, siempre mostrar "Terminar Partida"
  const isSingleRoundGame = totalRounds === 1;

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1d2e' }}>
      {/* Indicador de ronda si aplica con navegación */}
      {hasRounds && (
        <View style={{
          backgroundColor: '#252938',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#2d3248',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Botón Anterior */}
          <TouchableOpacity
            onPress={onPreviousRound}
            disabled={!canGoBack}
            style={{
              padding: 8,
              opacity: canGoBack ? 1 : 0.3,
            }}
          >
            <CaretLeft size={24} color="#fff" weight="bold" />
          </TouchableOpacity>

          {/* Texto de ronda */}
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#fff',
            textAlign: 'center',
            marginHorizontal: 16,
            minWidth: 120,
          }}>
            Ronda {currentRound} de {totalRounds}
          </Text>

          {/* Botón Siguiente */}
          <TouchableOpacity
            onPress={onNextRound}
            disabled={!canGoForward}
            style={{
              padding: 8,
              opacity: canGoForward ? 1 : 0.3,
            }}
          >
            <CaretRight size={24} color="#fff" weight="bold" />
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de jugadores o equipos */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {mode === 'individual' && players.map((player, index) => (
          <PlayerScoreCard
            key={player.id}
            playerName={player.name}
            score={player.score}
            color={player.color || PLAYER_COLORS[index % PLAYER_COLORS.length]}
            onScoreChange={(newScore) => onScoreChange(player.id, newScore)}
            isCompact={isCompact}
          />
        ))}

        {mode === 'teams' && teams.map((team, index) => (
          <TeamScoreCard
            key={team.id}
            teamName={team.name}
            players={team.players}
            score={team.score}
            color={team.color || PLAYER_COLORS[index % PLAYER_COLORS.length]}
            onScoreChange={(newScore) => onScoreChange(team.id, newScore)}
            isCompact={isCompact}
          />
        ))}
      </ScrollView>

      {/* Botón flotante de terminar ronda/partida */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#1a1d2e',
        borderTopWidth: 1,
        borderTopColor: '#2d3248',
      }}>
        <TouchableOpacity
          onPress={isSingleRoundGame || isLastRound ? onEndGame : onEndRound}
          style={{
            backgroundColor: isSingleRoundGame || isLastRound ? '#ef4444' : '#10b981',
            paddingVertical: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isSingleRoundGame || isLastRound ? (
            <CheckCircle size={24} color="#fff" weight="bold" />
          ) : (
            <ArrowRight size={24} color="#fff" weight="bold" />
          )}
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
          }}>
            {isSingleRoundGame || isLastRound ? 'Terminar Partida' : 'Terminar Ronda'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};