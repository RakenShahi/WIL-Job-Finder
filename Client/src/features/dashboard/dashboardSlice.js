import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import AwesomeDebouncePromise from "awesome-debounce-promise";

const initialState = {
  jobs: [],
  users: [],
  isLoadingJobs: false,
  postJobSuccess: false,
  profileUpdateSuccess: false,
  editJobSuccess: false,
  deleteJobSuccess: false,
  jobApplicantsSuccess: false,
  applyJobSuccess: false,
  cvUrl: "",
  searchTerm: "",
  jobApplicants: [],
  appliedJobs: []
};

export const authSlice = createSlice({
  name: "dashboard",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    getJobsStarted: (state, action) => {
      state.isLoadingJobs = true;
    },
    getJobsSuccess: (state, action) => {      
      state.jobs = action.payload;
      state.isLoadingJobs = false;
    },
    getJobsFailure: (state, action) => {
      state.isLoadingJobs = false;
    },
    getUsersStarted: (state, action) => {
      state.isLoadingJobs = true;
    },
    getUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.isLoadingJobs = false;
    },
    getUsersFailure: (state, action) => {
      state.isLoadingJobs = false;
    },
    updateMyProfileStarted: (state, action) => {
      state.isLoadingJobs = true;
      state.profileUpdateSuccess = false;
    },
    updateMyProfileSuccess: (state, action) => {
      console.log('-------')
      state.isLoadingJobs = false;
      state.profileUpdateSuccess = true;
    },
    updateMyProfileFailure: (state, action) => {
      state.isLoadingJobs = false;
      state.profileUpdateSuccess = false;
    },
    postJobStarted: (state, action) => {
      state.isLoadingJobs = true;
      state.postJobSuccess = false;
    },
    postJobSuccess: (state, action) => {
      // state.users = action.payload;
      state.isLoadingJobs = false;
      state.postJobSuccess = true;
    },
    postJobFailure: (state, action) => {
      state.isLoadingJobs = false;
      state.postJobSuccess = false;
    },
    editJobStarted: (state, action) => {
      state.isLoadingJobs = true;
      state.editJobSuccess = false;
    },
    editJobSuccess: (state, action) => {
      // state.users = action.payload;
      state.isLoadingJobs = false;
      state.editJobSuccess = true;
    },
    editJobFailure: (state, action) => {
      state.isLoadingJobs = false;
      state.editJobSuccess = false;
    },
    deleteJobStarted: (state, action) => {
      state.isLoadingJobs = true;
      state.deleteJobSuccess = false;
    },
    deleteJobSuccess: (state, action) => {
      state.isLoadingJobs = false;
      state.deleteJobSuccess = true;
    },
    deleteJobFailure: (state, action) => {
      state.isLoadingJobs = false;
      state.deleteJobSuccess = false;
    },
    jobApplicantsStarted: (state, action) => {
      state.isLoadingJobs = true;
      state.jobApplicantsSuccess = false;
    },
    jobApplicantsSuccess: (state, action) => {
      console.log(action.payload)
      state.isLoadingJobs = false;
      state.jobApplicantsSuccess = true;
      state.jobApplicants = action.payload;
    },
    jobApplicantsFailure: (state, action) => {
      state.isLoadingJobs = false;
      state.deleteJobSuccess = false;
    },
    applyJobStarted: (state, action) => {
      state.isLoadingJobs = true;
      state.applyJobSuccess = false;
    },
    applyJobSuccess: (state, action) => {
      state.isLoadingJobs = false;
      state.applyJobSuccess = true;
    },
    applyJobFailure: (state, action) => {
      state.isLoadingJobs = false;
      state.deleteJobSuccess = false;
    },
    getJobApplicantsSuccess: (state, action) => {
      state.isLoadingJobs = false;
    },
    getJobApplicantsFailure: (state, action) => {
      state.isLoadingJobs = false;
    },
    getAppliedJobSuccess: (state, action) => {
      console.log(action.payload, "}}}}}}}");
      state.isLoadingJobs = false;
      state.appliedJobs = action.payload;
    },
    getAppliedJobsFailure: (state, action) => {
      state.isLoadingJobs = false;
    },
    getCvSuccess: (state, action) => {
      state.isLoadingJobs = false;
      state.cvUrl = action.payload
    },
  },
});

export const getJobs = (params) => {
  return async (dispatch) => {
    console.log(dispatch);
    try {
      dispatch(getJobsStarted());
      console.log(params);
      const result = await axios.get("https://wiljob.herokuapp.com/allJobs");

      console.log(result);

      dispatch(getJobsSuccess(result.data.data));
    } catch (error) {
      dispatch(getJobsFailure());
    }
  };
};

export const getApprovedJobs = (params) => {
  return async (dispatch) => {
    console.log(dispatch);
    try {
      dispatch(getJobsStarted());
      const result = await axios.get("https://wiljob.herokuapp.com/approvedJobs");

      console.log(result, '-----')

      if (result.data.success) {
        dispatch(getJobsSuccess(result.data.data));
      } else {
        dispatch(getJobsFailure(result.data.data));
      }
    } catch (error) {
      dispatch(getJobsFailure());
    }
  };
};

export const getEmployeeJobById = (params) => {
  return async (dispatch) => {
    console.log(dispatch, "----------");
    try {
      dispatch(getJobsStarted());
      console.log(params);
      const result = await axios.post("https://wiljob.herokuapp.com/jobByEId", params);

      console.log(result);

      dispatch(getJobsSuccess(result.data.data));
    } catch (error) {
      dispatch(getJobsFailure());
    }
  };
};

export const getAllUsers = (params) => {
  return async (dispatch) => {
    console.log(dispatch, "----------");
    try {
      dispatch(getUsersStarted());
      console.log(params);
      setTimeout(async () => {
        const result = await axios.get("https://wiljob.herokuapp.com/users");

        console.log(result);

        dispatch(getUsersSuccess(result.data.data));
      }, 200);
    } catch (error) {
      dispatch(getUsersFailure());
    }
  };
};

export const getMyProfile = (params) => {
  return async (dispatch) => {
    try {
      dispatch(getUsersStarted());
      console.log(params);
      setTimeout(async () => {
        const result = await axios.post("https://wiljob.herokuapp.com/userById", params);

        console.log(result);
        // if(result.data.success) {
        //   localStorage.setItem("user", result.data.data[0])
        // }

        // dispatch(getUsersSuccess(result.data.data[0]));
      }, 200);
    } catch (error) {
      dispatch(getUsersFailure());
    }
  };
};

export const getMyCv = (params) => {
  return async (dispatch) => {
    try {
      dispatch(getUsersStarted());
      console.log(params);
      setTimeout(async () => {
        const result = await axios.post("https://wiljob.herokuapp.com/selectCVURL", params);

        dispatch(getCvSuccess(result.data.data));
      }, 200);
    } catch (error) {
      console.log(error)
    }
  };
};

export const postJob = (params) => {
  return async (dispatch) => {
    try {
      dispatch(postJobStarted());
      console.log(params);
      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/users/job",
          params
        );

        if (result.data.error) {
          toast("Unable to post job");
          dispatch(postJobFailure());
        } else {
          console.log(result);
          toast("Job posted sucessfully");

          dispatch(postJobSuccess());
        }
      }, 200);
    } catch (error) {
      toast("Unable to post job");
      dispatch(postJobFailure());
    }
  };
};

export const updateJob = (params) => {
  return async (dispatch) => {
    try {
      dispatch(editJobStarted());      
      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/job/update",
          params
        );

        if (result.data.success) {          
          toast(result.data.message);
          dispatch(getJobs())
          dispatch(editJobSuccess());
        } else {
          toast("Unable to update job");
          dispatch(editJobFailure());
        }
      }, 200);
    } catch (error) {
      toast("Unable to update job");
      dispatch(editJobFailure());
    }
  };
};

export const updateProfile = (params) => {
  return async (dispatch) => {
    try {
      dispatch(updateMyProfileStarted());
      console.log(params);
      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/updateUser",
          params
        );

        if (result.data.error) {
          console.log(result);
          toast("Profile failed");

          dispatch(updateMyProfileFailure());          
        } else {
          toast("Profile updated success");
          dispatch(getMyProfile({user_id: params.user_id}))
          dispatch(updateMyProfileSuccess());
        }
      }, 200);
    } catch (error) {
      toast("Profile updated failed");
      dispatch(postJobFailure());
    }
  };
};

export const deleteJob = (params) => {
  return async (dispatch) => {
    try {
      dispatch(deleteJobStarted());

      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/deleteJob",
          params
        );

        if (result.data.error) {
          toast("Delete job failed");
          dispatch(deleteJobStarted());
        } else {
          console.log(result);
          toast("Job deleted sucessfully");

          dispatch(deleteJobSuccess());
        }
      }, 200);
    } catch (error) {
      toast("Delete job failed");
      dispatch(deleteJobFailure());
    }
  };
};

export const viewJobApplicants = (params, userId) => {
  return async (dispatch) => {
    try {
      dispatch(jobApplicantsStarted());

      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/jobApplicants",
          params
        );

        if (result.data.success) {
          dispatch(jobApplicantsSuccess(result.data.data));
        } else {
          dispatch(jobApplicantsFailure());
        }
      }, 200);
    } catch (error) {
      dispatch(jobApplicantsFailure());
    }
  };
};

export const applyJob = (params) => {
  return async (dispatch) => {
    try {
      dispatch(applyJobStarted());

      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/applyJob",
          params
        );

        if (result.data.success) {
          toast("Job applied successfully, wait for the response");
          dispatch(getAllAppliedJobs({user_id: params.user_id}))
          dispatch(applyJobSuccess());          
        } else {
          dispatch(applyJobFailure());
        }
      }, 200);
    } catch (error) {
      dispatch(jobApplicantsFailure());
    }
  };
};

export const getAllAppliedJobs = (params) => {
  return async (dispatch) => {
    try {
      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/listAppliedJobs",
          params
        );

        console.log("=+=+++++==++++++");
        if (result.data.success) {
          dispatch(getAppliedJobSuccess(result.data.data));
        }
      }, 200);
    } catch (error) {
      dispatch(getAppliedJobFailure());
    }
  };
};

export const approveJob = (params) => {
  return async (dispatch) => {
    try {
      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/updateJobStatus",
          params
        );

        dispatch(getJobs());
      }, 200);
    } catch (error) {
      dispatch(getJobsFailure());
    }
  };
};

export const deleteUser = (params) => {
  return async (dispatch) => {
    try {
      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/deleteUser",
          params
        );

        dispatch(getAllUsers());
      }, 200);
    } catch (error) {
      dispatch(getUsersFailure());
    }
  };
};

export const uploadCV = (formData) => {
  return async (dispatch) => {
    try {
      setTimeout(async () => {
        const result = await axios.post(
          "https://wiljob.herokuapp.com/upload2",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast("File uploaded sucessfully");
      }, 200);
    } catch (error) {
      dispatch(getUsersFailure());
    }
  };
};

export const {
  setEmail,
  getJobsFailure,
  getJobsStarted,
  getJobsSuccess,
  getUsersFailure,
  getUsersStarted,
  getUsersSuccess,
  postJobStarted,
  postJobSuccess,
  postJobFailure,
  deleteJobStarted,
  deleteJobSuccess,
  deleteJobFailure,
  editJobStarted,
  editJobSuccess,
  editJobFailure,
  updateMyProfileStarted,
  updateMyProfileSuccess,
  updateMyProfileFailure,
  jobApplicantsStarted,
  jobApplicantsSuccess,
  jobApplicantsFailure,
  applyJobStarted,
  applyJobSuccess,
  applyJobFailure,
  getJobApplicantsSuccess,
  getJobApplicantsFailure,
  getAppliedJobSuccess,
  getAppliedJobFailure,
  getCvSuccess
} = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const jobs = (state) => state.dashboard.jobs;
export const selectUsers = (state) => state.dashboard.users;
export const selectPostJobSuccess = (state) => state.dashboard.postJobSuccess;
export const selectDeleteJobSuccess = (state) =>
  state.dashboard.deleteJobSuccess;
export const selectApplyJobSuccess = (state) => state.dashboard.applyJobSuccess;
export const selectJobApplicants = (state) => state.dashboard.jobApplicants;
export const selectProfileUpdateSuccess = (state) =>
  state.dashboard.profileUpdateSuccess;
export const selecteditJobSuccess = (state) =>
  state.dashboard.editJobSuccess;
export const selectAppliedJobs = (state) =>
  state.dashboard.appliedJobs;
export const isLoadingJobs = (state) => state.dashboard.isLoadingJobs;
export const selectCvUrl = (state) => state.dashboard.cvUrl;

export default authSlice.reducer;
