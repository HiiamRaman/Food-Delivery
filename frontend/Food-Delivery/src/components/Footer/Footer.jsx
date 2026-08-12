import React from "react";
import { assets } from "../../assets/assets.js";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-content-left">
          <h1 className="group cursor-pointer text-3xl font-extrabold tracking-tight text-white">
            Raman
            <span className="ml-0.5 text-orange-500 transition-colors duration-300 group-hover:text-orange-400">
              .
            </span>
          </h1>

          <p>
            Bringing your favorite meals closer to you. Discover delicious
            dishes, order with ease, and enjoy fresh food delivered straight to
            your door.
          </p>

          {/* Social Links */}
          <div className="footer-social-icons flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500"
            >
              <img src={assets.facebook_icon} alt="" className="h-5 w-5" />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500"
            >
              <img src={assets.twitter_icon} alt="" className="h-5 w-5" />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500"
            >
              <img src={assets.linkedin_icon} alt="" className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Company */}
        <div className="footer-content-center">
          <h2>COMPANY</h2>

          <ul>
            <li>
              <a href="/">Home</a>
            </li>

            <li>
              <a href="#explore-menu">Explore Menu</a>
            </li>

            <li>
              <a href="#app-download">Get the App</a>
            </li>

            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>

          <ul>
            <li>+977 9826518530</li>

            <li>contact_myfriend_aarav_chaulagain@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr />

      {/* Copyright */}
      <p className="footer-copyright">© 2026 Raman. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
