import React, { useState, useEffect, useRef }from "react";

import { useLocation } from "react-router-dom";

import Footer from "../../ui/Footer";
import Navbar from "../../ui/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faLocationArrow } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import path from "../../utils/path";
import LoadingButton from "../../ui/button/LoadingButton";

export default function ChatPage() {
  const state = useLocation().state;

  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageIsEmpty, setMessageIsEmpty] = useState(true);
  const [error, setError] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const messageEndRef = useRef(null);

  // 2nd user
  const [secondUser, setSecondUser] = useState({});
  const [loadingSecondUser, setLoadingSecondUser] = useState(true);
  const [isHavingConversation, setIsHavingConversation] = useState(false);

  const MessageList = ({ messages }) => (
    <div className="flex flex-col flex-nowrap	space-y-4 w-full">
      {messages &&
        messages.map(({ id, text, sentBy, sentByID, sentAt }) => (
          <Message
            key={id}
            id={id}
            text={text}
            sentByID={sentByID}
            sentBy={sentBy}
            sentAt={sentAt}
          />
        ))}
      <div ref={messageEndRef} />
    </div>
  );

  const Message = ({ id, text, sentBy, sentByID, sentAt }) => {
    const messageClassNames = [
      "flex",
      "rounded-xl",
      "px-4",
      "py-2",
      "text-base",
      "max-w-xs",
      "shadow-sm",
      // sentByID === state.ID
      id % 2 === 0
        ? "bg-orange-200 text-black text-right"
        : "bg-blue-300 text-white text-left",
    ].join(" ");

    const dateClassNames = [
      "flex pt-1 ",
      // if key is odd then align right else align left (for date)
      id % 2 === 0 ? "justify-end" : "justify-start",
    ].join(" ");

    const messageBoxClassNames = [
      "flex",
      id % 2 === 0 ? "justify-end" : "justify-start",
    ].join(" ");

    return (
      <div className={messageBoxClassNames}>
        <div className="grid grid-cols-1">
          <div className={messageClassNames}>{text}</div>
          <div className={dateClassNames}>
            <p className="text-xs text-gray-500">{sentAt}</p>
          </div>
        </div>
      </div>
    );
  };

  const data = [
    {
      id: 1,

      text: "Hello",
      sentAt: "12:45 pm",
      sentBy: "John Doe",
      sentByID: 1,
    },
    {
      id: 2,

      text: "Hello",
      sentAt: "12:45 pm",
      sentBy: "John Doe",
      sentByID: 1,
    },
    {
      id: 3,

      text: "Hello",
      sentAt: "12:45 pm",
      sentBy: "John Doe",
      sentByID: 1,
    },];

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sentAt: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
      }),
      sentBy: state.FirstName + " " + state.LastName,
      sentByID: state.ID,
    };

    console.log(newMessage.id);

    setMessages([...messages, newMessage]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message.trim() === "") {
      setError(true);
      return;
    }
    sendMessage(message);
    setMessage("");
    setError(false);
    console.log(messages);
  };

  const UsersList = ({ users }) => (
    <div className="flex flex-col flex-nowrap	space-y-4 w-full overflow-auto">
      {users &&
        users.map(({ ID, FirstName, LastName }) => (
          <User key={ID} id={ID} FirstName={FirstName} LastName={LastName} />
        ))}
    </div>
  );

  const User = ({ id, FirstName, LastName }) => {
    return (
      <div
        key={id}
        className="px-3 flex items-center bg-grey-light cursor-pointer hover:bg-orange-100 pb-2 border-b"
        onClick={() => {
          setSecondUser({ id, FirstName, LastName });
          setLoadingSecondUser(false);
          setIsHavingConversation(true);
          setMessages(data);
          }
        }
      >
        <img
          className="h-12 w-12 rounded-full"
          src="https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg"
        />
        <div className="ml-4 w-full flex items-center justify-between border-grey-lighter py-4">
          <p className="text-grey-darkest">
            {FirstName} {LastName}
          </p>
          <p className="text-xs text-grey-darkest">12:45 pm</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log(state);
    if (state == null) {
      setIsAuthenticated(false);
      window.location.href = "/";
    } else {
      setIsAuthenticated(true)
          axios
            .get(path.url + "api/chat/getUsers/" + state.ID)
            .then((res) => {
              setUsers(res.data);
              setLoadingUsers(false);
            })
            .catch((err) => {});
    }
  }, []);

    return (
      <div className="min-h-screen flex flex-col w-screen">
        <Navbar />
        <div className="bg-gray-100 h-full max-w-full">
          <div>
            <div
              className="container mx-auto -mt-38 h-screen w-screen"
              style={{ height: "calc(100vh - 96px)" }}
            >
              <div className="py-2 h-full">
                <div className="flex border border-grey rounded shadow-lg h-full w-full">

                  {/* LEFT SECTION */}
                  <div className="w-1/3 border flex flex-col">
                    <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-center items-center w-full">
                      <div className="flex">
                        <p className="text-grey-darkest">Contacts</p>
                      </div>
                    </div>

                    <div className="py-2 px-2 bg-grey-lightest w-full">
                      <input
                        type="text"
                        className="w-full px-2 py-2 text-sm"
                        placeholder="Search or start new chat"
                      />
                      <div className="w-full mt-6">
                        {loadingUsers ? (
                          <div className="flex justify-center">
                            <LoadingButton />
                          </div>
                        ) : (
                          <UsersList users={users} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SECTION*/}
                  <div className="w-2/3 border flex flex-col">
                    <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <p className="text-grey-darkest">{isHavingConversation ? secondUser.FirstName + " " + secondUser.LastName : "No conversation selected"}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="ml-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                          >
                            <path
                              fill="#263238"
                              fillOpacity=".6"
                              d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-gray-200">
                      <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                        {messages && messages.length > 0 ? (
                          <MessageList messages={messages} />
                        ) : (
                          <div className="mx-auto text-center text-gray-500">
                            Start a conversation
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-grey-lighter px-4 py-4 flex items-center">
                      <FontAwesomeIcon icon={faImages} />
                      <div className="flex-1 mx-4">
                        <input
                          className="w-full border rounded px-2 py-2"
                          type="text"
                          name="message"
                          id="message-input"
                          autoComplete="off"
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              handleSubmit(event);
                            }
                          }}
                        />
                      </div>
                      <FontAwesomeIcon
                        icon={faLocationArrow}
                        className="rotate-45 cursor-pointer text-black hover:text-orange-400"
                        onClick={handleSubmit}
                        id="send-message"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
}