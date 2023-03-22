import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <ChakraProvider> */}
      <Navbar />
      <App minHeight="100vh" minWith="100vw"/>
    {/* </ChakraProvider> */}
  </React.StrictMode>
);
