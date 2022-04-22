import React, { useEffect, useState, useContext } from "react";
import {
  Share,
  Alert,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "./OrbitControlsView";
import { ProteinDetail } from "./proteinDetail";
import SwitchButton from "./HomeScreen/SwitchButton";
import { AmbientLight, PerspectiveCamera, Scene, SpotLight } from "three";
import setGeometries from "../Helpers/setGeometries";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { LigandContext } from "../context/state";

const raycaster = new THREE.Raycaster();

export default function Protein({ atoms, connects }) {
  const [width, setWidth] = useState(Dimensions.get("screen").width);
  const [height, setHeight] = useState(Dimensions.get("screen").height);
  const [loading, setLoading] = useState(false);

  const renderRef = React.useRef(null);
  const key = React.useRef(0);
  const value = useContext(LigandContext);
  const ligandmode = value.state.ligandmode;

  //Create Camera
  const [camera, setCamera] = useState(
    new PerspectiveCamera(75, width / height, 0.01, 1000)
  );

  // set Atoms and Connects to a group
  const group = new THREE.Group();
  useEffect(() => {
    setLoading(true);
    const protein = setGeometries({
      atoms,
      connects,
      width,
      height,
      model: ligandmode,
      rasmol: value,
    });
    group.remove(...group.children);
    group.add(...protein.children);
    setLoading(false);
  }, [ligandmode]);

  console.log("ligandmode", ligandmode);

  // Create scene
  const scene = new Scene();

  useEffect(() => {
    // set camera position and look at center of screen
    camera.position.set(0, 0, -30);
    camera.lookAt(0, 0, 0);
    setCamera(camera);
  }, []);

  const takeScreenShot = async () => {
    try {
      const res = await viewShotRef.current.capture();
      Share.share({ url: res });
      // await Sharing.shareAsync(res, { dialogTitle: "Share this image" });
      let result = await MediaLibrary.requestPermissionsAsync(true);
      if (result.status === "granted") {
        let r = await MediaLibrary.saveToLibraryAsync(res);
      }
      Alert.alert("Success", "ScreenShot Successfully");
    } catch (e) {
      console.error(e);
    }
  };

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
        Alert.alert(
          "Atom Details",
          `Element : ${element.info["name"]}
          x : ${element.info["x"]}
          y : ${element.info["y"]}
          z : ${element.info["z"]}
          color : ${element.info["color"]}
          `,
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
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

  const handelColor = (value) => {
    const protein = setGeometries({
      atoms,
      connects,
      width,
      height,
      model,
      rasmol: value,
    });
    group.remove(...group.children);
    group.add(...protein.children);
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
              key={ligandmode}
              style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height,
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
                scene.add(group);

                // Render function
                const render = () => {
                  spotLight.position.set(
                    camera.position.x,
                    camera.position.y,
                    camera.position.z
                  );
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
      {/* <ProteinDetail atom={selectAtom} /> */}
      {/* <View
        style={{
          paddingHorizontal: 21,
          paddingVertical: 21,
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 1,
          backgroundColor: "white",
          width: "100%",
        }}
      >
        <TouchableOpacity onPress={() => Zoom(true)}>
          <Text
            style={{
              backgroundColor: "gray",
              textAlign: "center",
              width: 20,
              height: 20,
              fontSize: 20,
              color: "black",
            }}
          >
            +
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Zoom(false)}>
          <Text
            style={{
              backgroundColor: "gray",
              textAlign: "center",
              width: 20,
              height: 20,
              fontSize: 20,
              color: "black",
            }}
          >
            -
          </Text>
        </TouchableOpacity>
      </View> */}
      {/* <View
        style={{
          paddingHorizontal: 21,
          paddingVertical: 21,
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          left: 0,
          zIndex: 1,
          backgroundColor: "white",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            takeScreenShot(renderRef.current);
          }}
        >
          <Text>Take Snapshot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => handelColor(true)}>
          <Text>rasmol</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => handelColor(false)}>
          <Text>jmol</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
