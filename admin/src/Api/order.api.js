
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const getAllOrders = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/order/allOrders`);

  return res.data;
};
  

export const updateWorkflow = async(orderId)=>{
  return await axios.post(`${BASE_URL}/api/v1/order/${orderId}/workflow`);


}
export const adminDispatch = async(orderId)=>{
  return await axios.post(`${BASE_URL}/api/v1/order/${orderId}/admin-dispatch`);

}