import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";

export default function OngoingOrderPage({ navigation, route }) {
  const { teacher, subject, orderId } = route.params;
  const navigate = useNavigation();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const goChat = async () => {
    const userId = await AsyncStorage.getItem("id");
    const username = await AsyncStorage.getItem("name");
    navigate.push("Chat", {
      roomId: orderId,
      userId: `student${userId}`,
      name: username,
    });
  };

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#008bb5", "#48bcae"]}
      style={{ height: "100%" }}
    >
      <View style={styles.top}></View>
      <View style={styles.container}>
        <Image
          source={{
            uri:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          }}
          style={styles.profileImg}
        />
        <View
          style={{
            marginTop: "4%",
            alignItems: "center",
            // backgroundColor: "green",
          }}
        >
          <Text style={styles.title}>{teacher.name}</Text>
          <Text style={styles.subtitle}>{teacher.email}</Text>
        </View>

        <View>{/* <Text>{teacher.background}</Text> */}</View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <View style={styles.div}>
          <MaterialIcons name="place" size={48} color="#008bb5"></MaterialIcons>
          <Text style={styles.text}>12 km</Text>
        </View>
        <View style={styles.div}>
          <Entypo name="book" size={48} color="#008bb5"></Entypo>
          <Text style={styles.text}>{subject}</Text>
        </View>
        <View style={styles.div}>
          <MaterialCommunityIcons
            name="star"
            size={48}
            color="#008bb5"
          ></MaterialCommunityIcons>
          <Text style={styles.text}>{teacher.rating}</Text>
        </View>
      </View>
      <View style={styles.containerbot}>
        <TouchableHighlight style={styles.button1} onPress={goChat}>
          <Text style={styles.textBtn1}>Chat</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={(e) => {
            navigate.push("Payment", { orderId: orderId });
          }}
        >
          <Text style={styles.textBtn}>Payment</Text>
        </TouchableHighlight>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: '3%'
    // backgroundColor: 'red'
  },
  image: {
    flex: 1,
    resizeMode: "repeat",
    justifyContent: "center",
    alignItems: "center",
  },
  containerbot: {
    flex: 0.9,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    paddingBottom: "10%",
    // backgroundColor: 'orange',
    // alignContent: 'center',
  },
  button: {
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#008bb5",
    borderRadius: 30,
    width: "40%",
    height: "13%",
    justifyContent: "center",
  },
  button1: {
    alignItems: "center",
    backgroundColor: "#008bb5",
    borderRadius: 30,
    width: "40%",
    height: "13%",
    justifyContent: "center",
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  profileImg: {
    width: 130,
    height: 130,
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
  input: {
    height: "10%",
    width: "50%",
    borderColor: "gray",
    borderWidth: 1,
    textAlign: "center",
    backgroundColor: "white",
    margin: 10,
  },
  top: {
    width: "100%",
    height: "65%",
    top: "38%",
    backgroundColor: "rgba(232,232,232, 1)",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    position: "absolute",
  },
  title: {
    color: "floralwhite",
    fontWeight: "bold",
    fontSize: 28,
  },
  subtitle: {
    color: "floralwhite",
    fontWeight: "normal",
    fontSize: 16,
  },
  text: {
    color: "#008bb5",
    fontSize: 16,
    fontWeight: "bold",
  },
  div: {
    alignItems: "center",
    // marginLeft: "5%",
    // backgroundColor: "red",
  },
  textBtn: {
    color: "#008bb5",
    fontSize: 16,
    fontWeight: "bold",
    // backgroundColor: 'red'
  },
  textBtn1: {
    color: "floralwhite",
    fontSize: 16,
    fontWeight: "bold",
    // backgroundColor: 'red'
  },
});
