import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight
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
  Row
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios'

export default function ListTeachersPage() {
  // const [image, setImage] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigation();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios({
      url: 'http://192.168.0.100:3000/teachers',
      method: 'GET'
    })
    .then(({data}) => {
      const filteredData = data.filter(el => {
        return el.available_status == true
      })
      setTeachers(filteredData)
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  
  const goDetail = (teacher) => {
    navigate.push('Order', { teacher })
  };

  if(loading) return <Text>Loading...</Text>

  else {
    return (
      // <SafeAreaView style={styles.container}>
      <>
        <View style={styles.top}>
        </View>
        <Title style={styles.title}>List teacher</Title>
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
                    <Image source={{ uri: teacher.image_url }} style={styles.profileImg} />
                    <Body>
                      <Text>{teacher.name}</Text>
                      <Text note>{teacher.email}</Text>
                      <Text note>Rp: 100.000</Text>
                      <Text note>Rp: 100.000</Text>
                    </Body>
                  </Left>
                  <Right>
                    <Body>
                      <Text note>Rating : {teacher.rating}</Text>
                      <Text note>Distance : {teacher.position}</Text>
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
    borderColor: "gray"
  }
});
