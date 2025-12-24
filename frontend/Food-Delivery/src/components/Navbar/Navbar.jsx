import React from 'react'
import {assets} from '../../assets/assets'
import "./Navbar.css"
function Navbar() {
  return (
    <div className='navbar'>
      <img src={assets.logo} alt="" className='logo'/>
      <ul className='navbar-menu'>
        <li>Home</li>
        <li>Menu</li>
        <li>MobileApp</li> 
        <li>ContactUs</li>
      </ul>
      <div className='navbar-right'>
          <img src={assets.search_icon} alt="" />
          <div className="navbar-seach-icon">
            <img src={assets.basket_icon} alt="" />
          </div>
      </div>
      <button>sign in</button>



    </div>
  )
}

export default Navbar


