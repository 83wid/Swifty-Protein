import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
// import { View, TouchableWithoutFeedback, Text } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import axios from "axios";
import matchAll from "string.prototype.matchall";
import parsePdb from "parse-pdb";


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

const  colors = {
  "H": {
    "jmol": "FFFFFF",
    "rasmol": "FFFFFF",
    "discoverd_by": "Henry Cavendish ",
    "phase": "Gas"
  },
  "He": {
    "jmol": "D9FFFF",
    "rasmol": "FFC0CB",
    "discoverd_by": "Pierre Janssen ",
    "phase": "Gas"
  },
  "Li": {
    "jmol": "CC80FF",
    "rasmol": "B22222",
    "discoverd_by": "Johan August Arfwedson ",
    "phase": "Solid"
  },
  "Be": {
    "jmol": "C2FF00",
    "rasmol": "FF1493",
    "discoverd_by": "Louis Nicolas Vauquelin ",
    "phase": "Solid"
  },
  "B": {
    "jmol": "FFB5B5",
    "rasmol": "00FF00",
    "discoverd_by": "Joseph Louis Gay-Lussac ",
    "phase": "Solid"
  },
  "C": {
    "jmol": "909090",
    "rasmol": "C8C8C8",
    "discoverd_by": "Ancient Egypt ",
    "phase": "Solid"
  },
  "N": {
    "jmol": "3050F8",
    "rasmol": "8F8FFF",
    "discoverd_by": "Daniel Rutherford ",
    "phase": "Gas"
  },
  "O": {
    "jmol": "FF0D0D",
    "rasmol": "F00000",
    "discoverd_by": "Carl Wilhelm Scheele ",
    "phase": "Gas"
  },
  "F": {
    "jmol": "90E050",
    "rasmol": "DAA520",
    "discoverd_by": "André-Marie Ampère ",
    "phase": "Gas"
  },
  "Ne": {
    "jmol": "B3E3F5",
    "rasmol": "FF1493",
    "discoverd_by": "Morris Travers ",
    "phase": "Gas"
  },
  "Na": {
    "jmol": "AB5CF2",
    "rasmol": "0000FF",
    "discoverd_by": "Humphry Davy ",
    "phase": "Solid"
  },
  "Mg": {
    "jmol": "8AFF00",
    "rasmol": "228B22",
    "discoverd_by": "Joseph Black ",
    "phase": "Solid"
  },
  "Al": {
    "jmol": "BFA6A6",
    "rasmol": "808090",
    "discoverd_by": "null ",
    "phase": "Solid"
  },
  "Si": {
    "jmol": "F0C8A0",
    "rasmol": "DAA520",
    "discoverd_by": "Jöns Jacob Berzelius ",
    "phase": "Solid"
  },
  "P": {
    "jmol": "FF8000",
    "rasmol": "FFA500",
    "discoverd_by": "Hennig Brand ",
    "phase": "Solid"
  },
  "S": {
    "jmol": "FFFF30",
    "rasmol": "FFC832",
    "discoverd_by": "Ancient china ",
    "phase": "Solid"
  },
  "Cl": {
    "jmol": "1FF01F",
    "rasmol": "00FF00",
    "discoverd_by": "Carl Wilhelm Scheele ",
    "phase": "Gas"
  },
  "Ar": {
    "jmol": "80D1E3",
    "rasmol": "FF1493",
    "discoverd_by": "Lord Rayleigh ",
    "phase": "Gas"
  },
  "K": {
    "jmol": "8F40D4",
    "rasmol": "FF1493",
    "discoverd_by": "Humphry Davy ",
    "phase": "Solid"
  },
  "Ca": {
    "jmol": "3DFF00",
    "rasmol": "808090",
    "discoverd_by": "Humphry Davy ",
    "phase": "Solid"
  },
  "Sc": {
    "jmol": "E6E6E6",
    "rasmol": "FF1493",
    "discoverd_by": "Lars Fredrik Nilson ",
    "phase": "Solid"
  },
  "Ti": {
    "jmol": "BFC2C7",
    "rasmol": "808090",
    "discoverd_by": "William Gregor ",
    "phase": "Solid"
  },
  "V": {
    "jmol": "A6A6AB",
    "rasmol": "FF1493",
    "discoverd_by": "Andrés Manuel del Río ",
    "phase": "Solid"
  },
  "Cr": {
    "jmol": "8A99C7",
    "rasmol": "808090",
    "discoverd_by": "Louis Nicolas Vauquelin ",
    "phase": "Solid"
  },
  "Mn": {
    "jmol": "9C7AC7",
    "rasmol": "808090",
    "discoverd_by": "Torbern Olof Bergman ",
    "phase": "Solid"
  },
  "Fe": {
    "jmol": "E06633",
    "rasmol": "FFA500",
    "discoverd_by": "5000 BC ",
    "phase": "Solid"
  },
  "Co": {
    "jmol": "F090A0",
    "rasmol": "FF1493",
    "discoverd_by": "Georg Brandt ",
    "phase": "Solid"
  },
  "Ni": {
    "jmol": "50D050",
    "rasmol": "A52A2A",
    "discoverd_by": "Axel Fredrik Cronstedt ",
    "phase": "Solid"
  },
  "Cu": {
    "jmol": "C88033",
    "rasmol": "A52A2A",
    "discoverd_by": "Middle East ",
    "phase": "Solid"
  },
  "Zn": {
    "jmol": "7D80B0",
    "rasmol": "A52A2A",
    "discoverd_by": "India ",
    "phase": "Solid"
  },
  "Ga": {
    "jmol": "C28F8F",
    "rasmol": "FF1493",
    "discoverd_by": "Lecoq de Boisbaudran ",
    "phase": "Solid"
  },
  "Ge": {
    "jmol": "668F8F",
    "rasmol": "FF1493",
    "discoverd_by": "Clemens Winkler ",
    "phase": "Solid"
  },
  "As": {
    "jmol": "BD80E3",
    "rasmol": "FF1493",
    "discoverd_by": "Bronze Age ",
    "phase": "Solid"
  },
  "Se": {
    "jmol": "FFA100",
    "rasmol": "FF1493",
    "discoverd_by": "Jöns Jakob Berzelius ",
    "phase": "Solid"
  },
  "Br": {
    "jmol": "A62929",
    "rasmol": "A52A2A",
    "discoverd_by": "Antoine Jérôme Balard ",
    "phase": "Liquid"
  },
  "Kr": {
    "jmol": "5CB8D1",
    "rasmol": "FF1493",
    "discoverd_by": "William Ramsay ",
    "phase": "Gas"
  },
  "Rb": {
    "jmol": "702EB0",
    "rasmol": "FF1493",
    "discoverd_by": "Robert Bunsen ",
    "phase": "Solid"
  },
  "Sr": {
    "jmol": "00FF00",
    "rasmol": "FF1493",
    "discoverd_by": "William Cruickshank (chemist) ",
    "phase": "Solid"
  },
  "Y": {
    "jmol": "94FFFF",
    "rasmol": "FF1493",
    "discoverd_by": "Johan Gadolin ",
    "phase": "Solid"
  },
  "Zr": {
    "jmol": "94E0E0",
    "rasmol": "FF1493",
    "discoverd_by": "Martin Heinrich Klaproth ",
    "phase": "Solid"
  },
  "Nb": {
    "jmol": "73C2C9",
    "rasmol": "FF1493",
    "discoverd_by": "Charles Hatchett ",
    "phase": "Solid"
  },
  "Mo": {
    "jmol": "54B5B5",
    "rasmol": "FF1493",
    "discoverd_by": "Carl Wilhelm Scheele ",
    "phase": "Solid"
  },
  "Tc": {
    "jmol": "3B9E9E",
    "rasmol": "FF1493",
    "discoverd_by": "Emilio Segrè ",
    "phase": "Solid"
  },
  "Ru": {
    "jmol": "248F8F",
    "rasmol": "FF1493",
    "discoverd_by": "Karl Ernst Claus ",
    "phase": "Solid"
  },
  "Rh": {
    "jmol": "0A7D8C",
    "rasmol": "FF1493",
    "discoverd_by": "William Hyde Wollaston ",
    "phase": "Solid"
  },
  "Pd": {
    "jmol": "006985",
    "rasmol": "FF1493",
    "discoverd_by": "William Hyde Wollaston ",
    "phase": "Solid"
  },
  "Ag": {
    "jmol": "C0C0C0",
    "rasmol": "808090",
    "discoverd_by": "unknown, before 5000 BC ",
    "phase": "Solid"
  },
  "Cd": {
    "jmol": "FFD98F",
    "rasmol": "FF1493",
    "discoverd_by": "Karl Samuel Leberecht Hermann ",
    "phase": "Solid"
  },
  "In": {
    "jmol": "A67573",
    "rasmol": "FF1493",
    "discoverd_by": "Ferdinand Reich ",
    "phase": "Solid"
  },
  "Sn": {
    "jmol": "668080",
    "rasmol": "FF1493",
    "discoverd_by": "unknown, before 3500 BC ",
    "phase": "Solid"
  },
  "Sb": {
    "jmol": "9E63B5",
    "rasmol": "FF1493",
    "discoverd_by": "unknown, before 3000 BC ",
    "phase": "Solid"
  },
  "Te": {
    "jmol": "D47A00",
    "rasmol": "FF1493",
    "discoverd_by": "Franz-Joseph Müller von Reichenstein ",
    "phase": "Solid"
  },
  "I": {
    "jmol": "940094",
    "rasmol": "A020F0",
    "discoverd_by": "Bernard Courtois ",
    "phase": "Solid"
  },
  "Xe": {
    "jmol": "429EB0",
    "rasmol": "FF1493",
    "discoverd_by": "William Ramsay ",
    "phase": "Gas"
  },
  "Cs": {
    "jmol": "57178F",
    "rasmol": "FF1493",
    "discoverd_by": "Robert Bunsen ",
    "phase": "Solid"
  },
  "Ba": {
    "jmol": "00C900",
    "rasmol": "FFA500",
    "discoverd_by": "Carl Wilhelm Scheele ",
    "phase": "Solid"
  },
  "La": {
    "jmol": "70D4FF",
    "rasmol": "FF1493",
    "discoverd_by": "Carl Gustaf Mosander ",
    "phase": "Solid"
  },
  "Ce": {
    "jmol": "FFFFC7",
    "rasmol": "FF1493",
    "discoverd_by": "Martin Heinrich Klaproth ",
    "phase": "Solid"
  },
  "Pr": {
    "jmol": "D9FFC7",
    "rasmol": "FF1493",
    "discoverd_by": "Carl Auer von Welsbach ",
    "phase": "Solid"
  },
  "Nd": {
    "jmol": "C7FFC7",
    "rasmol": "FF1493",
    "discoverd_by": "Carl Auer von Welsbach ",
    "phase": "Solid"
  },
  "Pm": {
    "jmol": "A3FFC7",
    "rasmol": "FF1493",
    "discoverd_by": "Chien Shiung Wu ",
    "phase": "Solid"
  },
  "Sm": {
    "jmol": "8FFFC7",
    "rasmol": "FF1493",
    "discoverd_by": "Lecoq de Boisbaudran ",
    "phase": "Solid"
  },
  "Eu": {
    "jmol": "61FFC7",
    "rasmol": "FF1493",
    "discoverd_by": "Eugène-Anatole Demarçay ",
    "phase": "Solid"
  },
  "Gd": {
    "jmol": "45FFC7",
    "rasmol": "FF1493",
    "discoverd_by": "Jean Charles Galissard de Marignac ",
    "phase": "Solid"
  },
  "Tb": {
    "jmol": "30FFC7",
    "rasmol": "FF1493",
    "discoverd_by": "Carl Gustaf Mosander ",
    "phase": "Solid"
  },
  "Dy": {
    "jmol": "1FFFC7",
    "rasmol": "FF1493",
    "discoverd_by": "Lecoq de Boisbaudran ",
    "phase": "Solid"
  },
  "Ho": {
    "jmol": "00FF9C",
    "rasmol": "FF1493",
    "discoverd_by": "Marc Delafontaine ",
    "phase": "Solid"
  },
  "Er": {
    "jmol": "00E675",
    "rasmol": "FF1493",
    "discoverd_by": "Carl Gustaf Mosander ",
    "phase": "Solid"
  },
  "Tm": {
    "jmol": "00D452",
    "rasmol": "FF1493",
    "discoverd_by": "Per Teodor Cleve ",
    "phase": "Solid"
  },
  "Yb": {
    "jmol": "00BF38",
    "rasmol": "FF1493",
    "discoverd_by": "Jean Charles Galissard de Marignac ",
    "phase": "Solid"
  },
  "Lu": {
    "jmol": "00AB24",
    "rasmol": "FF1493",
    "discoverd_by": "Georges Urbain ",
    "phase": "Solid"
  },
  "Hf": {
    "jmol": "4DC2FF",
    "rasmol": "FF1493",
    "discoverd_by": "Dirk Coster ",
    "phase": "Solid"
  },
  "Ta": {
    "jmol": "4DA6FF",
    "rasmol": "FF1493",
    "discoverd_by": "Anders Gustaf Ekeberg ",
    "phase": "Solid"
  },
  "W": {
    "jmol": "2194D6",
    "rasmol": "FF1493",
    "discoverd_by": "Carl Wilhelm Scheele ",
    "phase": "Solid"
  },
  "Re": {
    "jmol": "267DAB",
    "rasmol": "FF1493",
    "discoverd_by": "Masataka Ogawa ",
    "phase": "Solid"
  },
  "Os": {
    "jmol": "266696",
    "rasmol": "FF1493",
    "discoverd_by": "Smithson Tennant ",
    "phase": "Solid"
  },
  "Ir": {
    "jmol": "175487",
    "rasmol": "FF1493",
    "discoverd_by": "Smithson Tennant ",
    "phase": "Solid"
  },
  "Pt": {
    "jmol": "D0D0E0",
    "rasmol": "FF1493",
    "discoverd_by": "Antonio de Ulloa ",
    "phase": "Solid"
  },
  "Au": {
    "jmol": "FFD123",
    "rasmol": "DAA520",
    "discoverd_by": "Middle East ",
    "phase": "Solid"
  },
  "Hg": {
    "jmol": "B8B8D0",
    "rasmol": "FF1493",
    "discoverd_by": "unknown, before 2000 BCE ",
    "phase": "Liquid"
  },
  "Tl": {
    "jmol": "A6544D",
    "rasmol": "FF1493",
    "discoverd_by": "William Crookes ",
    "phase": "Solid"
  },
  "Pb": {
    "jmol": "575961",
    "rasmol": "FF1493",
    "discoverd_by": "Middle East ",
    "phase": "Solid"
  },
  "Bi": {
    "jmol": "9E4FB5",
    "rasmol": "FF1493",
    "discoverd_by": "Claude François Geoffroy ",
    "phase": "Solid"
  },
  "Po": {
    "jmol": "AB5C00",
    "rasmol": "FF1493",
    "discoverd_by": "Pierre Curie ",
    "phase": "Solid"
  },
  "At": {
    "jmol": "754F45",
    "rasmol": "FF1493",
    "discoverd_by": "Dale R. Corson ",
    "phase": "Solid"
  },
  "Rn": {
    "jmol": "428296",
    "rasmol": "FF1493",
    "discoverd_by": "Friedrich Ernst Dorn ",
    "phase": "Gas"
  },
  "Fr": {
    "jmol": "420066",
    "rasmol": "FF1493",
    "discoverd_by": "Marguerite Perey ",
    "phase": "Solid"
  },
  "Ra": {
    "jmol": "007D00",
    "rasmol": "FF1493",
    "discoverd_by": "Pierre Curie ",
    "phase": "Solid"
  },
  "Ac": {
    "jmol": "70ABFA",
    "rasmol": "FF1493",
    "discoverd_by": "Friedrich Oskar Giesel ",
    "phase": "Solid"
  },
  "Th": {
    "jmol": "00BAFF",
    "rasmol": "FF1493",
    "discoverd_by": "Jöns Jakob Berzelius ",
    "phase": "Solid"
  },
  "Pa": {
    "jmol": "00A1FF",
    "rasmol": "FF1493",
    "discoverd_by": "William Crookes ",
    "phase": "Solid"
  },
  "U": {
    "jmol": "008FFF",
    "rasmol": "FF1493",
    "discoverd_by": "Martin Heinrich Klaproth ",
    "phase": "Solid"
  },
  "Np": {
    "jmol": "0080FF",
    "rasmol": "FF1493",
    "discoverd_by": "Edwin McMillan ",
    "phase": "Solid"
  },
  "Pu": {
    "jmol": "006BFF",
    "rasmol": "FF1493",
    "discoverd_by": "Glenn T. Seaborg ",
    "phase": "Solid"
  },
  "Am": {
    "jmol": "545CF2",
    "rasmol": "FF1493",
    "discoverd_by": "Glenn T. Seaborg ",
    "phase": "Solid"
  },
  "Cm": {
    "jmol": "785CE3",
    "rasmol": "FF1493",
    "discoverd_by": "Glenn T. Seaborg ",
    "phase": "Solid"
  },
  "Bk": {
    "jmol": "8A4FE3",
    "rasmol": "FF1493",
    "discoverd_by": "Lawrence Berkeley National Laboratory ",
    "phase": "Solid"
  },
  "Cf": {
    "jmol": "A136D4",
    "rasmol": "FF1493",
    "discoverd_by": "Lawrence Berkeley National Laboratory ",
    "phase": "Solid"
  },
  "Es": {
    "jmol": "B31FD4",
    "rasmol": "FF1493",
    "discoverd_by": "Lawrence Berkeley National Laboratory ",
    "phase": "Solid"
  },
  "Fm": {
    "jmol": "B31FBA",
    "rasmol": "FF1493",
    "discoverd_by": "Lawrence Berkeley National Laboratory ",
    "phase": "Solid"
  },
  "Md": {
    "jmol": "B30DA6",
    "rasmol": "FF1493",
    "discoverd_by": "Lawrence Berkeley National Laboratory ",
    "phase": "Solid"
  },
  "No": {
    "jmol": "BD0D87",
    "rasmol": "FF1493",
    "discoverd_by": "Joint Institute for Nuclear Research ",
    "phase": "Solid"
  },
  "Lr": {
    "jmol": "C70066",
    "rasmol": "FF1493",
    "discoverd_by": "Lawrence Berkeley National Laboratory ",
    "phase": "Solid"
  },
  "Rf": {
    "jmol": "CC0059",
    "rasmol": "FF1493",
    "discoverd_by": "Joint Institute for Nuclear Research ",
    "phase": "Solid"
  },
  "Db": {
    "jmol": "D1004F",
    "rasmol": "FF1493",
    "discoverd_by": "Joint Institute for Nuclear Research ",
    "phase": "Solid"
  },
  "Sg": {
    "jmol": "D90045",
    "rasmol": "FF1493",
    "discoverd_by": "Lawrence Berkeley National Laboratory ",
    "phase": "Solid"
  },
  "Bh": {
    "jmol": "E00038",
    "rasmol": "FF1493",
    "discoverd_by": "Gesellschaft für Schwerionenforschung ",
    "phase": "Solid"
  },
  "Hs": {
    "jmol": "E6002E",
    "rasmol": "FF1493",
    "discoverd_by": "Gesellschaft für Schwerionenforschung ",
    "phase": "Solid"
  },
  "Mt": {
    "jmol": "EB0026",
    "rasmol": "FF1493",
    "discoverd_by": "Gesellschaft für Schwerionenforschung ",
    "phase": "Solid"
  }
};
const regex = /^CONECT(:?\s*\d+.+)+/gm;
const regexMatchdigit = /(:?\d+s*)/gm;
const getConnect = (grp) => {
  let array = [];
  for (let i = 0; i < grp.length; i++) {
    array.push(grp[i][1]?.match(regexMatchdigit));
  }
  return array;
};
const mapAtoms = (Atoms) => {
  console.log(Atoms.length);
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
  constructor(color) {
    super(
      new SphereGeometry(1, 50, 20, 0, Math.PI * 2, 0, Math.PI * 2),
      new MeshStandardMaterial({
        color: color,
      })
    );
  }
}

const sphere = new SphereMesh();
const camera = new PerspectiveCamera(100, 0.4, 0.01, 1000);

let cameraInitialPositionX = 0;
let cameraInitialPositionY = 2;
let cameraInitialPositionZ = -50;
const ligand = '011';
const url1 = `https://files.rcsb.org/ligands/view/${ligand}_model.pdb`;

export default function App() {
  const [Atoms, setAtoms] = useState([]);

  useEffect(() => {
		axios(url1)
			.then((res) => {
				if (res.data) {
					let atomsPdb = parsePdb(res.data);
          setAtoms(mapAtoms(atomsPdb.atoms));
				}
			})
			.catch((er) => alert(er));
	}, []);

  return (
    Atoms.length > 0 &&  <GLView
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
          // Atoms.length > 0 && console.log('my atoms: ', Atoms);
          // Add sphere object instance to our scene
          for (let i = 0; i < 3; i++) {
            let atomMesh = new SphereMesh(colors[Atoms[i].element]);
            // console.log(Atoms[i].x)
            atomMesh.position.set(Atoms[i].x, Atoms[i].y, Atoms[i].z);
                scene.add(atomMesh);
            // array.push(grp[i][1]?.match(regexMatchdigit));
          }
          // sphere.position.set(cameraInitialPositionX + 100,
          //   cameraInitialPositionY + 100,
          //   cameraInitialPositionZ + 100);
          // scene.add(sphere);

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
