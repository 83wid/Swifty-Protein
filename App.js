import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import { View, TouchableWithoutFeedback, Text } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";

import {
  AmbientLight,
  SphereGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from "three";

class SphereMesh extends Mesh {
  constructor() {
    super(
      new SphereGeometry(0, 50, 20, 0, Math.PI * 2, 0, Math.PI * 2),
      new MeshStandardMaterial({
        color: 0x000000,
      })
    );
  }
}

const sphere = new SphereMesh();
const camera = new PerspectiveCamera(100, 0.4, 0.01, 1000);

let cameraInitialPositionX = 0;
let cameraInitialPositionY = 2;
let cameraInitialPositionZ = 5;

export default function App() {
  return (
      <GLView
        style={{ flex: 1 }}
        onContextCreate={async (gl) => {
          // GL Parameter disruption
          const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

          // Renderer declaration and set properties
          const renderer = new Renderer({ gl });
          renderer.setSize(width, height);
          renderer.setClearColor("#fff");

          // Scene declaration, add a fog, and a grid helper to see axes dimensions
          const scene = new Scene();
          scene.fog = new Fog("#3A96C4", 1, 10000);
          scene.add(new GridHelper(10, 10));

          // Add all necessary lights
          const ambientLight = new AmbientLight(0x101010);
          scene.add(ambientLight);

          const pointLight = new PointLight(0xffffff, 2, 1000, 1);
          pointLight.position.set(0, 200, 200);
          scene.add(pointLight);

          const spotLight = new SpotLight(0xffffff, 0.5);
          spotLight.position.set(0, 500, 100);
          spotLight.lookAt(scene.position);
          scene.add(spotLight);

          // Add sphere object instance to our scene
          sphere.position.set(cameraInitialPositionX + 5,
            cameraInitialPositionY + 5,
            cameraInitialPositionZ + 5);
          scene.add(sphere);

          // Set camera position and look to sphere
          camera.position.set(
            cameraInitialPositionX,
            cameraInitialPositionY,
            cameraInitialPositionZ
          );

          camera.lookAt(sphere.position);

          // Render function
          const render = () => {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            gl.endFrameEXP();
          };
          render();
        }}
      />
    // <View style={styles.container}>
    //   {/* <GLView style={{ flex: 1 }} onContextCreate={async (gl) => {}} /> */}
    //   {/* <Text>Hello B</Text>
    //   <StatusBar style="auto" /> */}
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
