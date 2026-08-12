
import React from "react";
import { Link } from "react-router-dom";
function Header() {
  return (
    /*
      1. mx-auto w-full: Forces the header block to perfectly center itself inside your page container.
      2. bg-cover bg-center: Ensures your image looks crisp and centered at all times.
    */
    <div className="header relative mx-auto w-full h-[38vw] min-h-[420px] max-w-7xl flex items-center rounded-3xl bg-[url('/header_img.png')] bg-cover bg-center px-6 sm:px-12 md:px-16 overflow-hidden shadow-sm">
      {/*
        Optional Dark Overlay:
        If your header image makes the white text hard to read, uncomment the line below
        to add a subtle dark layer behind the text.
      */}
      {/* <div className="absolute inset-0 bg-black/20 rounded-3xl pointer-events-none" /> */}

      {/* Content wrapper - handles the text width and layout spacing */}
      <div className="relative z-10 flex max-w-full flex-col items-start gap-4 sm:max-w-[60%] sm:gap-5 md:gap-6 animate-fade-in">
        {/* Main Heading with dynamic text size scaling */}
        <h2 className="text-3xl font-bold leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
          Order your food here
        </h2>

        {/* Paragraph description */}
        <p className="text-sm font-medium text-slate-100 sm:text-base md:text-lg leading-relaxed drop-shadow-sm">
          Discover fresh, delicious meals from your favorite local restaurants
          and have them delivered straight to your door — fast, simple, and
          convenient.
        </p>

        {/* Premium View Menu Button */}
        <a href="#explore-menu">
          <button
            type="button"
            className="rounded-xl  w-20 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg active:scale-95"
          >
            View Menu
          </button>
        </a>
      </div>
    </div>
  );
}

export default Header;
