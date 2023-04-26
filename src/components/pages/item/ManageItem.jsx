import Footer from "../../ui/Footer";
import Navbar from "../../ui/Navbar";

import React from "react";
import NewItem from "../NewItem";
import { useLocation } from "react-router-dom";

export default function ManageItem() {

    const location = useLocation()
    const state = location.state

    return (
        <div className="ManageItem">
        <Navbar />
        <div className="bg-gray-100 w-screen h-screen">
            <div className="flex flex-col items-center justify-center h-full">
            <NewItem/>
            </div>
        </div>
        <Footer/>
        </div>
    );
}