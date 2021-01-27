import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Touchable,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as logo from "../assets/drawable-xxxhdpi/logo.png";

export default function LandingPage() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#008bb5", "#48bcae"]}
      style={{ height: "100%" }}
    >
      <View style={styles.top}></View>
      <View style={styles.container}>
        {/* <Text style={{ fontSize: 40, fontWeight: 'bold' ,color: 'floralwhite' }}>Ruang Private</Text> */}
        <Image
          source={require("../assets/drawable-xxxhdpi/logo.png")}
          style={{ height: 250, width: 280 }}
        ></Image>
      </View>
      <View style={styles.containerbot}>
        <TouchableHighlight
          style={styles.button}
          onPress={(e) => {
            navigation.replace("Login");
          }}
        >
          <Text style={styles.text}>SIGN IN</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button1}
          onPress={(e) => {
            navigation.push("Register");
          }}
        >
          <Text style={styles.text1}>SIGN UP</Text>
        </TouchableHighlight>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'red'
  },
  // image: {
  //   flex: 1,
  //   resizeMode: "repeat",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  containerbot: {
    top: '5%',
    flex: 0.4,
    alignItems: "center",
  },
  button: {
    top: "10%",
    height: "22%",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "floralwhite",
    elevation: 14,
    // borderWidth: 4,
    // borderColor: "floralwhite",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: -4,
    },
  },
  button1: {
    marginTop: "10%",
    height: "22%",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: '#008bb5',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  text: {
    color: "#008bb5",
    fontSize: 16,
    fontWeight: "bold",
  },
  text1: {
    color: "#008bb5",
    fontSize: 16,
    fontWeight: "bold",
  },
  top: {
    width: "100%",
    height: "20%",
    top: "80%",
    backgroundColor: "rgba(232,232,232, 1)",
    borderTopRightRadius: 180,
    borderTopLeftRadius: 180,
    position: "absolute",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: -4,
    },
  },
});
