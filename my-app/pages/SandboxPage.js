import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableHighlight, Touchable } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
    const [role, setRole] = useState('')
    const [name, setName] = useState('')
    const [currentSubject, setCurrSubject] = useState('')
    const subjects = ['mtk', 'english', 'ipa', 'ips']
    const image = { uri: "https://smallimg.pngkey.com/png/small/2-24221_google-chrome-apple-fedex-and-mcdonalds-are-some.png" };


    if (role === 'teacher') {
        return (
            <LinearGradient
                        // Background Linear Gradient
                        colors={['#008bb5','#48bcae']}
                        style={{height: '100%'}}
                    >
                    <View style={styles.container} >
                        <Text>Register Teacher</Text>
                        <TextInput value={name} onChangeText={text => setName(text)}></TextInput>
                        <StatusBar style="auto" />
                        {/* <Button
                        onPress={(e) => {setRole(false)}}
                        title="Learn More"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                        /> */}
                        <Picker
                            selectedValue={role}
                            style={{ height: 50, width: 150 }}
                            onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
                        >
                            <Picker.Item label="Student" value="student" />
                            <Picker.Item label="Teacher" value="teacher" />
                        </Picker>
                        <Picker
                            selectedValue={currentSubject}

                            style={{ height: 50, width: 150 }}
                            onValueChange={(itemValue, itemIndex) => setCurrSubject(itemValue)}
                        >
                            {
                                subjects.map(subject => {
                                    return <Picker.Item label={subject} value={subject} />
                                })
                            }
                        </Picker>
                    </View>
                    
                    <View
                        style={styles.test}
                    >
                        <Text style={{top: -50}}>Submit</Text>
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
                    <View style={styles.container}>
                        <Text>Register Student</Text>
                        <TextInput value={name} onChangeText={text => setName(text)}></TextInput>
                        {/* <Button
                        onPress={(e) => {setRole(true)}}
                        title="Learn More"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                        /> */}
                        <Picker
                            selectedValue={role}
                            style={{ height: 50, width: 150 }}
                            onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
                        >
                            <Picker.Item label="student" value="student" />
                            <Picker.Item label="teacher" value="teacher" />
                        </Picker>
                    </View>
                        
                    <View
                        style={styles.test}
                    >
                        <Text style={{top: -50}}>Submit</Text>
                    </View>
                </LinearGradient>
        );
    }
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
    submit: {
        flex: 1,
        justifyContent: 'flex-end',
        borderRadius:100,
        width: 10,
        borderColor: '#fff',
        backgroundColor: 'white'
      },
    test: {
        flex: 0.2,
        borderRadius: 100,
        bottom: -50,
        alignItems: 'center',
        backgroundColor: 'white'
    }
});
