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
  Alert
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
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

export default function HomeTeacherPage() {
  const [isEnabled, setIsEnabled] = useState();
  
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    getDataById()

    return function cleanUp() {
      abortController.abort()
    }
  },[])
  
  async function toggleSwitch (value) {
    setIsEnabled(value)

    try {
      const access_token = await AsyncStorage.getItem('access_token')
      
      axios({
        url: `http://192.168.0.100:3000/teachers`,
        method: 'PATCH',
        headers: {
          access_token: access_token
        },
        data: {
          status: value
        }
      })
      .then(({data}) => {
        
        if(value){
          Alert.alert(`Working`)
        }else{
          Alert.alert(`Off Working`)
        }
      })
      .catch(err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  };

  async function getDataById () {
    try {
      const value = await AsyncStorage.getItem('id')
      
      axios({
        url: `http://192.168.0.100:3000/teachers/${value}`,
        method: 'GET'
      })
      .then(({data}) => {
        setIsEnabled(data.available_status)
      })
      .catch(err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  const goDetail = ({item}) => {
    return (
      <View style={{
        height: 250,
        padding:10,
        justifyContent: 'center',
        backgroundColor: 'floralwhite',
        borderRadius:20
      }}>
        <Text style={{fontSize: 20}}>{item.title}</Text>
      </View>
    )
  };
  const goSquare = ({item}) => {
    return (
      <View style={{
        height: 150,
        padding:10,
        justifyContent: 'center',
        backgroundColor: 'floralwhite',
        borderRadius:20
      }}>
        <Text style={{fontSize: 20}}>{item.title}</Text>
      </View>
    )
  };

  const SLIDER_WIDTH = Dimensions.get('window').width

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.top}></View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Title style={styles.title}>Hello!</Title>
        <Switch
          style={{right: "10%", top: "5%"}}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={value => {toggleSwitch(value)}}
          value={isEnabled}
        />
      </View>
      <Text style={{ fontSize: 20, color: 'white', marginLeft: '6%' }}>Pak Agus</Text>
      <View style={{flex:1, flexDirection: 'row', justifyContent: "center", marginTop: '5%'}}>
      <Carousel layout={'default'} sliderWidth={SLIDER_WIDTH} data={photo} itemWidth={350} renderItem={goDetail}></Carousel>
      </View>
      <Text style={{ fontSize: 26, color: "#48bcae", marginLeft: '5%', top: '5%' }}>List Students</Text>
      <View style={{flex:1, flexDirection: 'row', marginLeft: '-20%', marginTop: '15%',}}>
      <Carousel layout={'default'} sliderWidth={SLIDER_WIDTH} data={photo} itemWidth={200} renderItem={goSquare}></Carousel>
      </View>
   </SafeAreaView>
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
    marginBottom: "2%",
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
