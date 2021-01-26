import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableHighlight, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native'

export default function OngoingOrderPage({navigation, route}) {
    const { teacher, subject } = route.params
    const navigate = useNavigation()
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const dataTeacher = {
        id: '123',
        name: 'Sudirman',
        email: 'sudirman@gmail.com',
        rating: 4.2,
        distance: 1.2,
        background: 'Bachelor Degree of Computer Science at Hacktiv University',
        subject: 'Biology',
        phone: '081212525252',
        date: new Date(),
        price: 170000,
        distancePrice: 30000
    }

    return (
      <LinearGradient
      // Background Linear Gradient
      colors={['#008bb5','#48bcae']}
      style={{height: '100%'}}
        >
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
              <Image source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}} style={styles.profileImg} />
              <View>
                  <Text>{teacher.name}</Text>
                  <Text>{teacher.email}</Text>
                  <View style={{flexDirection: 'row'}}>
                      <Text>{dataTeacher.distance} km</Text>
                      <Text>{dataTeacher.rating}</Text>
                  </View>
              </View>
            </View>
            <View>
              <Text>{teacher.background}</Text>
              <Text>{subject}</Text>
            </View>
        </View>
            <View
                style={styles.containerbot}
            >
            <TouchableHighlight style={styles.button} onPress={e => {navigate.push('Payment')}}>
              <Text>Chat</Text>
            </TouchableHighlight>
        </View>
      </LinearGradient>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
      flex: 1,
      resizeMode: 'repeat',
      justifyContent: "center",
      alignItems: 'center'
  },
  containerbot: {
      flex: 1,
      alignItems: 'center'
  },
  button: {
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 30,
    width: '30%',
    height: '10%'
  },
  profileImg: {
      width: 100,
      height: 100,
      borderRadius: 150 / 2,
      overflow: "hidden",
      borderWidth: 3,
      borderColor: "red"
  },
  input: {
      height: '10%',
      width: '50%',
      borderColor: 'gray',
      borderWidth: 1,
      textAlign: 'center',
      backgroundColor: 'white',
      margin: 10,
  }
  });
