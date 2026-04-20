import React, { useContext, useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login({ setShowLogin }) {
  const { url, setToken, loadCartData } = useContext(StoreContext);

  // State to track whether Login or Signup form is active
  const [currState, setCurrState] = useState("Login");

  // Separate states for Login and Signup
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  // Input change handler
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (currState === "Login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit handler
  const onSubmit = async (e) => {
    e.preventDefault();

    const submitData = currState === "Login" ? loginData : signupData;
    const apiEndpoint =
      currState === "Login"
        ? `${url}/api/v1/user/login`
        : `${url}/api/v1/user/register`;

    try {
      const response = await axios.post(apiEndpoint, submitData);

      if (response.data.statusCode == 200) {
        const token = response.data.data.accessToken;
        if (token) {
          setToken(token);
          localStorage.setItem("accessToken", token);
          setTimeout(() => {
            loadCartData(token);
          }, 0);
          
          setShowLogin(false);
          toast.success(response.data.message || "Login successful");
        }
      } else {
        toast.error(response.data.message || "Login Failed ");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.response?.data?.message || "Network or server error");
    }
  };

  // Switch between Login and Signup
  const toggleForm = () => {
    if (currState === "Login") {
      setCurrState("Signup");
      setSignupData({
        username: "",
        fullname: "",
        email: "",
        password: "",
      });
    } else {
      setCurrState("Login");
      setLoginData({ email: "", password: "" });
    }
  };

  return (
    <div className="login">
      <form onSubmit={onSubmit} className="login-container">
        {/* Title + Close */}
        <div className="login-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>

        {/* Form Inputs */}
        <div className="login-inputs">
          {currState === "Signup" && (
            <>
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={onChangeHandler}
                required
              />
              <input
                name="fullname"
                type="text"
                placeholder="Full Name"
                value={signupData.fullname}
                onChange={onChangeHandler}
                required
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={currState === "Login" ? loginData.email : signupData.email}
            onChange={onChangeHandler}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={
              currState === "Login" ? loginData.password : signupData.password
            }
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit">
          {currState === "Signup" ? "Create Account" : "Login"}
        </button>

        {/* Terms Checkbox */}
        {currState === "Signup" && (
          <div className="login-condition">
            <input type="checkbox" required />
            <p>Accept Terms and Conditions</p>
          </div>
        )}

        {/* Switch Form Link */}
        <p>
          {currState === "Login"
            ? "Create a new account? "
            : "Already have an account? "}
          <span onClick={toggleForm} className="form-switch">
            {currState === "Login" ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;










