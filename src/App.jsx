import SignIn from "./components/pages/SignIn";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import SignUp from "./components/pages/SignUp";

import { Route, Routes } from "react-router-dom";
import NewItem from "./components/pages/NewItem";
import DisplayImage from "./components/pages/DisplayImage";
import ItemDetails from "./components/pages/ItemDetails";
import ManageItem from "./components/pages/item/ManageItem";
import ChatPage from "./components/pages/chat/ChatPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/user/manage/profile"></Route>

        {/* item */}
        <Route path="/user/manage/item" element={<ManageItem />}></Route>
        <Route path="/item/create" element={<NewItem />} />
        <Route path="/item/:id" element={<DisplayImage />} />
        <Route path="/listing/item/:id" element={<ItemDetails />} />

        {/* Event */}
        <Route path="/listing/event/:id" element={<DisplayImage />} />

        {/* Chat */}
        <Route path="/message/" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
