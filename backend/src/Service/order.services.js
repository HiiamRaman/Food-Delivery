import { Order } from "../models/order.model.js";
import { startRiderMovement } from "./rider.service.js";

const STATUS_FLOW = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};
const isValidTransition = (current, next) => {
  return STATUS_FLOW[current]?.includes(next);
};





export const handleOrderSideEffects = async ({ io, order }) => {
 const shouldStart = 
 order.orderStatus=== "out_for_delivery" && !order.riderStarted
 console.log("shouldStart:", shouldStart);
 if(!shouldStart) return ;
 order.riderStarted = true;
 await order.save()

  startRiderMovement(io, order._id.toString(), order.route);
};
