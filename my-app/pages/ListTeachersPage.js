import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
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

export default function ListTeachersPage() {
  // const [image, setImage] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const navigate = useNavigation();
  const [loading, setLoading] = useState(false);
  const [filterSubject, setFilterSubject] = useState("");
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

  useEffect(() => {
    setLoading(true);
    axios
      .get("/teachers")
      .then(({ data }) => {
        const filteredData = data.filter((el) => {
          return el.available_status == true;
        });
        setTeachers(filteredData);
        setAllTeachers(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleFilterSubject(itemValue) {
    let filterByItemValue = [];
    setFilterSubject(itemValue);

    if (itemValue == "") {
      const duplicate = allTeachers;
      setTeachers(duplicate);
    } else {
      allTeachers.forEach((element1) => {
        element1.subjects.forEach((element2) => {
          if (element2 == itemValue) {
            filterByItemValue.push(element1);
          }
        });
      });
      setTeachers(filterByItemValue);
    }
  }

  const goDetail = (teacher) => {
    navigate.push("Order", { teacher });
  };

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
          {teachers.map((teacher) => (
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

                      <Text note>Rp: 100.000</Text>
                    </Body>
                  </Left>
                  <Right>
                    <Body>
                      <Text note>4</Text>
                      <Text note>1</Text>
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
