




import React, { useContext, useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Login({ setShowLogin }) {
  const { url, setToken, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const navigate = useNavigate();

  // Single state object for all fields
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
  e.preventDefault();

  const isLogin = currState === "Login";
  const apiEndpoint = isLogin
    ? `${url}/api/v1/user/login`
    : `${url}/api/v1/user/register`;

  const submitData = isLogin
    ? { email: formData.email, password: formData.password }
    : formData;

  try {
    const response = await axios.post(apiEndpoint, submitData, {
      withCredentials: true,
    });

    if (response.status >= 200 && response.status < 300) {
      const token = response.data.data.accessToken;
      const user = response.data.data.user;

      if (isLogin && user.role === "admin") {
        toast.success("Redirecting to Admin Panel...");

        setTimeout(() => {
          window.location.href = "http://localhost:5174";
        }, 1000);

        return;
      }

      if (isLogin) {
        setToken(token);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        await loadCartData(token);

        toast.success("User logged in successfully");
        navigate("/");
        setShowLogin(false);
      } else {
        toast.success("Account created successfully. Please login.");
        setCurrState("Login");
      }
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred");
  }
};

  return (
    <div className="login">
      <form onSubmit={onSubmit} className="login-container">
        <div className="login-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>

        <div className="login-inputs">
          {currState === "Signup" && (
            <>
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={onChangeHandler}
                required
              />
              <input
                name="fullname"
                type="text"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={onChangeHandler}
                required
              />
            </>
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChangeHandler}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChangeHandler}
            required
          />
        </div>

        <button type="submit">
          {currState === "Signup" ? "Create Account" : "Login"}
        </button>

        {currState === "Signup" && (
          <div className="login-condition">
            <input type="checkbox" required />
            <p>Accept Terms and Conditions</p>
          </div>
        )}

        <p>
          {currState === "Login"
            ? "Create a new account? "
            : "Already have an account? "}
          <span
            onClick={() =>
              setCurrState(currState === "Login" ? "Signup" : "Login")
            }
            className="form-switch"
          >
            {currState === "Login" ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;











































































