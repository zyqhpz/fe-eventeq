import Navbar from "../ui/Navbar";

import EventEQLogo from "../../assets/EventEQ.png";

import axios from "axios";

import { useState } from "react";

import { useToast } from "@chakra-ui/react";


import { Alert, AlertIcon } from "@chakra-ui/react";

import Footer from "../ui/Footer";

export default function SignUp() {
  const login = (email, password) => {
    return axios.post(
      "http://localhost:8080/api/user/register",
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  // Error feedback for login failure
  const toast = useToast();
  const RegisterError = () => {
    return toast({
      title: "Login failed.",
      description: "Please check your email and password.",
      status: "error",
      position: "top-right",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // prevent the default form submission behavior

    login(email, password)
      .then((response) => {
        if (response.data.status == "success") {
          window.location.href = "/";
        } else {
          RegisterError();
        }
      })
      .catch((error) => {
        console.error("Register error:", error.response.data);
      });
  };

  // function to check if password and confirm password match
  const validatePassword = (e) => {
    if (password != e.target.value) {
      setIsPasswordMatch(false);
      return false;
    } else {
      setIsPasswordMatch(true);
      setConfirmPassword(e.target.value);
      return true;
    }
  };

  const checkInputFields = () => {
    if (
      firstName != "" &&
      lastName != "" &&
      email != "" &&
      password != "" &&
      confirmPassword != "" &&
      IsPasswordMatch
    ) {
      console.log("all fields are filled");
      setIsAvailableToSubmit(true);
    } else {
      setIsAvailableToSubmit(false);
    }
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isAvailableToSubmit, setIsAvailableToSubmit] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex min-h-full h-auto w-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-24 w-auto"
              src={EventEQLogo}
              alt="EventEQ Logo"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Have an existing account?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in here!
              </a>
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit} method="POST">
            <div className="-space-y-px rounded-md shadow-sm">
              <div className="flex gap-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    First Name
                  </label>
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="off"
                    required
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      checkInputFields();
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="off"
                    required
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Your last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      checkInputFields();
                    }}
                  />
                </div>
              </div>
              <div className="pt-4">
                <label
                  htmlFor="email-address"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    checkInputFields();
                  }}
                />
              </div>
              <div className="pt-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="off"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkInputFields();
                  }}
                  placeholder="•••••••••"
                />
              </div>
              <div className="pt-4">
                <div className={isPasswordMatch ? 'hidden' : 'block'}>
                  <Alert status="error">
                    <AlertIcon />
                    Password does not match
                  </Alert>
                </div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="off"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    validatePassword(e);
                    checkInputFields();
                  }}
                  placeholder="•••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative flex w-full justify-center rounded-md py-2 px-3 text-sm font-semibold text-white 
                  ${
                    isAvailableToSubmit
                      ? "bg-orange-400 hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                disabled={!isAvailableToSubmit}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
