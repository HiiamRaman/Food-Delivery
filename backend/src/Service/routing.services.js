export const fetchRouteFromORS = async (start, end) => {
  try {
    const requestBody = {
      coordinates: [
        [start.lng, start.lat],
        [end.lng, end.lat],
      ],
    };

    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        method: "POST",
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    const data = await res.json();

    return data;
  } catch (err) {
    console.log(" SERVICE ERROR:", err);
    throw new Error("ORS request failed");
  }
};
