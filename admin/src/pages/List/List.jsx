import React, { useEffect, useState } from "react";
import adminApi from "../../Api/axios.admin";
import { toast } from "react-toastify";
import "./List.css";

function List() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // FETCH LIST
  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get(`/allfoods`);

      if (response.data.success) {
        setList(response.data.data.foods);
      } else {
        toast.error("Error fetching foods");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch foods");
    } finally {
      setLoading(false);
    }
  };

  // DELETE FOOD
  const removeFood = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      // optimistic update (instant UI change)
      setList((prev) => prev.filter((item) => item._id !== id));

      const response = await adminApi.delete(`/remove-food/${id}`);

      if (response.data.success) {
        toast.success("Food removed successfully");
      } else {
        toast.error(response.data.message || "Delete failed");
        fetchList(); // rollback if failed
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      fetchList(); // restore state if error
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>

      {loading && <p>Loading...</p>}

      <div className="list-table">
        <div className="list-table-format-title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img
              src={item.image}
              alt={item.name}
              onError={(e) => (e.target.src = "/fallback.png")}
            />

            <p>{item.name}</p>
            <p>${item.price}</p>
            <p>{item.category}</p>

            <button
              onClick={() => removeFood(item._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;