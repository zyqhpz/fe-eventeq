import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import './index.css'

import { BrowserRouter } from 'react-router-dom'

import { registerSW } from 'virtual:pwa-register'

// Register the service worker
registerSW()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ChakraProvider>
)
