import React, { useState } from 'react'
import {assets} from '../../assets/assets'
import "./Navbar.css"
import {Link} from 'react-router-dom'
function Navbar({setShowLogin}) {
  const [menu,setMenu] = useState("Home");
  
 
  return (
    <div className='navbar'>
      <img src={assets.logo} alt="" className='logo'/>
      <ul className='navbar-menu'>
        < Link to='/' onClick={()=>{setMenu("Home")}} className={menu==="Home"?"active":""}>Home</Link>
        <a href='#explore-menu' onClick={()=>{setMenu("Menu")}} className={menu==="Menu"?"active":""}>Menu</a>
        <a href='#app-download' onClick={()=>{setMenu("MobileApp")}} className={menu==="MobileApp"?"active":""}>MobileApp</a> 
        <a href='#footer' onClick={()=>{setMenu("ContactUs")}} className={menu==="ContactUs"?"active":""}>ContactUs</a>
      </ul>
      <div className='navbar-right'>
          <img src={assets.search_icon} alt="" />
          <div className="navbar-search-icon">
            <img src={assets.basket_icon} alt="" />
            <div className='dot'></div>
          </div>
      </div>
      <button onClick={()=>setShowLogin(true)}>sign in</button>



    </div>
  )
}

export default Navbar


