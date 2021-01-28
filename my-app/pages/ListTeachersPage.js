import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  Alert,
  RefreshControl,
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
import axios from "../config/axiosInstance";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function ListTeachersPage() {
  // const [image, setImage] = useState(null);
  const navigate = useNavigation();
  const [teachers, setTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSubject, setFilterSubject] = useState("");
  const [positionStudent, setPositionStudent] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const allSubjects = [
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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    getDataById();

    wait(1000).then(() => {
      setFilterSubject("");
      setLoading(false);
      setRefreshing(false);
    });
  }, []);

  async function getDataById() {
    try {
      const value = await AsyncStorage.getItem("id");
      let tempPos = [];

      axios
        .get(`/students/${value}`)
        .then(({ data }) => {
          setPositionStudent(data.position);
          tempPos = data.position;
          return axios.get("/teachers");
        })
        .then(({ data }) => {
          const filteredData = data.filter((el) => {
            return el.available_status == true;
          });

          const duplicate = [];
          filteredData.forEach((element) => {
            element["distance"] = getDistanceFromLatLonInKm(
              tempPos[0],
              tempPos[1],
              element.position[0],
              element.position[1]
            );
            duplicate.push(element);
          });
          const sorted = duplicate.sort(
            (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
          );

          setTeachers(sorted);
          setAllTeachers(sorted);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true);

    getDataById();
  }, []);

  const handleFilterSubject = (itemValue) => {
    setFilterSubject(itemValue);
    if (itemValue == "") {
      const duplicate = [];
      allTeachers.forEach((element) => {
        element["distance"] = getDistanceFromLatLonInKm(
          positionStudent[0],
          positionStudent[1],
          element.position[0],
          element.position[1]
        );
        duplicate.push(element);
      });
      setTeachers(duplicate);
    } else {
      let filterByItemValue = [];
      allTeachers.forEach((element1) => {
        element1.subjects.forEach((element2) => {
          if (element2 == itemValue) {
            element1["distance"] = getDistanceFromLatLonInKm(
              positionStudent[0],
              positionStudent[1],
              element1.position[0],
              element1.position[1]
            );
            filterByItemValue.push(element1);
          }
        });
      });
      setTeachers(filterByItemValue);
    }
  };

  const goDetail = (teacher) => {
    const distance = getDistanceFromLatLonInKm(
      positionStudent[0],
      positionStudent[1],
      teacher.position[0],
      teacher.position[1]
    ).toFixed(2);

    navigate.push("Order", { teacher, distance });
  };

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

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

  if (loading)
    return <View style={{ marginTop: Constants.statusBarHeight }}></View>;
  else {
    return (
      // <SafeAreaView style={styles.container}>
      <>
        <View style={styles.top}></View>
        <View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Title style={styles.title}>List Teachers</Title>
          </ScrollView>
        </View>
        <View style={{ alignItems: "flex-end", marginBottom: "3%" }}>
          <Picker
            selectedValue={filterSubject}
            style={{
              width: "40%",
              color: "floralwhite",
            }}
            onValueChange={(itemValue, itemIndex) =>
              handleFilterSubject(itemValue)
            }
          >
            <Picker.Item label="All Subjects" value="" />
            {allSubjects.map((mapel, index) => {
              return <Picker.Item key={index} label={mapel} value={mapel} />;
            })}
          </Picker>
        </View>
        <ScrollView>
          {teachers.map((teacher) => (
            <TouchableOpacity
              onPress={() => {
                goDetail(teacher);
              }}
              key={teacher.id}
              style={styles.card}
            >
              <Card style={{ borderRadius: 20, }}>
                <CardItem style={styles.borderTop}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "4%",
                        marginLeft: "2%",
                        marginTop: "3%",
                      }}
                    >
                      <Image
                        source={{ uri: teacher.image_url }}
                        style={styles.profileImg}
                      />

                      <View
                        style={{
                          flexDirection: "column",
                          marginVertical: "5%",
                          marginLeft: "5%",
                        }}
                      >
                        <Text style={styles.text1}>{teacher.name}</Text>
                        <Text style={styles.text}>
                          {teacher.subjects.join(", ")}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginVertical: "5%",
                        justifyContent: "space-between",
                        // backgroundColor: 'red',
                        left: "14%",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <MaterialCommunityIcons
                          name="star"
                          size={18}
                          color="#008bb5"
                        ></MaterialCommunityIcons>
                        <Text style={styles.text}>{teacher.rating.toFixed(1)}</Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <MaterialIcons
                          name="place"
                          size={18}
                          color="#008bb5"
                        ></MaterialIcons>
                        <Text style={styles.text}>
                          {getDistanceFromLatLonInKm(
                            positionStudent[0],
                            positionStudent[1],
                            teacher.position[0],
                            teacher.position[1]
                          ).toFixed(1)}{" "}
                          km
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.text}>Rp.{convertRupiah(teacher.price)}</Text>
                      </View>
                    </View>
                  </View>
                </CardItem>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
      // </SafeAreaView>
    );
  }
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
    backgroundColor: "floralwhite",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    elevation: 4
  },
  borderBot: {
    // backgroundColor: "#008bb5",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  profileImg: {
    width: 75,
    height: 75,
    borderRadius: 150 / 2,
    overflow: "hidden",
  },
  text: {
    color: "#008bb5",
    fontSize: 16,
  },
  text1: {
    color: "#008bb5",
    fontWeight: "bold",
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
});
