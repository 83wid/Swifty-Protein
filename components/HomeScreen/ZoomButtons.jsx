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

export default function ZoomButtons({ZoomIn, ZoomOut}) {
  return (
    <SafeAreaView style={{
      position: "absolute",
      top: 20,
      right: 20,
      zIndex: 2,
    }}>
      <View
        style={{
          padding: 4,
          backgroundColor: "white",
          borderRadius: 10,
        }}
      >
        <TouchableOpacity onPress={ZoomIn}>
          <View
            style={{
              backgroundColor: "#D8D8D8",
              width: 40,
              height: 40,
              fontSize: 20,
              marginBottom: 5,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="plus" size={20} color="black" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={ZoomOut}>
          <View
            style={{
              backgroundColor: "#D8D8D8",
              width: 40,
              height: 40,
              fontSize: 20,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="minus" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}