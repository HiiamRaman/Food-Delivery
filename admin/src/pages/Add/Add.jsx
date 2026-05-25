import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets.js";
import "./Add.css";
import adminApi from "../../Api/axios.admin.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Add() {
  const url = "http://localhost:3000";
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Cake",
  });
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
  
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);
      const response = await adminApi.post(`/add-food/add`, formData);
      if (response.data.success) {
        console.log(" Food Added  successfully!!")
        setData({ name: "", description: "", price: "", category: "Cake" });
         setImage(null)
         toast.success(response.data.message)
      }
      
    } catch (error) {
      // Axios error for 400 or 500 status
  const message =
    error.response?.data?.data ||    // e.g., "All Fields are required!!"
    error.response?.data?.message || // fallback message
    "Something went wrong!";
  
  toast.error(message); // This will now show the toast
    }
  };

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />{" "}
          </label>
          {/* image?URL.createObjectURL(image) this helps to preview image */}
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type Here product name"
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product decription</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write Content Here"
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category-flex-col">
            <p>Product Category</p>
            <select
              onChange={onChangeHandler}
              value={data.category}
              name="category"
              id=""
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Desserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price-flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="$20"
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
}

export default Add;
