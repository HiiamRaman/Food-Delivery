export const startRiderMovement  = (io,orderId,route=[])=>{
    let index = 0;
    if (!route || route.length === 0) {
  console.log("❌ No route provided");
  return;
}
    const interval  = setInterval(()=>{
        // stop when route ends

        if(index>=route.length){
          

            clearInterval(interval);
            
            io.to(orderId).emit("riderLocationUpdate",{
                orderId,
                status:"arrived"
            });
            return ;
        }
        console.log("location",route[index])
        io.to(orderId).emit("riderLocationUpdate",{
            orderId,
            location:route[index]
        })
        index++

    },2000); //move every 2 sec
}








