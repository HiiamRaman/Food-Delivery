import { Order } from "../models/order.model.js";
import {User} from '../models/user.model.js';
import { ApiError } from "../utils/API/apiError.js";
export const assignRiderToOrder = async({orderId,riderId})=>{
    
 const order = await Order.findById(orderId);
 if(!order){
    throw new ApiError(404,"Order not found")
 }
 const rider = await User.findById(riderId);
 if(!rider){
    throw new ApiError(400,"Rider not Found")
 }


 if(rider.role !=="rider"){
    throw new ApiError(400,"Selected user is not a rider")
 };
 order.assignedRider = riderId;
 order.riderAcceptted=false;
 await order.save();
 return order;
}