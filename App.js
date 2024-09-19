import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import ProfileScreen from './screens/ProfileScreen';
import CourseListScreen from './screens/CourseListScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        tabBarLabelPosition: 'beside-icon',
        tabBarShowLabel: false,
      }}>
        <Tab.Screen name="Course List" component={CourseListScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }} />
        <Tab.Screen name="Profile" component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }} />
        <Tab.Screen name="Settings" component={SettingsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}