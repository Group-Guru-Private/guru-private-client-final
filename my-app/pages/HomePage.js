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
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";

export default function HomePage() {
  const [orders, setOrders] = useState([]);
  const [topTeachers, setTopTeachers] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigation();
  const SLIDER_WIDTH = Dimensions.get("window").width;

  const dummy = [
    {
      title: "Sorry you have not taken any courses",
      uri:
        "https://w7.pngwing.com/pngs/340/299/png-transparent-computer-icons-magnifying-glass-symbol-filename-extension-list-angle-text-rectangle-thumbnail.png",
    },
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getName();
    axios
      .get("/orders")
      .then(async ({ data }) => {
        try {
          const asyncId = await AsyncStorage.getItem("id");
          const filteredData = data.filter((el) => {
            return el.StudentId == asyncId && el.status == false;
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
    // console.log(item, '<<<<<')
    return (
      <TouchableOpacity
        onPress={() =>
          navigate.push("OngoingOrder", {
            teacher: item.Teacher,
            subject: item.subject,
            orderId: item.id,
          })
        }
      >
        <View
          style={{
            height: 240,
            paddingHorizontal: 10,
            justifyContent: "space-between",
            backgroundColor: "floralwhite",
            borderRadius: 20,
          }}
        >
          <View style={{ alignSelf: "flex-start" }}>
            <Text
              style={{
                // left: "-25%",
                marginVertical: "5%",
                fontSize: 20,
                fontWeight: "bold",
                color: "#008bb5",
              }}
            >
              Ongoing Course
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginHorizontal: "4%",
              // backgroundColor: "green",
            }}
          >
            <Image
              source={{
                uri: item.Teacher.image_url,
              }}
              style={styles.profileImg2}
            />
            <View style={{ marginLeft: "4%", alignSelf: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#008bb5",
                  marginLeft: "1%",
                }}
              >
                {item.Teacher.name}
              </Text>
              <Text
                style={{ fontSize: 13, color: "#008bb5", marginLeft: "1%" }}
              >
                {item.Teacher.email}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: "3%",
              // backgroundColor: "orange",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <MaterialCommunityIcons
                name="phone"
                size={30}
                color="#008bb5"
              ></MaterialCommunityIcons>
              <Text
                style={{ fontSize: 12, color: "#008bb5", fontWeight: "bold" }}
              >
                {item.Teacher.telpon_number}
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Entypo name="book" size={30} color="#008bb5"></Entypo>
              <Text
                style={{ fontSize: 12, color: "#008bb5", fontWeight: "bold" }}
              >
                {item.subject}
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Fontisto
                name="date"
                size={28}
                color="#008bb5"
                style={{ marginBottom: "5%" }}
              ></Fontisto>
              <Text
                style={{ fontSize: 12, color: "#008bb5", fontWeight: "bold" }}
              >
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const goDummy = ({ item }) => {
    return (
      <View
        style={{
          height: 250,
          // paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "floralwhite",
          borderRadius: 20,
        }}
      >
        <Image
          source={{ uri: item.uri }}
          style={{ width: "70%", height: "60%", marginBottom: "13%" }}
        ></Image>
        <Text style={{ top: "-14%", color: "#008bb5" }}>{item.title}</Text>
      </View>
    );
  };

  const goSquare = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => goOrder(item)}>
        <View
          style={{
            height: 215,
            width: 160,
            padding: 10,
            backgroundColor: "floralwhite",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              // backgroundColor: "red",
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: "3%",
              alignSelf: "center",
            }}
          >
            <Image
              source={{
                uri: item.image_url,
              }}
              style={styles.profileImg}
            ></Image>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#008bb5",
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                alignSelf: "center",
                color: "#008bb5",
              }}
            >
              {item.subjects[0]}
            </Text>
            {index === 0 || index === 1 || index === 2 ? (
              <MaterialCommunityIcons
                name="trophy"
                size={18}
                color="#008bb5"
                style={{
                  alignSelf: "flex-start",
                  position: "absolute",
                  top: "-250%",
                }}
              ></MaterialCommunityIcons>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: "15%",
              // backgroundColor: "brown",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <MaterialCommunityIcons
                name="star"
                size={16}
                color="#008bb5"
                style={{ top: "5%" }}
              ></MaterialCommunityIcons>
              <Text style={{ fontSize: 14, color: "#008bb5" }}>
                {item.rating}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 14, color: "#008bb5" }}>
                Rp.{convertRupiah(item.price)}
              </Text>
            </View>
          </View>
          {/* <View>
            <Text style={{ fontSize: 16 }}>{item.address}</Text>
          </View> */}
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
      setName(nameStudent);
    } catch (error) {
      console.log(error);
    }
  };

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
    <>
      <View style={styles.top}></View>
      <View style={{ marginTop: "10%", marginBottom: "2%", marginLeft: "5%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: "7%",
          }}
        >
          <Title
            style={{
              fontSize: 20,
              color: "white",
              marginLeft: "2%",
              marginTop: "4%",
              fontWeight: "200",
            }}
          >
            Hello!
          </Title>
          <Image
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
            style={styles.profileImg1}
          ></Image>
        </View>
        <Text style={styles.title}>{name}</Text>
      </View>

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
          data={orders.length ? orders : dummy}
          itemWidth={350}
          renderItem={orders.length ? goDetail : goDummy}
        ></Carousel>
      </View>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: "#008bb5",
          marginLeft: "5%",
          top: "1%",
        }}
      >
        Top teachers
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginLeft: "-20%",
          bottom: "-6%",
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
    textAlign: "left",
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginLeft: "2%",
    top: "-17%",
  },
  card: {
    marginLeft: "3%",
    marginRight: "3%",
    borderRadius: 100,
  },
  borderTop: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  borderBot: {
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  profileImg2: {
    width: 90,
    height: 90,
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
  profileImg1: {
    width: 65,
    height: 65,
    borderRadius: 150 / 2,
    overflow: "hidden",
    top: "4%",
  },
});
