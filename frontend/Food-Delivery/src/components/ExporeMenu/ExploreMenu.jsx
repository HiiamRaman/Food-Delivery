import React, { useContext } from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets.js";
import { StoreContext } from "../../Context/StoreContext.jsx";

function ExploreMenu() {
  // Access category state and updater from context
  const { category, setCategory } = useContext(StoreContext);

 
 
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore menu</h1>
      <p className="explore-menu-text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, facere
        atque! Error expedita velit dolorum molestiae vero voluptatem commodi
        delectus?
      </p>

      <div className="explore-menu-list">
        {/* Map through menu_list to display each category */}
        {menu_list.map((item, index) => {
          return (
            <div
              key={index}
              className="explore-menu-list-item"
              onClick={() => {
                // Toggle category: if already selected, reset to "All"; else set selected
                setCategory((prev) =>
                  prev.trim().toLowerCase() ===
                  item.menu_name.trim().toLowerCase()
                    ? "All"
                    : item.menu_name
                );
               
              }}
            >
              {/* Highlight the image if it matches the selected category */}
              <img
                className={
                  category.trim().toLowerCase() ===
                  item.menu_name.trim().toLowerCase()
                    ? "active"
                    : ""
                }
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>

      <hr />
    </div>
  );
}

export default ExploreMenu;
