import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { Card, CardItem, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import axios from "../config/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Rating, AirbnbRating } from "react-native-ratings";

export default function HomePage() {
  // const [image, setImage] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    axios({
      url: "/orders",
      method: "GET",
    })
      .then(async ({ data }) => {
        try {
          const asyncId = await AsyncStorage.getItem("id");
          const filteredData = data.filter((el) => {
            return el.StudentId == asyncId && el.status == true;
          });
          const sorted = filteredData.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setOrders(sorted);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(err);
      });
  }

  const goDetail = (id) => {
    console.log(id);
  };

  async function ratingCompleted(rating, data) {
    console.log("Rating is: " + rating);
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      axios({
        url: `/orders/${data.id}`,
        method: "PUT",
        headers: {
          access_token,
        },
        data: {
          rating,
        },
      })
        .then((data) => {
          fetchData();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <View style={styles.top}></View>
      <Text style={styles.title}>History</Text>

      <ScrollView>
        {orders.map((data) => (
          <View key={data.id} style={styles.card}>
            <Card style={{ borderRadius: 20 }}>
              <CardItem style={styles.borderTop}>
                <View
                  style={{
                    // backgroundColor: "red",
                    // alignItems: "center",
                    width: "100%",
                  }}
                  >
                  <View
                    style={{
                      flexDirection: "row",
                      // alignSelf: 'flex-start',
                      // backgroundColor: "blue",
                      // alignItems: "center",
                      justifyContent: "space-between",
                      width: '100%'
                    }}
                  >
                    <Image
                      source={
                        data.image_url
                          ? { uri: data.image_url }
                          : {
                              uri:
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                            }
                      }
                      style={styles.profileImg}
                    ></Image>
                    <View
                      style={{
                        justifyContent: "center",
                        flexDirection: "column",
                        // backgroundColor: 'red',
                        left: '-48%',
                        top: '3%'

                      }}
                    >
                      <Text>{data.Teacher.name}</Text>
                      <Text note>{data.subject}</Text>
                    </View>
                    <Text
                      note
                      style={{
                        // backgroundColor: "green",
                        alignSelf: "flex-start",
                      }}
                    >
                      {data.date}
                    </Text>
                  </View>

                  <View
                    style={{
                      // backgroundColor: "orange",
                      height: 15,
                      justifyContent: "flex-end",
                      alignSelf: "flex-end",
                      marginBottom: '5%'
                    }}
                  >
                    <AirbnbRating
                      count={5}
                      onFinishRating={(value) => ratingCompleted(value, data)}
                      defaultRating={data.rating}
                      reviews={[]}
                      isDisabled={data.rating == 0 ? false : true}
                      size={22}
                    />
                  </View>
                </View>
              </CardItem>
            </Card>
          </View>
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
  profileImg: {
    width: 75,
    height: 75,
    borderRadius: 150 / 2,
    overflow: "hidden",
    top: '3%'
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
    marginTop: "10%",
    marginBottom: "5%",
    marginLeft: "5%",
    textAlign: "left",
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  card: {
    marginHorizontal: "3%",
    borderRadius: 100,
  },
  borderTop: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: "floralwhite",
  },
  // borderBot: {
  //   borderBottomRightRadius: 15,
  //   borderBottomLeftRadius: 15,
  // },
});
