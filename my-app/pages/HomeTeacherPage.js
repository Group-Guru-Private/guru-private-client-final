import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Switch,
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

const photo = [
  {
    albumId: 1,
    id: 1,
    title: "Sudirman",
    url: "https://via.placeholder.com/600/92c952",
    thumbnailUrl: "https://via.placeholder.com/150/92c952",
  },
  {
    albumId: 1,
    id: 2,
    title: "reprehenderit est deserunt velit ipsam",
    url: "https://via.placeholder.com/600/771796",
    thumbnailUrl: "https://via.placeholder.com/150/771796",
  },
  {
    albumId: 1,
    id: 3,
    title: "officia porro iure quia iusto qui ipsa ut modi",
    url: "https://via.placeholder.com/600/24f355",
    thumbnailUrl: "https://via.placeholder.com/150/24f355",
  },
  {
    albumId: 1,
    id: 4,
    title: "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
    url: "https://via.placeholder.com/600/d32776",
    thumbnailUrl: "https://via.placeholder.com/150/d32776",
  },
  {
    albumId: 1,
    id: 5,
    title: "natus nisi omnis corporis facere molestiae rerum in",
    url: "https://via.placeholder.com/600/f66b97",
    thumbnailUrl: "https://via.placeholder.com/150/f66b97",
  },
  {
    albumId: 1,
    id: 6,
    title: "accusamus ea aliquid et amet sequi nemo",
    url: "https://via.placeholder.com/600/56a8c2",
    thumbnailUrl: "https://via.placeholder.com/150/56a8c2",
  },
];

export default function HomeTeacherPage({navigation}) {
  const [isEnabled, setIsEnabled] = useState();
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([])
  const [name, setName] = useState([])
  const navigate = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      axios
      .get("/orders")
      .then(async ({ data }) => {
        try {
          const asyncId = await AsyncStorage.getItem("id");
          const filteredData = data.filter((el) => {
            return el.TeacherId == asyncId && el.status == false;
          });
          const filteredByHistory = data.filter((el) => {
            return el.TeacherId == asyncId && el.status == true;
          });
          const sorted = filteredByHistory.sort((a, b) => new Date(a.date) - new Date(b.date))
          setHistory(sorted);
          setOrders(filteredData);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(err);
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getDataById();

    axios
      .get("/orders")
      .then(async ({ data }) => {
        try {
          const asyncId = await AsyncStorage.getItem("id");
          const filteredData = data.filter((el) => {
            return el.TeacherId == asyncId && el.status == false;
          });
          const filteredByHistory = data.filter((el) => {
            return el.TeacherId == asyncId && el.status == true;
          });
          const sorted = filteredByHistory.sort((a, b) => new Date(a.date) - new Date(b.date))
          setHistory(sorted);
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

  async function toggleSwitch(value) {
    setIsEnabled(value);

    try {
      const access_token = await AsyncStorage.getItem("access_token");

      axios({
        url: `/teachers/`,
        method: "PATCH",
        headers: {
          access_token: access_token,
        },
        data: {
          status: value,
        },
      })
        .then(({ data }) => {
          if (value) {
            Alert.alert(`Working`);
          } else {
            Alert.alert(`Off Working`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function getDataById() {
    try {
      const value = await AsyncStorage.getItem("id");
      const name = await AsyncStorage.getItem("name")
      setName(name)

      axios
        .get(`/teachers/${value}`)
        .then(({ data }) => {
          setIsEnabled(data.available_status);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const goChat = async (item) => {
    const userId = await AsyncStorage.getItem("id");
    const username = await AsyncStorage.getItem("name");
    navigate.push("TeacherOngoingOrderPage", {
      userId: `teacher${userId}`,
      name: username,
      roomId: item.id,
    });
  };

  const goDetail = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
        navigate.push("TeacherOngoingOrder", {
          teacher: item.Teacher,
          student: item.Student,
          subject: item.subject,
          orderId: item.id,
          orderDate: item.date
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
            elevation: 12
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
                uri: "https://www.abadikini.com/media/files/2019/09/IMG_20190908_191823-390x220.jpg",
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
                {item.Student.name}
              </Text>
              <Text
                style={{ fontSize: 13, color: "#008bb5", marginLeft: "1%" }}
              >
                {item.Student.email}
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
                {item.Student.telpon_number}
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
                {item.date}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const goSquare = ({ item }) => {
    return (
      <View>
        <View
          style={{
            height: 215,
            width: 160,
            padding: 10,
            backgroundColor: "floralwhite",
            borderRadius: 20,
            elevation: 12
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
                uri: "https://www.abadikini.com/media/files/2019/09/IMG_20190908_191823-390x220.jpg",
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
              {item.Student.name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                alignSelf: "center",
                color: "#008bb5",
              }}
            >
              {item.subject}
            </Text>
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
               {item.date}
              </Text>
            </View>
          </View>
 
        </View>
      </View>
    );
  };
  
  const SLIDER_WIDTH = Dimensions.get("window").width;

  return (
    // <SafeAreaView style={styles.container}>
    <>
      <View style={styles.top}></View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          // backgroundColor: "red",
        }}
      >
        <Title style={styles.title}>Hello!</Title>
        <Switch
          style={{ right: "10%", top: "5%" }}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#008bb5" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={(value) => {
            toggleSwitch(value);
          }}
          value={isEnabled}
        />
      </View>
      <Text style={{ fontSize: 26, color: "white", fontWeight: "bold", marginLeft: "5%" }}>
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
        style={{ fontSize: 26, color: "#48bcae", marginLeft: "5%", top: "5%", fontWeight: 'bold' }}
      >
        History
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
          data={history}
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
    fontSize: 20,
    color: "white",
    marginLeft: "5%",
    marginTop: "10%",
    fontWeight: "200",
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
    borderColor: "red",
  },
  profileImg2: {
    width: 90,
    height: 90,
    borderRadius: 150 / 2,
    overflow: "hidden",
  }
});
