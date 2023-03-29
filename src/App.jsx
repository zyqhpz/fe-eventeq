import SignIn from "./components/pages/SignIn";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import SignUp from "./components/pages/SignUp";

import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  );
}

export default App;
