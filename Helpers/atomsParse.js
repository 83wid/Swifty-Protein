import React from "react";
import { mapAtoms } from "./mapAtoms";
import { Atom } from "../classes/Atom";
import { colors } from "./colors";

export const atomsParse = (data) => {
  const atm = [];
  data.split("\n").forEach((element) => {
    if (element.includes("ATOM")) {
      let elem = element.replace(/\s+/g, " ").split(" ");
      atm.push(new Atom(elem[6], elem[7], elem[8], elem[11], colors[elem[11]]));
    }
  });
  return mapAtoms(atm);
}