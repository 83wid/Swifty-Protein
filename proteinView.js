import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  Camera,
  BoxBufferGeometry,
  MeshBasicMaterial,
  SpotLight,
} from "three";

export default function Protein({ navigation, route }) {
  const [Atoms, setAtoms] = useState([]);
  const [connect, setConnect] = useState([]);
  const [camera, setCamera] = useState(true);
  const data = route.params;
  useEffect(() => {
    setAtoms(data.atoms);
    const newCamera = new PerspectiveCamera(75, 0.5, 0.01, 1000);
    newCamera.position.set(0, 0, -20);
    newCamera.lookAt(0, 0, 0);
    setCamera(newCamera);
    setConnect(data.connects);
  }, []);
  const scale = 2;
  return (
    <OrbitControlsView camera={camera}>
      {connect.length > 0 && Atoms.length > 0 ? (
        <GLView
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
          onContextCreate={async (gl) => {
            const { drawingBufferWidth: width, drawingBufferHeight: height } =
              gl;

            // Create scene
            const scene = new Scene();

            // Create camera

            gl.canvas = { width: width, height: height };

            // Create lights
            const spotLight = new SpotLight(0xffffff, 0.5);
            spotLight.position.set(0, 0, -20);
            spotLight.lookAt(scene.position);
            scene.add(spotLight);

            // Create renderer
            const renderer = new Renderer({ gl });
            renderer.setSize(width, height);


            // atoms cordinates
            const start = new THREE.Vector3();
            const end = new THREE.Vector3();
            const pos = new THREE.Vector3();

            // Add Atoms  instances to our scene
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
              atomMesh.material.color.set(Atoms[i].color);
              
              scene.add(atomMesh);
            }

            // Add Connections  instances to our scene
            for (let i = 0; i < connect.length; i++) {
              for (let j = 1; j < connect[i].length; j++) {
                const initCords = Number(connect[i][0]) - 1;
                const nextCords = Number(connect[i][j]) - 1;
                if (initCords < Atoms.length - 1 && nextCords < Atoms.length) {
                  start.x = Atoms[initCords].x;
                  start.y = Atoms[initCords].y;
                  start.z = Atoms[initCords].z;
                  end.x = Atoms[nextCords].x;
                  end.y = Atoms[nextCords].y;
                  end.z = Atoms[nextCords].z;
                  start.multiplyScalar(scale);
                  end.multiplyScalar(scale);
                  const geoBox = new THREE.BoxGeometry(
                    0.3,
                    0.3,
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
                  scene.add(cylinder);
                }
              }
            }

            // Render function
            const render = () => {
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
  );
}
