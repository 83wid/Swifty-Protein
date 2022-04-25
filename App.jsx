import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Views/Login";
import Home from "./Views/Home";
import Ligand from "./Views/Ligand";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import AnimatedSplash from "react-native-animated-splash-screen";
import { AppState } from "react-native";
import { navigationRef } from './components/RootNavigation';
import { AppWrapper } from "./context/state";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const appState = useRef(AppState.currentState);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/) && appState.current === 'active')
      navigationRef.current.navigate('Login');

    appState.current = nextAppState;
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync();
    setTimeout(async () => {
      setIsLoaded(true);
    }, 2000);
  }, []);

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={isLoaded}
      logoImage={require("./assets/LogoBlack.png")}
      backgroundColor={"#000"}
      logoHeight={250}
      logoWidth={250}
    >
      <AppWrapper>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Ligand"
              component={Ligand}
              options={({ route }) => ({
                title: route.params.name,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppWrapper>
    </AnimatedSplash>
  );
}