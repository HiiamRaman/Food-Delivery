








import React, { useContext, useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import api from "../../utils/axios.client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login({ setShowLogin }) {
  const { setToken, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const navigate = useNavigate();

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

    try {
      // ========================
      // LOGIN
      // ========================
      if (isLogin) {
        const response = await api.post("/user/login", {
          email: formData.email,
          password: formData.password,
        });



        const token = response.data?.data?.accessToken;
        const user = response.data?.data?.user;



        // HARD SAFETY CHECK
        if (!token || token === "undefined") {
          console.log("❌ INVALID TOKEN:", response.data);
          toast.error("Login failed: invalid token from server");
          return;
        }

        if (!user) {
          toast.error("Login failed: user data missing");
          return;
        }

        // ========================
        // STORE AUTH DATA
        // ========================
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // sync axios (only needed if using header auth)
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        setToken(token);

        await loadCartData(token);

        // ========================
        // ADMIN REDIRECT
        // ========================
        if (user.role === "admin") {
          toast.success("Redirecting to Admin Panel...");

          setTimeout(() => {
            window.location.replace ("http://localhost:5174") ;
          }, 1000);

          return;
        }

        toast.success("User logged in successfully");
        navigate("/");
        setShowLogin(false);

        return;
      }

      // ========================
      // SIGNUP
      // ========================
      await api.post("/user/register", formData);

      toast.success("OTP sent to your email");

      navigate("/otp-verify", {
        state: { email: formData.email },
      });

      setShowLogin(false);
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);
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

          {currState === "Login" && (
            <p
              className="forgot-password"
              onClick={() => {
                navigate("/Forgot-password");
                setShowLogin(false);
              }}
            >
              Forgot Password?
            </p>
          )}
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
