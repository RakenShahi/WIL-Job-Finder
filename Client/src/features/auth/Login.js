import React, { PureComponent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { loginUser, selectEmail, selectIsAuthorised, selectPassword, selectRemember, setEmail, setPassword, setRememberMe } from "./authSlice";
import { routes } from "../../constants/generalConstants";
import { login } from "./authApi";
import { ToastContainer, toast } from "react-toastify";

const Login = (props) => {
  const dispatch = useDispatch();
  const isChecked = useSelector(selectIsAuthorised);  
  const email = useSelector(selectEmail);  
  const password = useSelector(selectPassword);
  const isAuthorised = useSelector(selectIsAuthorised);

  useEffect(()=>{
    if(isAuthorised) {
      props.history.push(routes.dashboard)
    }
  },[isAuthorised])

  useEffect(()=>{
    setTimeout(() => {    
      localStorage.removeItem("user")
    }, 200);
  },[])
  

  return (
    <div className="main">
      <div className="login center">
        <div className="website-title">WIL JOB FINDER</div>
        <div className="login-header">Login</div>
        <div className="login-form">
          <input
            className="text-field"
            placeholder="Email"
            onChange={(event) => {
              dispatch(setEmail(event.target.value));
            }}
          />
          <br />
          <input
            className="text-field"
            placeholder="Password"     
            type="password"
            onChange={(event) => {              
              dispatch(setPassword(event.target.value));
            }}
          />
        </div>
        <div className="button-container">
          <div className="button-left">
            <input
              type="checkbox"
              checked={true}
              onChange={(event) => {
                const value = event.target.value === "on"
                dispatch(setRememberMe(value));
              }}
            />
            <label className="button-text"> Remember me</label>
          </div>
          <button type="button" className="button-right" onClick={async()=>{
            const params = {
              email,
              password
            }
            await dispatch(loginUser(params))
          }}>
            Login
          </button>
        </div>

        <div className="create-account" onClick={()=>{props.history.push(routes.register)}}>
          <label className="btn center">Create new account</label>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Login;
