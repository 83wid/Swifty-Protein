import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, ActivityIndicator } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
// import matchAll from "string.prototype.matchall";
import parsePdb from "parse-pdb";

import {
  AmbientLight,
  SphereGeometry,
  CylinderGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Camera,
  BoxBufferGeometry,
  MeshBasicMaterial,
  SpotLight,
} from "three";

const colors = {
  H: "FFFFFF",
  He: "FFC0CB",
  Li: "B22222",
  Be: "FF1493",
  B: "00FF00",
  C: "C8C8C8",
  N: "8F8FFF",
  O: "F00000",
  F: "DAA520",
  Ne: "FF1493",
  Na: "0000FF",
  Mg: "228B22",
  Al: "808090",
  Si: "DAA520",
  P: "FFA500",
  S: "FFC832",
  Cl: "00FF00",
  Ar: "FF1493",
  K: "FF1493",
  Ca: "808090",
  Sc: "FF1493",
  Ti: "808090",
  V: "FF1493",
  Cr: "808090",
  Mn: "808090",
  Fe: "FFA500",
  Co: "FF1493",
  Ni: "A52A2A",
  Cu: "A52A2A",
  Zn: "A52A2A",
  Ga: "FF1493",
  Ge: "FF1493",
  As: "FF1493",
  Se: "FF1493",
  Br: "A52A2A",
  Kr: "FF1493",
  Rb: "FF1493",
  Sr: "FF1493",
  Y: "FF1493",
  Zr: "FF1493",
  Nb: "FF1493",
  Mo: "FF1493",
  Tc: "FF1493",
  Ru: "FF1493",
  Rh: "FF1493",
  Pd: "FF1493",
  Ag: "808090",
  Cd: "FF1493",
  In: "FF1493",
  Sn: "FF1493",
  Sb: "FF1493",
  Te: "FF1493",
  I: "A020F0",
  Xe: "FF1493",
  Cs: "FF1493",
  Ba: "FFA500",
  La: "FF1493",
  Ce: "FF1493",
  Pr: "FF1493",
  Nd: "FF1493",
  Pm: "FF1493",
  Sm: "FF1493",
  Eu: "FF1493",
  Gd: "FF1493",
  Tb: "FF1493",
  Dy: "FF1493",
  Ho: "FF1493",
  Er: "FF1493",
  Tm: "FF1493",
  Yb: "FF1493",
  Lu: "FF1493",
  Hf: "FF1493",
  Ta: "FF1493",
  W: "FF1493",
  Re: "FF1493",
  Os: "FF1493",
  Ir: "FF1493",
  Pt: "FF1493",
  Au: "DAA520",
  Hg: "FF1493",
  Tl: "FF1493",
  Pb: "FF1493",
  Bi: "FF1493",
  Po: "FF1493",
  At: "FF1493",
  Rn: "FF1493",
  Fr: "FF1493",
  Ra: "FF1493",
  Ac: "FF1493",
  Th: "FF1493",
  Pa: "FF1493",
  U: "FF1493",
  Np: "FF1493",
  Pu: "FF1493",
  Am: "FF1493",
  Cm: "FF1493",
  Bk: "FF1493",
  Cf: "FF1493",
  Es: "FF1493",
  Fm: "FF1493",
  Md: "FF1493",
  No: "FF1493",
  Lr: "FF1493",
  Rf: "FF1493",
  Db: "FF1493",
  Sg: "FF1493",
  Bh: "FF1493",
  Hs: "FF1493",
  Mt: "FF1493",
};
const mapAtoms = (Atoms) => {
  let max = { x: Atoms[0]?.x, y: Atoms[0]?.y, z: Atoms[0]?.z };
  let min = { x: Atoms[0]?.x, y: Atoms[0]?.y, z: Atoms[0]?.z };
  for (let i = 0; i < Atoms.length; i++) {
    if (max.x < Atoms[i].x) max.x = Atoms[i].x;
    if (max.y < Atoms[i].y) max.y = Atoms[i].y;
    if (max.z < Atoms[i].z) max.z = Atoms[i].z;
    if (min.x > Atoms[i].x) min.x = Atoms[i].x;
    if (min.y > Atoms[i].y) min.y = Atoms[i].y;
    if (min.z > Atoms[i].z) min.z = Atoms[i].z;
  }
  let diff = { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z };
  for (let i = 0; i < Atoms.length; i++) {
    Atoms[i].x = Atoms[i].x - min.x - diff.x / 2;
    Atoms[i].y = Atoms[i].y - min.y - diff.y / 2;
    Atoms[i].z = Atoms[i].z - min.z - diff.z / 2;
  }
  return Atoms;
};

class SphereMesh extends Mesh {
  constructor() {
    super(new SphereGeometry(0.4, 32, 16), new MeshStandardMaterial({}));
  }
}
class CylinderMesh extends Mesh {
  constructor() {
    super(
      new CylinderGeometry(0.2, 0.2, 1, 64, 64, false, 0, 2 * Math.PI),
      new MeshStandardMaterial({})
    );
  }
}

const sphere = new SphereMesh();

// export default function Protein({ navigation, route }) {
//     const [Atoms, setAtoms] = useState([]);
//     const data = route.params;
//     useEffect(() => {

//         let atomsPdb = parsePdb(data);
//         setAtoms(mapAtoms(atomsPdb.atoms));
//     }, []);

//     return (
//         <GLView
//             style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
//             onContextCreate={async (gl) => {
//                 // GL Parameter disruption
//                 const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

//                 // Renderer declaration and set properties
//                 const renderer = new Renderer({ gl });
//                 renderer.setSize(width, height);
//                 renderer.setClearColor("#fff");

//                 // Scene declaration, add a fog, and a grid helper to see axes dimensions
//                 const scene = new Scene();

//                 //camera
//                 const camera = new PerspectiveCamera(100, width / height , 0.01, 1000);

//                 let cameraInitialPositionX = 0;
//                 let cameraInitialPositionY = 2;
//                 let cameraInitialPositionZ = -20;

//                 // Add all necessary lights
//                 const ambientLight = new AmbientLight(0x101010);
//                 scene.add(ambientLight);

//                 const pointLight = new PointLight(0xffffff, 2, 1000, 1);
//                 pointLight.position.set(0, 200, 200);
//                 scene.add(pointLight);

//                 const spotLight = new SpotLight(0xffffff, 0.5);
//                 spotLight.position.set(cameraInitialPositionX, cameraInitialPositionY, cameraInitialPositionZ);
//                 spotLight.lookAt(scene.position);
//                 scene.add(spotLight);
//                 // Add Atoms  instances to our scene
//                 for (let i = 0; i < Atoms.length; i++) {
//                     let atomMesh = new SphereMesh();
//                     atomMesh.position.set(Atoms[i].x, Atoms[i].y, Atoms[i].z);
//                     atomMesh.material.color.set('#' + colors[Atoms[i].element]);
//                     scene.add(atomMesh);
//                 }

//                 // Set camera position and look to sphere
//                 camera.position.set(
//                     cameraInitialPositionX,
//                     cameraInitialPositionY,
//                     cameraInitialPositionZ
//                 );

//                 camera.lookAt(sphere.position);

//                 // Render function
//                 const render = () => {
//                     requestAnimationFrame(render);
//                     renderer.render(scene, camera);
//                     gl.endFrameEXP();
//                 };
//                 render();
//             }}
//         />
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#000",
//         alignItems: "center",
//         justifyContent: "center",
//     },
// });

// const onContextCreate = async (gl) => {
//     const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
//     const scene = new Scene();
//     const camera = new PerspectiveCamera(
//         75, width, height, 0.1, 1000
//     );
//     gl.canvas = { width: width, height: height };
//     camera.position.z = 2;

//     const renderer = new Renderer({ gl });
//     renderer.setSize(width, height);

//     // Add Atoms  instances to our scene
//     for (let i = 0; i < Atoms.length; i++) {
//         let atomMesh = new SphereMesh();
//         atomMesh.position.set(Atoms[i].x, Atoms[i].y, Atoms[i].z);
//         atomMesh.material.color.set('#' + colors[Atoms[i].element]);
//         scene.add(atomMesh);
//     }

//     const render = () => {
//         requestAnimationFrame(render);
//         renderer.render(scene, camera);
//         gl.endFrameEXP();
//     }
//     render();

// }

class Atom {
  constructor(x, y, z, element) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.element = element;
  }
}

export default function Protein({ navigation, route }) {
  const [Atoms, setAtoms] = useState([]);
  const [connect, setConnect] = useState([]);
  const data = route.params;
  const con = [];
  const atm = [];
  useEffect(() => {
    let atomsPdb = parsePdb(data);
    
    // data.split("\n").forEach((element) => {
    // //   if (element.includes("ATOM")) {
    // //     //   console.log(element.replace(/\s+/g, " ").split(" "));
    // //     // let links = connect[i].split(' ');
    // //     let elem = element.replace(/\s+/g, " ").substr(5, element.length).split(" ");
    // //     atm.push(new Atom(elem[4], elem[5], elem[6], elem[10]));
    // //     // atm.push(element.replace(/\s+/g, " ").substr(5, element.length).split(" "));
    // //   }
    // });
    data.split("\n").forEach((element) => {
      if (element.includes("CONECT")) {
        // let links = connect[i].split(' ');
        // console.log(element.replace(/\s+/g, " ").substr(7, element.length).split(" "));
        con.push(element.replace(/\s+/g, " ").substr(7, element.length).split(" "));
      }
    });
    setConnect(con);
    // console.log(con);

    // console.log(connect);
    // setAtoms(mapAtoms(atm));
    setAtoms(mapAtoms(atomsPdb.atoms));
  }, []);
  const scale = 2;
  return (connect.length > 0 && Atoms.length > 0 ? (
    // <View>
    <GLView
      style={{
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}
      onContextCreate={async (gl) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const scene = new Scene();
        const camera = new PerspectiveCamera(75, 0.5, 0.01, 1000);
        camera.position.set(0, 0, -20);
        camera.lookAt(0, 0, 0);
        gl.canvas = { width: width, height: height };
        // camera.position.z = 2;
        //spotLight

        const spotLight = new SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 0, -20);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);

        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        const start = new THREE.Vector3();
        const end = new THREE.Vector3();
        const pos = new THREE.Vector3()
        
        // Add Atoms  instances to our scene
        for (let i = 0; i < Atoms.length; i++) {
            let atomMesh = new SphereMesh();
            pos.x = Atoms[i].x;
            pos.y = Atoms[i].y;
            pos.z = Atoms[i].z;
          pos.multiplyScalar(
           scale
        );
          atomMesh.position.copy(pos);
          atomMesh.material.color.set("#" + colors[Atoms[i].element]);
          scene.add(atomMesh);
        }
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
                  start.multiplyScalar(
                  scale
                );
                end.multiplyScalar(
                  scale
                );
                const geoBox = new THREE.BoxGeometry(
                  0.3,
                  0.3,
                  start.distanceTo(end),
                  
                );
                const cylinder = new THREE.Mesh(
                  geoBox,
                  new THREE.MeshPhongMaterial({ color: 0xffffff })
                );
                cylinder.position.copy(start);
                cylinder.position.lerp(end, 0.5);
                cylinder.lookAt(end);
                scene.add(cylinder);
                // const conMesh = new CylinderMesh();
                // conMesh.position.copy(start);
    
                // // conMesh.position.lerp(end, 0.5);
                // conMesh.lookAt(end);
                // scene.add(conMesh);
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
    />) : ( <ActivityIndicator />));
    // </View>
}
