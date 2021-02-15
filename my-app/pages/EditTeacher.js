import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Button,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import axios from "../config/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import NumberFormat from "react-number-format";
import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";

const region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function EditStudent({ route }) {
  const [currentPositions, setCurrentPositions] = useState(region);
  const navigate = useNavigation();
  const { profile } = route.params;
  const [slide, setSlide] = useState({
    value: 0,
    count: 0,
  });
  const [photo, setPhoto] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")

  //console.log(profile, "<<<< sliderr");

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

  const [newProfile, setNewProfile] = useState({
    name: "",
    address: "",
    telpon_number: "",
    price: 0,
    background: "",
    position: [],
    image_url: "https://www.abadikini.com/media/files/2019/09/IMG_20190908_191823-390x220.jpg"
  });

  useEffect(() => {
    setNewProfile({
      name: profile.name,
      address: profile.address,
      telpon_number: profile.telpon_number,
      price: profile.price,
      background: profile.background,
      position: profile.position,
      image_url: profile.image_url
    });

    setCurrentPositions({
      ...currentPositions,
      latitude: profile.position[0],
      longitude: profile.position[1],
    });
  }, []);

  const changePositions = (e) => {
    console.log(e.nativeEvent);
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCurrentPositions({
      ...currentPositions,
      latitude,
      longitude,
    });
    setNewProfile({
      ...newProfile,
      position: [latitude, longitude],
    });
  };

  const getAccessToken = async () => {
    //alert(JSON.stringify(newProfile))
    try {
      const access = await AsyncStorage.getItem("access_token");
      const id = await AsyncStorage.getItem("id");

      axios({
        url: `/teachers/${id}`,
        method: "PUT",
        headers: {
          access_token: access,
        },
        data: newProfile,
      })
        .then(async ({ data }) => {
          try {
            console.log(data);
            await AsyncStorage.removeItem("name");
            await AsyncStorage.setItem("name", newProfile.name);
            Alert.alert(`Edit Success`);
            navigate.reset({
              index: 0,
              routes: [{ name: "BottomNavTeacher" }]
            })
          } catch (error) {
            console.log(error);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  async function uploadImage () {
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

      handleUpload(uploadFile)
    }
  }

  const handleUpload = (image) => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'ruangprivate')
    data.append('cloud_name', "farhats")

    axios({
      url: "https://api.cloudinary.com/v1_1/farhats/image/upload",
      method: 'POST',
      data: data
    })
    .then(async ({data}) => {
      const duplicate = {...newProfile, image_url: data.url}
      try {
        const access_token = await AsyncStorage.getItem("access_token");
        const id = await AsyncStorage.getItem("id");
        axios({
          url: `/teachers/${id}`,
          method: "PUT",
          headers: {
            access_token: access_token,
          },
          data: duplicate
        })
        .then(({ data: response }) => {
          setNewProfile({...newProfile, image_url: data.url})
          Alert.alert('Success to upload image')
        })
        .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    })
    .catch(err => {
      console.log(err);
    })
    
  }


  const handleChange = (inputValue, inputName) => {
    let value = inputValue;
    const name = inputName;
    setNewProfile({ ...newProfile, [name]: value });
  };

  return (
    <>
      <View style={styles.top}></View>
      <View
        style={{
          flex: 0.2,
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "3%",
        }}
      >
        <View></View>
        <TouchableHighlight
          style={{
            marginTop: Constants.statusBarHeight,
            right: "4%",
            height: "150%",
          }}
          onPress={(e) => {
            getAccessToken();
          }}
        >
          <Text style={styles.text1}>Save</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.container}>
        <View style={{ alignItems: "flex-start", alignSelf: "center", marginTop: '10%' }}>
      <TouchableOpacity onPress={uploadImage}>
          <Image
            source={{
              uri: newProfile.image_url,
            }}
            style={styles.profileImg}
          />
          
          <MaterialCommunityIcons
            name="pencil"
            size={29}
            color={"floralwhite"}
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              marginTop: "20%",
              right: "-2%",
            }}
          ></MaterialCommunityIcons>
       
        </TouchableOpacity>
        </View>
      </View>
      
      <View style={{ marginHorizontal: "5%", top: "13%" }}>
       
        <Text style={styles.text}>Name</Text>
        <TextInput
          value={newProfile.name}
          onChangeText={(value) => handleChange(value, "name")}
          style={styles.input}
        ></TextInput>
        <Text style={styles.text}>Background</Text>
        <TextInput
          value={newProfile.background}
          onChangeText={(value) => handleChange(value, "background")}
          style={styles.input}
        ></TextInput>
        <Text style={styles.text}>Address</Text>
        <TextInput
          value={newProfile.address}
          onChangeText={(value) => handleChange(value, "address")}
          style={styles.input}
        ></TextInput>
        <Text style={styles.text}>Phone Number</Text>
        <TextInput
          value={newProfile.telpon_number}
          onChangeText={(value) => handleChange(value, "telpon_number")}
          style={styles.input}
        ></TextInput>
        <Text style={styles.text}>Location</Text>
         <MapView
          region={currentPositions}
          style={{ width: "100%", height: "30%", marginVertical: '3%' }}
        >
          <Marker
            draggable
            coordinate={{
              latitude: currentPositions.latitude,
              longitude: currentPositions.longitude,
            }}
            onDragEnd={changePositions}
          />
        </MapView>
        <Text style={styles.text}>Price</Text>
        <View>
          <Slider
            onSlidingComplete={(value) =>
              handleChange(value * 1000000, "price")
            }
          ></Slider>
          <Text>Price: {newProfile.price.toFixed()} / 90 minutes</Text>
          {/* <Text>
          <NumberFormat value={slide.value} displayType={'text'} thousandSeparator={true} prefix={'IDR'} />
          </Text> */}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  top: {
    width: "100%",
    height: "22%",
    backgroundColor: "#008bb5",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    position: "absolute",
  },
  container: {
    flex: 0.3,
    justifyContent: "flex-start",
    top: "-2%",
    // backgroundColor: "red",
  },
  profileImg: {
    width: 120,
    height: 120,
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
    marginTop: "10%",
    marginBottom: "5%",
    marginLeft: "5%",
    textAlign: "left",
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    marginTop: Constants.statusBarHeight,
    marginRight: "3%",
  },
  text: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#008bb5",
    // backgroundColor: 'red'
  },
  text1: {
    fontSize: 22,
    fontWeight: "bold",
    color: "floralwhite",
    // backgroundColor: 'red'
  },
  text2: {
    fontSize: 18,
    fontWeight: "300",
    color: "#008bb5",
    marginBottom: "5%",
    marginTop: "3%",
  },
  input: {
    marginTop: "2%",
    marginBottom: "1%",
  },
});
