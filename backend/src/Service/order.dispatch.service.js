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




export const dispatchOrderByAdmin = async (orderId, io) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // if (order.dispatchApproved) {
  //   throw new ApiError(400, "Order already dispatched");
  // }

  if (order.orderStatus !== "preparing") {
    throw new ApiError(400, "Order must be in preparing state");
  }

  // ✅ approve
  order.dispatchApproved = true;
  order.orderStatus = "out_for_delivery";

  await order.save();

  console.log("✅ Admin approved dispatch:", orderId);

  // 🚴 movement
  startRiderMovement(io, orderId, order.route);

  return order;
};