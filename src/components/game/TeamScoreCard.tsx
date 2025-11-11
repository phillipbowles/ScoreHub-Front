// src/components/game/TeamScoreCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { Minus, Plus, Pencil, Users } from 'phosphor-react-native';

interface Player {
  id: string;
  name: string;
}

interface TeamScoreCardProps {
  teamName: string;
  players: Player[];
  score: number;
  color: string;
  onScoreChange: (newScore: number) => void;
  isCompact?: boolean;
}

export const TeamScoreCard: React.FC<TeamScoreCardProps> = ({
  teamName,
  players,
  score,
  color,
  onScoreChange,
  isCompact = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempScore, setTempScore] = useState(score.toString());

  const handleIncrement = () => {
    onScoreChange(score + 1);
  };

  const handleDecrement = () => {
    onScoreChange(score - 1);
  };

  const handleScoreSave = () => {
    const newScore = parseInt(tempScore) || 0;
    onScoreChange(newScore);
    setShowModal(false);
  };

  const cardHeight = isCompact ? 100 : 140;
  const scoreSize = isCompact ? 40 : 56;

  return (
    <>
      <View style={{
        backgroundColor: color,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        minHeight: cardHeight,
      }}>
        {/* Header con nombre del equipo y editar */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Users size={20} color="#000" weight="bold" />
              <Text style={{
                fontSize: isCompact ? 18 : 22,
                fontWeight: 'bold',
                color: '#000',
              }}>
                {teamName}
              </Text>
            </View>
            {/* Nombres de jugadores del equipo */}
            <Text style={{
              fontSize: 12,
              color: 'rgba(0, 0, 0, 0.7)',
              marginTop: 2,
            }}>
              {players.map(p => p.name).join(', ')}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => {
              setTempScore(score.toString());
              setShowModal(true);
            }}
          >
            <Pencil size={20} color="#000" weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Score y botones */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,
        }}>
          <TouchableOpacity
            onPress={handleDecrement}
            style={{
              width: isCompact ? 44 : 52,
              height: isCompact ? 44 : 52,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Minus size={isCompact ? 28 : 32} color="#000" weight="bold" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setTempScore(score.toString());
              setShowModal(true);
            }}
          >
            <Text style={{
              fontSize: scoreSize,
              fontWeight: 'bold',
              color: '#000',
            }}>
              {score}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleIncrement}
            style={{
              width: isCompact ? 44 : 52,
              height: isCompact ? 44 : 52,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={isCompact ? 28 : 32} color="#000" weight="bold" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para editar puntaje */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowModal(false)}
        >
          <Pressable
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              width: '80%',
              maxWidth: 300,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Editar Puntaje - {teamName}
            </Text>

            <TextInput
              value={tempScore}
              onChangeText={setTempScore}
              keyboardType="numeric"
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#000',
                textAlign: 'center',
                borderBottomWidth: 2,
                borderBottomColor: color,
                marginBottom: 24,
                padding: 8,
              }}
              selectTextOnFocus
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: 14,
                  backgroundColor: '#e5e7eb',
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleScoreSave}
                style={{
                  flex: 1,
                  padding: 14,
                  backgroundColor: color,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#000',
                }}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};