// confirmOrder → markPreparing → dispatchOrder → startRiderMovement



import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/apiError.js";
export const confirmOrder = async(orderId,io)=>{
    const order = await Order.findById(orderId)
    if(!order){
        throw new ApiError(404,"Order not found");

    }

     order.orderStatus = "confirmed";
     await order.save();
     io.to(orderId).emit("orderStatusUpdated",{
        orderId,
        status:order.orderStatus
     })
     return order;

}

// MARK PREPARING

export const markPreparing = async(orderId,io)=>{
    const order  = await Order.findById(orderId);
    if(!order){
        throw new ApiError(400,"Order not found")
    }
    order.orderStatus=  "preparing";
    await order.save();

    io.to(orderId).emit("orderStatusUpdated",{
orderId,
status: order.orderStatus,
    })
    return order;

}



// 3. DISPATCH ORDER (IMPORTANT STEP)

// This is where rider starts:



import { startRiderMovement } from "./rider.service.js";

export const  dispatchOrder = async (orderId,io)=>{
    
    const order = await Order.findById(orderId);
     
    if(!order){
        throw new ApiError(400,"Order not found!!!!")
    }
    console.log("ROUTE FROM DB:", order.route);
     if (!order.route || order.route.length === 0) {
    throw new ApiError(400, "No route found in order");
  }

    order.orderStatus = "out_for_delivery";
   
    order.riderStarted =true;
    await order.save();

   

 
     // 🚴 START RIDER MOVEMENT
  startRiderMovement(io, orderId,order.route);

  return order;


}