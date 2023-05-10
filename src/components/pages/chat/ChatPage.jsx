import React, { useState }from "react";

import { useLocation } from "react-router-dom";

import Footer from "../../ui/Footer";
import Navbar from "../../ui/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faLocationArrow } from "@fortawesome/free-solid-svg-icons";


const Message = ({ text, isSent }) => {
  const messageClassNames = [
    "inline-block",
    "rounded-full",
    "px-4",
    "py-2",
    isSent
      ? "bg-blue-500 text-white float-right"
      : "bg-gray-200 text-gray-900 float-left",
  ].join(" ");

  return <div className={messageClassNames}>{text}</div>;
};

const MessageList = ({ messages }) => (
  <div className="flex flex-col space-y-4">
    {messages &&
      messages.map(({ id, text, isSent }) => (
        <Message key={id} text={text} isSent={isSent} />
      ))}
  </div>
);

export default function ChatPage() {

  const state = useLocation().state;

  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageIsEmpty, setMessageIsEmpty] = useState(true);
  const [error, setError] = useState(false);

  const sendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      isSent: true,
    };

    setMessages([...messages, newMessage]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message.trim() === "") {
      // setMessageIsEmpty(true);
      setError(true);
      return;
    }
    sendMessage(message);
    setMessage("");
    setError(false);
    console.log(messages);
  };

    return (
      <div className="min-h-screen flex flex-col w-screen">
        <Navbar />
        <div className="bg-gray-100 h-screen max-w-full">
          {/* <div className="max-w-xl">
            <h1>Chat Page</h1>
          </div> */}
          <div>
            <h1>{state.FirstName + " " + state.LastName}</h1>
            <div className="w-full h-32 bg-orange-400"></div>

            <div className="container mx-auto -mt-32 h-screen max-w-xl">
              <div className="py-6 h-screen">
                <div className="flex border border-grey rounded shadow-lg h-full">
                  <div className="w-1/3 border flex flex-col">
                    <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                      <div>
                        {/* <img className="w-10 h-10 rounded-full" src="http://andressantibanez.com/res/avatar.png"/> */}
                      </div>

                      <div className="flex"></div>
                    </div>

                    <div className="py-2 px-2 bg-grey-lightest">
                      <input
                        type="text"
                        className="w-full px-2 py-2 text-sm"
                        placeholder="Search or start new chat"
                      />
                    </div>
                  </div>

                  <div className="w-2/3 border flex flex-col">
                    <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                      <div className="flex items-center">
                        <div>
                          {/* <img className="w-10 h-10 rounded-full" src="https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg"/> */}
                        </div>
                        <div className="ml-4">
                          <p className="text-grey-darkest">User Name</p>
                          <p className="text-grey-darker text-xs mt-1">
                            Andrés, Tom, Harrison, Arnold, Sylvester
                          </p>
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

                    <div className="flex-1 overflow-auto bg-orange-200">
                      <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">{
                        messages && messages.length > 0 ? (
                          <MessageList messages={messages} />
                        ) : (
                          <div className="text-center text-gray-500">
                            No messages yet
                          </div>
                        )
                      }</div>
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
        <Footer />
      </div>
    );
}