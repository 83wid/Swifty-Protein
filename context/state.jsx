import { createContext, useState } from "react";
import useOrientation from "../Hooks/useOrientation";
import { Renderer } from "expo-three";

export const LigandContext = createContext();

export function AppWrapper({ children }) {
  const [ligandmode, setLigandMode] = useState(0);
  const [colorMode, setColorMode] = useState(0);
  const [ligand, setLigand] = useState("");
  const orientation = useOrientation();
  const [selectedAtom, setSelectedAtom] = useState({
    x: 0,
    y: 0,
    z: 0,
    name: "C",
  });
  // const [scene, setscene] = useState(new THREE.Scene());

  return (
    <LigandContext.Provider value={{
      state: {
        data: require('../assets/ligands.json'),
        ligandmode: ligandmode,
        setLigandMode: setLigandMode,
        colorMode: colorMode,
        setColorMode: setColorMode,
        orientation: orientation,
        ligand: ligand,
        setLigand: setLigand,
        selectedAtom: selectedAtom,
        setSelectedAtom: setSelectedAtom,
      },
    }}>
      {children}
    </LigandContext.Provider>
  )
}