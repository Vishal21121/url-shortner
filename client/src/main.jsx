import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { UserContextProvider } from './context/UserContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
