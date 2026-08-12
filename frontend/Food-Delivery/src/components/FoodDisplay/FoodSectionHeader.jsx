import React from "react";

function FoodSectionHeader() {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
        Fresh Choices
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Top dishes near you
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
        Discover freshly prepared meals and choose something delicious from
        our most popular dishes.
      </p>
    </div>
  );
}

export default FoodSectionHeader;
