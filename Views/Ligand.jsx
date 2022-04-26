import { View, StyleSheet, StatusBar, Dimensions, Text } from "react-native";
import useOrientation from '../Hooks/useOrientation';
import { useEffect, useRef } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';
import ZoomButtons from "../components/HomeScreen/ZoomButtons";
import BottomHalfModal from "../components/HomeScreen/modal";
import ProteinView from "../components/ProteinView";

export default function Ligand({ navigation, route }) {
  const headerHeight = useHeaderHeight();
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height - headerHeight;
  const containers = useRef(null)
  // const orientation = useOrientation();
  console.log("here3");

  return (
    <View style={{
      ...styles.ligandPage,
      // width: orientation === 'portrait' ? width : width,
      // height: orientation === "portrait" ? height : height,
      width: width,
      height: height,
    }}
      ref={containers}
    >
      <StatusBar backgroundColor="#000" barStyle="dark-content" />
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <ProteinView {...route.params.data} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ligandPage: {
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    // width: "100%",
    // height: "100%"
  },
  content: {
    backgroundColor: "#000",
    opacity: 0.9,
    width: "100%",
    // height: "87%",
    flex: 1,
    // height: 20,
  }
})