
import React, { useContext } from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets.js";
import { StoreContext } from "../../Context/StoreContext.jsx";

function ExploreMenu() {
  const { category, setCategory } = useContext(StoreContext);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>

      <p className="explore-menu-text">
        Browse by category and quickly find the kind of meal you're craving,
        from light bites and fresh salads to hearty mains and sweet treats.
      </p>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          const isActive =
            category.trim().toLowerCase() ===
            item.menu_name.trim().toLowerCase();

          return (
            <div
              key={index}
              className="explore-menu-list-item"
              onClick={() => {
                setCategory((prev) =>
                  prev.trim().toLowerCase() ===
                  item.menu_name.trim().toLowerCase()
                    ? "All"
                    : item.menu_name
                );
              }}
            >
              <img
                className={isActive ? "active" : ""}
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
