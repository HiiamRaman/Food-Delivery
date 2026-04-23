import { fetchRouteFromORS } from "../Service/routing.services.js";

export const getDeliveryRoute = async (req, res) => {
  try {
    const { start, end } = req.body;

    const data = await fetchRouteFromORS(start, end);

    if (!data) {
      return res.status(500).json({ message: "No response from ORS" });
    }

    if (!data.routes) {
      return res
        .status(500)
        .json({ message: "Invalid ORS response (no routes)" });
    }

    const route = data.routes[0];

    return res.json({
      distance: route.summary.distance,
      duration: route.summary.duration,
      geometry: route.geometry,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching route",
    });
  }
};
