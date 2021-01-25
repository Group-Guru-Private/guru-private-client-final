import React, {useState, useEffect} from 'react'
import {WebView} from 'react-native-webview'
import {View, Text, ActivityIndicator} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import axios from '../config/axiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function WebScreen () {
  const [token, setToken] = useState('')
  const webviewRef = React.useRef(null)
  const navigation = useNavigation()
  const idOrder = 1  //---> ini teh params ya ---> mesti diganti
  // const access_token = AsyncStorage.getItem('access_token')

  useEffect(() => {
    async function fetchToken () {
      try {
        const getToken = await axios({
          method: 'PATCH',
          url: '/orders/' + idOrder,
          headers: {
            access_token: await AsyncStorage.getItem('access_token')
          }
        })
        if (getToken) setToken(getToken.data.token)
      } catch (err) {
        console.log(err)
      }
    }
    fetchToken()
    // axios({
    //   method: 'PATCH',
    //   url: '/orders/' + idOrder,
    //   headers: {
    //     access_token
    //   }
    // })
    //   .then(({ data }) => {
    //     setToken(data.token)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }, [])

  const htmlContent = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Page</title>
        <script type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="SB-Mid-client-tuHFsrsxohwXDvQ4">
        </script>
      </head>
      <body>
        <script type="text/javascript">
            snap.pay('${token}',
            {
              onSuccess: function(result){window.ReactNativeWebView.postMessage('success');},
              onPending: function(result){window.ReactNativeWebView.postMessage('pending');},
              onError: function(result){window.ReactNativeWebView.postMessage('error');},
              onClose: function(){window.ReactNativeWebView.postMessage('close');}
            }
            );
         </script>
      </body>
    </html>
  `
  const injectedJavaScript = `(function() {
      window.postMessage = function(data){
        window.ReactNativeWebView.postMessage(data);
      };
  })()`;

  const LoadingIndicatorView = () => {
    return(
      <ActivityIndicator 
        color="red"
        size="large"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    )
  }

  const onMessage = (event) => {
    const { data } =  event.nativeEvent;
    alert(data)
    navigation.navigate('Home')
  }
  
  if (token) {
    return (
      <WebView 
        javaScriptEnabled={true}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ marginTop: 100 }}
        // injectedJavaScript={injectedJavaScript}
        renderLoading={LoadingIndicatorView}
        startInLoadingState={true}
        onMessage={onMessage}
        ref={webviewRef}
      />
    );
  } else return <View><Text>loading...</Text></View>

}
