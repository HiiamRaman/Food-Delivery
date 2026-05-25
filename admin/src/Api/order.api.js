import adminApi from "./axios.admin";

// GET all orders
export const getAllOrders = async () => {
  
  const res = await adminApi.get("/order/allOrders");

  
  return res.data; // 👈 THIS is correct
};


// UPDATE workflow
export const updateWorkflow = (orderId, action) => {
  return adminApi.post(`/order/${orderId}/workflow`, { action });
};

// ADMIN dispatch order
export const adminDispatch = (orderId) => {
  return adminApi.post(`/order/${orderId}/admin-dispatch`);
};