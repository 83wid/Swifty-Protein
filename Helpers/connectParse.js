import React from "react";

export const connectParse = (data) => {
  const con = [];
  data.split("\n").forEach((element) => {
    if (element.includes("CONECT")) {
      con.push(
        element.replace(/\s+/g, " ").substr(7, element.length).split(" ")
      );
    }
  });
  return con;
};
