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
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ListTeachersPage() {
  // const [image, setImage] = useState(null);
  const navigate = useNavigation();
  const [teachers, setTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSubject, setFilterSubject] = useState("");
  const [positionStudent, setPositionStudent] = useState([]);

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

  async function getDataById() {
    try {
      const value = await AsyncStorage.getItem("id");
      let tempPos = []

      axios
        .get(`/students/${value}`)
        .then(({ data }) => {
          setPositionStudent(data.position)
          tempPos = data.position
          return axios.get("/teachers")
        })
        .then(({ data }) => {
          const filteredData = data.filter((el) => {
            return el.available_status == true;
          });
          const duplicate = []
          filteredData.forEach(element => {
            element['distance'] = getDistanceFromLatLonInKm(tempPos[0], tempPos[1], element.position[0], element.position[1])
            duplicate.push(element)
          })
          const sorted = duplicate.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
          //console.log(sorted);
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
  
    getDataById()

    
  }, []);

  

  function handleFilterSubject(itemValue) {
    setFilterSubject(itemValue);
    if (itemValue == "") {
      const duplicate = []
      allTeachers.forEach(element => {
        element['distance'] = getDistanceFromLatLonInKm(positionStudent[0], positionStudent[1], element.position[0], element.position[1])
        duplicate.push(element)
      })
      setTeachers(duplicate)
    } else {
      let filterByItemValue = [];
      allTeachers.forEach((element1) => {
        element1.subjects.forEach((element2) => {
          if (element2 == itemValue) {
            element1['distance'] = getDistanceFromLatLonInKm(positionStudent[0], positionStudent[1], element1.position[0], element1.position[1])
            filterByItemValue.push(element1);
          }
        })
      })
      setTeachers(filterByItemValue)
    }
  }

  const goDetail = (teacher) => {
    const distance = getDistanceFromLatLonInKm(positionStudent[0], positionStudent[1], teacher.position[0], teacher.position[1]).toFixed(2)

    navigate.push("Order", { teacher, distance });
  };

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  if (loading)
    return (
      <View style={{ marginTop: Constants.statusBarHeight }}>
        <Text style={{ textAlign: "center" }}>Loading...</Text>
      </View>
    );
  else {
    return (
      // <SafeAreaView style={styles.container}>
      <>
        <View style={styles.top}></View>
        <View>
          <Title style={styles.title}>List teacher</Title>
          <Picker
            selectedValue={filterSubject}
            style={{ width: "40%", backgroundColor: "red" }}
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
          {
          teachers.map((teacher) => (
            <TouchableOpacity
              onPress={() => {
                goDetail(teacher);
              }}
              key={teacher.id}
              style={styles.card}
            >
              <Card style={{ borderRadius: 20 }}>
                <CardItem style={styles.borderTop}>
                  <Left>
                    <Image
                      source={{ uri: teacher.image_url }}
                      style={styles.profileImg}
                    />
                    <Body>
                      <Text>{teacher.name}</Text>
                      <Text note>{teacher.email}</Text>
                      <Text note>Rp.{teacher.price}</Text>
                    </Body>
                  </Left>
                  <Right>
                    <Body>
                      <Text note>{getDistanceFromLatLonInKm(positionStudent[0], positionStudent[1], teacher.position[0], teacher.position[1]).toFixed(2)} km</Text>
                      <Text note>{teacher.rating}</Text>
                      <Text note>{teacher.subjects.join(", ")}</Text>
                    </Body>
                  </Right>
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
    backgroundColor: "#48bcae",
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
    width: 50,
    height: 50,
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "gray",
  },
});
