import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
// import styled from 'styled-components'
import { allUsersRoute, host } from './APIRoutes'
import ChatContainer from './ChatContainer'
// import Contacts from '../components/Contacts'

export default function Chat () {
  const navigate = useNavigate()
  const socket = useRef()
  const [contacts, setContacts] = useState([])
  const [currentChat, setCurrentChat] = useState(undefined)
  const [currentUser, setCurrentUser] = useState(undefined)
  useEffect(async () => {
    // if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
    if (!localStorage.getItem('userId')) {
      navigate('/login')
    } else {
      setCurrentUser(await JSON.parse(localStorage.getItem('userId')))
    }
  }, [])
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host)
      socket.current.emit('add-user', currentUser._id)
    }
  }, [currentUser])

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
        setContacts(data.data)
      } else {
        navigate('/setAvatar')
      }
    }
  }, [currentUser])
  const handleChatChange = (chat) => {
    setCurrentChat(chat)
  }
  return (
    <>
      <div>
        <div className="container">
          {/* <Contacts contacts={contacts} changeChat={handleChatChange} /> */}
            <ChatContainer currentChat={currentChat} socket={socket} />
        </div>
      </div>
    </>
  )
}
