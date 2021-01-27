import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import CheckBox from "@react-native-community/checkbox";
import axios from "../config/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigation();
  const [isSelected, setSelection] = useState(false);

  function handleLogin() {
    if (isSelected) {
      axios
        .post("/teachers/login", {
          email: email,
          password: password,
        })
        .then(async ({ data }) => {
          console.log(data);
          try {
            console.log(data);
            await AsyncStorage.setItem("access_token", data.access_token);
            await AsyncStorage.setItem("id", data.id.toString());
            await AsyncStorage.setItem("name", data.name);
            navigate.replace("BottomNavTeacher");
          } catch (err) {
            // saving error
            console.log(err);
          }
        })
        .catch((err) => {
          console.log(err);
          Alert.alert("Invalid Email or Password");
        });
    } else {
      axios
        .post("/students/login", {
          email: email,
          password: password,
        })
        .then(async ({ data }) => {
          try {
            await AsyncStorage.setItem("access_token", data.access_token);
            await AsyncStorage.setItem("id", data.id.toString());
            await AsyncStorage.setItem("name", data.name);
            navigate.replace("BottomNav");
          } catch (err) {
            // saving error
            console.log(err);
          }
        })
        .catch((err) => {
          console.log(err);
          Alert.alert("Invalid Email or Password");
        });
    }
  }

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#008bb5", "#48bcae"]}
      style={{ height: "100%" }}
    >
      <View style={styles.top}></View>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: "8%",
            color: "floralwhite",
          }}
        >
          Login
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          placeholderTextColor="grey"
          textAlign="left"
          fontSize={16}
          value={email}
        />
        <TextInput
          style={styles.input1}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="grey"
          textAlign="left"
          fontSize={16}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            marginTop: "4%",
            left: "13%",
          }}
        >
          <CheckBox
            value={isSelected}
            onValueChange={(newValue) => setSelection(newValue)}
          />
          <Text style={{ padding: "1%", color: "floralwhite" }}>
            I'm a teacher
          </Text>
        </View>
      </View>
      <View style={styles.containerbot}>
        <TouchableHighlight style={styles.button} onPress={handleLogin}>
          <AntDesign name="login" size={26} color="#008bb5"></AntDesign>
        </TouchableHighlight>
      </View>
      <View>
        <TouchableOpacity onPress={() => navigate.replace("Register")}>
          <Text
            style={{
              textAlign: "center",
              marginBottom: "3%",
              color: "#008bb5",
            }}
          >
            Dont have an account? Register here
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    top: "6%",
  },
  containerbot: {
    flex: 0.7,
    alignItems: "center",
  },
  input: {
    height: "13%",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "floralwhite",
    elevation: 14,
    paddingLeft: "5%",
    shadowOpacity: 0.5,
    shadowRadius: 7,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  input1: {
    marginTop: "4%",
    height: "13%",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "floralwhite",
    elevation: 14,
    paddingLeft: "5%",
    shadowOpacity: 0.5,
    shadowRadius: 7,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "floralwhite",
    width: "80%",
    width: 75,
    height: 75,
    marginTop: "5%",
    borderRadius: 150 / 2,
    elevation: 2,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  top: {
    width: "100%",
    height: "45%",
    top: "65%",
    backgroundColor: "rgba(232,232,232, 1)",
    borderTopRightRadius: 250,
    borderTopLeftRadius: 250,
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
