import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext.jsx";
import FoodItem from "../FoodItem/FoodItem.jsx";

function FoodDisplay() {
  const { food_list, category } = useContext(StoreContext);

  // Read search query from URL
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const currentList = Array.isArray(food_list) ? food_list : [];

  const filteredFood = currentList.filter((item) => {
    // Category filter
    const matchesCategory =
      category === "All" ||
      item.category?.trim().toLowerCase() ===
        category?.trim().toLowerCase();

    // Search filter
    const matchesSearch =
      !searchQuery ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase());

    // Both filters must match
    return matchesCategory && matchesSearch;
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
              {searchQuery
                ? `No dishes found for "${searchQuery}".`
                : "There are currently no dishes available in this category."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodDisplay;
