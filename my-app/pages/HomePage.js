import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import Constants from "expo-constants";
import {
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Body,
  Icon,
  Right,
  Text,
  Left,
  Title,
  Button,
  Header,
  Row,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import axios from "../config/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// var angka = 13531153
// var locale = angka.toLocaleString('en-US', { style: 'currency', currency: 'JPY' })
// console.log(angka, '<<<<<<')
// console.log(locale, '<<<')

export default function HomePage() {
  const [orders, setOrders] = useState([]);
  const [topTeachers, setTopTeachers] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigation();
  const SLIDER_WIDTH = Dimensions.get("window").width;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getName()
    axios
      .get("orders/")
      .then(async ({ data }) => {
        try {
          const asyncId = await AsyncStorage.getItem("id");
          const filteredData = data.filter((el) => {
            return el.StudentId == asyncId;
          });
          setOrders(filteredData);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(err);
      });

    return function cleanUp() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    axios
      .get("/teachers")
      .then(({ data }) => {
        const filterData = data
          .filter((el) => el.rating > 3)
          .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        setTopTeachers(filterData);
      })
      .catch((err) => console.log(err));
  }, []);

  const goDetail = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigate.push("OngoingOrder", {
            teacher: item.Teacher,
            subject: item.subject,
          })
        }
      >
        <View
          style={{
            height: 250,
            paddingHorizontal: 10,
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "floralwhite",
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              left: "-25%",
              marginVertical: "5%",
              fontSize: 20,
              fontWeight: "bold",
              color: "#008bb5",
            }}
          >
            Ongoing Course
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-start",
              marginLeft: "2%",
            }}
          >
            <Image
              source={{
                uri: item.Teacher.image_url,
              }}
              style={styles.profileImg}
            />
            <View style={{ marginLeft: "4%", alignSelf: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.Teacher.name}
              </Text>
              <Text style={{ fontSize: 13 }}>{item.subject}</Text>
              <Text style={{ fontSize: 13 }}>{item.Teacher.address}</Text>
              <Text style={{ fontSize: 13 }}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const goSquare = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => goOrder(item)}>
        <View
          style={{
            height: 150,
            padding: 10,
            // justifyContent: "center",
            // alignContent: 'center',
            backgroundColor: "floralwhite",
            borderRadius: 20,
            // flexDirection: "row",
            alignItems: "center",
          }}
        >
          {index === 0 || index === 1 || index === 2 ? (
            <MaterialCommunityIcons
              name="trophy"
              size={24}
              color='#008bb5'
              style={{ alignSelf: "flex-start"}}
            ></MaterialCommunityIcons>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              marginLeft: "-3%",
              marginTop: "10%",
            }}
          >
            <Image
              source={{
                uri: item.image_url,
              }}
              style={styles.profileImg1}
            ></Image>
            <View style={{ alignSelf: "center" }}>
              <Text
                style={{ fontSize: 14, marginLeft: "7%", fontWeight: "bold" }}
              >
                {item.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: "7%",
                    marginTop: "2%",
                  }}
                >
                  <MaterialCommunityIcons
                    name="star"
                    size={14}
                  ></MaterialCommunityIcons>
                  <Text style={{ fontSize: 10, marginLeft: "10%" }}>
                    {item.rating}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginLeft: "7%" }}>
                  <MaterialIcons name="attach-money" size={14}></MaterialIcons>
                  <Text style={{ fontSize: 10 }}>{item.price}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 10, marginLeft: "8%", marginTop: "2%" }}>
                {item.address}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const goOrder = (teacher) => {
    navigate.replace("Order", { teacher });
    console.log(teacher);
  };

  const getName = async () => {
    try {
      const nameStudent = await AsyncStorage.getItem("name");
      return setName(nameStudent)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <SafeAreaView style={styles.container}>
    <>
      <View style={styles.top}></View>
      <Title style={styles.title}>Hello!</Title>
      <Text style={{ fontSize: 20, color: "white", marginLeft: "6%" }}>
        {name}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "5%",
        }}
      >
        <Carousel
          layout={"default"}
          sliderWidth={SLIDER_WIDTH}
          data={orders}
          itemWidth={350}
          renderItem={goDetail}
        ></Carousel>
      </View>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: "#008bb5",
          marginLeft: "5%",
          top: "5%",
        }}
      >
        Top teachers
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginLeft: "-20%",
          marginTop: "15%",
        }}
      >
        <Carousel
          layout={"default"}
          sliderWidth={SLIDER_WIDTH}
          data={topTeachers}
          itemWidth={200}
          renderItem={goSquare}
          firstItem={0}
        ></Carousel>
      </View>
    </>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  top: {
    width: "100%",
    height: "35%",
    backgroundColor: "#008bb5",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    position: "absolute",
  },
  title: {
    // flex: 1,
    marginTop: "10%",
    // marginBottom: "2%",
    marginLeft: "5%",
    textAlign: "left",
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  card: {
    marginLeft: "3%",
    marginRight: "3%",
    borderRadius: 100,
  },
  borderTop: {
    //  backgroundColor: "#008bb5",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  borderBot: {
    // backgroundColor: "#008bb5",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
  profileImg1: {
    width: 70,
    height: 70,
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
});
