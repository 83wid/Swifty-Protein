import React, { useState } from "react";

const Context = React.createContext(); // Context for the ProtienView component

const HooksPovider = (props) => {
  const [model, setModel] = useState(1);
  const { children } = props;
  return (
    <Context.Provider
      value={{
        model,
        setModel: (value) => setModel(value),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context as ProteinHookContext, HooksPovider };
