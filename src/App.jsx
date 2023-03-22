import { useState } from "react";
import Navbar from "./components/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import SignIn from "./components/SignIn";

import Navigation from "./components/Navigation";

function App() {

  return (
    <div className="App">
      {/* <Navigation /> */}
      <Navbar />
      <div className="bg-indigo-600 w-full h-screen"></div>
    </div>
  );
}

export default App;
