export const generateMockRoute = (start,end,steps=5)=>{
    const route = [];

    const latStep = (end.lat - start.lat) / steps;
  const lngStep = (end.lng - start.lng) / steps;
 for (let i = 0; i <= steps; i++) {
    route.push({
      lat: start.lat + latStep * i,
      lng: start.lng + lngStep * i,
    });
  }
  return route

}