import React, { useState, useEffect, useRef } from 'react'

import { useLocation } from 'react-router-dom'

import Navbar from '../../ui/Navbar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faImages,
  faLocationArrow,
  faCircleUser
} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'
import path from '../../utils/path'
import LoadingButton from '../../ui/button/LoadingButton'

export default function ChatPage () {
  const [message, setMessage] = useState([])
  const [messages, setMessages] = useState([])
  const [messageIsEmpty, setMessageIsEmpty] = useState(true)
  const [error, setError] = useState(false)

  const [webSocket, setWebSocket] = useState(null)

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const messageEndRef = useRef(null)

  const [data, setData] = useState([])

  // 2nd user
  const [secondUser, setSecondUser] = useState({})
  const [loadingSecondUser, setLoadingSecondUser] = useState(true)
  const [isHavingConversation, setIsHavingConversation] = useState(false)

  let messagesCount = 0

  const userId = localStorage.getItem('userId')

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const toUser = queryParams.get('to_user')

  useEffect(() => {
    if (userId == null) {
      setIsAuthenticated(false)
      window.location.href = '/login'
    } else {
      setIsAuthenticated(true)

      axios
        .get(path.url + 'api/chat/getUsers/' + userId)
        .then((res) => {
          setUsers(res.data)
          setLoadingUsers(false)
        })
        .catch(() => {})
    }
  }, [])

  const MessageList = ({ messages }) => (
    <div className="flex flex-col flex-nowrap space-y-4 w-full">
      {messages &&
        messages.map(({ ID, Message, Sender, CreatedAt }) => (
          <MessageBox
            key={messagesCount++}
            id={ID}
            text={Message}
            sender={Sender}
            createdAt={CreatedAt}
          />
        ))}
      <div ref={messageEndRef} />
    </div>
  )

  const MessageBox = ({ id, text, sender, createdAt }) => {
    const messageClassNames = [
      'flex',
      'rounded-xl',
      'px-4',
      'py-2',
      'text-base',
      'max-w-xs',
      'shadow-sm',
      sender === userId
        ? 'bg-orange-200 text-black text-right'
        : 'bg-blue-300 text-white text-left'
    ].join(' ')

    const dateClassNames = [
      'flex pt-1 ',
      // if key is odd then align right else align left (for date)
      sender === userId ? 'justify-end' : 'justify-start'
    ].join(' ')

    const messageBoxClassNames = [
      'flex',
      sender === userId ? 'justify-end' : 'justify-start'
    ].join(' ')

    const formattedDate = new Date(createdAt).toLocaleString('en-MY', {
      hour: 'numeric',
      minute: 'numeric',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    return (
      <div className={messageBoxClassNames} key={id}>
        <div className="grid grid-cols-1">
          <div className={messageClassNames}>{text}</div>
          <div className={dateClassNames}>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text) => {
    const newMessage = {
      ID: messagesCount++,
      Message: text,
      Sender: userId,
      Receiver: secondUser.id,
      CreatedAt: new Date()
    }
    setMessages([...messages, newMessage])
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (message.trim() === '') {
      setError(true)
      return
    }

    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open yet. Cannot send message.')
      return
    }

    const data = {
      sender: userId,
      receiver: secondUser.id,
      message
    }

    // Send message to the WebSocket server
    webSocket.send(JSON.stringify(data))

    sendMessage(message)
    setMessage('')
    setError(false)
  }

  useEffect(() => {
    if (toUser) {
      // find user with id == toUser
      const user = users.find((user) => {
        return user.ID === toUser
      })

      if (user) {
        setSecondUser({ id: user.ID, FirstName: user.FirstName, LastName: user.LastName })
        setLoadingSecondUser(false)
        setIsHavingConversation(true)
        getMessages(userId, user.ID)
      }
    } else {
      // clear messages
      setMessages([])
      setSecondUser({ id: null, FirstName: null, LastName: null })
      setIsHavingConversation(false)
    }
  }, [users])

  const UsersList = ({ users }) => (
    <div className="flex flex-col flex-nowrap space-y-4 w-full overflow-auto">
      {users &&
        users.map(({ ID, FirstName, LastName, IsAvatarImageSet, ProfileImage }) => (
          <User key={ID} id={ID} FirstName={FirstName} LastName={LastName} IsAvatarImageSet={IsAvatarImageSet} ProfileImage={ProfileImage} />
        ))}
    </div>
  )

  const getMessages = (sender, receiver) => {
    // Establish WebSocket connection
    const ws = new WebSocket(path.ws + 'ws')

    // On connection open
    ws.onopen = () => {
      setWebSocket(ws)
    }

    // On receiving a message from the WebSocket server
    ws.onmessage = (event) => {
      const received = JSON.parse(event.data)
      if (received.receiver === userId && received.sender === receiver) {
        const receivedMessage = received.message
        const newMessage = {
          ID: messagesCount++,
          Message: receivedMessage,
          Sender: secondUser.id,
          Receiver: userId,
          CreatedAt: new Date()
        }
        setMessages((prevMessages) => [...prevMessages, newMessage])
      }
    }

    // On error
    ws.onerror = (event) => {
      console.error('WebSocket error:', event)
    }

    // On close
    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }

    const requestData = {
      sender,
      receiver
    }

    fetch(path.url + 'api/chat/messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data)
      })
      .catch((error) => {
        console.log(error)
      })

    // Clean up the WebSocket connection on component unmount
    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close()
      }
    }
  }

  const User = ({ id, FirstName, LastName, IsAvatarImageSet, ProfileImage }) => {
    return (
      <div
        key={id}
        // if id == secondUser.id then add bg-orange-100
        className={
          'flex flex-row items-center px-4 py-2 rounded-xl cursor-pointer hover:bg-orange-100 ' +
          (id === secondUser.id ? 'bg-orange-300' : '')
        }
        onClick={() => {
          window.location.href = '/message?to_user=' + id
        }}
      >
        {IsAvatarImageSet ? (
          <>
            <img
              src={path.url + 'api/item/image/' + ProfileImage}
              alt=""
              className="h-10 w-10 rounded-full object-center object-fill"
            />
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faCircleUser}
              className="h-10 w-10 rounded-full"
            />
          </>
        )}
        <div className="ml-4 w-full flex items-center justify-between border-grey-lighter py-4">
          <p className="text-grey-darkest">
            {FirstName} {LastName}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col w-screen">
      <Navbar />
      <div className="bg-gray-100 h-full max-w-full">
        <div>
          <div
            className="container mx-auto -mt-38 h-screen w-screen"
            style={{ height: 'calc(100vh - 96px)' }}
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
                      {loadingUsers
                        ? (
                        <div className="flex justify-center">
                          <LoadingButton />
                        </div>
                          )
                        : (
                        <UsersList users={users} />
                          )}
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="w-2/3 border flex flex-col">
                  <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                    <div className="flex items-center">
                      <div className="ml-4 font-semibold">
                        <p className="text-grey-darkest">{isHavingConversation ? secondUser.FirstName + ' ' + secondUser.LastName : 'No conversation selected'}</p>
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
                      {messages && messages.length > 0
                        ? (
                        <MessageList messages={messages} />
                          )
                        : (
                        <div className="mx-auto text-center text-gray-500">
                          Start a conversation
                        </div>
                          )}
                    </div>
                  </div>

                  <div className="bg-grey-lighter px-4 py-4 flex items-center">
                    {/* <FontAwesomeIcon icon={faImages} />   // TODO: Add image upload */}
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
                          if (event.key === 'Enter') {
                            handleSubmit(event)
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
    </div>
  )
}
