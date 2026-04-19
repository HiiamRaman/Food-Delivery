// // src/pages/Success/Success.jsx
// import React, { useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { CheckCircle } from "lucide-react"; // optional: you can use react-icons too
// import "./Success.css";
// import { useContext } from "react";
// import { StoreContext } from "../../Context/StoreContext";
// import axios from "axios";

// function Success() {
//   const { url, token, setCartItems } = useContext(StoreContext);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const orderId = searchParams.get("orderId");

//   // Optional: redirect to home after few seconds
//   useEffect(() => {
//     const orderId = searchParams.get("orderId");
//     if (!orderId) return;
//     const confirmPayment = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:3000/api/v1/payment/success",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               orderId,
//               paymentId: "demo_payment_id", // later from Stripe webhook
//             }),
//           },
//         );
//         const data = await res.json();
//         console.log("✅ Payment confirmed:", data);
//       } catch (error) {
//         console.error("❌ Error confirming payment:", error);
//       }
//     };
//     confirmPayment();

//     let timer; // ✅ define here

//     const clearCartAndRedirect = async () => {
//       try {
//         //clear backend cart
//         if (token) {
//           console.log("URL:", url + "/api/v1/deleteCart/clear");
//           await axios.delete(
//             `${url}/api/v1/deleteCart/clear`,

//             {
//               headers: { Authorization: `Bearer ${token}` },
//             },
//           );
//         }

//         //clear frontend cart
//         setCartItems({});

//         timer = setTimeout(() => {
//           navigate("/");
//         }, 10000); // 10 seconds
//       } catch (error) {
//         console.log("Failed to Clear Cart", error);
//         navigate("/");
//       }
//     };

//     clearCartAndRedirect();
//     return () => {
//       if (timer) clearTimeout(timer);
//     };

//   }, [navigate, token]);

//   const handleBackToHome = async () => {
//     try {
//       if (token) {
//         await axios.delete(`${url}/api/v1/cart/clear`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }
//       setCartItems({});
//       navigate("/");
//     } catch (error) {
//       console.log(error);
//       navigate("/");
//     }
//   };

//   return (
//     <div className="success-container">
//       <div className="success-card">
//         <CheckCircle size={64} color="#4BB543" className="success-icon" />
//         <h1 className="success-title">Payment Successful!</h1>
//         {orderId && (
//           <p className="success-order-id">
//             Your Order ID: <b>{orderId}</b>
//           </p>
//         )}
//         <p className="success-message">
//           Thank you for your order. Your payment has been completed
//           successfully.
//         </p>
//         <button className="success-button" onClick={handleBackToHome}>
//           Back to Home
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Success;















import React, { useEffect, useContext, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import "./Success.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { io } from "socket.io-client";




const socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });


socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Socket disconnected");
});

function Success() {
  const { url, token, setCartItems } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  // Use a ref to prevent double-calling in React Strict Mode
  const hasCalled = useRef(false);

  

 useEffect(() => {
  console.log("🚀 Success page mounted");

  console.log("📦 orderId:", orderId);
  console.log("🔐 token:", token);

  if (!orderId || !token || hasCalled.current) {
    console.log("⛔ Skipping execution", {
      orderId,
      token,
      alreadyCalled: hasCalled.current,
    });
    return;
  }

  hasCalled.current = true;

  const processPostPayment = async () => {
    try {
      console.log("📡 Calling payment success API...");

      // 1. Confirm Payment
      const paymentRes = await axios.post(`${url}/api/v1/payment/success`, {
        orderId,
        paymentId: "stripe_session_completed",
      });

      console.log("📥 Payment response:", paymentRes.data);

      if (paymentRes.data.success) {
        console.log("✅ Payment confirmed");

        // 2. Clear Backend Cart
        console.log("🧹 Clearing backend cart...");
        await axios.delete(`${url}/api/v1/deleteCart/clear`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Backend cart cleared");

        // 3. Clear Frontend Cart
        setCartItems({});
        console.log("✅ Frontend cart cleared");

        // 4. Emit socket event
        const routeData = [
          { lat: 27.7172, lng: 85.3240 },
          { lat: 27.721, lng: 85.325 },
          { lat: 27.725, lng: 85.33 },
          { lat: 27.727, lng: 85.336 },
          { lat: 27.729, lng: 85.339 },
        ];

        console.log("📤 Emitting start_order_tracking:", routeData);

        socket.emit("start_order_tracking", {
          route: routeData,
        });

        console.log("📡 Socket emit done");
      } else {
        console.log("❌ Payment not successful:", paymentRes.data);
      }
    } catch (error) {
      console.error("❌ Success Page Error:", error.response?.data || error.message);
    }
  };

  processPostPayment();

  const timer = setTimeout(() => {
    console.log("⏳ Redirecting to /myorders");
    navigate("/myorders");
  }, 10000);

  return () => {
    console.log("🧹 Cleanup Success page");
    clearTimeout(timer);
  };
}, [orderId, token, url, navigate, setCartItems]);

  const handleBackToHome = () => {
    navigate("/");
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
          Your rider will be assigned shortly. You can track your order in the
          "My Orders" section.
        </p>
        <button className="success-button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Success;
