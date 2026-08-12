import React from "react";
import { assets } from "../../assets/assets.js";
import "./Footer.css";
function Footer() {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <h1 className="group cursor-pointer text-3xl font-extrabold tracking-tight text-white">
            Raman
            <span className="ml-0.5 text-orange-500 transition-colors duration-300 group-hover:text-orange-600">
              .
            </span>
          </h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae,
            nobis.
          </p>
          <div className="footer-social-icons flex gap-3">
  <a
    href="#"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 hover:bg-orange-500 transition-colors"
  >
    <img src={assets.facebook_icon} alt="Facebook" className="h-5 w-5" />
  </a>
  <a
    href="#"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 hover:bg-orange-500 transition-colors"
  >
    <img src={assets.twitter_icon} alt="Twitter" className="h-5 w-5" />
  </a>
  <a
    href="#"
    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 hover:bg-orange-500 transition-colors"
  >
    <img src={assets.linkedin_icon} alt="LinkedIn" className="h-5 w-5" />
  </a>
</div>

        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in Touch </h2>
          <ul>
            <li>+977 9826518530</li>
            <li>contact_myfriend_aarav_chaulagain@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 Elite.com - All Right Reserved{" "}
      </p>
    </div>
  );
}

export default Footer;
