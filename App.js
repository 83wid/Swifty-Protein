import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchBar from "./Views/searchBar";
import Protein from "./components/proteinView";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SearchBar"
          component={SearchBar}
          >
        </Stack.Screen>
        <Stack.Screen
        name="Protein"
        component={Protein}
        >
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}