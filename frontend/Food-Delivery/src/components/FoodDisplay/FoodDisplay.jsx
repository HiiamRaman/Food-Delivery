import React from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Context/StoreContext.jsx";
import { useContext } from "react";
import FoodItem from "../FoodItem/Fooditem.jsx";

function FoodDisplay() {
  const { food_list, category } = useContext(StoreContext);

  const filteredFood = food_list.filter((item) => {
    return category === "All" || item.category === category;
  });

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {filteredFood.map((item, index) => {
          return (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FoodDisplay;
