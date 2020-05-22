import React from "react";
import ReactDOM from "react-dom";
import { Routes } from "./frontend/Routes";

ReactDOM.render(
  <div className="container" style={{ height: "100vh" }}>
    <Routes />
  </div>,
  document.getElementById("root")
);
