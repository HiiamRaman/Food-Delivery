import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar.jsx';
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home/Home.jsx';
import Cart from './pages/Cart/Cart.jsx'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder.jsx';
import Footer from './components/Footer/Footer.jsx';
import Login from './components/Login/Login.jsx';
function App() {
const[showLogin,setShowLogin]=useState(false);

  return (
    <>
     {showLogin?<Login  setShowLogin={setShowLogin}/> :<> </>}
 <div className='app'>

      <Navbar  setShowLogin={setShowLogin}/>
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
