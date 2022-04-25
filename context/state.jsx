import { createContext, useState } from "react";
import useOrientation from "../Hooks/useOrientation";

export const LigandContext = createContext();

export function AppWrapper({ children }) {
  const [ligandmode, setLigandMode] = useState(0);
  const [colorMode, setColorMode] = useState(0);
  const [ligand, setLigand] = useState("");
  const orientation = useOrientation();

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
      },
    }}>
      {children}
    </LigandContext.Provider>
  )
}