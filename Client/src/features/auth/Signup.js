import React, { PureComponent } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { routes, userTypes } from "./../../constants/generalConstants";
import { Link } from "react-router-dom";
import _ from "lodash"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {
  registerUser,
  selectConfirmPassword,
  selectEmail,
  selectFirstName,
  selectLastName,
  selectPassword,
  selectUserType,
  setConfirmPassword,
  setEmail,
  setFirstName,
  setFullName,
  setLastName,
  setPassword,
  setUserType,
  signup,
} from "./authSlice";

const Signup = (props) => {
  const buttonColor = "abc";
  const dispatch = useDispatch();
  const type = useSelector(selectUserType);
  const firstName = useSelector(selectFirstName);
  const lastName = useSelector(selectLastName);
  const password = useSelector(selectPassword);
  const confirmPassword = useSelector(selectConfirmPassword);
  const email = useSelector(selectEmail);

  return (
    <div class="main">
      <div class="login center">
        <div className="website-title">WIL JOB FINDER</div>
        <div class="login-header">Create New Account</div>

        <div class="button-container">
          <button
            type="button"
            class="jobseeker"
            style={{
              backgroundColor:
                type === userTypes.jobSeeker ? "green" : "#4671EC",
            }}
            onClick={() => dispatch(setUserType(userTypes.jobSeeker))}
          >
            {userTypes.jobSeeker}
          </button>
          <button
            type="button"
            class="button-right"
            style={{
              backgroundColor: type === userTypes.employer ? "green" : "#4671EC",
            }}
            onClick={() => dispatch(setUserType(userTypes.employer))}
          >
            {userTypes.employer}
          </button>
        </div>

        <div
          class="login-form"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            class="text-field"
            placeholder="Email"
            onChange={(event) => {
              dispatch(setEmail(event.target.value));
            }}
          />
          <br />
          <input
            class="text-field"
            placeholder="First Name"
            onChange={(event) => {
              dispatch(setFirstName(event.target.value));
            }}
          />
          <br />
          <input
            class="text-field"
            placeholder="Last Name"
            onChange={(event) => {
              dispatch(setLastName(event.target.value));
            }}
          />
          <br />
          <input
            type="password"
            class="text-field"
            placeholder="Password"
            onChange={(event) => {
              dispatch(setPassword(event.target.value));
            }}
          />
          <br />
          <input
            class="text-field"
            type="password"
            placeholder="Confirm Password"
            onChange={(event) => {
              dispatch(setConfirmPassword(event.target.value));
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            class="btn"
            style={{ padding: 16, color: "white" }}
            onClick={async () => {
              if(_.isEmpty(firstName) || _.isEmpty(lastName) || _.isEmpty(email)) {
                toast("Check all fields")
              } else if(password !== confirmPassword){
                toast("Password don't match")
              } else {
                const params = {
                  first_name:firstName,
                  middle_name: "",
                  last_name: lastName, 
                  email: email,
                  phone_number: "0987654",
                  date_of_birth: "2021-06-13",
                  user_type: type,
                  password: password
                }
                
                await dispatch(registerUser(params))
                
                props.history.push(routes.login)
              }
            }}
          >
            Create new account
          </button>
          <div class="foot-text">
            <p>
              Already have account? <Link to={routes.login}>Login</Link>
            </p>
          </div>
        </div>
      </div>      
      <ToastContainer/>
    </div>
  );
};

export default Signup;
