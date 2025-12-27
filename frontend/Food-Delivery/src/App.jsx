import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar.jsx';
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home/Home.jsx';
import Cart from './pages/Cart/Cart.jsx'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder.jsx';
import Footer from './components/Footer/Footer.jsx';
function App() {
const[showLogin,setLogin]=useState(false);

  return (
    <>
     
 <div className='app'>

      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/order'element={<PlaceOrder/>} />

      </Routes>
      <Footer/>
 </div>


 
    </>


   
  )
}

export default App
