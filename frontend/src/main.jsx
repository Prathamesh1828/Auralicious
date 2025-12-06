import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <GoogleOAuthProvider clientId="428470904674-9198dcbtn4hm0aj0epmqc7iq49gd5n2a.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </StoreContextProvider>
  </BrowserRouter>,
)
