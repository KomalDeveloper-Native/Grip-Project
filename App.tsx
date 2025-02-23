/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/layouts/navigation/AppNavigation';
import {firebase} from './firebaseConfig';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {LogBox} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from  'react-native-splash-screen'
import { CombinedDarkTheme, CombinedDefaultTheme } from './src/utils/theme';
import { Provider, useSelector } from 'react-redux';
import store from './src/Redux/store';
if (!firebase.apps.length) {
  firebase.initializeApp();
}

function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, );

  })
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize("0467873e-af8b-43b5-927f-add391e15d83");
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('OneSignal: notification clicked:', event);
    });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <PaperProvider >
    <NavigationContainer >
    <Provider store={store}>
      <AppNavigation />
      </Provider>
    </NavigationContainer>
  </PaperProvider>
 </GestureHandlerRootView>
  );
}
export default App