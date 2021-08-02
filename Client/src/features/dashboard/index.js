import React, { PureComponent, useEffect, useMemo, useState } from "react";
import { Dots } from "react-activity";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import JobIcon from "@material-ui/icons/Work";
import ProfileIcon from "@material-ui/icons/PermIdentity";
import UsersIcon from "@material-ui/icons/People";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import profilePic from "./../../assets/images/profile.jpg";
import _ from "loadsh";

import {
  getAllUsers,
  getEmployeeJobById,
  getJobs,
  getMyProfile,
  isLoadingJobs,
  jobs,
  postJob,
  selectUsers,
  selectPostJobSuccess,
  updateProfile,
  selectProfileUpdateSuccess,
  updateJob,
  deleteJob,
  selectDeleteJobSuccess,
  viewJobApplicants,
  applyJob,
  selectApplyJobSuccess,
  getAllAppliedJobs,
  approveJob,
  uploadCV,
  selectCvUrl,
  deleteUser,
  selecteditJobSuccess,
  getApprovedJobs,
  selectAppliedJobs,
  selectJobApplicants,
} from "./dashboardSlice";

import AwesomeDebouncePromise from "awesome-debounce-promise";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { userTypes } from "../../constants/generalConstants";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { toast, ToastContainer } from "react-toastify";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const allTabs = ["Dashboard", "Jobs", "Users", "Profile", "Logout"];
const tabs = {
  [userTypes.jobSeeker]: ["Dashboard", "Jobs", "Profile", "Logout"],
  [userTypes.admin]: ["Dashboard", "Jobs", "Users", "Profile", "Logout"],
  [userTypes.employer]: ["Dashboard", "Jobs", "Users", "Profile", "Logout"],
};

const Dashboard = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const isLodingJobs = useSelector(isLoadingJobs);
  const user = JSON.parse(localStorage.getItem("user")); //useSelector(selectUser);
  const allJobs = useSelector(jobs);
  const allUsers = useSelector(selectUsers);
  const editJobSuccess = useSelector(selecteditJobSuccess);
  const postJobSuccess = useSelector(selectPostJobSuccess);
  const deleteJobSuccess = useSelector(selectDeleteJobSuccess);
  const applyJobSuccess = useSelector(selectApplyJobSuccess);
  const jobApplicants = useSelector(selectJobApplicants);
  const appliedJobs = useSelector(selectAppliedJobs);
  const cvUrl = useSelector(selectCvUrl);
  const profileUpdateSuccess = useSelector(selectProfileUpdateSuccess);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobPostDate, setJobPostDate] = useState("");
  const [jobExpityDate, setJobExpityDate] = useState("");
  const [jobSalary, setJobSalary] = useState("");

  const [editProfile, setEditProfile] = useState(false);
  const [firstName, setFirstName] = useState(user ? user.first_name : "");
  const [lastName, setLastName] = useState(user ? user.last_name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [phoneNumber, setPhoneNumber] = useState(user ? user.phone_number : "");
  const [dob, setDob] = useState(user ? user.date_of_birth : "");
  const [bio, setbio] = useState(user ? user.description : "");
  const [nterests, setInterests] = useState(user ? user.Interests : "");
  const [skills, setSkills] = useState(user ? user.skills : "");

  const [editJob, setEditJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState();
  const [showApplication, setShowApplication] = useState(false);
  const [showApplyJob, setShowApplyJob] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedFile, setSelectedFile] = useState();

  const filterResult = (searchTerm) => {
    let list = [];

    if (selectedTab === "Dashboard" || selectedTab === "Jobs") {
      list = allJobs;
    } else if (selectedTab === "Users") {
      list = allUsers;
    }

    if (list.length > 0) {
      const testJobs = allJobs.filter((item) => {
        return item.post_title.includes(searchTerm);
      });

      setFilteredJobs(testJobs);
    }
  };

  const handleCapture = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const searchAPIDebounced = AwesomeDebouncePromise(filterResult, 1000);

  // const classes = useStyles();

  useEffect(async () => {
    const user = await localStorage.getItem("user");
    if (user) {
    } else {
      props.history.push("/");
    }
  }, []);

  useEffect(() => {
    dispatch(getJobs());
    //  if(user){
    //   dispatch(getAllAppliedJobs({ user_id: user.user_id }));
    //  }
  }, []);

  useEffect(() => {
    if (editJobSuccess) {
      setEditJob(false);
    }
  }, [editJobSuccess]);

  useEffect(() => {
    if (postJobSuccess) {
      setShowAddForm(false);
      dispatch(getJobs());
    }
  }, [postJobSuccess]);

  useEffect(() => {
    if (profileUpdateSuccess) {
      setEditProfile(false);
      dispatch(getJobs());
    }
  }, [profileUpdateSuccess]);

  useEffect(() => {
    if (deleteJobSuccess) {
      dispatch(getJobs());
    }
  }, [deleteJobSuccess]);

  useEffect(() => {
    if (applyJobSuccess) {
      setShowApplyJob(false);
    }
  }, [applyJobSuccess]);

  const data = _.isEmpty(searchTerm) ? allJobs : filteredJobs;
  const testIcons = {
    Dashboard: <DashboardIcon />,
    Jobs: <JobIcon />,
    Users: <UsersIcon />,
    Profile: <ProfileIcon />,
    Logout: <LogoutIcon />,
  };

  const getDashboard = () => {
    return (
      <div>
        <TextField
          style={{ width: "100%", marginBottom: 16 }}
          id="outlined-basic"
          label="Search with job title"
          variant="outlined"
          onChange={(event) => {
            setSearchTerm(event.target.value);
            searchAPIDebounced(event.target.value);
            // dispatch(setSearchTerm(event.target.value));
          }}
          placeholder="Search..."
        />
        {isLodingJobs && <Dots />}

        {data.map((item) => {
          return (
            <div style={{ marginTop: 10, marginBottom: 20 }}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography variant="h3" component="h2">
                    {item.post_title}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {`Posted on: ${moment(item.post_date).format(
                      "yyyy-MM-DD"
                    )}`}
                    <span style={{ marginLeft: 10 }}>
                      {`Expires on: ${moment(item.expiry_date).format(
                        "yyyy-MM-DD"
                      )}`}
                    </span>
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {`Salary: ${item.post_salary}`}
                  </Typography>
                  <Typography
                    className={classes.pos}
                    color={item.job_status === "pending" ? "error" : "primary"}
                  >
                    <p
                      style={{ fontSize: 16 }}
                    >{`Status: ${item.job_status}`}</p>
                  </Typography>
                  <Typography variant="body2" component="p">
                    {`${item.post_description}`}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    );
  };

  const getEditJobForm = () => {
    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "70%" }}>
          <h1>Edit Job Details</h1>
          {isLodingJobs && <Dots />}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: 60,
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                style={{ marginBottom: 16, width: "45%" }}
                id="outlined-basic"
                label="Job title"
                variant="outlined"
                onChange={(event) => {
                  setJobTitle(event.target.value);
                }}
                value={jobTitle}
                placeholder="Job title"
              />
              <TextField
                style={{ marginBottom: 16, width: "45%" }}
                id="outlined-basic"
                label="Salary"
                variant="outlined"
                onChange={(event) => {
                  setJobSalary(event.target.value);
                }}
                value={jobSalary}
                placeholder="Salary"
              />
            </div>
            <TextareaAutosize
              style={{ marginBottom: 16 }}
              rowsMax={10}
              rowsMin={4}
              aria-label="maximum height"
              placeholder="Job Description"
              onChange={(event) => {
                setJobDescription(event.target.value);
              }}
              value={jobDescription}
            />

            <TextField
              style={{ marginBottom: 16 }}
              id="expiry-date"
              label="Expiry Date"
              type="date"
              defaultValue="2021-06-17"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              value={moment(jobExpityDate).format("yyyy-MM-DD")}
              onChange={(event) => {
                setJobExpityDate(event.target.value);
              }}
            />
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ width: "50%", marginTop: 200, height: 60 }}
          onClick={() => {
            if (
              _.isEmpty(jobTitle) ||
              _.isEmpty(jobDescription) ||
              _.isEmpty(jobExpityDate)
            ) {
              toast("Check the input fields");
              return;
            }
            const params = {
              post_title: jobTitle,
              post_description: jobDescription,
              post_salary: jobSalary,
              post_date: moment().format("yyyy-MM-DD"),
              expiry_date: moment(jobExpityDate).format("yyyy-MM-DD"),
              job_id: selectedJob.job_id,
            };
            dispatch(updateJob(params));
          }}
        >
          Update Job
        </Button>
      </div>
    );
  };

  const getApplyForm = () => {
    return (
      <div>
        <h2>{`Application For ${selectedJob.post_title}`}</h2>
        <TextareaAutosize
          style={{ marginBottom: 16, width: "100%" }}
          rowsMax={40}
          rowsMin={20}
          aria-label="maximum height"
          placeholder="Cover Letter"
          onChange={(event) => {
            setCoverLetter(event.target.value);
          }}
          value={coverLetter}
        />
        <Button
          style={{ marginTop: 20 }}
          size="medium"
          color="primary"
          variant="contained"
          onClick={() => {
            dispatch(
              applyJob({
                user_id: user.user_id,
                job_id: selectedJob.job_id,
                cover_letter: coverLetter,
              })
            );
          }}
        >
          Apply For Job
        </Button>
      </div>
    );
  };

  const getApplyButton = (item) => {
    console.log("========");
    const appliedList = appliedJobs.filter(
      (job) =>
        item.job_id === job.job_id && job.applied_user_id === user.user_id
    );
    const applied = appliedList.length > 0;
    if (applied) {
      return (
        <Button
          style={{ marginTop: 20 }}
          size="medium"
          color="secondary"
          variant="contained"
          disabled
        >
          Applied
        </Button>
      );
    } else {
      return (
        <Button
          style={{ marginTop: 20 }}
          size="medium"
          color="primary"
          variant="contained"
          onClick={() => {
            setSelectedJob(item);
            setShowApplyJob(true);
          }}
        >
          Apply For Job
        </Button>
      );
    }
  };

  const getJobsView = () => {
    const isEmployer = user.user_type === userTypes.employer;
    const isStudent = user.user_type === userTypes.jobSeeker;
    const isAdmin = user.user_type === userTypes.admin;

    if (isStudent && showApplyJob) {
      return getApplyForm();
    }

    if (isEmployer && editJob) {
      return getEditJobForm();
    }

    if (isEmployer && showApplication) {
      return (
        <div>
          <h2>{`All applications for ${selectedJob.post_title}`}</h2>
          {jobApplicants.map((item) => {
            return (
              <div style={{ marginTop: 10, marginBottom: 20 }}>
                <Card className={classes.root} variant="outlined">
                  <CardContent>
                    <Typography variant="h3" component="h2">
                      {item.first_name}{" "}
                      <span style={{ marginLeft: 10 }}>{item.last_name}</span>
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {`Contact Number: ${item.phone_number}`}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {`Email: ${item.email}`}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {`Skills: ${item.skills}`}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {`Interests: ${item.interests}`}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {`Cover Letter: ${item.cover_letter}`}
                    </Typography>
                    {!_.isEmpty(item.download_src) && (
                      <Button
                        style={{ marginTop: 20 }}
                        size="medium"
                        color="primary"
                        variant="outline"
                      >
                        <a href={item.download_src} target="_blank"  >Download CV</a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      );
    }

    if (showAddForm) {
      return (
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "70%" }}>
            <h1>Add detail information</h1>
            {isLodingJobs && <Dots />}
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: 60,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ marginBottom: 16, width: "45%" }}
                  id="outlined-basic"
                  label="Job title"
                  variant="outlined"
                  onChange={(event) => {
                    setJobTitle(event.target.value);
                  }}
                  placeholder="Job title"
                />
                <TextField
                  style={{ marginBottom: 16, width: "45%" }}
                  id="outlined-basic"
                  label="Salary"
                  variant="outlined"
                  onChange={(event) => {
                    setJobSalary(event.target.value);
                  }}
                  placeholder="Salary"
                />
              </div>
              <TextareaAutosize
                style={{ marginBottom: 16 }}
                rowsMax={10}
                rowsMin={4}
                aria-label="maximum height"
                placeholder="Job Description"
                onChange={(event) => {
                  setJobDescription(event.target.value);
                }}
              />

              <TextField
                style={{ marginBottom: 16 }}
                id="expiry-date"
                label="Expiry Date"
                type="date"
                defaultValue="2021-06-17"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event) => {
                  setJobExpityDate(event.target.value);
                }}
              />
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "50%", marginTop: 200, height: 60 }}
            onClick={() => {
              if (
                _.isEmpty(jobTitle) ||
                _.isEmpty(jobDescription) ||
                _.isEmpty(jobExpityDate)
              ) {
                toast("Check the input fields");
                return;
              }
              const params = {
                post_title: jobTitle,
                post_description: jobDescription,
                post_salary: jobSalary,
                post_date: moment().format("yyyy-MM-DD"),
                expiry_date: moment(jobExpityDate).format("yyyy-MM-DD"),
                user_id: user.user_id,
                job_status: "pending",
              };
              dispatch(postJob(params));
            }}
          >
            Post Job
          </Button>
        </div>
      );
    }
    return (
      <div>
        <div
          style={{
            position: "relative",
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <TextField
            style={{ width: isEmployer ? "80%" : "100%", marginBottom: 16 }}
            id="outlined-basic"
            label="Search Job"
            variant="outlined"
            onChange={(event) => {
              setSearchTerm(event.target.value);
              searchAPIDebounced(event.target.value);
              // dispatch(setSearchTerm(event.target.value));
            }}
            placeholder="Search Job"
          />
          {getAddMenu()}
        </div>
        {isLodingJobs && <Dots />}

        {data.map((item) => {
          return (
            <div style={{ marginTop: 10, marginBottom: 20 }}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography variant="h3" component="h2">
                    {item.post_title}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {`Posted on: ${moment(item.post_date).format(
                      "yyyy-MM-DD"
                    )}`}
                    <span style={{ marginLeft: 10 }}>
                      {`Expires on: ${moment(item.expiry_date).format(
                        "yyyy-MM-DD"
                      )}`}
                    </span>
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {`Salary: ${item.post_salary}`}
                  </Typography>
                  <Typography
                    className={classes.pos}
                    color={item.job_status === "pending" ? "error" : "primary"}
                  >
                    <p
                      style={{ fontSize: 16 }}
                    >{`Status: ${item.job_status}`}</p>
                  </Typography>
                  <Typography variant="body2" component="p">
                    {`${item.post_description}`}
                  </Typography>
                  {isEmployer && (
                    <CardActions>
                      <Button
                        style={{ marginTop: 20 }}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          console.log(item);
                          setJobTitle(item.post_title);
                          setJobDescription(item.post_description);
                          setJobSalary(item.post_salary);
                          setJobExpityDate(item.expiry_date);
                          setEditJob(true);
                          setSelectedJob(item);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        style={{ marginTop: 20 }}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          dispatch(deleteJob({ job_id: item.job_id }));
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        style={{ marginTop: 20 }}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          setSelectedJob(item);
                          dispatch(
                            viewJobApplicants(
                              { job_id: item.job_id },
                              user.user_id
                            )
                          );
                          setShowApplication(true);
                        }}
                      >
                        View applicants
                      </Button>
                    </CardActions>
                  )}
                  {isStudent && getApplyButton(item)}
                  {isAdmin && (
                    <>
                      {item.job_status === "pending" && (
                        <Button
                          style={{ marginTop: 20 }}
                          size="medium"
                          color="primary"
                          variant="outlined"
                          onClick={() => {
                            dispatch(
                              approveJob({
                                job_id: item.job_id,
                                job_status: "approved",
                              })
                            );
                          }}
                        >
                          Approve Job
                        </Button>
                      )}
                      <Button
                        style={{ marginTop: 20, marginLeft: 10 }}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          dispatch(deleteJob({ job_id: item.job_id }));
                        }}
                      >
                        Delete Job
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    );
  };

  const getUsersView = () => {
    const isAdmin = user.user_type === userTypes.admin;

    return (
      <div>
        <TextField
          style={{ width: "100%", marginBottom: 16 }}
          id="outlined-basic"
          label="Search User"
          variant="outlined"
          onChange={(event) => {
            setSearchTerm(event.target.value);
            searchAPIDebounced(event.target.value);
            // dispatch(setSearchTerm(event.target.value));
          }}
          placeholder="Search User"
        />
        {isLodingJobs && <Dots />}

        {allUsers.map((item) => {
          return (
            <div style={{ marginTop: 10, marginBottom: 20 }}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography variant="h3" component="h2">
                    {item.first_name}{" "}
                    <span style={{ marginLeft: 10 }}>{item.last_name}</span>
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {`Contact Number: ${item.phone_number}`}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {`Email: ${item.email}`}
                  </Typography>
                  {/* <Typography variant="body2" component="p">
                    {`${item.post_description}`}
                    <br />
                    {'"a benevolent smile"'}
                  </Typography> */}
                  {isAdmin && (
                    <Button
                      style={{ marginTop: 20 }}
                      size="medium"
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        // dispatch(deleteUser({user_id: item.user_id}));
                        toast("This feature is yet to be live");
                      }}
                    >
                      Delete User
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    );
  };

  const getProfileView = () => {
    const isSeeker = user.user_type === userTypes.jobSeeker;
    const showUpload = isSeeker && selectedFile;

    if (editProfile) {
      return (
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "70%" }}>
            <h1>Edit your information</h1>
            {isLodingJobs && <Dots />}
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: 60,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ marginBottom: 16, width: "45%" }}
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  onChange={(event) => {
                    setFirstName(event.target.value);
                  }}
                  value={firstName}
                  placeholder="First Name"
                />
                <TextField
                  style={{ marginBottom: 16, width: "45%" }}
                  id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  onChange={(event) => {
                    setLastName(event.target.value);
                  }}
                  value={lastName}
                  placeholder="Last Name"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextField
                  style={{ marginBottom: 16, width: "45%" }}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  value={email}
                  placeholder="Email"
                />
                <TextField
                  style={{ marginBottom: 16, width: "45%" }}
                  id="outlined-basic"
                  label="Phone Number"
                  variant="outlined"
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                  }}
                  value={phoneNumber}
                  placeholder="Phone Number"
                />
              </div>
              <TextField
                style={{ marginBottom: 16 }}
                id="outlined-basic"
                label="Skills"
                variant="outlined"
                onChange={(event) => {
                  setSkills(event.target.value);
                }}
                value={skills}
                placeholder="Skills"
              />
              <TextField
                style={{ marginBottom: 16 }}
                id="outlined-basic"
                label="Interests"
                variant="outlined"
                onChange={(event) => {
                  setInterests(event.target.value);
                }}
                value={nterests}
                placeholder="Interests"
              />
              <TextField
                style={{ marginBottom: 16 }}
                id="expiry-date"
                label="Date of Birth"
                type="date"
                defaultValue="2021-06-17"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                value={moment(dob).format("yyyy-MM-DD")}
                onChange={(event) => {
                  setDob(event.target.value);
                }}
              />
              <TextareaAutosize
                style={{ marginBottom: 16 }}
                rowsMax={10}
                rowsMin={4}
                aria-label="maximum height"
                placeholder="Your bio"
                value={bio}
                onChange={(event) => {
                  setbio(event.target.value);
                }}
              />
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "50%", marginTop: 100, height: 60 }}
            onClick={() => {
              if (_.isEmpty(firstName) || _.isEmpty(lastName)) {
                toast("First name and last name are required");
                return;
              }
              const params = {
                first_name: firstName,
                middle_name: "",
                last_name: lastName,
                email: email,
                phone_number: phoneNumber,
                date_of_birth: moment(dob).format("yyyy-MM-DD"),
                description: bio,
                skills: skills,
                Intrests: nterests,
                user_id: user.user_id,
              };
              dispatch(updateProfile(params));
            }}
          >
            Update Profile
          </Button>
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: "50%",
            margin: "auto",
          }}
        >
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="140"
                image={profilePic}
                title="Contemplative Reptile"
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {`FullName: ${user.first_name} ${user.last_name}`}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {`Bio: ${user.description}`}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {`Skills: ${user.skills}`}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {`Interests: ${user.Intrests}`}
                </Typography>
                <Typography variant="body3" color="textSecondary" component="p">
                  {`Email: ${user.email}`}
                </Typography>
                <Typography variant="body3" color="textSecondary" component="p">
                  {`Phone Number: ${user.phone_number}`}
                </Typography>
                <Typography variant="body3" color="textSecondary" component="p">
                  {`Date Of Birth: ${moment(user.date_of_birth)}`}
                </Typography>
                <Typography variant="body3" color="textSecondary" component="p">
                  {user.description}
                </Typography>
                <input
                  style={{ marginTop: 20 }}
                  accept="image/png, image/gif, image/jpeg"
                  className={classes.input}
                  id="faceImage"
                  type="file"
                  onChange={handleCapture}
                />
              </CardContent>
              <CardActions>
                <Button
                  style={{ marginTop: 20 }}
                  size="medium"
                  color="primary"
                  variant="contained"
                  onClick={() => setEditProfile(true)}
                >
                  Edit Profile Info
                </Button>
                {showUpload && (
                  <Button
                    style={{ marginTop: 20 }}
                    size="medium"
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      var formData = new FormData();

                      formData.append("file", selectedFile);
                      formData.append("cv_user_id", user.user_id);
                      dispatch(uploadCV(formData));
                    }}
                  >
                    Upload CV
                  </Button>
                )}
              </CardActions>
            </CardActionArea>
          </Card>
        </div>
      );
    }
  };
  const getLogoutView = () => {};

  const getContentView = () => {
    if (selectedTab === "Dashboard") {
      return getDashboard();
    } else if (selectedTab === "Jobs") {
      return getJobsView();
    } else if (selectedTab === "Users") {
      return getUsersView();
    } else if (selectedTab === "Profile") {
      return getProfileView();
    } else if (selectedTab === "Logout") {
      return getLogoutView();
    }
  };

  const handleOptionClick = (text) => {
    setSelectedTab(text);
    if (userType === userTypes.employer) {
      setShowApplication(false);
      setEditJob(false);
      setShowAddForm(false);
      if (text === "Dashboard") {
        dispatch(getJobs());
      } else if (text === "Jobs") {
        dispatch(getEmployeeJobById({ employer_id: user.user_id }));
      } else if (text === "Users") {
        dispatch(getAllUsers());
      } else if (text === "Profile") {
        // dispatch(getMyProfile({ user_id: user.user_id }));
        return getProfileView();
      } else if (text === "Logout") {
        localStorage.removeItem("user");
        window.location.reload();
        // props.history.push("/");
      }
    } else if (userType === userTypes.jobSeeker) {
      setEditProfile(false);

      if (text === "Dashboard") {
        dispatch(getJobs());
      } else if (text === "Jobs") {
        console.log("----student-job");
        dispatch(getApprovedJobs());
      } else if (text === "Users") {
        dispatch(getAllUsers());
      } else if (text === "Profile") {
        return getProfileView();
      } else if (text === "Logout") {
        // props.history.push("/");
        localStorage.removeItem("user");
        window.location.reload();
      }
    } else if (userType === userTypes.admin) {
      setEditProfile(false);
      if (text === "Dashboard") {
        dispatch(getJobs());
      } else if (text === "Jobs") {
        dispatch(getJobs());
      } else if (text === "Users") {
        dispatch(getAllUsers());
      } else if (text === "Logout") {
        // props.history.push("/");
        localStorage.removeItem("user");
        window.location.reload();
      }
    }
  };

  console.log(selectedTab);

  const userType = user ? user.user_type : userTypes.employer;

  const getAddMenu = () => {
    if (userType === userTypes.employer) {
      if (selectedTab === "Jobs" && !showAddForm) {
        return (
          <Fab
            color="primary"
            aria-label="add"
            // style={{ position: "absolute", top: 10, right: 50 }}
            onClick={() => {
              setShowAddForm(true);
            }}
          >
            <AddIcon />
          </Fab>
        );
      }
    } else if (userType === userTypes.admin) {
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "space-between",
          }}
        >
          <Typography variant="h6" noWrap>
            {selectedTab}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {tabs[userType].map((text, index) => (
            <div onClick={() => handleOptionClick(text)}>
              <ListItem button key={text}>
                <ListItemIcon>{testIcons[text]}</ListItemIcon>
                <ListItemText primary={text} />
                <Divider />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Drawer>
      <main className={classes.content} style={{ minHeight: "100vh" }}>
        <div className={classes.toolbar} />
        {getContentView()}
        <ToastContainer />
      </main>
    </div>
  );
};

export default Dashboard;
