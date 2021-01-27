import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Button,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import axios from "../config/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import NumberFormat from "react-number-format";

export default function EditStudent({ route }) {
  const navigate = useNavigation();
  const { profile } = route.params;
  const [slide, setSlide] = useState({
    value: 0,
    count: 0,
  });
  console.log(slide.value.toFixed(), "<<<< sliderr");

  const currency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  const [newProfile, setNewProfile] = useState({
    name: "",
    address: "",
    telpon_number: "",
  });

  useEffect(() => {
    setNewProfile({
      name: profile.name,
      address: profile.address,
      telpon_number: profile.telpon_number,
    });
  }, []);

  const getAccessToken = async () => {
    try {
      const access = await AsyncStorage.getItem("access_token");
      const id = await AsyncStorage.getItem("id");

      axios({
        url: `/students/edit/${id}`,
        method: "PUT",
        headers: {
          access_token: access,
        },
        data: newProfile,
      })
        .then(async ({ data }) => {
          try {
            console.log(data);
            await AsyncStorage.removeItem("name");
            await AsyncStorage.setItem("name", data.name);
            Alert.alert(`Edit Success`);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (inputValue, inputName) => {
    let value = inputValue;
    const name = inputName;
    setNewProfile({ ...newProfile, [name]: value });
  };

  return (
    <>
      <View style={styles.top}></View>
      <View
        style={{
          flex: 0.2,
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "3%",
        }}
      >
        <TouchableHighlight
          onPress={(e) => {
            navigate.push("BottomNav");
          }}
          style={{ marginTop: Constants.statusBarHeight, left: "7%" }}
        >
          <Text style={styles.text1}>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={{ marginTop: Constants.statusBarHeight, right: "2%" }}
          onPress={(e) => {
            getAccessToken();
            navigate.push("BottomNav");
          }}
        >
          <Text style={styles.text1}>Save</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.container}>
        <View style={{ alignItems: "flex-start", alignSelf: "center" }}>
          <Image
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
            style={styles.profileImg}
          />
        </View>
      </View>
      <View style={{ marginHorizontal: "5%", top: '2%' }}>
        <Text style={styles.text}>Your Name</Text>
        <TextInput
          value={newProfile.name}
          onChangeText={(value) => handleChange(value, "name")}
          style={styles.input}
        ></TextInput>
        <Text style={styles.text}>Your Address</Text>
        <TextInput
          value={newProfile.address}
          onChangeText={(value) => handleChange(value, "address")}
          style={styles.input}
        ></TextInput>
        <Text style={styles.text}>Your Phone Number</Text>
        <TextInput
          value={newProfile.telpon_number}
          onChangeText={(value) => handleChange(value, "telpon_number")}
          style={styles.input}
        ></TextInput>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  top: {
    width: "100%",
    height: "35%",
    backgroundColor: "#008bb5",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    position: "absolute",
  },
  container: {
    flex: 0.3,
    justifyContent: "flex-start",
    top: "-2%",
    // backgroundColor: "red",
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
  button: {
    alignItems: "center",
    marginBottom: "2%",
    padding: 10,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    borderRadius: 30,
    width: "30%",
  },
  title: {
    marginTop: "10%",
    marginBottom: "5%",
    marginLeft: "5%",
    textAlign: "left",
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    marginTop: Constants.statusBarHeight,
    marginRight: "3%",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#008bb5",
    // backgroundColor: 'red'
  },
  text1: {
    fontSize: 22,
    fontWeight: "bold",
    color: "floralwhite",
    // backgroundColor: 'red'
  },
  text2: {
    fontSize: 18,
    fontWeight: "300",
    color: "#008bb5",
    marginBottom: "5%",
    marginTop: "3%",
  },
  input: {
    marginTop: "3%",
    marginBottom: "5%",
  },
});
