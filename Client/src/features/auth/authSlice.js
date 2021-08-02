import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  isAuthorised: false,
  user: {},
  email: "",
  password: "",
  confirmPassword: "",
  remember: true,
  userType: "Job Seeker",
  firstName: "",
  lastName: "",
  status: "idle",
  signupComplete: false,
  loginComplete: false,
  jobList: [],
  searchTerm: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRememberMe: (state, action) => {
      state.remember = action.payload;
    },
    setConfirmPassword: (state, action) => {
      state.confirmPassword = action.payload;
    },
    signupSuccess: (state, action) => {
      state.signupComplete = true;
    },
    signupFailure: (state, action) => {
      state.signupComplete = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthorised = true;
      state.loginComplete = true;
    },
    loginFailure: (state, action) => {
      state.isAuthorised = false;
      state.loginComplete = true;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const registerUser = (params) => {
  return async (dispatch) => {
    try {
      console.log(params);
      await axios.post("https://wiljob.herokuapp.com/users", params);
      toast("User registered successfully");
      dispatch(signupSuccess());
    } catch (error) {
      dispatch(signupFailure());
    }
  };
};

export const loginUser = (params) => {
  return async (dispatch) => {
    try {
      console.log(params);
      const response = await axios.post(
        "https://wiljob.herokuapp.com/users/login",
        params
      );
      console.log(response, "______");
      if (response.data.success) {
        dispatch(loginSuccess(response.data.user));
        localStorage.setItem("user", JSON.stringify(response.data.user))
      } else {
        dispatch(loginFailure());
        toast(response.data.message);
      }
    } catch (error) {
      dispatch(loginFailure());
    }
  };
};

export const {
  increment,
  decrement,
  incrementByAmount,
  setEmail,
  setPassword,
  setRememberMe,
  setConfirmPassword,
  setFirstName,
  setLastName,
  setUserType,
  signup,
  signupSuccess,
  signupFailure,
  loginSuccess,
  loginFailure,
  setSearchTerm
} = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectIsAuthorised = (state) => state.auth.isAuthorised;
export const selectEmail = (state) => state.auth.email;
export const selectPassword = (state) => state.auth.password;
export const selectConfirmPassword = (state) => state.auth.confirmPassword;
export const selectRemember = (state) => state.auth.remember;
export const selectUserType = (state) => state.auth.userType;
export const selectFirstName = (state) => state.auth.firstName;
export const selectLastName = (state) => state.auth.lastName;
export const selectSignupComplete = (state) => state.auth.signupComplete;
export const selectLoginComplete = (state) => state.auth.loginComplete;
export const selectSearchTerm = (state) => state.auth.searchTerm;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
