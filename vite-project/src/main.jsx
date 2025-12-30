import { StrictMode } from 'react'
import {GoogleOAuthProvider} from "@react-oauth/google";
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import store from "../store/store.jsx"
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Provider store={store}>
    <BrowserRouter>
    <GoogleOAuthProvider clientId="744154804557-9e4d3llkuqss6en0a5iqodtqltnopl32.apps.googleusercontent.com">
    <App></App>
    </GoogleOAuthProvider>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)


