import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Button
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";

export default function ProfilePage() {
  const [image, setImage] = useState(null);
  const dataProfile = {
    name: "Zaidan Ammar",
    email: "bam@gmail.com",
    phone: "0812121212",
  };
  const navigate = useNavigation();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#008bb5", "#48bcae"]}
      style={{ height: "100%" }}
    >
      <View style={styles.top}></View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>Profile</Text>
        <MaterialCommunityIcons
          style={styles.icon}
          name="logout"
          color="white"
          size={26}
          onPress={(e) => {
            navigate.replace("Landing");
          }}
        ></MaterialCommunityIcons>
      </View>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Image
            source={image? {uri: image} : {
              uri:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
            style={styles.profileImg}
          />
          <View style={{ justifyContent: "center", marginRight: "28%" }}>
            <Text style={styles.text}>{dataProfile.name}</Text>
            <Text style={styles.text2}>{dataProfile.email}</Text>
            <Text style={styles.text2}>{dataProfile.phone}</Text>
          </View>
        </View>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {/* <View>
          <TouchableHighlight
            style={styles.button}
            onPress={(e) => {
              navigate.replace("Landing");
            }}
          >
            <Text>LOGOUT</Text>
          </TouchableHighlight>
        </View> */}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -420,
    justifyContent: "space-between",
    // flexDirection: "row",
    marginLeft: "5%",
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 150 / 2,
    overflow: "hidden",
    // borderWidth: 3,
    // borderColor: "red",
  },
  button: {
    alignItems: "center",
    marginBottom: "2%",
    padding: 10,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    borderRadius: 30,
    width: "30%",
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
  icon: {
    marginTop: "10%",
    marginRight: "3%",
  },
  top: {
    width: "100%",
    height: "35%",
    backgroundColor: "rgba(127,125,120, 0.9)",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    position: "absolute",
  },
  text: {
    fontSize: 22,
    fontWeight: "500",
    color: "floralwhite",
    marginBottom: "3%",
  },
  text2: {
    fontSize: 16,
    fontWeight: "300",
    color: "floralwhite",
    marginBottom: "3%",
  },
});
