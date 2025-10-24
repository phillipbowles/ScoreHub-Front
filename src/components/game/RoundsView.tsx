// src/components/game/RoundsView.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ArrowsClockwise, Users as UsersIcon } from 'phosphor-react-native';

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

interface RoundsViewProps {
  mode: 'individual' | 'teams';
  players?: Player[];
  teams?: Team[];
  rounds: RoundScore[];
  currentRound: number;
  totalRounds: number;
}

export const RoundsView: React.FC<RoundsViewProps> = ({
  mode,
  players = [],
  teams = [],
  rounds,
  currentRound,
  totalRounds,
}) => {
  const items = mode === 'teams' ? teams : players;
  const cellWidth = Math.max(80, (100 / (items.length + 1)));

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1d2e' }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View style={{ paddingVertical: 16 }}>
          {/* Header con icono de shuffle y nombres */}
          <View style={{
            flexDirection: 'row',
            borderBottomWidth: 2,
            borderBottomColor: '#2d3248',
            paddingBottom: 8,
            marginBottom: 8,
          }}>
            {/* Columna de rondas */}
            <View style={{
              width: 70,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
            }}>
              <ArrowsClockwise size={24} color="#3b82f6" weight="bold" />
            </View>

            {/* Columnas de jugadores/equipos */}
            {items.map((item) => (
              <View
                key={item.id}
                style={{
                  width: cellWidth + 20,
                  alignItems: 'center',
                  paddingHorizontal: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: item.color,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    minWidth: 80,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  {mode === 'teams' && (
                    <UsersIcon size={14} color="#000" weight="bold" />
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#000',
                      textAlign: 'center',
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Fila de totales */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: '#252938',
            borderRadius: 8,
            marginHorizontal: 8,
            marginBottom: 12,
            paddingVertical: 12,
          }}>
            <View style={{
              width: 70,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#9ca3af',
              }}>
                Total
              </Text>
            </View>

            {items.map((item) => (
              <View
                key={item.id}
                style={{
                  width: cellWidth + 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                  {item.score}
                </Text>
              </View>
            ))}
          </View>

          {/* Filas de rondas */}
          <ScrollView
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={false}
          >
            {rounds.map((round, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  marginHorizontal: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#2d3248',
                  backgroundColor: index === currentRound - 1 ? '#252938' : 'transparent',
                  borderRadius: index === currentRound - 1 ? 8 : 0,
                }}
              >
                <View style={{
                  width: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#6b7280',
                  }}>
                    #{index + 1}
                  </Text>
                </View>

                {items.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      width: cellWidth + 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '500',
                      color: '#e5e7eb',
                    }}>
                      {round[item.id] || 0}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Rondas futuras vacías - solo mostrar hasta totalRounds */}
            {Array.from({ length: Math.max(0, totalRounds - rounds.length) }).map((_, index) => (
              <View
                key={`future-${index}`}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  marginHorizontal: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#2d3248',
                }}
              >
                <View style={{
                  width: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#4b5563',
                  }}>
                    #{rounds.length + index + 1}
                  </Text>
                </View>

                {items.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      width: cellWidth + 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '500',
                      color: '#4b5563',
                    }}>
                      -
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};