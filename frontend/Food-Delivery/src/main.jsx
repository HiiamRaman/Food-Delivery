import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StoreContextProvider from './Context/StoreContext.jsx';
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
socket.on("connect",()=>{
  console.log("connected to server ", socket.id)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <StoreContextProvider>

    <App />
  </StoreContextProvider>
  </BrowserRouter>
  </StrictMode>,
)
