// src/components/game/GameHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CaretLeft, DotsThree } from 'phosphor-react-native';

interface GameHeaderProps {
  gameName: string;
  onBack: () => void;
  onMenu?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  gameName,
  onBack,
  onMenu,
}) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#000',
    }}>
      <TouchableOpacity
        onPress={onBack}
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CaretLeft size={28} color="#fff" weight="bold" />
      </TouchableOpacity>

      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
      }}>
        {gameName}
      </Text>

      <TouchableOpacity
        onPress={onMenu}
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DotsThree size={28} color="#fff" weight="bold" />
      </TouchableOpacity>
    </View>
  );
};