export const riderSocket = (io) => {

  io.on("connection", (socket) => {
    console.log("Rider Connected", socket.id);

    socket.on("start_demo_route", (route) => {
      // route = array of lat/lng points from frontend or backend
      let index = 0;

      const interval = setInterval(() => {
        if (index >= route.length) {
          clearInterval(interval);
          return;
        }

        const currentPosition = route[index];

        io.emit("rider_location_update", currentPosition);

        index++;
      }, 4000); // smooth movement speed
    });

    socket.on("disconnect", () => {
      console.log("Rider Disconnected", socket.id);
    });
  });

};