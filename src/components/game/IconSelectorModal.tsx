import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Dimensions,
  useWindowDimensions
} from 'react-native';
import {
  CardsThree,
  DiceFive,
  Trophy,
  Football,
  Target,
  GameController,
  Crown,
  Rocket,
  Fire,
  Lightning,
  Star,
  Heart,
  Diamond,
  Club,
  Spade,
  Sword,
  Shield,
  Flag,
  Medal,
  Gift,
  Pizza,
  Coffee,
  Martini,
  Wine,
  BeerStein,
  Cake,
  Cookie,
  IceCream,
  Hamburger,
  Popcorn,
  Basketball,
  Baseball,
  Volleyball,
  TennisBall,
  Bicycle,
  Boat,
  Airplane,
  Car,
  Train,
  Bus,
  Compass,
  MapTrifold,
  Globe,
  Mountains,
  Island,
  Tree,
  Leaf,
  FlowerLotus,
  Sun,
  Moon,
  Cloud,
  X
} from 'phosphor-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (iconName: string, color: string, bgColor: string) => void;
  currentIcon: string;
  currentColor: string;
}

interface ColorPalette {
  main: string;
  bg: string;
  name: string;
}

const gameIcons = [
  { icon: CardsThree, name: 'CardsThree', label: 'Cartas' },
  { icon: DiceFive, name: 'DiceFive', label: 'Dados' },
  { icon: Trophy, name: 'Trophy', label: 'Copa' },
  { icon: Football, name: 'Football', label: 'Fútbol' },
  { icon: Target, name: 'Target', label: 'Diana' },
  { icon: GameController, name: 'GameController', label: 'Gaming' },
  { icon: Crown, name: 'Crown', label: 'Corona' },
  { icon: Rocket, name: 'Rocket', label: 'Cohete' },
  { icon: Fire, name: 'Fire', label: 'Fuego' },
  { icon: Lightning, name: 'Lightning', label: 'Rayo' },
  { icon: Star, name: 'Star', label: 'Estrella' },
  { icon: Heart, name: 'Heart', label: 'Corazón' },
  { icon: Diamond, name: 'Diamond', label: 'Diamante' },
  { icon: Club, name: 'Club', label: 'Trébol' },
  { icon: Spade, name: 'Spade', label: 'Pica' },
  { icon: Sword, name: 'Sword', label: 'Espada' },
  { icon: Shield, name: 'Shield', label: 'Escudo' },
  { icon: Flag, name: 'Flag', label: 'Bandera' },
  { icon: Medal, name: 'Medal', label: 'Medalla' },
  { icon: Gift, name: 'Gift', label: 'Regalo' },
  { icon: Pizza, name: 'Pizza', label: 'Pizza' },
  { icon: Coffee, name: 'Coffee', label: 'Café' },
  { icon: Martini, name: 'Martini', label: 'Martini' },
  { icon: Wine, name: 'Wine', label: 'Vino' },
  { icon: BeerStein, name: 'BeerStein', label: 'Cerveza' },
  { icon: Cake, name: 'Cake', label: 'Torta' },
  { icon: Cookie, name: 'Cookie', label: 'Galleta' },
  { icon: IceCream, name: 'IceCream', label: 'Helado' },
  { icon: Hamburger, name: 'Hamburger', label: 'Hamburguesa' },
  { icon: Popcorn, name: 'Popcorn', label: 'Pochoclo' },
  { icon: Basketball, name: 'Basketball', label: 'Basket' },
  { icon: Baseball, name: 'Baseball', label: 'Béisbol' },
  { icon: Volleyball, name: 'Volleyball', label: 'Vóley' },
  { icon: TennisBall, name: 'TennisBall', label: 'Tenis' },
  { icon: Bicycle, name: 'Bicycle', label: 'Bici' },
  { icon: Boat, name: 'Boat', label: 'Barco' },
  { icon: Airplane, name: 'Airplane', label: 'Avión' },
  { icon: Car, name: 'Car', label: 'Auto' },
  { icon: Train, name: 'Train', label: 'Tren' },
  { icon: Bus, name: 'Bus', label: 'Bus' },
  { icon: Compass, name: 'Compass', label: 'Brújula' },
  { icon: MapTrifold, name: 'MapTrifold', label: 'Mapa' },
  { icon: Globe, name: 'Globe', label: 'Globo' },
  { icon: Mountains, name: 'Mountains', label: 'Montañas' },
  { icon: Island, name: 'Island', label: 'Isla' },
  { icon: Tree, name: 'Tree', label: 'Árbol' },
  { icon: Leaf, name: 'Leaf', label: 'Hoja' },
  { icon: FlowerLotus, name: 'FlowerLotus', label: 'Flor' },
  { icon: Sun, name: 'Sun', label: 'Sol' },
  { icon: Moon, name: 'Moon', label: 'Luna' },
  { icon: Cloud, name: 'Cloud', label: 'Nube' },
];

const colorPalettes: ColorPalette[] = [
  { main: '#3b82f6', bg: '#dbeafe', name: 'Azul' },
  { main: '#10b981', bg: '#d1fae5', name: 'Verde' },
  { main: '#f59e0b', bg: '#fef3c7', name: 'Amarillo' },
  { main: '#ef4444', bg: '#fee2e2', name: 'Rojo' },
  { main: '#8b5cf6', bg: '#ede9fe', name: 'Violeta' },
  { main: '#ec4899', bg: '#fce7f3', name: 'Rosa' },
  { main: '#06b6d4', bg: '#cffafe', name: 'Cyan' },
  { main: '#f97316', bg: '#ffedd5', name: 'Naranja' },
  { main: '#14b8a6', bg: '#ccfbf1', name: 'Turquesa' },
  { main: '#a855f7', bg: '#f3e8ff', name: 'Púrpura' },
  { main: '#84cc16', bg: '#ecfccb', name: 'Lima' },
  { main: '#f43f5e', bg: '#ffe4e6', name: 'Coral' },
];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const IconSelectorModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
  currentIcon,
  currentColor,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);
  const [selectedColor, setSelectedColor] = useState(
    colorPalettes.find(c => c.main === currentColor) || colorPalettes[0]
  );

  // Cálculo automático para colores (6 por fila)
  const COLOR_ITEMS_PER_ROW = 6;
  const COLOR_PADDING = 24;
  const COLOR_SPACING = 8;
  const colorItemSize = (windowWidth - (COLOR_PADDING * 2) - (COLOR_SPACING * (COLOR_ITEMS_PER_ROW - 1))) / COLOR_ITEMS_PER_ROW;

  // Cálculo automático para iconos (5 por fila)
  const ICON_ITEMS_PER_ROW = 5;
  const ICON_PADDING = 24;
  const ICON_SPACING = 8;
  const iconItemSize = (windowWidth - (ICON_PADDING * 2) - (ICON_SPACING * (ICON_ITEMS_PER_ROW - 1))) / ICON_ITEMS_PER_ROW;

  const handleConfirm = () => {
    onSelect(selectedIcon, selectedColor.main, selectedColor.bg);
  };

  const currentIconData = gameIcons.find(i => i.name === selectedIcon);
  const CurrentIconComponent = currentIconData?.icon || Trophy;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        <View style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: SCREEN_HEIGHT * 0.85,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#111827',
            }}>
              Elegir Icono y Color
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Preview FIJO */}
          <View style={{
            alignItems: 'center',
            paddingVertical: 24,
            backgroundColor: '#f9fafb',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
              backgroundColor: selectedColor.bg,
            }}>
              <CurrentIconComponent
                size={40}
                color={selectedColor.main}
                weight="fill"
              />
            </View>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#111827',
            }}>
              {currentIconData?.label || 'Copa'}
            </Text>
            <Text style={{
              fontSize: 13,
              color: '#6b7280',
            }}>
              Color: {selectedColor.name}
            </Text>
          </View>

          {/* ScrollView con colores e iconos */}
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Color Selector */}
            <View style={{ paddingHorizontal: COLOR_PADDING, paddingTop: 20, paddingBottom: 12 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 12,
              }}>
                Color
              </Text>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
                {colorPalettes.map((color, index) => (
                  <Pressable
                    key={color.main}
                    onPress={() => setSelectedColor(color)}
                    style={{ 
                      width: colorItemSize,
                      height: colorItemSize,
                      marginRight: (index + 1) % COLOR_ITEMS_PER_ROW === 0 ? 0 : COLOR_SPACING,
                      marginBottom: COLOR_SPACING,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: color.bg,
                      borderColor: selectedColor.main === color.main ? '#000' : '#e5e7eb',
                      borderWidth: selectedColor.main === color.main ? 2 : 1,
                    }}>
                      <View style={{
                        width: colorItemSize * 0.45,
                        height: colorItemSize * 0.45,
                        borderRadius: colorItemSize * 0.225,
                        backgroundColor: color.main,
                      }} />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Icon Grid */}
            <View style={{ paddingHorizontal: ICON_PADDING, paddingVertical: 12 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 12,
              }}>
                Icono
              </Text>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
                {gameIcons.map((item, index) => {
                  const IconComponent = item.icon;
                  const isSelected = selectedIcon === item.name;
                  
                  return (
                    <Pressable
                      key={item.name}
                      onPress={() => setSelectedIcon(item.name)}
                      style={{
                        width: iconItemSize,
                        height: iconItemSize,
                        marginRight: (index + 1) % ICON_ITEMS_PER_ROW === 0 ? 0 : ICON_SPACING,
                        marginBottom: ICON_SPACING,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <View style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? selectedColor.bg : '#f9fafb',
                        borderColor: isSelected ? '#000' : '#e5e7eb',
                        borderWidth: isSelected ? 2 : 1,
                      }}>
                        <IconComponent
                          size={iconItemSize * 0.5}
                          color={isSelected ? selectedColor.main : '#6b7280'}
                          weight={isSelected ? 'fill' : 'regular'}
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}>
            <TouchableOpacity
              onPress={handleConfirm}
              style={{
                backgroundColor: '#3b82f6',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 16,
              }}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};