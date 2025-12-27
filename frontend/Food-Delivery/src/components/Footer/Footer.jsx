import React from 'react'
import { assets } from '../../assets/assets.js'
import './Footer.css'
function Footer() {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
                <img src={assets.logo} alt="" />
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, nobis.</p>
                <div className='footer-social-icons'>
                   <img src={assets.facebook_icon} alt="" />
                   <img src={assets.twitter_icon} alt="" />
                   <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className='footer-content-center'>
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
            </div>
            <div className='footer-content-right'>
                 <h2>Get in Touch </h2>
                 <ul>
                    <li>+977 9826518530</li>
                    <li>contact_myfriend_aarav_chaulagain@gmail.com</li>
                 </ul>
            </div>

        </div>
      <hr />
      <p className='footer-copyright'>Copyright 2024 Elite.com - All Right Reserved </p>
    </div>
  )
}

export default Footer
