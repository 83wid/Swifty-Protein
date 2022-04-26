import { View, Text, TouchableWithoutFeedback, Animated, Easing, SafeAreaView } from "react-native";
import { useRef, useEffect, useState, useContext } from 'react';
import { LigandContext } from "../../context/state";

export default function ModeSwitchButton({ addedStyle, items }) {
  const [indicatorTransition, setIndicatorTransition] = useState(null);
  const translation = useRef(new Animated.Value(0)).current;
  const [buttonWidth, setButtonWidth] = useState(0);
  const value = useContext(LigandContext);
  const setLigandMode = value.state.setLigandMode;
  const ligandmode = value.state.ligandmode;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 65 * ligandmode,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, [indicatorTransition]);

  return (
    <View style={{
      position: 'absolute',
      backgroundColor: '#FFF',
      flexDirection: 'row',
      borderRadius: 12,
      padding: 3,
      alignItems: 'center',
      ...addedStyle
    }}
    >
      {items.map((item, index) => {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              setIndicatorTransition(buttonWidth * index);
              setLigandMode(item.value);
            }}
            onLayout={(e) => {
              setButtonWidth(e.nativeEvent.layout.width);
            }}
            key={index}
          >
            <View
              style={{
                width: 65,
                height: 35,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                }}
              >{item.name}</Text>
            </View>
          </TouchableWithoutFeedback>
        )
      })}
      <Animated.View
        style={{
          width: buttonWidth,
          height: 35,
          position: 'absolute',
          backgroundColor: "#D8D8D8",
          borderRadius: 10,
          transform: [{ translateX: translation }],
          zIndex: -1,
          left: 3,
        }}
      ></Animated.View>
    </View>
  );
}