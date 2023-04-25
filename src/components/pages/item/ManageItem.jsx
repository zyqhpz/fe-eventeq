import Footer from "../../ui/Footer";
import Navbar from "../../ui/Navbar";

import React from "react";
import NewItem from "../NewItem";
import { useLocation } from "react-router-dom";

export default function ManageItem(props) {

    const location = useLocation()

    const state = location.state?.data

    // console.log(props, "props")
    console.log(location, "location")

    console.log(location.state, "data")


    // console.log(state)
    // const { data } = state;

    return (
        <div className="Home">
            {/* <div>{data.FirstName + data.LastName}</div> */}
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