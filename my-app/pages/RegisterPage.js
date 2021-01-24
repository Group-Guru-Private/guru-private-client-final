import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableHighlight, Touchable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { LinearGradient } from 'expo-linear-gradient';
import MapView , {PROVIDER_GOOGLE} from 'react-native-maps'
import {ActivityIndicator} from 'react-native'
import axios from '../config/axiosInstance'
import {useNavigation} from '@react-navigation/native'

export default function RegisterPage() {
    const subjects = ['Mathematics', 'English', 'Chemisty', 'Physics', 'Biology', 'Bahasa Indonesia', 'History', 'Geography', 'Sociology', 'Economics']
    const initPosition = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    const navigation = useNavigation()
    const [inputData, setInputData] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      role: 'student',
      background: '',
      selectedSubject: ''
    })
    const [position, setPosition] = useState(initPosition)
    
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(currentPosition => {
        // alert(JSON.stringify(currentPosition))
        const { latitude, longitude } = currentPosition.coords
        setPosition({
          ...position,
          latitude,
          longitude
        })
      }, 
      error => alert(error.message), 
      { timeout: 5000, maximumAge: 1000 })
    }, [])

    function handleInputChange(text, inputName){
      const name = inputName
      let value = text

      setInputData({
        ...inputData,
        [name]: value
      })
    }

    const register = () => {
      if (inputData.role === 'student') {
        const payload = {
          name: inputData.name,
          email: inputData.email,
          password: inputData.password,
          role: 'student',
          address: inputData.address,
          telpon_number: inputData.phone,
          position: [position.latitude, position.longitude]
        }
        axios.post('/students/register', payload)
          .then(({ data }) => {
            navigation.navigate('Login')
          })
          .catch(err => {
            if (err) alert(err.response.data.message.split(',').map(msg => msg))
          })
      }else {
        const payload = {
          name: inputData.name,
          email: inputData.email,
          password: inputData.password,
          role: 'teacher',
          address: inputData.address,
          telpon_number: inputData.phone,
          position: [position.latitude, position.longitude],
          subjects: [inputData.selectedSubject],
          background: inputData.background,
          price: 0,
          image_url: 'https://www.abadikini.com/media/files/2019/09/IMG_20190908_191823-390x220.jpg'
        }
        axios.post('/teachers/register', payload)
          .then(({ data }) => {
            navigation.navigate('Login')
          })
          .catch(err => {
            if (err) alert(err.response.data.message.split(',').map(msg => msg))
          })
      }
    }
    // if (position.latitude !== null) {
    if (inputData.role === 'teacher') {
        return (
            <LinearGradient
                  // Background Linear Gradient
                  colors={['#008bb5','#48bcae']}
                  style={{height: '100%'}}
              >
              <View style={styles.container} >
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>Register</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'name')}}
                    placeholder="Name"
                    placeholderTextColor='white'
                    value={inputData.name}
                   />
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'email')}}
                    placeholder="Email"
                    placeholderTextColor='white'
                    value={inputData.email}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'password')}}
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor='white'
                    value={inputData.password}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'phone')}}
                    placeholder="Phone Number"
                    placeholderTextColor='white'
                    value={inputData.phone}
                   />
                   <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'address')}}
                    placeholder="Address"
                    placeholderTextColor='white'
                    value={inputData.address}
                  />
                  <Picker
                      selectedValue={inputData.role}
                      style={styles.input}
                      onValueChange={(itemValue, itemIndex) => {handleInputChange(itemValue, 'role')}}
                  >
                      <Picker.Item label="Student" value="student" />
                      <Picker.Item label="Teacher" value="teacher" />
                  </Picker>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'background')}}
                    placeholder="Background"
                    placeholderTextColor='white'
                    value={inputData.background}
                  />
                  <Picker
                      selectedValue={inputData.selectedSubject}
                      style={styles.input}
                      onValueChange={(itemValue, itemIndex) => {handleInputChange(itemValue, 'selectedSubject')}}
                  >
                      {
                          subjects.map((subject, index) => {
                              return <Picker.Item key={index} label={subject} value={subject} />
                          })
                      }
                  </Picker>
                  <TouchableHighlight style={styles.button} onPress={register}>
                    <Text>Register</Text>
                  </TouchableHighlight>
              </View>
            </LinearGradient>
        );
    } else {
        return (
          <LinearGradient
                  // Background Linear Gradient
                  colors={['#008bb5','#48bcae']}
                  style={{height: '100%'}}
              >
              {/* <MapView 
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                showsUserLocation
                initialRegion={position}
              /> */}
              <View style={styles.container}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>Register</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'name')}}
                    placeholder="Name"
                    placeholderTextColor='white'
                    value={inputData.name}
                   />
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'email')}}
                    placeholder="Email"
                    placeholderTextColor='white'
                    value={inputData.email}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'password')}}
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor='white'
                    value={inputData.password}
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'phone')}}
                    placeholder="Phone Number"
                    placeholderTextColor='white'
                    value={inputData.phone}
                   />
                  <TextInput
                    style={styles.input}
                    onChangeText={text => {handleInputChange(text, 'address')}}
                    placeholder="Address"
                    placeholderTextColor='white'
                    value={inputData.address}
                  />
                  <Picker
                      selectedValue={inputData.role}
                      style={styles.input}
                      onValueChange={(itemValue, itemIndex) => {handleInputChange(itemValue, 'role')}}
                  >
                      <Picker.Item label="Student" value="student" />
                      <Picker.Item label="Teacher" value="teacher" />
                  </Picker>
                  <TouchableHighlight style={styles.button} onPress={register}>
                    <Text>Register</Text>
                  </TouchableHighlight>
              </View>
          </LinearGradient>
        );
    }
  // } else <ActivityIndicator style={{ flex: 1 }} animating size="large" />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        height: '5%',
        width: '50%',
        borderColor: 'gray',
        borderWidth: 1,
        textAlign: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        margin: 10 
    },
    button: {
        alignItems: "center",
        marginBottom: '2%',
        padding: 10,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 30,
        width: '50%'
    }
});
