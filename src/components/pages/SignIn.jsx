import Navbar from "../ui/Navbar";

import EventEQLogo from "../../assets/EventEQ.png";

import axios from "axios";

import { useState } from "react";

import {
  useToast,
} from "@chakra-ui/react";
import Footer from "../ui/Footer";

export default function SignIn() {
  const login = (email, password) => {
    return axios.post("http://localhost:8080/api/user/login", {
      email: email,
      password: password,

    }, {
        headers: {
          "Content-Type": "application/json",
      }
    });
  };

  // Error feedback for login failure
  const toast = useToast();
  const ErrorLogin = () => {
    return (
      toast({
        title: "Login failed.",
        description: "Please check your email and password.",
        status: "error",
        position: "top-right",
        duration: 9000,
        isClosable: true,
      })
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // prevent the default form submission behavior

    login(email, password)
      .then((response) => {
        if (response.data.status == "success") {
          window.location.href = "/";
        }
        else {
          ErrorLogin();
        }
      })
      .catch((error) => {
        console.error("Login error:", error.response.data);
      });
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Need an account?{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up here!
              </a>
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            method="POST"
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-orange-400 py-2 px-3 text-sm font-semibold text-white hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
