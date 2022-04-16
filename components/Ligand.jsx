import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from "react-native";
import ProteinDetail from "./ProteinDetail";

export default function Ligand({ navigation, route }) {
  return (
    <View style={styles.ligandPage}>
      <StatusBar backgroundColor="#000" barStyle="dark-content" />
      <View style={styles.content}>
      </View>
      {/* <ProteinDetail atom="C" /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  ligandPage: {
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  content: {
    backgroundColor: "#000",
    opacity: 0.9,
    width: "100%",
    flex: 1,
  }
})