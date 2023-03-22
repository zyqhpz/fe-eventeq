import { useState } from "react";
// import Navbar from "./components/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import SignIn from "./components/SignIn";
// import "./App.css";
// import API from "./api.js";

// async function getData() {
//   const response = await fetch(API.books);
//   const res = await response.json();
//   console.log(res);
// }

// var data = {
//   id: "4",
//   title: "The Great Gatsby",
//   author: "F. Scott Fitzgerald",
//   quantity: 7,
// };

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

// async function postData() {
//   await fetch(API.books, {
//     method: "POST",
//     Accept: "application/json",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then(function (response) {
//       console.log(response);
//     })
//     .then(function (data) {
//       console.log("Success:", data);
//     })
//     .catch(function (error) {
//       console.error("Error:", error);
//     });
// }

import React from "react";

function Navbar() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-pink-500 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              href="#pablo"
            >
              pink Tailwind Starter Kit
            </a>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75"></i><span className="ml-2">Share</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i><span className="ml-2">Tweet</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i><span className="ml-2">Pin</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

function App() {
  // getData();

  return (
    <div className="App">
      <Navbar className="mx-auto min-w-full" />
      {/* <SignIn /> */}
      {/* <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Section 1 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Section 2 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion> */}
      {/* <form className="mx-auto flex-1">
        <div>
          <label className="text-2xl font-bold mx-3" htmlFor="book_title">
            Title
          </label>
          <input type="text" id="book_title" name="book_title" />
        </div>
        <div>
          <label
            className="text-2xl font-bold mx-3 rounded-md"
            htmlFor="book_author"
          >
            Author
          </label>
          <input type="text" id="book_author" name="book_author" />
        </div> */}
      {/* add input field that accept only integer numbers. use range */}
      {/* <div>
          <label className="text-2xl font-bold mx-3" htmlFor="book_quantity">
            Quantity
          </label>
          <input
            type="number"
            id="book_quantity"
            name="book_quantity"
            min={0}
            max={100}
          />
        </div> */}

      {/* <button className="m-3 bg-blue-600" type="submit">
          Add New
        </button>
      </form>
      <div>
        <button className="mx-2 bg-green-500" type="button" onClick={postData}>
          Send JSON
        </button>
      </div> */}
    </div>
  );
}

export default App;
