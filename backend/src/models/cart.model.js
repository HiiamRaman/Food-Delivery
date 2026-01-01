import mongoose from 'mongoose'

export const cartSchema  = new mongoose.Schema ({
food:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Food",
    required:true
},
quantity:{
    type:Number,
    default:1,
    min:1
},





},{timestamps:true});
export const Cart = new mongoose.model("Cart",cartSchema);