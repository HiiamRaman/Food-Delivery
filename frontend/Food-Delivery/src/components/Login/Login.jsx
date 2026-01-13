import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";
import App from "../../App";
import { StoreContext } from "../../Context/StoreContext";
import axios from 'axios'

function Login({ setShowLogin }) {
  const {url,setToken} = useContext(StoreContext)
  const [currState, setCurrState] = useState("Signup");
  const[data,setData]= useState({
    username:"",
    email:"",
    fullname:'',
    password:""
  });
  const onChangeHandler =   (event)=>{
    const name = event.target.name;
    const value = event.target.value;
setData(data=>({...data,[name]:value}))
  }
  const onLogIn = async(event)=>{
 event.preventDefault();

 let newUrl = url;
 if(currState==='Login'){
  newUrl+='/api/v1/user/login'

 }else{
   newUrl+='/api/v1/user/register'
 }


 const response = await axios.post(newUrl,data)

if(response.data.success){
    setToken(response.data.data.accessToken);
    localStorage.setItem("accessToken",response.data.data.accessToken);
    setShowLogin(false)
}else{
  alert(response.data.message)
}

  }
  
  return (
    <div className="login">
      <form onSubmit={onLogIn} className="login-container">
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
          ) : ( <div>

            <input name="username" onChange={onChangeHandler} value={data.username} type="text" placeholder="Enter Your  username" required />
            <input name="fullname" onChange={onChangeHandler} value={data.fullname} type="text" placeholder="Enter Your full name" required />
          </div>
          )}

          <input  name = 'email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Enter Your Email" required />
          <input name = 'password' onChange={onChangeHandler} value={data.password} type="password" placeholder="Enter Your Password" required />
        </div>
        <button type="submit"> {currState === "Signup" ? "Create account" : "Login"} </button>
        <div className="login-condition">
          <input type="checkbox" required />
          <p>!! Terms and Conditions</p>
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
