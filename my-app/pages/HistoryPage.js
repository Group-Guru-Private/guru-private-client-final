import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
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
  Header,
  Button,
  Title
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import axios from '../config/axiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function HomePage() {
  // const [image, setImage] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigation();

  useEffect(() => {
    
    axios({
      url: '/orders',
      method: 'GET'
    })
    .then(async ({ data }) => {
      try {
        const asyncId = await AsyncStorage.getItem("id");
        const filteredData = data.filter((el) => {
          return el.StudentId == asyncId && el.status == true;
        });
        const sorted = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date))
        setOrders(sorted)
      } catch (error) {
        console.log(error);
      }
    })
    .catch((err) => {
      console.log(err);
      Alert.alert(err);
    });
    
  }, [])

  const goDetail = (id) => {
    console.log(id);
  };

  return (
    <>
      <View style={styles.top}></View>
      <Text style={styles.title}>History</Text>
      <ScrollView>
        {orders.map(data => (
          <TouchableOpacity
            onPress={() => {
              goDetail(data.id);
            }}
            key={data.id}
            style={styles.card}
          >
            <Card style={{ borderRadius: 20 }}>
              <CardItem style={styles.borderTop}>
                <Left>
                  <Thumbnail />
                  <Body>
                    <Text>{data.Teacher.name}</Text>
                    <Text note>{data.Teacher.email}</Text>
                    <Text note>{data.subject}</Text>
                    <Text note>{data.date}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  top: {
    // top: "-5%",
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
    marginBottom: "5%",
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
});
