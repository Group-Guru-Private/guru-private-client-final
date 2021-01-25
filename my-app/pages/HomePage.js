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
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const photo = [
  {
    albumId: 1,
    id: 1,
    name: "Zaidan ammar",
    distance: 2,
    rating: 2,
    price: 8676876,
    url: "https://via.placeholder.com/600/92c952",
    thumbnailUrl: "https://via.placeholder.com/150/92c952",
  },
  {
    albumId: 1,
    id: 2,
    rating: 3,
    name: "farhat 3",
    distance: 2.3,
    price: 100000,
    url:
      "https://i7.pngguru.com/preview/555/703/598/computer-icons-avatar-woman-user-avatar.jpg",
    thumbnailUrl: "https://via.placeholder.com/150/771796",
  },
  {
    albumId: 1,
    id: 3,
    rating: 1,
    name: "farhat 2",
    distance: 2.9,
    price: 100000,
    url:
      "https://i7.pngguru.com/preview/555/703/598/computer-icons-avatar-woman-user-avatar.jpg",
    thumbnailUrl: "https://via.placeholder.com/150/24f355",
  },
  {
    albumId: 1,
    id: 4,
    rating: 5,
    name: "farhat 1",
    distance: 4.3,
    price: 100000,
    url:
      "https://i7.pngguru.com/preview/555/703/598/computer-icons-avatar-woman-user-avatar.jpg",
    thumbnailUrl: "https://via.placeholder.com/150/d32776",
  },
  {
    albumId: 1,
    id: 5,
    name: "farhat 4",
    distance: 1.3,
    rating: 4,
    price: 100000,
    url:
      "https://i7.pngguru.com/preview/555/703/598/computer-icons-avatar-woman-user-avatar.jpg",
    thumbnailUrl: "https://via.placeholder.com/150/f66b97",
  },
  {
    albumId: 1,
    id: 6,
    name: "farhat 5",
    distance: 8.3,
    rating: 3,
    price: 100000,
    url:
      "https://i7.pngguru.com/preview/555/703/598/computer-icons-avatar-woman-user-avatar.jpg",
    thumbnailUrl: "https://via.placeholder.com/150/56a8c2",
  },
];
const sort  = photo.filter(el => el.rating > 3)


// var angka = 13531153
// var locale = angka.toLocaleString('en-US', { style: 'currency', currency: 'JPY' })
// console.log(angka, '<<<<<<')
// console.log(locale, '<<<')


export default function HomePage() {
  // const [image, setImage] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigation();
  const SLIDER_WIDTH = Dimensions.get("window").width;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    axios(({
      url: 'http://192.168.0.100:3000/orders/',
      method: 'GET'
    }))
      .then(async ({data}) => {
        try {
          const asyncId = await AsyncStorage.getItem('id')
          const filteredData = data.filter(el => {
            return el.StudentId == asyncId
          })
          console.log(filteredData)
          setOrders(filteredData)
        } catch (error) {
          console.log(error);
        }
      })
      .catch(err => {
        console.log(err)
        Alert.alert(err)
      })

    return function cleanUp() {
      abortController.abort();
    };
  }, []);

  const goDetail = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigate.push('OngoingOrder', { teacher: item.Teacher, subject: item.subject })}>
      <View
        style={{
          height: 250,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "floralwhite",
          borderRadius: 20,
        }}
      >
        <Text style={{left: "-35%", top: "-20%", fontSize: 20, fontWeight: 'bold'}}>Ongoing</Text>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{
              uri: item.Teacher.image_url,
            }}
            style={styles.profileImg}
          />
          <View>
            <Text style={{ fontSize: 13 }}>Name: {item.Teacher.name}</Text>
            <Text style={{ fontSize: 13 }}>Subject: {item.subject}</Text>
            <Text style={{ fontSize: 13 }}>Address: {item.Teacher.address}</Text>
            <Text style={{ fontSize: 13 }}>Date: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
  };
  const goSquare = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => goOrder(item)}>
        <View
          style={{
            height: 150,
            padding: 10,
            justifyContent: "center",
            backgroundColor: "floralwhite",
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmpoQaaw13BKAmYv1iRPzkz9AkM0ZskCqK_g&usqp=CAU",
            }}
            style={{ width: 70, height: 70 }}
          ></Image>
          <View>
            <Text style={{ fontSize: 14, marginLeft: "7%" }}>{item.name}</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 10, marginLeft: "10%" }}>
                R: {item.rating}
              </Text>
              <Text style={{ fontSize: 10, marginRight: "30%" }}>
                D: {item.distance}
              </Text>
            </View>
            <Text style={{ fontSize: 10, marginLeft: "7%" }}>{item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const goOrder = (teacher) => {
    navigate.replace('Order', {teacher})
    console.log(teacher)
  };

  return (
    // <SafeAreaView style={styles.container}>
    <>
      <View style={styles.top}></View>
      <Title style={styles.title}>Hello!</Title>
      <Text style={{ fontSize: 20, color: "white", marginLeft: "6%" }}>
        Zaidan Ammar
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
        style={{ fontSize: 26, color: "#48bcae", marginLeft: "5%", top: "5%" }}
      >
        Top teacher on the week
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
          data={sort}
          itemWidth={200}
          renderItem={goSquare}
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
    backgroundColor: "#48bcae",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    position: "absolute",
  },
  title: {
    // flex: 1,
    marginTop: "10%",
    marginBottom: "2%",
    marginLeft: "5%",
    textAlign: "left",
    fontSize: 32,
    fontWeight: "500",
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
    borderWidth: 3,
    borderColor: "red"
  }
});
