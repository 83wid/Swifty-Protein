import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Share,
  Alert,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "./OrbitControlsView";
// import { ProteinDetail } from "./proteinDetail";
import ModeSwitchButton from "./HomeScreen/ModeSwitchButton";
import ColorSwitchButton from "./HomeScreen/ColorSwitchButton";
import { AmbientLight, PerspectiveCamera, Scene, SpotLight } from "three";
import setGeometries from "../Helpers/setGeometries";
import ViewShot from "react-native-view-shot";
import { LigandContext } from "../context/state";
import ZoomButtons from "./HomeScreen/ZoomButtons";
import BottomHalfModal from "./HomeScreen/modal";
import ShareButtons from "./HomeScreen/ShareButtons";
import { OrbitControls } from "../Helpers/controls/OrbitControls";

const raycaster = new THREE.Raycaster();

export default function Protein({ atoms, connects }) {
  const [width, setWidth] = useState(Dimensions.get("screen").width);
  const [height, setHeight] = useState(Dimensions.get("screen").height);
  const [loading, setLoading] = useState(false);

  const renderRef = React.useRef(null);
  const key = React.useRef(0);
  const value = useContext(LigandContext);
  const ligandmode = value.state.ligandmode;
  const colorMode = value.state.colorMode;
  const orientation = value.state.orientation;
  const glViewRef = useRef(0);

  //Create Camera
  const [camera, setCamera] = useState(
    new PerspectiveCamera(75, width / height, 0.01, 1000)
  );

  // set Atoms and Connects to a group
  const group = new THREE.Group();
  useEffect(() => {
    setLoading(true);
    glViewRef.current = glViewRef.current + 1;
    renderRef.current = renderRef.current + 1;
    setLoading(false);
  }, [ligandmode, colorMode, orientation]);

  const scene = new Scene();
  // Create scene

  useEffect(() => {
    // set camera position and look at center of screen
    camera.position.set(0, 0, -30);
    camera.lookAt(0, 0, 0);
    setCamera(camera);
  }, []);

  // Show Atom info when Tap on Atom
  const showAtomsInfo = ({ nativeEvent }) => {
    let pointer = new THREE.Vector2();
    pointer.x = (nativeEvent.locationX / width) * 2 - 1;
    pointer.y = -(nativeEvent.locationY / height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects.length);
    if (intersects.length > 0) {
      let element = intersects[0].object;
      if (element.info != undefined) {
        console.log("elemet", element.info);
        Alert.alert(
          "Atom Details",
          `Element : ${element.info["name"]}
          x : ${parseFloat(element.info["x"].toFixed(2))}
          y : ${parseFloat(element.info["y"].toFixed(2))}
          z : ${parseFloat(element.info["z"].toFixed(2))}`,
          [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ],
          { cancelable: false }
        );
      }
    }
  };
  const viewShotRef = React.useRef();
  // Zoom in and out on Touch
  const Zoom = (value) => {
    if (value) {
      if (camera.fov - 5 > 10) camera.fov -= 5;
    }
    if (!value) {
      if (camera.fov + 5 < 120) camera.fov += 5;
    }
    camera.updateProjectionMatrix();
    // setCamera(camera);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.8 }}>
        <OrbitControlsView
          key={renderRef.current}
          camera={camera}
          onTouchEndCapture={showAtomsInfo}
        >
          {!loading ? (
            <GLView
              key={glViewRef.current}
              style={{
                width: Dimensions.get("screen").width,
                height:  Dimensions.get("screen").height,
              }}
              onContextCreate={async (gl) => {
                const {
                  drawingBufferWidth: width,
                  drawingBufferHeight: height,
                } = gl;
                gl.viewport(0, 0, width, height);
                // Create lights

                // spotlight
                const spotLight = new SpotLight(0xffffff, 0.5);
                spotLight.position.set(
                  camera.position.x,
                  camera.position.y,
                  camera.position.z
                );
                spotLight.lookAt(scene.position);
                scene.add(spotLight);

                // ambient light
                const ambientLight = new AmbientLight(0xffffff, 0.2);
                ambientLight.position.set(
                  camera.position.x,
                  camera.position.y,
                  camera.position.z
                );
                scene.add(ambientLight);

                // point light
                const pointLight = new THREE.PointLight(0xffffff, 0.5);
                pointLight.position.set(
                  camera.position.x,
                  camera.position.y,
                  camera.position.z
                );

                // Create renderer
                const renderer = new Renderer({ gl });
                renderer.setSize(width, height);
                renderer.setClearColor(0x000000, 1);
                renderRef.current = renderer;

                // Add Group to Scene
                const group = setGeometries({
                  atoms,
                  connects,
                  width,
                  height,
                  model: ligandmode,
                  rasmol: colorMode === 0 ? true : false,
                });
                scene.remove(scene.children);
                scene.add(group);
                // console.log("scene", scene.children);
                // Create OrbitControls
                const controls = new OrbitControls(camera, renderer.domElement);

                // Render function
                const render = () => {
                  spotLight.position.set(
                    camera.position.x,
                    camera.position.y,
                    camera.position.z
                  );
                  controls.update();
                  requestAnimationFrame(render);
                  renderer.render(scene, camera);
                  gl.endFrameEXP();
                };
                render();
              }}
            />
          ) : (
            <ActivityIndicator />
          )}
        </OrbitControlsView>
      </ViewShot>
      <ModeSwitchButton
        addedStyle={{ left: orientation === "portrait" ? 20 : 35, top: 20 }}
        items={[
          {
            name: "Full",
            value: 0,
          },
          {
            name: "Skeleton",
            value: 1,
          },
          {
            name: "Atoms",
            value: 2,
          },
        ]}
      />
      <ColorSwitchButton
        addedStyle={{ left: orientation === "portrait" ? 20 : 35, top: 70 }}
        items={[
          {
            name: "Color 1",
            value: 0,
          },
          {
            name: "Color 2",
            value: 1,
          },
        ]}
      />
      <ZoomButtons ZoomIn={() => Zoom(true)} ZoomOut={() => Zoom(false)} />
      <ShareButtons renderRef={renderRef} viewShotRef={viewShotRef} />
      <BottomHalfModal atom="C" CoordX={100} CoordY={50} CoordZ={50} />
    </View>
  );
}
