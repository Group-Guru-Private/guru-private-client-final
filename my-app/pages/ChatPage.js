import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleSheet, TextInput, View, LogBox, Button, Text } from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDB0FYj13cgwV-NxfP2rTgIMCO5OxiCOlM",
    authDomain: "chatapp-cebc2.firebaseapp.com",
    databaseURL: "https://chatapp-cebc2-default-rtdb.firebaseio.com",
    projectId: "chatapp-cebc2",
    storageBucket: "chatapp-cebc2.appspot.com",
    messagingSenderId: "264855153546",
    appId: "1:264855153546:web:868110e43a679db8833673"
}

LogBox.ignoreLogs(['Setting a timer for a long period of time'])

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
}

const db = firebase.firestore()
const chatsRef = db.collection('chats')

export default function ChatScreen({route}) {
    const [user, setUser] = useState(null)
    const [name, setName] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    console.log(route, 'isi route');
    useEffect(() => {
        readUser()
        // const user = { _id: route.params.id, name: route.params.name }
        // setUser(user)
        const unsubscribe = chatsRef.onSnapshot((querySnapshot) => {
            setLoading(true)
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type === 'added')
                // .filter(data => {
                //     console.log(data);
                //     return data
                // })
                .map(({ doc }) => {
                    const message = doc.data()
                    // createdAt is firebase.firestore.Timestamp instance
                    //https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
                    return { ...message, createdAt: message.createdAt.toDate() }
                })
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                const allMesages = messagesFirestore.filter(el => el.roomId == route.params.roomId)
                console.log(messagesFirestore), 'messagefireeeeeee';
                appendMessages(allMesages)
        })
        return () => unsubscribe()
    }, [])
    
    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
            setLoading(false)
        },
        [messages]
    )

    async function readUser() {
        const user = await AsyncStorage.getItem('user')
        if (user) {
            setUser(JSON.parse(user))
        }
    }

    async function handlePress() {
        const _id = route.params.userId
        const user = { _id, name: route.params.name }
        await AsyncStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }

    async function handleSend(messages) {
        const writes = messages.map((m) => {
            m.roomId = route.params.roomId
            return chatsRef.add(m)
            }
        )
        await Promise.all(writes)
    }
    
    function renderBubble (props) {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: 'aqua'
              }
            }}
          />
        )
      }
    

    if (!user) {
        handlePress()
    }

    return (
        <View style={{ backgroundColor: "#8c8f8d", flex: 1 }}>
            <GiftedChat
                messages={messages}
                onSend={handleSend}
                user={user}
                containerStyle={{ backgroundColor: "black" }}
            />
        </View>
    )
    //<GiftedChat renderBubble={renderBubble} messages={messages} user={user} onSend={handleSend} style={{backgroundColor: 'red'}}/>
           
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 15,
        marginBottom: 20,
        borderColor: 'gray',
    },
})
