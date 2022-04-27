import React from "react";
import { Atom } from "../classes/Atom";

export const atomsParse = (data) => {
  const atm = [];
  data.split("\n").forEach((element) => {
    if (element.includes("ATOM")) {
      let elem = element.replace(/\s+/g, " ").split(" ");
      const name = elem[11].length > 1 ?  elem[11][0].toUpperCase() + elem[11][1].toLowerCase() : elem[11];
      atm.push(new Atom(Number(elem[6]), Number(elem[7]), Number(elem[8]),name));
    }
  });
  return atm;
}