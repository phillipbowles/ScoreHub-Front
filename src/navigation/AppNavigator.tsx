import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateGameScreen } from '../screens/game/CreateGameScreen';
import { SelectGameTypeScreen } from '../screens/game/SelectGameTypeScreen';
import { AddPlayersScreen } from '../screens/game/AddPlayersScreen';
import { GameConfigScreen } from '../screens/game/GameConfigScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Ocultar headers por defecto para diseño más limpio
          cardStyle: { backgroundColor: 'white' },
        }}
      >
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
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            gestureEnabled: false, // Prevenir volver atrás con gesto
          }}
        />
        <Stack.Screen 
          name="CreateGame" 
          component={CreateGameScreen}
        />
        <Stack.Screen 
          name="SelectGameType" 
          component={SelectGameTypeScreen}
        />
        <Stack.Screen 
          name="AddPlayers" 
          component={AddPlayersScreen}
        />
        <Stack.Screen 
          name="GameConfig" 
          component={GameConfigScreen}
        />
        <Stack.Screen 
          name="Game" 
          component={HomeScreen} // Temporalmente hasta crear GameScreen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};