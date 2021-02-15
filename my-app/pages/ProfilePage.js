import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Button,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "../config/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfilePage({navigation}) {
  const [image, setImage] = useState(null);
  const [profile, setProfile] = useState([])

  const navigate = useNavigation();

  useEffect(() => {
     getId()
  },[])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //Alert.alert('Refreshed');
    });
    return unsubscribe;
  }, [navigation]);

  
  const getId = async () => {
    try {
      const idStudent = await AsyncStorage.getItem('id')
      Number(idStudent)
      axios
        .get(`/students/${idStudent}`)
        .then(({data}) => {
          setProfile(data)
        })
    } catch (error) {
      console.log(error)
    }
  }

  console.log(profile, '<<<<<')

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
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

    return function cleanUp() {
      abortController.abort();
    };
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const generateName = result.uri.split('/')

      const uploadFile = {
        uri: result.uri,
        type: "image/png",
        name: generateName[generateName.length-1]
      }

      setImage(result.uri);
      handeUpload(uploadFile)
    }
  };


  const handeUpload = (image) => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'ruangprivate')
    data.append('cloud_name', "farhats")

    axios({
      url: "https://api.cloudinary.com/v1_1/farhats/image/upload",
      method: 'POST',
      data: data
    })
    .then(data => {
      console.log(data)
    })
    .catch(err => {
      console.log(err);
    })
    
  }

  return (
    // <LinearGradient
    //   // Background Linear Gradient
    //   colors={["#008bb5", "#48bcae"]}
    //   style={{ height: "100%" }}
    // >
      <>
      <View style={styles.top}></View>
      <View
        style={{
          flex: 0.2,
          flexDirection: "row",
          justifyContent: "space-between",
          // backgroundColor: 'blue'
        }}
      >
        {/* <Text style={styles.title}>Profile</Text> */}
        <TouchableHighlight style={{marginTop: Constants.statusBarHeight, left: '12%'}}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="pencil"
            color="white"
            size={28}
            onPress={(e) => {
              navigate.navigate("EditStudent", {profile});
            }} 
          ></MaterialCommunityIcons>
        </TouchableHighlight>
        <TouchableHighlight style={{marginTop: Constants.statusBarHeight,  right: '2%'}}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="logout"
            color="white"
            size={28}
            onPress={(e) => {
              navigate.replace("Landing");
            }} 
          ></MaterialCommunityIcons>
        </TouchableHighlight>
      </View>
      <View style={styles.container}>
        <View style={{ alignItems: "flex-start", alignSelf: 'center' }}>
          <Image
            source={
              image
                ? { uri: image }
                : {
                    uri:
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  }
            }
            style={styles.profileImg}
          />
        </View>
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.title}>{profile.name}</Text>
          </View>
          <View style={{ justifyContent: "center", marginHorizontal: '6%', marginVertical: '5%' }}>
            <Text style={styles.text}>Email</Text>
            <Text style={styles.text2}>{profile.email}</Text>
            <Text style={styles.text}>Phone Number</Text>
            <Text style={styles.text2}>{profile.telpon_number}</Text>
            <Text style={styles.text}>Address</Text>
            <Text style={styles.text2}>{profile.address}</Text>
          </View>
      </View>
        {/* <Button title="test edit" onPress={() => navigate.replace('EditStudent', {profile})} /> */}
        {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
      </>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    top: '-6%',
    // backgroundColor: 'green'
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 150 / 2,
    overflow: "hidden",
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
    marginTop: "3%",
    marginBottom: "5%",
    fontSize: 28,
    fontWeight: "bold",
    // backgroundColor: 'red',
    color: "white",
  },
  icon: {
    marginTop: Constants.statusBarHeight,
    marginRight: "3%",
  },
  top: {
    width: "100%",
    height: "35%",
    backgroundColor: "#008bb5",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    position: "absolute",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#008bb5",
  },
  text2: {
    fontSize: 18,
    fontWeight: "300",
    color: "#008bb5",
    marginBottom: "5%",
    marginTop: '3%'
  },
});
