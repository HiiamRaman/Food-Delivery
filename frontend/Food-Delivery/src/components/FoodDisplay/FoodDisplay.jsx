import React from 'react'
import './FoodDisplay.css'
import  { StoreContext } from '../../Context/StoreContext.jsx'
import { useContext } from 'react'
import FoodItem from '../FoodItem/Fooditem.jsx'
function FoodDisplay() {

    const {food_list} =useContext(StoreContext)
  return (

    <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item,index)=>{
            return  <FoodItem key={index} id={item.id} name={item.name} price={item.price} description={item.description} image={item.image}/>
            })}
      </div>
    </div>
  )
}

export default FoodDisplay
