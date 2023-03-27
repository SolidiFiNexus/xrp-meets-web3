import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {HomeScreen} from "./src/screens/home.screen";
import {WebViewScreen} from "./src/screens/webview.screen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = route.name === 'Home' ? "home" : "globe";
            if (focused) {iconName += '-outline';}
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Webview" component={WebViewScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
