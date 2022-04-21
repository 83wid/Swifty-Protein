import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Feather,
  Alert,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "./controls/OrbitControlsView";

import {
  AmbientLight,
  PerspectiveCamera,
  Scene,
  SpotLight,
} from "three";

const raycaster = new THREE.Raycaster();

export default function Protein({ navigation, route }) {
  const [Atoms, setAtoms] = useState([]);
  const [connect, setConnect] = useState([]);
  const [width, setWidth] = useState(Dimensions.get("screen").width);
  const [height, setHeight] = useState(Dimensions.get("screen").height);
  const renderRef = React.useRef(null);
  const [camera, setCamera] = useState(true);
  const [scene, setScene] = useState(true);
  const data = route.params;
  useEffect(() => {
    setAtoms(data.atoms);
    setConnect(data.connects);

    //Create Camera
    const camera = new PerspectiveCamera(75, width / height, 0.01, 1000);
    camera.position.set(0, 0, -30);
    camera.lookAt(0, 0, 0);
    setCamera(camera);

    // Create scene
    const newScene = new Scene();
    setScene(newScene);
    
  }, [renderRef]);

  const scale = width < height ? 1 + width / height  : 1 + height / width;

  // Show Atom info when Tap on Atom
  const showAtomsInfo = ({ nativeEvent }) => {
    let pointer = new THREE.Vector2();
    pointer.x = (nativeEvent.locationX / width) * 2 - 1;
    pointer.y = -(nativeEvent.locationY / height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      let element = intersects[0].object;
      console.log(element);
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

  // Zoom in and out on Touch
  const Zoom = (value) => {
    if (value) {
      if (camera.fov - 5 > 10) camera.fov -= 5;
    }
    if (!value) {
      if (camera.fov + 5 < 120) camera.fov += 5;
    }
    camera.updateProjectionMatrix();
    setCamera(camera);
    renderRef.current?.render(scene, camera);
  };

  return (
    <View style={{ flex: 1 }}>
      <OrbitControlsView
        key={renderRef.current}
        camera={camera}
        onTouchEndCapture={showAtomsInfo}
      >
        {connect.length > 0 && Atoms.length > 0 ? (
          <GLView
            key={renderRef.current}
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
            }}
            onContextCreate={async (gl) => {
              const { drawingBufferWidth: width, drawingBufferHeight: height } =
                gl;

              gl.canvas = { width: width, height: height };

              // Create lights
              const spotLight = new SpotLight(0xffffff, 0.5);
              spotLight.position.set(0, 0, -20);
              spotLight.lookAt(scene.position);
              scene.add(spotLight);

              // Create renderer
              const renderer = new Renderer({ gl });
              renderer.setSize(width, height);
              renderRef.current = renderer;

              // create Group
              const group = new THREE.Group();

              // atoms cordinates
              const start = new THREE.Vector3();
              const end = new THREE.Vector3();
              const pos = new THREE.Vector3();

              // Add Atoms  instances to our Group
              for (let i = 0; i < Atoms.length; i++) {
                let atomMesh = new THREE.Mesh(
                  new THREE.SphereGeometry(0.4, 32, 16),
                  new THREE.MeshStandardMaterial({})
                );
                pos.x = Atoms[i].x;
                pos.y = Atoms[i].y;
                pos.z = Atoms[i].z;
                pos.multiplyScalar(scale);
                atomMesh.position.copy(pos);
                atomMesh.info = Atoms[i];
                atomMesh.material.color.set(Atoms[i].color);
                group.add(atomMesh);
              }

              // Add Connections  instances to our Group
              for (let i = 0; i < connect.length; i++) {
                for (let j = 1; j < connect[i].length; j++) {
                  const initCords = Number(connect[i][0]) - 1;
                  const nextCords = Number(connect[i][j]) - 1;
                  if (
                    initCords < Atoms.length - 1 &&
                    nextCords < Atoms.length
                  ) {
                    start.x = Atoms[initCords].x;
                    start.y = Atoms[initCords].y;
                    start.z = Atoms[initCords].z;
                    end.x = Atoms[nextCords].x;
                    end.y = Atoms[nextCords].y;
                    end.z = Atoms[nextCords].z;
                    start.multiplyScalar(scale);
                    end.multiplyScalar(scale);
                    const geoBox = new THREE.BoxGeometry(
                      0.2,
                      0.2,
                      start.distanceTo(end)
                    );
                    const cylinder = new THREE.Mesh(
                      geoBox,
                      new THREE.MeshPhongMaterial({ color: 0xffffff })
                    );
                    const mid = start;
                    mid.lerp(end, 0.5);
                    cylinder.position.copy(mid);
                    cylinder.lookAt(end);

                    group.add(cylinder);
                  }
                }
              }

              // Set Camera to look at the Group center
              camera.lookAt(computeGroupCenter(group));

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
      <View
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
      </View>
      <View
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
            saveAsImage(renderRef.current);
          }}
        >
          <Text>Take Snapshot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function computeGroupCenter(group) {
  var center = new THREE.Vector3();
  var children = group.children;
  var count = children.length;
  for (var i = 0; i < count; i++) {
    center.add(children[i].position);
  }
  center.divideScalar(count);
  return center;
}
