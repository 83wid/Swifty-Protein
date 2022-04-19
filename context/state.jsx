import { createContext, useState, useEffect } from "react";

export const LigandContext = createContext();

export function AppWrapper({ children }) {
  const [ligandmode, setLigandMode] = useState(0);

  return (
    <LigandContext.Provider value={{
      state: {
        ligandmode: ligandmode,
        setLigandMode: setLigandMode,
      },
    }}>
      {children}
    </LigandContext.Provider>
  )
}