import React, {useRef, useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {BackHandler, SafeAreaView} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  let baseUrl = 'http://tutorlab.co.kr/';
  const webview = useRef();
  const [exitApp, SETexitApp] = useState(false);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  const backAction = () => {
    if (exitApp == false) {
      SETexitApp(true);
      // Toast.show({
      //   text2: '한번 더 뒤로가기 버튼을 누르면 종료됩니다.',
      //   topOffset: 640,
      //   visibilityTime: 500,
      // });
      onAndroidBackPress();
    } else if (exitApp == true) {
      BackHandler.exitApp();
    }

    setTimeout(() => {
      SETexitApp(false);
    }, 500);
    return true;
  };
  const onAndroidBackPress = () => {
    if (webview.current) {
      webview.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [exitApp]);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }, []); // Never re-run this effect
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('fcmTOken', fcmToken);
  };

  useEffect(() => {
    getFcmToken();
  }, []);
  useEffect(() => {
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // });
    requestUserPermission();
    // return unsubscribe;
  }, []);
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  }
  return (
    <SafeAreaView style={{flex: 1, zIndex: 0, backgroundColor: 'transparent'}}>
      <WebView
        source={{uri: baseUrl}}
        ref={webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
};

export default App;
