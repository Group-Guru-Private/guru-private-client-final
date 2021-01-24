import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableHighlight, Touchable } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'

export default function LandingPage() {
    const navigation = useNavigation()

    return (
        <LinearGradient
              // Background Linear Gradient
              colors={['#008bb5','#48bcae']}
              style={{height: '100%'}}
          >
          <View style={styles.container} >
              <Text style={{fontSize: 40}}>Ruang Private</Text>
          </View>
          <View
              style={styles.containerbot}
          >
              <TouchableHighlight style={styles.button} onPress={e => {navigation.replace('Login')}}>
                  <Text>SIGN IN</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.button} onPress={e => {navigation.push('Register')}}>
                  <Text>REGISTER</Text>
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
        flex: 0.4,
        alignItems: 'center'
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
