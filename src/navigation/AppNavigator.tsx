import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { House, GameController, ChartBar, User } from 'phosphor-react-native';
import { RootStackParamList } from '../types';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Main Screens (Bottom Tabs)
import { HomeScreen } from '../screens/HomeScreen';
import { SelectGameTypeScreen } from '../screens/match/SelectGameTypeScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// Game Flow Screens
import { CreateGameScreen } from '../screens/createGame/CreateGameScreen';
import { GameListScreen } from '../screens/match/GameListScreen';
import { MatchConfigScreen } from '../screens/match/MatchConfigScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator para las pantallas principales
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1c1c1e',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f2f2f7',
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 85 : 70,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent;
          
          switch (route.name) {
            case 'HomeTab':
              IconComponent = House;
              break;
            case 'GamesTab':
              IconComponent = GameController;
              break;
            case 'StatsTab':
              IconComponent = ChartBar;
              break;
            case 'ProfileTab':
              IconComponent = User;
              break;
            default:
              IconComponent = House;
          }

          return (
            <IconComponent 
              size={size} 
              color={color} 
              weight={focused ? 'fill' : 'regular'} 
            />
          );
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="GamesTab" 
        component={SelectGameTypeScreen}
        options={{
          tabBarLabel: 'Juegos',
        }}
      />
      <Tab.Screen 
        name="StatsTab" 
        component={StatsScreen}
        options={{
          tabBarLabel: 'Estadísticas',
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator principal
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'white' },
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{
            animationTypeForReplace: 'push',
          }}
        />

        {/* Main App (Bottom Tabs) */}
        <Stack.Screen 
          name="Home" 
          component={MainTabs}
          options={{
            gestureEnabled: false,
          }}
        />

        {/* Game Flow Screens (New Flow) */}
        <Stack.Screen
          name="CreateGame"
          component={CreateGameScreen}
        />
        <Stack.Screen
          name="SelectGameType"
          component={SelectGameTypeScreen}
        />
        <Stack.Screen
          name="GameList"
          component={GameListScreen}
        />
        <Stack.Screen
          name="MatchConfig"
          component={MatchConfigScreen}
        />
        <Stack.Screen
          name="Game"
          component={HomeScreen} // Temporalmente hasta crear GameScreen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};