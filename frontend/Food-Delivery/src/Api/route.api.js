export const getRoute = async (start, end) => {
  const res = await fetch("http://localhost:3000/api/v1/delivery/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start, end }),
  });

  return res.json();
};