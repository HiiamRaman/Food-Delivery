import React, { useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";
import App from "../../App";
function Login({ setShowLogin }) {
  const [currState, setCurrState] = useState("Signup");
  return (
    <div className="login">
      <form className="login-container">
        <div className="login-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input type="text" placeholder="Enter Your name" required />
          )}

          <input type="email" placeholder="Enter Your Email" required />
          <input type="password" placeholder="Enter Your Password" required />
        </div>
        <button> {currState === "Signup" ? "Create account" : "Login"} </button>
        <div className="login-condition">
          <input type="checkbox" required />
          <p>Fuck!! Terms and Conditions</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new Account{" "}
            <span onClick={() => setCurrState("Signup")}>Click Me</span>{" "}
          </p>
        ) : (
          <p>
            Already have an account ?{" "}
            <span onClick={() => setCurrState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
