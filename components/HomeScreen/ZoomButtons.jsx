import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function ZoomButtons({ ZoomIn, ZoomOut }) {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View
        style={styles.container}
      >
        <TouchableOpacity onPress={ZoomIn}>
          <View
            style={styles.plusButton}
          >
            <Feather name="plus" size={20} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={ZoomOut}>
          <View
            style={styles.minusButton}
          >
            <Feather name="minus" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 2,
  },
  container: {
    padding: 4,
    backgroundColor: "white",
    borderRadius: 10,
  },
  plusButton: {
    backgroundColor: "#D8D8D8",
    width: 40,
    height: 40,
    fontSize: 20,
    marginBottom: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  minusButton: {
    backgroundColor: "#D8D8D8",
    width: 40,
    height: 40,
    fontSize: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  }
});