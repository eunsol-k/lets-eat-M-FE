import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import MainScreen from './screens/MainScreen';
import SearchScreen from './screens/SearchScreen';
import MedicineDetail from './screens/MedicineDetail';
import SettingsScreen from './screens/SettingsScreen';
import CameraScreen from './screens/CameraScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SetNicknameScreen from './screens/SetNicknameScreen'
import MypageScreen from './screens/MypageScreen';
import LikeListScreen from './screens/LikeListScreen';
import MapScreen from './screens/MapScreen';
import { Ionicons } from '@expo/vector-icons';

// Stack Navigator for Home flow
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
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ headerShown: true, title: 'Camera' }} // CameraScreen에 헤더 표시
      />
      <Stack.Screen 
        name="MapScreen" 
        component={MapScreen} 
        options={{ headerShown: true, title: 'Map' }} // MapScreen에 헤더 표시
      />
    </Stack.Navigator>
  );
};

// Stack Navigator for Mypage flow
const MypageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MypageScreen" 
        component={MypageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LikeListScreen" 
        component={LikeListScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

function MyTab() {
  const navigation = useNavigation();
  const [isLoginned, setIsLoginned] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', async () => {
      const token = await AsyncStorage.getItem('access_token');
      setIsLoginned(!!token);
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('access_token');
        setIsLoginned(!!token);
      };

      checkLoginStatus();
    }, [])
  );

  return (
    <Tab.Navigator initialRouteName="Home"
    screenOptions={{
      tabBarLabelPosition: 'beside-icon', // 라벨 위치 변경
      tabBarShowLabel: false
    }}>
      <Tab.Screen 
        name="Mypage" 
        component={MypageStack} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons 
              name="person" 
              size={size} 
              color={isLoginned ? color : '#999'} 
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity 
              {...props} 
              disabled={!isLoginned}
              style={[
                props.style, 
                !isLoginned && { opacity: 0.5 }
              ]}
              onPress={() => {
                if (isLoginned) {
                  props.onPress();
                }
              }}
            />
          )
        }} 
      />
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