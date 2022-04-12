import React from 'react';
import { View, Pressable, Dimensions, StyleSheet, Text } from 'react-native'

const { width } = Dimensions.get('window')

const ProteinDetail = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.atomContainer}>
        <Text style={styles.atomLabel}>C</Text>
      </View>
      <View style={styles.atomDetailContainer}>
        <Text style={styles.atomDetailLabel}>lol</Text>
      </View>
      <View style={styles.proteinContainer}>
        <Text style={styles.proteinDetail}>lol</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    backgroundColor: "#333B42",
    borderRadius: 28,
    marginHorizontal: width * 0.1,
    minWidth: width * 0.89,
    maxWidth: width * 0.89,
    minHeight: 90,
    borderWidth: 3,
    borderColor: "red",
    // padding: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 1,
    borderColor: "#333B42"
  },
  atomContainer: {
    width: 35,
    height: 55,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  atomLabel: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  atomDetailContainer: {
    flex: 1,
    backgroundColor: "white",
    height: 55,
    justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 10,
  },
  proteinContainer: {
    backgroundColor: "green",
    width: width * 0.15,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    marginLeft: 10,
  },
  proteinDetail: {
    fontSize: 25,
  }
})


export default ProteinDetail; 