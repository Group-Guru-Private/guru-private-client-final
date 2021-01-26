import { StatusBar } from 'expo-status-bar';
import React from 'react';
import BottomNav from './components/BottomNav';
import BottomNavTeacher from './components/BottomNavTeacher';
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import OrderPage from './pages/OrderPage'
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'
import OngoingOrderPage from './pages/OngoingOrderPage'

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {



  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Landing" options={{headerTransparent: true, title: null}} component={LandingPage} />
          <Stack.Screen name="Register" options={{headerTransparent: true, title: null}} component={RegisterPage} />
          <Stack.Screen name="Login" options={{headerTransparent: true, title: null}} component={LoginPage} />
          <Stack.Screen name="Order"  options={{headerTransparent: true, title: null}}  component={OrderPage} />
          <Stack.Screen name="OngoingOrder" component={OngoingOrderPage} />
          <Stack.Screen name="BottomNav" options={{headerTransparent: true, title: null}} component={BottomNav}/>
          <Stack.Screen name="BottomNavTeacher" options={{headerTransparent: true, title: null}} component={BottomNavTeacher}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}