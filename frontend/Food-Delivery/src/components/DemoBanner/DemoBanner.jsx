// import React from "react";
// import { FlaskConical } from "lucide-react";
// import "./DemoBanner.css";

// function DemoBanner() {
//   const message = (
//     <span className="demo-message">
//       <FlaskConical size={14} />
//       DEMO PROJECT
//       <span>•</span>
//       FOR PORTFOLIO PURPOSES
//       <span>•</span>
//       PAYMENTS ARE NOT REAL
//       <span>•</span>
//     </span>
//   );

//   return (
//     <div className="demo-banner">
//       <div className="demo-track">
//         {message}
//         {message}
//         {message}
//         {message}
//       </div>
//     </div>
//   );
// }

// export default DemoBanner;








import React, { useState } from "react";
import {
  ChevronDown,
  FlaskConical,
  Github,
  Info,
} from "lucide-react";
import "./DemoBanner.css";

function DemoBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="demo-banner">
      <div className="demo-banner-inner">
        {/* Moving Text */}

        <div className="demo-marquee">
          <div className="demo-track">
            <span className="demo-message">
              <FlaskConical size={15} />

              DEMO PROJECT

              <span>•</span>

              FOR PORTFOLIO PURPOSES

              <span>•</span>

              PAYMENTS ARE NOT REAL

              <span>•</span>
            </span>

            <span className="demo-message">
              <FlaskConical size={15} />

              DEMO PROJECT

              <span>•</span>

              FOR PORTFOLIO PURPOSES

              <span>•</span>

              PAYMENTS ARE NOT REAL

              <span>•</span>
            </span>

            <span className="demo-message">
              <FlaskConical size={15} />

              DEMO PROJECT

              <span>•</span>

              FOR PORTFOLIO PURPOSES

              <span>•</span>

              PAYMENTS ARE NOT REAL

              <span>•</span>
            </span>
          </div>
        </div>

        {/* Dropdown */}

        <div className="demo-dropdown">
          <button
            type="button"
            className="demo-dropdown-button"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            Explore

            <ChevronDown
              size={17}
              className={isOpen ? "dropdown-arrow open" : "dropdown-arrow"}
            />
          </button>

          {isOpen && (
            <div className="demo-dropdown-menu">
              <a
                href="https://github.com/HiiamRaman"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={17} />

                <div>
                  <strong>View GitHub</strong>
                  <span>See my projects</span>
                </div>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <Info size={17} />

                <div>
                  <strong>Demo Project</strong>
                  <span>Portfolio showcase</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DemoBanner;
