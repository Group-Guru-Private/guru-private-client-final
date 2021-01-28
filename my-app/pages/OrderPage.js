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
import axios from "../config/axiosInstance";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

export default function OrderPage({ navigation, route }) {
  const { teacher, distance } = route.params;
  const [subject, setSubject] = useState(teacher.subjects[0]);
  const listSubjectss = ["Biology", "Mathematics", "English", "Programming"];
  const navigate = useNavigation();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

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
      const total = teacher.price + countDistance(distance);
      if (value !== null) {
        axios({
          url: `/orders/${teacher.id}`,
          method: "POST",
          data: {
            subject: subject,
            date: date.toISOString().split("T")[0],
            distance: distance,
            total_price: total,
          },
          headers: {
            access_token: value,
          },
        })
          .then(({ data }) => {
            Alert.alert(`Order Success`);
            navigate.reset({
              index: 0,
              routes: [{ name: "BottomNav" }],
            });
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

  function countDistance(distanceParams) {
    if (distanceParams < 1) {
      return 5000;
    } else if (distanceParams >= 1 && distanceParams < 3) {
      return 10000;
    } else if (distanceParams >= 3 && distanceParams < 6) {
      return 15000;
    } else if (distanceParams >= 6 && distanceParams < 10) {
      return 20000;
    } else {
      return 30000;
    }
  }

  const convertRupiah = (price) => {
    const numberString = price.toString();
    const sisa = numberString.length % 3;
    var rupiah = numberString.substr(0, sisa);
    const ribuan = numberString.substr(sisa).match(/\d{3}/g);
    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }
    return rupiah;
  };

  return (
    <LinearGradient
    
      colors={["#008bb5", "#48bcae"]}
      style={{ height: "100%" }}
    >
   
      <View style={styles.top}></View>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
    
          <Image
            source={{
              uri:
                teacher.image_url,
            }}
            style={styles.profileImg}
          />
       
          <View
            style={{
              marginLeft: "5%",
              justifyContent: "center",
            }}
          >
            <Text style={styles.text1}>{teacher.name}</Text>
            <Text style={styles.text2}>{teacher.email}</Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: "5%",
                // backgroundColor: "red",
                justifyContent: "space-between",
              }}
            >
              <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={14}
                  color="white"
                  style={{ marginRight: "4%" }}
                ></MaterialCommunityIcons>
                <Text style={styles.text3}>{teacher.address}</Text>
              </View>
              <View style={{flexDirection: 'row',}}>
                <MaterialCommunityIcons
                  name="star"
                  size={14}
                  color="white"
                  style={{paddingRight: '1%'}}
                ></MaterialCommunityIcons>
                <Text style={styles.text3}>{teacher.rating.toFixed(1)}</Text>
              </View>
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
            alignSelf: "center",
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
            marginLeft: "12%",
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
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#008bb5",
              marginBottom: "2%",
              marginLeft: "12%",
            }}
          >
            Total
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: "14%",
            }}
          >
            <Text style={{ color: "#008bb5" }}>Course Price</Text>
            <Text style={{ color: "#008bb5" }}>
              {" "}
              Rp.{convertRupiah(teacher.price)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: "13%",
            }}
          >
            <Text style={{ color: "#008bb5" }}> Distance Price</Text>
            <Text style={{ color: "#008bb5", right: "21%" }}>
              Rp.{convertRupiah(countDistance(distance))}
            </Text>
          </View>
          <View
            style={{
              left: "5%",
              alignSelf: "flex-end",
              marginHorizontal: "14%",
            }}
          >
            <Text style={{ color: "#008bb5" }}>-------------------- +</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: "5%",
              justifyContent: "space-between",
              marginHorizontal: "14%",
            }}
          >
            <Text style={{ color: "#008bb5" }}>Total Price</Text>
            <Text style={{ color: "#008bb5", right: "5%" }}>
              Rp.{convertRupiah(teacher.price + countDistance(distance))}
            </Text>
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
      </View>
   
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
    // alignItems: "center",
    top: "-5%",
  },
  button: {
    marginHorizontal: "10%",
    height: "25%",
    // width: "200%",
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
    backgroundColor: "rgba(245,245,245,1)",
    marginBottom: "3%",
    marginTop: "3%",
    elevation: 10,
    alignSelf: "center",
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
    marginLeft: "1%",
    marginTop: "2%",
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
