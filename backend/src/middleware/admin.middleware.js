import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const isAdmin = (req,res,next)=>{
    
    if(!req.user){
throw new ApiError(401,"UnAuthorized");

    }

    if(req.user.role !== "admin"){
        throw new ApiError(403,"Admin Access only")
    }
    next()

}









