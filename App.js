import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import MainScreen from './screens/MainScreen';
import CourseListScreen from './screens/CourseListScreen';
import SettingsScreen from './screens/SettingsScreen';
import CameraScreen from './screens/CameraScreen';
import { Ionicons } from '@expo/vector-icons';

// MainScreen과 CameraScreen을 Stack으로 묶음
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainScreen} 
        options={{ headerShown: false }} // 상단 헤더 숨김
      />
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ headerShown: true, title: 'Camera' }} // CameraScreen에 헤더 표시
      />
    </Stack.Navigator>
  );
}

function MyTab() {
  return (
    <Tab.Navigator initialRouteName="Home"
    screenOptions={{
      tabBarLabelPosition: 'beside-icon', // 라벨 위치 변경
      tabBarShowLabel: false
    }}>
      <Tab.Screen name="Course List" component={CourseListScreen} options={{
        tabBarLabel: "My Profile", // 탭 라벨 변경
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="Home" component={MainStack} options={{
        tabBarLabel: "Main", // 탭 라벨 변경
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