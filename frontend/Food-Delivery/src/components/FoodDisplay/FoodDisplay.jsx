// import React from "react";
// import "./FoodDisplay.css";
// import { StoreContext } from "../../Context/StoreContext.jsx";
// import { useContext } from "react";
// import FoodItem from "../FoodItem/Fooditem.jsx";

//  function FoodDisplay() {
//   const { food_list, category } = useContext(StoreContext);

//   // 1. Add a safety check. If food_list isn't an array, use an empty one.
//   const currentList = Array.isArray(food_list) ? food_list : [];

//   const filteredFood = currentList.filter((item) => {
//     return category === "All" || item.category === category;
//   });

//   return (
//     <div className="food-display" id="food-display">
//       <h2>Top dishes near you</h2>
//       <div className="food-display-list">
//         {filteredFood.length > 0 ? (
//           filteredFood.map((item) => (
//             <FoodItem
//               key={item._id}
//               id={item._id}
//               name={item.name}
//               price={item.price}
//               description={item.description}
//               image={item.image}
//             />
//           ))
//         ) : (
//           <p>Loading foods or no items found...</p>
//         )}
//       </div>
//     </div>
//   );

import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext.jsx";
import FoodItem from "../FoodItem/Fooditem.jsx";

function FoodDisplay() {
  const { food_list, category } = useContext(StoreContext);

  const currentList = Array.isArray(food_list) ? food_list : [];

  const filteredFood = currentList.filter((item) => {
    if (category === "All") return true;

    return (
      item.category?.trim().toLowerCase() === category?.trim().toLowerCase()
    );
  });

  return (
    <div id="food-display" className="w-full">

      {filteredFood.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFood.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No dishes found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no dishes available in this category.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodDisplay;
