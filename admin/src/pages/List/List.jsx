import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import './List.css';
function List() {
  const [list, setList] = useState([]);
  const url = "http://localhost:3000";
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/v1/allfoods`);
    
    if (response.data.success) {
      setList(response.data.data.foods);
    } else {
      toast.error("Erorr!!");
    }
  };

  const removeFood = async (id)=>{
    ;
    const response = await axios.delete(`${url}/api/v1/remove-food/${id}`)
    
    if (response.data.success) {
      toast.success("Food removed successfully");
      await fetchList(); // refresh the list
    } else {
      toast.error(response.data.message || "Delete failed");
    }
   
  }
  useEffect(() => {
    fetchList();
  }, []);
  return (
    <div className="list add flex-col">
      <p> All Food List</p>
      <div className="list-table">
        <div className="list-table-format-title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
       
          return (
            <div key={index} className="list-table-format">
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.src = "/fallback.png"; //this is image handler when image break this will help
                }}
              />
              <p>{item.name}</p>
              <p>${item.price}</p>
              <p>{item.category}</p>
              <p onClick={()=>removeFood(item._id)}>X</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default List;
