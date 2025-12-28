import React, { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import './PlaceOrder.css'
function PlaceOrder() {

  const{getCartSubtotal,getCartTotal,getDeliveryFee}  = useContext(StoreContext)
  return (
    <form className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Info</p>
        <div className="multi-fields">
          <input type="text"  placeholder='first name'/>
          <input type="text" placeholder=' last name' />
        </div>
        <input type="email" placeholder='Enter your email' />
        <input type="text" placeholder=' street' />
        <div className="multi-fields">
          <input type="text" placeholder='City' />
          <input type="text" placeholder='state' />
        </div>
        <div className="multi-fields">
          <input type="text" placeholder='Zip-Code'/>
          <input type="text" placeholder='Country'/>
        </div>
        <input type="text" placeholder='Phone ' />
        
      </div>
      <div className="place-order-right">
              <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-detail-1">
            <p>Subtotal</p>
            <p>${getCartSubtotal()}</p>
          </div>
          <hr />
          <div className="cart-total-detail-2">
            <p>Delivery Fee</p>
            <p>${getDeliveryFee()}</p>
          </div>
          <hr />
          <div className="cart-total-detail-3">
            <b>Total</b>
            <b>${getCartTotal()}</b>
          </div>

          
        </div>
        <button >Proceed To Pay</button>
      </div>
      </div>

    </form>
  )
}

export default PlaceOrder
