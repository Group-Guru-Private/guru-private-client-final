import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableHighlight, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function OrderPage({navigation, route}) {
    const { teacher } = route.params
    const [subject, setSubject] = useState(teacher.subjects[0])
    const listSubjects = ['Biology', 'Mathematics', 'English', 'Programming']

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

      const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
      };
    
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };

      const submitOrder = async () => {
        try {
          const value = await AsyncStorage.getItem('access_token')
          if(value !== null) {
            axios({
              url: `http://192.168.0.100:3000/orders/${teacher.id}`,
              method: 'POST',
              data: {
                subject: subject,
                date: date,
                distance: 20
              },
              headers: {
                access_token: value
              }
            })
            .then(({data}) => {
              Alert.alert(JSON.stringify(data))
            })
            .catch(err => {
              console.log(err);
            })
          }
        } catch(e) {
          // error reading value
          console.log(e);
        }
      }

    return (
        <LinearGradient
              // Background Linear Gradient
              colors={['#008bb5','#48bcae']}
              style={{height: '100%'}}
          >
          </View>
        </View>
        </View>
          <View
              style={styles.containerbot}
          >
              <Picker
                selectedValue={subject}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => setSubject(itemValue)}
              >
              {
                teacher.subjects.map((mapel, index) => {
                    return <Picker.Item key={index} label={mapel} value={mapel} />
                })
              }
              </Picker>
              <TouchableHighlight style={styles.input} onPress={showDatepicker}>
                  <Text>{date.toLocaleDateString()}</Text>
              </TouchableHighlight>
                {(show &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
                )}
              <TouchableHighlight style={styles.button} onPress={e => {submitOrder()}}>
                <Text>Order</Text>
              </TouchableHighlight>
          </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '-55%',
    justifyContent: "space-between",
    // flexDirection: "row",
    marginLeft: "5%",
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
    top: {
      width: "100%",
      height: "35%",
      backgroundColor: "rgba(127,125,120, 0.9)",
      borderBottomRightRadius: 25,
      borderBottomLeftRadius: 25,
      position: "absolute",
    },title: {
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
