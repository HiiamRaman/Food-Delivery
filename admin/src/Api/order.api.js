
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const getAllOrders = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/order/allOrders`);

  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  console.log("ORDER ID:", orderId);
console.log("STATUS:", status);

  const res = await axios.patch(
    `${BASE_URL}/api/v1/order/status/${orderId}`,
    { status }
  );
  console.log("STATUS UPDATE RESPONSE:", res);

  return res.data;
};



