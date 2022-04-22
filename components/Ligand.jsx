import { View, StyleSheet, StatusBar } from "react-native";
import { useContext } from "react";
import { ProteinDetail } from "./proteinDetail";
import SwitchButton from "./HomeScreen/SwitchButton";
import Protein from "./proteinView";
import { LigandContext } from "../context/state";

export default function Ligand({ navigation, route }) {
  const value = useContext(LigandContext);
  return (
    <View style={styles.ligandPage}>
      <StatusBar backgroundColor="#000" barStyle="dark-content" />
      <View style={styles.content}>
        <Protein {...route.params.data} />
        <SwitchButton
          addedStyle={{ left: 20, top: 20 }}
          items={[
            {
              name: "F-P",
              value: 0,
            },
            {
              name: "P-C",
              value: 1,
            },
            {
              name: "P-A",
              value: 2,
            },
          ]}
        />
      </View>
      <ProteinDetail atom="" />
    </View>
  );
}

const styles = StyleSheet.create({
  ligandPage: {
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  content: {
    backgroundColor: "#000",
    opacity: 0.9,
    width: "100%",
    flex: 1,
  },
});
