// import React, { useEffect, useState } from "react";
// import adminApi from "../../Api/axios.admin";
// import { toast } from "react-toastify";
// import "./List.css";

// function List() {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // FETCH LIST
//   const fetchList = async () => {
//     setLoading(true);
//     try {
//       const response = await adminApi.get(`/allfoods`);

//       if (response.data.success) {
//         setList(response.data.data.foods);
//       } else {
//         toast.error("Error fetching foods");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch foods");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // DELETE FOOD
//   const removeFood = async (id) => {
//     const confirmDelete = window.confirm("Are you sure?");
//     if (!confirmDelete) return;

//     try {
//       // optimistic update (instant UI change)
//       setList((prev) => prev.filter((item) => item._id !== id));

//       const response = await adminApi.delete(`/remove-food/${id}`);

//       if (response.data.success) {
//         toast.success("Food removed successfully");
//       } else {
//         toast.error(response.data.message || "Delete failed");
//         fetchList(); // rollback if failed
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong");
//       fetchList(); // restore state if error
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, []);

//   return (
//     <div className="list add flex-col">
//       <p>All Food List</p>

//       {loading && <p>Loading...</p>}

//       <div className="list-table">
//         <div className="list-table-format-title">
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b>Action</b>
//         </div>

//         {list.map((item) => (
//           <div key={item._id} className="list-table-format">
//             <img
//               src={item.image}
//               alt={item.name}
//               onError={(e) => (e.target.src = "/fallback.png")}
//             />

//             <p>{item.name}</p>
//             <p>${item.price}</p>
//             <p>{item.category}</p>

//             <button
//               onClick={() => removeFood(item._id)}
//               className="delete-btn"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default List;










import React, { useEffect, useState } from "react";
import adminApi from "../../Api/axios.admin";
import { toast } from "react-toastify";
import "./List.css";

function List() {
  const [list, setList] = useState([]);

  // Loading state for fetching foods
  const [loading, setLoading] = useState(false);

  // Stores the ID of the food currently being deleted
  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // FETCH FOOD LIST
  // =====================================================

  const fetchList = async () => {
    setLoading(true);

    try {
      const response = await adminApi.get("/allfoods");

      if (response.data.success) {
        setList(response.data.data.foods);
      } else {
        toast.error(
          response.data.message ||
            "Error fetching foods"
        );
      }
    } catch (error) {
      console.error(
        "FETCH FOOD ERROR:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch foods"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE FOOD
  // =====================================================

  const removeFood = (id) => {
    const food = list.find(
      (item) => item._id === id
    );

    if (!food) {
      toast.error("Food not found");
      return;
    }

    // Toast confirmation
    toast(
      ({ closeToast }) => (
        <div className="delete-confirm-toast">

          <p className="delete-confirm-title">
            Delete food?
          </p>

          <p className="delete-confirm-message">
            Are you sure you want to delete{" "}
            <strong>{food.name}</strong>?
          </p>

          <div className="delete-confirm-actions">

            <button
              className="cancel-delete-btn"
              onClick={closeToast}
            >
              Cancel
            </button>

            <button
              className="confirm-delete-btn"
              onClick={async () => {
                closeToast();

                await confirmDelete(id);
              }}
            >
              Delete
            </button>

          </div>

        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDelete = async (id) => {
    // Save current list for rollback
    const previousList = [...list];

    try {
      // Start deleting
      setDeletingId(id);

      // =================================================
      // OPTIMISTIC UPDATE
      // =================================================

      setList((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      // =================================================
      // API REQUEST
      // =================================================

      const response =
        await adminApi.delete(
          `/remove-food/${id}`
        );

      // =================================================
      // SUCCESS
      // =================================================

      if (response.data.success) {
        toast.success(
          "Food removed successfully"
        );

        return;
      }

      // =================================================
      // API FAILURE
      // =================================================

      setList(previousList);

      toast.error(
        response.data.message ||
          "Delete failed"
      );

    } catch (error) {
      // =================================================
      // ROLLBACK
      // =================================================

      setList(previousList);

      console.error(
        "DELETE FOOD ERROR:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );

    } finally {
      // Stop deleting state
      setDeletingId(null);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchList();
  }, []);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="list add flex-col">

      <p>All Food List</p>

      {/* ===============================================
          LOADING LIST
      =============================================== */}

      {loading && (
        <div className="loading-container">
          <p>Loading foods...</p>
        </div>
      )}

      {/* ===============================================
          EMPTY STATE
      =============================================== */}

      {!loading && list.length === 0 && (
        <div className="empty-state">
          <p>No food items found.</p>
        </div>
      )}

      {/* ===============================================
          FOOD TABLE
      =============================================== */}

      {!loading && list.length > 0 && (
        <div className="list-table">

          {/* HEADER */}

          <div className="list-table-format-title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>

          {/* FOOD ITEMS */}

          {list.map((item) => {

            const isDeleting =
              deletingId === item._id;

            return (
              <div
                key={item._id}
                className="list-table-format"
              >

                {/* IMAGE */}

                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      "/fallback.png";
                  }}
                />

                {/* NAME */}

                <p>
                  {item.name}
                </p>

                {/* CATEGORY */}

                <p>
                  {item.category}
                </p>

                {/* PRICE */}

                <p>
                  ${item.price}
                </p>

                {/* DELETE */}

                <button
                  onClick={() =>
                    removeFood(item._id)
                  }
                  disabled={isDeleting}
                  className="delete-btn"
                >
                  {isDeleting
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default List;
