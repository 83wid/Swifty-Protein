import { AppState, View } from "react-native";
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export default function ViewsContainer({ navigation, children, styles }) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const networkStatus = await Network.getNetworkStateAsync();

      console.log(networkStatus);
    })();
  }, []);

  const handleAppStateChange = nextAppState => {
    // if the app state is active
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
    }
    if (appState.current === 'active' && nextAppState === 'inactive')
      navigation.navigate('Login');

    appState.current = nextAppState;
    console.log('AppState', appState.current);
  };

  return (
    <View style={styles}>
      {children}
    </View>
  )
}