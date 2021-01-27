import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeTeacherPage from "../pages/HomeTeacherPage";
import TeacherProfilePage from '../pages/TeacherProfilePage'
import { useFonts } from "expo-font";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function BottomNavTeacher() {
  const Tab = createMaterialBottomTabNavigator();

  const [loaded] = useFonts({
    Roboto: require('native-base/Fonts/Roboto.ttf'),
    Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
  })

  if(!loaded) return null

  return (
      <Tab.Navigator activeColor={'aqua'}>
        <Tab.Screen
          name="Home"
          component={HomeTeacherPage}
          options={{
            tabBarLabel: " ",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileTeacher"
          component={TeacherProfilePage}
          options={{
            tabBarLabel: " ",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}
