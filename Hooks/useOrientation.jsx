import { useWindowDimensions, Dimensions } from "react-native";
import { useEffect, useState } from "react";

// create a useOrientation hook

export default function useOrientation() {
  const [orientation, setOrientation] = useState("");
  // const { width, height } = useWindowDimensions();
  // const {width} = Dimensions.get("screen");

  const updateOrientation = () => {
    if (Dimensions.get("screen").width > Dimensions.get("screen").height) {
      setOrientation("landscape");
    } else {
      setOrientation("portrait");
    }
  };

  useEffect(() => {
    updateOrientation();
  }, []);

  useEffect(() => {
    Dimensions.addEventListener("change", updateOrientation);
    return () => {
      Dimensions.removeEventListener("change", updateOrientation);
    };
  }, []);

  return orientation;
}