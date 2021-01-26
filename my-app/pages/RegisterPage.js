import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Touchable,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityIndicator } from "react-native";
import axios from "../config/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import SelectMultiple from "react-native-select-multiple";

export default function RegisterPage() {
  const subjects = [
    "Mathematics",
    "English",
    "Chemisty",
    "Physics",
    "Biology",
    "Bahasa Indonesia",
    "History",
    "Geography",
    "Sociology",
    "Economics",
  ];
  const initPosition = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const navigation = useNavigation();
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "student",
    background: "",
    selectedSubject: "",
  });
  const [selectedSubject, setSelectedSubject] = useState([]);

  const [position, setPosition] = useState(initPosition);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (currentPosition) => {
        // alert(JSON.stringify(currentPosition))
        const { latitude, longitude } = currentPosition.coords;
        setPosition({
          ...position,
          latitude,
          longitude,
        });
      },
      (error) => alert(error.message),
      { timeout: 5000, maximumAge: 1000 }
    );
  }, []);

  function onSelectionsChange(subject) {
    setSelectedSubject(subject);
    const newSubject = subject.map((sub) => {
      return sub.value;
    });

    setInputData({
      ...inputData,
      selectedSubject: newSubject,
    });
  }

  function handleInputChange(text, inputName) {
    const name = inputName;
    let value = text;

    setInputData({
      ...inputData,
      [name]: value,
    });
  }

  const register = () => {
    if (inputData.role === "student") {
      const payload = {
        name: inputData.name,
        email: inputData.email,
        password: inputData.password,
        role: "student",
        address: inputData.address,
        telpon_number: inputData.phone,
        position: [position.latitude, position.longitude],
      };
      axios
        .post("/students/register", payload)
        .then(({ data }) => {
          navigation.navigate("Login");
        })
        .catch((err) => {
          if (err)
            alert(err.response.data.message.split(",").map((msg) => msg));
        });
    } else {
      console.log("masuk");
      const payload = {
        name: inputData.name,
        email: inputData.email,
        password: inputData.password,
        role: "teacher",
        address: inputData.address,
        telpon_number: inputData.phone,
        position: [position.latitude, position.longitude],
        subjects: inputData.selectedSubject,
        background: inputData.background,
        price: 0,
        image_url:
          "https://www.abadikini.com/media/files/2019/09/IMG_20190908_191823-390x220.jpg",
      };
      axios
        .post("/teachers/register", payload)
        .then(({ data }) => {
          navigation.navigate("Login");
        })
        .catch((err) => {
          if (err)
            alert(err.response.data.message.split(",").map((msg) => msg));
        });
    }
  };
  // if (position.latitude !== null) {
  if (inputData.role === "teacher") {
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
              marginBottom: "5%",
              marginTop: "3%",
              color: "floralwhite",
            }}
          >
            Register
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              handleInputChange(text, "name");
            }}
            placeholder="Name"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.name}
          />
          <TextInput
            style={styles.input1}
            onChangeText={(text) => {
              handleInputChange(text, "email");
            }}
            placeholder="Email"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.email}
          />
          <TextInput
            style={styles.input1}
            onChangeText={(text) => {
              handleInputChange(text, "password");
            }}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.password}
          />
          <TextInput
            style={styles.input1}
            onChangeText={(text) => {
              handleInputChange(text, "phone");
            }}
            placeholder="Phone Number"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.phone}
          />
          <TextInput
            style={styles.input1}
            onChangeText={(text) => {
              handleInputChange(text, "address");
            }}
            placeholder="Address"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.address}
          />
          <View style={styles.input1}>
            <Picker
              selectedValue={inputData.role}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                handleInputChange(itemValue, "role");
              }}
            >
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Teacher" value="teacher" />
            </Picker>
          </View>
          <TextInput
            style={styles.input1}
            onChangeText={(text) => {
              handleInputChange(text, "background");
            }}
            placeholder="Background"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.background}
          />
          <ScrollView>
            <View style={styles.input2}>
              <SelectMultiple
                style={{ height: 100, width: 300 }}
                items={subjects}
                selectedItems={selectedSubject}
                onSelectionsChange={(e) => {
                  onSelectionsChange(e);
                }}
              />
            </View>
          </ScrollView>

          <TouchableHighlight
            style={[styles.button, styles.test]}
            onPress={register}
          >
            <Text>Register</Text>
          </TouchableHighlight>
        </View>
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        // Background Linear Gradient
        colors={["#008bb5", "#48bcae"]}
        style={{ height: "100%" }}
      >
        {/* <MapView 
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                showsUserLocation
                initialRegion={position}
              /> */}
        <View style={styles.top}></View>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              marginBottom: "5%",
              marginTop: "3%",
              color: "floralwhite",
            }}
          >
            Register
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              handleInputChange(text, "name");
            }}
            placeholder="Name"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.name}
          />
          <TextInput
            style={styles.input1}
            onChangeText={(text) => {
              handleInputChange(text, "email");
            }}
            placeholder="Email"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.email}
          />
          <TextInput
            style={styles.input1}
            onChangeText={(text) => {
              handleInputChange(text, "password");
            }}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.password}
          />
          <TextInput
            style={styles.input1}
            onChangeText={(text) => {
              handleInputChange(text, "phone");
            }}
            placeholder="Phone Number"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.phone}
          />
          <TextInput
            style={styles.input1}
            onChangeText={(text) => {
              handleInputChange(text, "address");
            }}
            placeholder="Address"
            placeholderTextColor="grey"
            textAlign="left"
            fontSize={16}
            value={inputData.address}
          />
          <View style={styles.input1}>
            <Picker
              selectedValue={inputData.role}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                handleInputChange(itemValue, "role");
              }}
            >
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Teacher" value="teacher" />
            </Picker>
          </View>
          <TouchableHighlight style={styles.button} onPress={register}>
            <Text style={{ color: "floralwhite" }}>Register</Text>
          </TouchableHighlight>
        </View>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text
            style={{
              textAlign: "center",
              marginBottom: "3%",
              color: "#008bb5",
            }}
          >
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
  // } else <ActivityIndicator style={{ flex: 1 }} animating size="large" />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    top: "4%",
  },
  input: {
    // top: '10%',
    height: "7.5%",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "floralwhite",
    elevation: 14,
    paddingLeft: "5%",
  },
  input1: {
    marginTop: "4%",
    height: "7.5%",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "floralwhite",
    elevation: 14,
    paddingLeft: "5%",
  },
  input2: {
    marginTop: "4%",
    height: "20%",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "floralwhite",
    elevation: 14,
    paddingLeft: "5%",
  },
  button: {
    alignItems: "center",
    marginBottom: "2%",
    marginTop: "12%",
    padding: 10,
    borderRadius: 30,
    width: "50%",
    backgroundColor: "rgba(232,232,232, 1)",
    elevation: 14,
  },
  top: {
    width: "100%",
    height: "15%",
    top: "85%",
    backgroundColor: "rgba(232,232,232, 1)",
    borderTopRightRadius: 250,
    borderTopLeftRadius: 250,
    position: "absolute",
  },
  picker: {
    height: "100%",
    width: "100%",
    textAlign: "left",
    left: "-2%",
    color: "grey",
  },
});
