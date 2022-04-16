import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Views/Login";
import Home from "./Views/Home";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import AnimatedSplash from "react-native-animated-splash-screen";
import { StyleSheet, AppState } from "react-native";
import Ligand from "./components/Ligand";
import { navigationRef } from './components/RootNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/) && appState.current === 'active')
      console.log(navigationRef.current.navigate('Login'));

    appState.current = nextAppState;
  };

  useEffect(() => {
    (async () => {
      await SplashScreen.hideAsync();
    })();
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
          {/* <Stack.Group screenOptions={{ presentation: 'modal', gestureEnabled: false, customAnimationOnGesture: false }}> */}
          <Stack.Screen
            name="Ligand"
            component={Ligand}
            // options={{ headerShown: false }}
            options={({ route }) => ({
              title: route.params.name,
            })}
          />
          {/* </Stack.Group> */}
        </Stack.Navigator>
      </NavigationContainer>
    </AnimatedSplash>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 60,
    width: '100%',
  },
  headerIcon: {
    position: 'absolute',
    left: 13
  },
  dissmisable: {
    position: 'absolute',
    width: 45,
    height: 5,
    backgroundColor: "#d3d3d3",
    top: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d4d4d6",
  },
  headerTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: "#000",
    opacity: 0.9,
    width: "100%",
    flex: 1,
  }
})