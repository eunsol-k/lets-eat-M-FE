import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import MainScreen from './screens/MainScreen';
import SearchScreen from './screens/SearchScreen';
import MedicineDetail from './screens/MedicineDetail';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SetNicknameScreen from './screens/SetNicknameScreen'
import MypageScreen from './screens/MypageScreen';
import { Ionicons } from '@expo/vector-icons';

// Stack Navigator for Search flow
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainScreen" 
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SignUpScreen" 
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SetNicknameScreen" 
        component={SetNicknameScreen}
        options={{ headerShown: false }}
      />
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
  const [isLoginned, setIsLoginned] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const nickname = await AsyncStorage.getItem('nickname');
      setIsLoginned(!!nickname);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  return (
    <Tab.Navigator initialRouteName="Home"
    screenOptions={{
      tabBarLabelPosition: 'beside-icon', // 라벨 위치 변경
      tabBarShowLabel: false
    }}>
      <Tab.Screen name="Mypage" component={MypageScreen} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
        tabBarButton: (props) => (
          <TouchableOpacity 
            {...props} 
            disabled={!isLoginned}
            style={[
              props.style, 
              !isLoginned && { opacity: 0.5 }
            ]}
          />
        )
      }} />
      <Tab.Screen name="Home" component={MainStack} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        headerShown: false,
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