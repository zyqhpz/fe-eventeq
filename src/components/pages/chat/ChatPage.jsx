import React, { useState, useEffect, useRef } from 'react'

import { useLocation } from 'react-router-dom'

import Navbar from '../../ui/Navbar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faLocationArrow } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'
import path from '../../utils/path'
import LoadingButton from '../../ui/button/LoadingButton'

import { io } from 'socket.io-client'

export default function ChatPage () {
  const [message, setMessage] = useState([])
  const [messages, setMessages] = useState([])
  const [messageIsEmpty, setMessageIsEmpty] = useState(true)
  const [error, setError] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const messageEndRef = useRef(null)

  const [data, setData] = useState([])

  // 2nd user
  const [secondUser, setSecondUser] = useState({})
  const [loadingSecondUser, setLoadingSecondUser] = useState(true)
  const [isHavingConversation, setIsHavingConversation] = useState(false)

  const [isFromItemDetails, setIsFromItemDetails] = useState(false)

  let messagesCount = 0

  const userId = localStorage.getItem('userId')

  const location = useLocation()
  const item = location.state?.item

  const socket = useRef()

  useEffect(() => {
    if (userId == null) {
      setIsAuthenticated(false)
      window.location.href = '/login'
    } else {
      setIsAuthenticated(true)

      console.log(item)

      axios
        .get(path.url + 'api/chat/getUsers/' + userId)
        .then((res) => {
          setUsers(res.data)
          setLoadingUsers(false)

          socket.current = io('http://localhost:5000')
          socket.current.emit('add-user', userId)
        })
        .catch(() => {})
    }
  }, [])

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on('msg-recieve', (msg) => {
  //       setArrivalMessage({ fromSelf: false, message: msg })
  //     })
  //   }
  // }, [])

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

  const handleSendMsg = async (msg) => {
    // const data = await JSON.parse(
    //   localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    // )
    socket.current.emit('send-msg', {
      to: secondUser._id,
      from: userId,
      msg
    })
    await axios.post('http://localhost:5000/api/messages/addmsg', {
      from: userId,
      to: secondUser._id,
      message: msg
    })

    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg })
    setMessages(msgs)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (message.trim() === '') {
      setError(true)
      return
    }

    const requestData = {
      sender: userId,
      receiver: secondUser.id,
      message
    }

    // fetch(path.url + 'api/chat/messages/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(requestData)
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // setMessages(data);
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })

    sendMessage(message)
    setMessage('')
    setError(false)
  }

  const UsersList = ({ users }) => (
    <div className="flex flex-col flex-nowrap space-y-4 w-full overflow-auto">
      {users &&
        users.map(({ ID, FirstName, LastName }) => (
          <User key={ID} id={ID} FirstName={FirstName} LastName={LastName} />
        ))}
    </div>
  )

  const getMessages = (sender, receiver) => {
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
  }

  const User = ({ id, FirstName, LastName }) => {
    return (
      <div
        key={id}
        className="px-3 flex items-center bg-grey-light cursor-pointer hover:bg-orange-100 pb-2 border-b"
        onClick={() => {
          setSecondUser({ id, FirstName, LastName })
          setLoadingSecondUser(false)
          setIsHavingConversation(true)
          getMessages(userId, id)
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
                      <div className="ml-4">
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
