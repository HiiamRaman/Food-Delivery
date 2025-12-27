import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header.jsx'
import ExploreMenu from '../../components/ExporeMenu/ExploreMenu.jsx'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay.jsx'
function Home() {
  const[category,setCategory]=useState("All")
   
  return (
    
    <div>
     <Header/>
    
     <ExploreMenu category={category} setCategory={setCategory}/>
     <FoodDisplay category={category}/>
    </div>
  )
}

export default Home
