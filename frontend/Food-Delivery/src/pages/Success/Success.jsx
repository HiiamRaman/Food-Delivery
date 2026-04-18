// src/pages/Success/Success.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // optional: you can use react-icons too
import "./Success.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

function Success() {
  const { url, token, setCartItems } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");

  // Optional: redirect to home after few seconds
  useEffect(() => {
     let timer; // ✅ define here

    const clearCartAndRedirect = async () => {
      try {
        //clear backend cart
        if (token) {
          console.log("URL:", url + "/api/v1/deleteCart/clear");
          await axios.delete(
            `${url}/api/v1/deleteCart/clear`,
            
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
        }

        //clear frontend cart
        setCartItems({});

         timer = setTimeout(() => {
          navigate("/");
        }, 10000); // 10 seconds
        
      } catch (error) {
        console.log("Failed to Clear Cart",error);
        navigate("/")
        
      }
    };

    clearCartAndRedirect()
    return () => {
   if (timer) clearTimeout(timer);

  };

  }, [navigate,token]);

  const handleBackToHome = async () => {
    try {
      if(token){
        await axios.delete(`${url}/api/v1/cart/clear`,  {
        headers: { Authorization: `Bearer ${token}` }
      })
      }
      setCartItems({});
      navigate("/")
    } catch (error) {
      console.log(error);
      navigate("/")
    }
    
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <CheckCircle size={64} color="#4BB543" className="success-icon" />
        <h1 className="success-title">Payment Successful!</h1>
        {orderId && (
          <p className="success-order-id">
            Your Order ID: <b>{orderId}</b>
          </p>
        )}
        <p className="success-message">
          Thank you for your order. Your payment has been completed
          successfully.
        </p>
        <button className="success-button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Success;
