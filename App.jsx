import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Views/Login";
import Home from "./Views/Home";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AnimatedSplash from "react-native-animated-splash-screen";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import ProteinDetail from "./components/ProteinDetail";

const Stack = createNativeStackNavigator();

const Ligand = ({ navigation, route }) => {
  return (
    <View style={{ overflow: "hidden", position: "relative", alignItems: "center", width: "100%", height: "100%" }}>
      <View style={styles.header}>
        <View style={styles.dissmisable}></View>
        <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.headerIcon}>
          <Feather name="chevron-left" size={25} color="#0078ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{route.params.name}</Text>
      </View>
      <View style={styles.content}>
        <Text style={{ color: "#fff" }}>Ligand</Text>
      </View>
      <ProteinDetail atom="C" />
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
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen
              name="Ligand"
              component={Ligand}
              options={{ headerShown: false }}
            />
          </Stack.Group>
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