import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import MainScreen from './screens/MainScreen';
import SearchScreen from './screens/SearchScreen';
import MedicineDetail from './screens/MedicineDetail';
import SettingsScreen from './screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

// Stack Navigator for Search flow
const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SearchScreen" 
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MedicineDetail" 
        component={MedicineDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

function MyTab() {
  return (
    <Tab.Navigator initialRouteName="Home"
    screenOptions={{
      tabBarLabelPosition: 'beside-icon', // 라벨 위치 변경
      tabBarShowLabel: false
    }}>
      <Tab.Screen name="Search" component={SearchStack} options={{
        tabBarLabel: "My Profile", // 탭 라벨 변경
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="Home" component={MainScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarLabel: "My Profile", // 탭 라벨 변경
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings" size={size} color={color} />
        ),
      }} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  );
}