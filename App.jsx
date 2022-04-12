import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Views/Login";
import Home from "./Views/Home";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AnimatedSplash from "react-native-animated-splash-screen";
import { View, Text } from "react-native";

const Stack = createNativeStackNavigator();

const Ligand = ({ navigation }) => {
  return (
    <View>
      <Text>Ligand</Text>
    </View>
  )
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

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
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Ligand" component={Ligand} options={({ route }) => ({ title: route.params.name })} />
        </Stack.Navigator>
      </NavigationContainer>
    </AnimatedSplash>
  );
}
