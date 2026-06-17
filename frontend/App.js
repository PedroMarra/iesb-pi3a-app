// App.js
import React from 'react';
import { StatusBar, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from './src/constants/colors';

// Telas
import Home from './src/screens/Home';
import Forum from './src/screens/Forum';
import NewPost from './src/screens/NewPost';
import PostDetails from './src/screens/PostDetails';
import Profile from './src/screens/Profile';
import Schedules from './src/screens/Schedules';
import Grades from './src/screens/Grades';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Opções padrão de header para todos os Stacks
const defaultHeaderOptions = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: COLORS.secondary,
  headerTitleStyle: { fontWeight: 'bold' }, // string numérica, não 'bold'
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="HomeMain" component={Home} options={{ title: 'HelpIesb' }} />
      <Stack.Screen name="Schedules" component={Schedules} options={{ title: 'Meus Horários' }} />
      <Stack.Screen name="Grades" component={Grades} options={{ title: 'Notas & Calculadora' }} />
    </Stack.Navigator>
  );
}

function ForumStack() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="ForumFeed" component={Forum} options={{ title: 'Fórum' }} />
      <Stack.Screen name="PostDetails" component={PostDetails} options={{ title: 'Publicação' }} />
    </Stack.Navigator>
  );
}

function NewPostStack() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="NewPostMain" component={NewPost} options={{ title: 'Nova Publicação' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={defaultHeaderOptions}>
      <Stack.Screen name="ProfileMain" component={Profile} options={{ title: 'Meu Perfil' }} />
    </Stack.Navigator>
  );
}

const TAB_ICONS = {
  Home: '🏠',
  Forum: '💬',
  NewPost: '➕',
  Portal: '🎓',
  Profile: '👤',
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.card,
            borderTopColor: COLORS.border,
            height: 62,
            paddingBottom: 8,
            paddingTop: 4,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.subtitle,
          tabBarLabelStyle: { fontWeight: 'bold', fontSize: 10 },
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>
              {TAB_ICONS[route.name]}
            </Text>
          ),
        })}
      >
        <Tab.Screen name="Home"    component={HomeStack}    options={{ title: 'Início' }} />
        <Tab.Screen name="Forum"   component={ForumStack}   options={{ title: 'Fórum' }} />
        <Tab.Screen name="NewPost" component={NewPostStack} options={{ title: 'Postar' }} />
        <Tab.Screen
          name="Portal"
          component={HomeStack}
          options={{ title: 'Portal' }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              const { Alert } = require('react-native');
              Alert.alert('Portal do Aluno', 'Esta integração estará disponível em breve.');
            },
          })}
        />
        <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Perfil' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
