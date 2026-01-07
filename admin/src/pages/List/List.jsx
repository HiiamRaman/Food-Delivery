import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
function List() {
  const [list, setList] = useState([]);
  const url = "http://localhost:3000";
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/v1/allfoods`);
    console.log(response.data);
    if (response.data.success) {
      setList(response.data.data.foods);
    } else {
      toast.error("Erorr!!");
    }
  };
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
          console.log(item.image);
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
              <p>X</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default List;
