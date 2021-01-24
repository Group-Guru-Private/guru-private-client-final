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
  Title,
  Button,
  Header,
  Row
} from "native-base";
import { useNavigation } from "@react-navigation/native";

export default function ListTeachersPage() {
  // const [image, setImage] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigation();

  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => setTeachers(data));

  //     useEffect(() => {
  //         (async () => {
  //           if (Platform.OS !== 'web') {
  //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //             if (status !== 'granted') {
  //               alert('Sorry, we need camera roll permissions to make this work!');
  //             }
  //           }
  //         })();
  //       }, []);

  //     const pickImage = async () => {
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     if (!result.cancelled) {
  //       setImage(result.uri);
  //     }
  //   };
  const goDetail = (teacher) => {
    navigate.push('Order', { teacher })
  };

  return (
    // <SafeAreaView style={styles.container}>
    <>
      <View style={styles.top}>
      </View>
      <Title style={styles.title}>List teacher</Title>
      <Right><Text style={styles.title}></Text></Right>
      <ScrollView>
        {teachers.map((teacher) => (
          <TouchableOpacity
            onPress={() => {
              goDetail({id: teacher.id, name: teacher.name, email: teacher.email});
            }}
            key={teacher.id}
            style={styles.card}
          >
            <Card style={{ borderRadius: 20 }}>
              <CardItem style={styles.borderTop}>
                <Left>
                  <Thumbnail />
                  <Body>
                    <Text>{teacher.name}</Text>
                    <Text note>{teacher.email}</Text>
                    <Text note>Rp: 100.000</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
});
