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

  // useEffect(() => {
  //   (async () => {
  //     const networkStatus = await Network.getNetworkStateAsync();

  //     console.log(networkStatus);
  //   })();
  // }, []);

  const handleAppStateChange = nextAppState => {
    if ((appState.current === 'active' || appState.current === 'inactive') && nextAppState === 'background')
      navigation.navigate('Login');

    console.log('AppState', appState.current, nextAppState);
    appState.current = nextAppState;
  };

  return (
    <View style={styles}>
      {children}
    </View>
  )
}