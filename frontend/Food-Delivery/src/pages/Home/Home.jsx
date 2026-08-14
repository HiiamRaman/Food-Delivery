import React, { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import ExploreMenu from "../../components/ExporeMenu/ExploreMenu.jsx";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";
import AppDownload from "../../components/AppDownload/AppDownload.jsx";
import FoodSectionHeader from "../../components/FoodDisplay/FoodSectionHeader.jsx";
function Home() {
  const [category, setCategory] = useState("All");

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      {/* Wrapper to constrain and center content blocks perfectly */}
      <div className="w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 md:space-y-24">
        <Header />
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodSectionHeader />
        <FoodDisplay category={category} />
        <AppDownload />
      </div>
    </div>
  );
}

export default Home;

































// import React, { useState } from "react";
// import Header from "../../components/Header/Header.jsx";
// import ExploreMenu from "../../components/ExporeMenu/ExploreMenu.jsx";
// import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";
// import AppDownload from "../../components/AppDownload/AppDownload.jsx";
// import FoodSectionHeader from "../../components/FoodDisplay/FoodSectionHeader.jsx";

// function Home() {
//   const [category, setCategory] = useState("All");

//   return (
//     <div className="w-full min-h-screen flex flex-col items-center bg-white">
//       {/* Wrapper to constrain and center content blocks */}
//       <div className="w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12 space-y-16 md:space-y-24">

//         {/* Hero Header */}
//         <Header />

//         {/* Explore Menu Section */}
//         <ExploreMenu category={category} setCategory={setCategory} />

//         {/* Food Section Header */}
//         <FoodSectionHeader />

//         {/* Food Display Grid */}
//         <FoodDisplay category={category} />

//         {/* App Download CTA */}
//         <AppDownload />
//       </div>
//     </div>
//   );
// }

// export default Home;
