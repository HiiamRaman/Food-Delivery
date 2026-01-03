import React from 'react'
import { assets } from '../../assets/assets.js'

function Add() {
  return (
    <div className='add'>
        <form className='flex-col'>
          <div className='add-image-upload flex-col'>
            <p>Upload Image</p>
            <label htmlFor="image">
                <img src={assets.upload_area} alt="" />
            </label>
            <input type="file"  id='image' hidden required/>

          </div>
          <div className="product-name flex-col">
            <p>Product name</p>
            <input type="text" name='name' placeholder='Type Here product name'/>
          </div>
          <div className="add-product-description">
            
          </div>
        </form>
      
    </div>
  )
}

export default Add
