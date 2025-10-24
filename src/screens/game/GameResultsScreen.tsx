// src/screens/game/GameResultsScreen.tsx
import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Trophy, Crown, Trash, FloppyDisk, CheckCircle } from 'phosphor-react-native';
import { RootStackParamList } from '../../types';

type GameResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameResults'>;
type GameResultsScreenRouteProp = RouteProp<RootStackParamList, 'GameResults'>;

interface Props {
  navigation: GameResultsScreenNavigationProp;
  route: GameResultsScreenRouteProp;
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

export const GameResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mode, players, teams, rounds, isWinning, hasRounds, gameName } = route.params;
  const [isSaving, setIsSaving] = useState(false);

  // Obtener la lista de jugadores o equipos
  const items = mode === 'teams' ? teams || [] : players || [];

  // Ordenar según tipo de juego:
  // - Si es por rondas (hasRounds = true): El que más puntos tiene gana (orden descendente)
  // - Si es por puntos y isWinning = true: El que más puntos tiene gana (orden descendente)
  // - Si es por puntos y isWinning = false: El que menos puntos tiene gana (orden ascendente)
  const sortedItems = [...items].sort((a, b) => {
    if (hasRounds) {
      // Para juegos por rondas, siempre gana el que tiene más puntos
      return b.score - a.score; // Mayor a menor
    } else if (isWinning) {
      return b.score - a.score; // Mayor a menor
    } else {
      return a.score - b.score; // Menor a mayor
    }
  });

  // Detectar empates: verificar si hay múltiples jugadores/equipos con el mismo puntaje más alto
  const hasTie = sortedItems.length > 1 && sortedItems[0].score === sortedItems[1].score;

  // Obtener todos los que están empatados en primer lugar
  const tiedWinners = hasTie
    ? sortedItems.filter(item => item.score === sortedItems[0].score)
    : [];

  const handleDeleteMatch = () => {
    Alert.alert(
      'Borrar Partida',
      '¿Estás seguro que quieres borrar esta partida? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar lógica de borrado
            Alert.alert('Partida Borrada', 'La partida ha sido borrada exitosamente', [
              { text: 'OK', onPress: () => navigation.navigate('Home') }
            ]);
          }
        }
      ]
    );
  };

  const handleSaveMatch = async () => {
    Alert.alert(
      'Guardar Partida',
      '¿Deseas guardar esta partida en tu historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: async () => {
            setIsSaving(true);
            try {
              // TODO: Implementar lógica de guardado en el backend
              // await apiService.saveMatch({ ... })

              setTimeout(() => {
                setIsSaving(false);
                Alert.alert(
                  'Partida Guardada',
                  'La partida ha sido guardada exitosamente en tu historial',
                  [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
                );
              }, 1000);
            } catch (error) {
              setIsSaving(false);
              Alert.alert('Error', 'No se pudo guardar la partida. Intenta de nuevo.');
            }
          }
        }
      ]
    );
  };

  const getRankColor = (index: number) => {
    if (index === 0) return '#FFD700'; // Oro
    if (index === 1) return '#C0C0C0'; // Plata
    if (index === 2) return '#CD7F32'; // Bronce
    return '#6b7280';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown size={32} color="#FFD700" weight="fill" />;
    return <Trophy size={32} color={getRankColor(index)} weight="fill" />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#1e293b',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#334155',
        alignItems: 'center',
      }}>
        <Trophy size={48} color="#10b981" weight="fill" />
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#fff',
          marginTop: 12,
        }}>
          Resultados Finales
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#94a3b8',
          marginTop: 4,
        }}>
          {gameName}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Podio - Top 3 */}
        {sortedItems.length > 0 && (
          <View style={{
            backgroundColor: '#1e293b',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              {hasTie ? '🤝 Empate' : isWinning ? '🏆 Ganador' : '🎯 Resultado'}
            </Text>

            {/* Si hay empate, mostrar todos los empatados */}
            {hasTie ? (
              <View>
                <Text style={{
                  fontSize: 16,
                  color: '#94a3b8',
                  marginBottom: 12,
                  textAlign: 'center',
                }}>
                  {tiedWinners.length} {mode === 'teams' ? 'equipos empatados' : 'jugadores empatados'} con {sortedItems[0].score} puntos
                </Text>
                {tiedWinners.map((item, index) => (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: '#0f172a',
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 8,
                      borderWidth: 3,
                      borderColor: '#f59e0b',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Trophy size={32} color="#f59e0b" weight="fill" />
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: '#fff',
                        }}>
                          {item.name}
                        </Text>
                        {mode === 'teams' && (item as Team).players && (
                          <Text style={{
                            fontSize: 14,
                            color: '#94a3b8',
                            marginTop: 2,
                          }}>
                            {(item as Team).players.map(p => p.name).join(', ')}
                          </Text>
                        )}
                      </View>
                      <View style={{
                        backgroundColor: item.color || '#10b981',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}>
                        <Text style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: '#000',
                        }}>
                          {item.score}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              /* Primer lugar destacado (sin empate) */
              <View style={{
                backgroundColor: '#0f172a',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 3,
                borderColor: '#FFD700',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Crown size={40} color="#FFD700" weight="fill" />
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: '#fff',
                    }}>
                      {sortedItems[0].name}
                    </Text>
                    <Text style={{
                      fontSize: 18,
                      color: '#94a3b8',
                      marginTop: 4,
                    }}>
                      {isWinning ? 'Ganador' : 'Resultado Final'}
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: sortedItems[0].color || '#10b981',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}>
                    <Text style={{
                      fontSize: 28,
                      fontWeight: 'bold',
                      color: '#000',
                    }}>
                      {sortedItems[0].score}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Resto de posiciones */}
        <View style={{
          backgroundColor: '#1e293b',
          borderRadius: 16,
          padding: 16,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 12,
          }}>
            Clasificación Completa
          </Text>

          {sortedItems.map((item, index) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#0f172a',
                borderRadius: 12,
                padding: 12,
                marginBottom: 8,
                gap: 12,
              }}
            >
              {/* Posición */}
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#334155',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: index < 3 ? '#000' : '#fff',
                }}>
                  {index + 1}
                </Text>
              </View>

              {/* Nombre */}
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#fff',
                }}>
                  {item.name}
                </Text>
                {mode === 'teams' && (item as Team).players && (
                  <Text style={{
                    fontSize: 14,
                    color: '#94a3b8',
                    marginTop: 2,
                  }}>
                    {(item as Team).players.map(p => p.name).join(', ')}
                  </Text>
                )}
              </View>

              {/* Score */}
              <View style={{
                backgroundColor: item.color || '#10b981',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                minWidth: 60,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#000',
                }}>
                  {item.score}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Estadísticas de rondas si aplica */}
        {rounds.length > 0 && (
          <View style={{
            backgroundColor: '#1e293b',
            borderRadius: 16,
            padding: 16,
            marginTop: 20,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: 8,
            }}>
              Estadísticas
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#94a3b8',
            }}>
              Total de rondas jugadas: {rounds.length}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Botones de acción */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1e293b',
        padding: 16,
        borderTopWidth: 2,
        borderTopColor: '#334155',
      }}>
        {/* Botón Guardar */}
        <TouchableOpacity
          onPress={handleSaveMatch}
          disabled={isSaving}
          style={{
            backgroundColor: '#10b981',
            paddingVertical: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          {isSaving ? (
            <CheckCircle size={24} color="#fff" weight="fill" />
          ) : (
            <FloppyDisk size={24} color="#fff" weight="fill" />
          )}
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
          }}>
            {isSaving ? 'Guardando...' : 'Guardar Partida'}
          </Text>
        </TouchableOpacity>

        {/* Botón Borrar */}
        <TouchableOpacity
          onPress={handleDeleteMatch}
          style={{
            backgroundColor: '#ef4444',
            paddingVertical: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Trash size={24} color="#fff" weight="fill" />
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
          }}>
            Borrar Partida
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
