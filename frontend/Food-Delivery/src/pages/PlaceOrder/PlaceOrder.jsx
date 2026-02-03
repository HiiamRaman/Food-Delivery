import React, { useContext, useEffect ,useState} from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./PlaceOrder.css";
import axios from "axios";


function PlaceOrder() {
  const {
    getCartSubtotal,
    getCartTotal,
    getDeliveryFee,
    token,
    food_list,
    cartItems,
    url,
  } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const createOrder = async (event)=>{
     event.preventDefault();
     let orderItems = [];
     food_list.map((item)=>{
      if(cartItems[item._id]>0){
        let itemInfo = {...item};
        itemInfo.quantity=cartItems[item._id];
        orderItems.push(itemInfo)
      }
     })
  let orderData = {
    deliveryAddress:data,
    items:orderItems,
    amount:getCartTotal()

  }
  let response = await axios.post(url+"/api/v1/order/create",orderData,{headers:{Authorization: `Bearer ${token}`}})


  if (response.data.success){
    const {url:session_url} = response.data.data;
    window.location.replace(session_url)
  } else{
    alert("Error")
  }
  }

 
  return (
    <form onSubmit={createOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Info</p>
        <div className="multi-fields">
          <input required  name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="first name" />
          <input required  name="lastName" onChange={onChangeHandler} value={data.lastName}  type="text" placeholder=" last name" />
        </div>
        <input  required  name="email" onChange={onChangeHandler} value={data.email}  type="email" placeholder="Enter your email" />
        <input  required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder=" street" />
        <div className="multi-fields">
          <input  required name="city" onChange={onChangeHandler} value={data.city}  type="text" placeholder="City" />
          <input  required  name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="state" />
        </div>
        <div className="multi-fields">
          <input required  name="zipcode" onChange={onChangeHandler}  value={data.zipcode} type="text" placeholder="Zip-Code" />
          <input  required  name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input   required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone " />
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
          <button type="submit" >Proceed To Pay</button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
