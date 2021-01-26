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
import axios from "axios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

export default function OrderPage({ navigation, route }) {
  const { teacher } = route.params;
  const [subject, setSubject] = useState(teacher.subjects[0]);
  const listSubjects = ["Biology", "Mathematics", "English", "Programming"];
  const navigate = useNavigation();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const dataTeacher = {
    id: "123",
    name: "Sudirman",
    email: "sudirman@gmail.com",
    rating: 4.2,
    distance: 1.2,
    background: "Bachelor Degree of Computer Science at Hacktiv University",
    subject: "Biology",
    phone: "081212525252",
    date: new Date(),
    price: 170000,
    distancePrice: 30000,
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const submitOrder = async () => {
    try {
      const value = await AsyncStorage.getItem("access_token");
      if (value !== null) {
        axios({
          url: `http://192.168.1.3:3000/orders/${teacher.id}`,
          method: "POST",
          data: {
            subject: subject,
            date: date,
            distance: 20,
          },
          headers: {
            access_token: value,
          },
        })
          .then(({ data }) => {
            Alert.alert(`Order Success`);
            navigate.replace("BottomNav");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#008bb5", "#48bcae"]}
      style={{ height: "100%" }}
    >
      {/* <> */}
      <View style={styles.top}></View>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          {/* <View style={{ top: "-8%" }}> */}
          <Image
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
            style={styles.profileImg}
          />
          {/* </View> */}
          <View
            style={{
              alignItems: "flex-start",
              marginLeft: "5%",
              justifyContent: "center",
            }}
          >
            <Text style={styles.text1}>{teacher.name}</Text>
            <Text style={styles.text2}>{teacher.email}</Text>
            <View style={{ flexDirection: "row", marginTop: "5%" }}>
              <MaterialCommunityIcons name="map-marker" size={13} color="white">
                <Text style={styles.text3}>{teacher.address}</Text>
              </MaterialCommunityIcons>
              <MaterialCommunityIcons
                name="star"
                size={13}
                color="white"
                style={{ paddingLeft: "10%" }}
              >
                <Text style={styles.text3}>{teacher.rating}</Text>
              </MaterialCommunityIcons>
            </View>
          </View>
        </View>
        <View style={{ marginTop: "5%", marginLeft: "2%" }}>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons name="school" size={28} color="white" />
            <Text style={styles.text4}>{teacher.background}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: "2%" }}>
            <MaterialCommunityIcons name="phone" size={28} color="white" />
            <Text style={styles.text4}>{teacher.telpon_number}</Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#008bb5",
          marginLeft: "12%",
          // marginBottom: "3%",
          top: "-8%",
        }}
      >
        Subject
      </Text>
      <View style={styles.containerbot}>
        <View
          style={{
            borderRadius: 30,
            backgroundColor: "rgba(245,245,245,1)",
            width: "80%",
            height: "16%",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            elevation: 10,
            top: "-2%",
          }}
        >
          <Picker
            selectedValue={subject}
            style={styles.input1}
            onValueChange={(itemValue, itemIndex) => setSubject(itemValue)}
          >
            {teacher.subjects.map((mapel, index) => {
              return <Picker.Item key={index} label={mapel} value={mapel} />;
            })}
          </Picker>
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#008bb5",
            marginTop: "2%",
            right: "30%",
          }}
        >
          Date
        </Text>
        <TouchableHighlight style={styles.input} onPress={showDatepicker}>
          <Text style={{ color: "#008bb5" }}>{date.toLocaleDateString()}</Text>
        </TouchableHighlight>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#008bb5",
            marginBottom: "2%",
            right: "30%",
          }}
        >
          Total
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ left: "-300%", color: "#008bb5" }}>Course Price</Text>
          <Text style={{ left: "300%", color: "#008bb5" }}> Rp.{teacher.price}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ left: "-265%", color: "#008bb5" }}>
            Distance Price
          </Text>
        <Text style={{ left: "275%", color: "#008bb5" }}>Rp.{dataTeacher.distancePrice}</Text>
        </View>
        <Text style={{left: '27%', color: "#008bb5"}}>
          ---------------------- +
        </Text>
        <View style={{ flexDirection: "row", marginBottom: '5%' }}>
          <Text style={{ left: "-335%", color: "#008bb5" }}>
            Total Price
          </Text>
          <Text style={{ left: "335%", color: "#008bb5" }}>Rp.{teacher.price + dataTeacher.distancePrice}</Text>
        </View>
        <TouchableHighlight
          style={styles.button}
          onPress={(e) => {
            submitOrder();
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Order
          </Text>
        </TouchableHighlight>
      </View>
      {/* </> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    left: "7%",
    top: "-3%",
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
  image: {
    flex: 1,
    resizeMode: "repeat",
    justifyContent: "center",
    alignItems: "center",
  },
  containerbot: {
    flex: 1,
    alignItems: "center",
    top: "-5%",
  },
  button: {
    // marginTop: '28%',
    height: "16%",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#008bb5",
    elevation: 14,
  },
  profileImg: {
    width: 110,
    height: 110,
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
  input: {
    height: "16%",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "rgba(245,245,245,1)",
    marginBottom: "3%",
    marginTop: "3%",
    elevation: 10,
  },
  input1: {
    height: "100%",
    width: "100%",
    textAlign: "center",
    left: "33%",
    color: "#008bb5",
  },
  text1: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
  },
  text2: {
    color: "white",
    fontSize: 15,
    fontWeight: "100",
  },
  text3: {
    color: "white",
    fontSize: 13,
    fontWeight: "100",
  },
  text4: {
    color: "white",
    fontSize: 15,
    fontWeight: "400",
    marginLeft: "5%",
    top: "1%",
  },
});
