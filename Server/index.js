import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import cors from 'cors'
import bodyParser from 'body-parser'
import routerPage from './route.js'
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql'
import * as req from "express";
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const _ = require('lodash');
var buffer = require('buffer').Buffer


// Connection Mysql
const connection = mysql.createConnection({
    host: '34.72.19.139',
    user: 'root',
    password: 'root',
    database: 'wiljob',
    port: '3306'
});

connection.connect(function (err) {
    console.log("Connected!");
    if (err) throw err;
    console.log("Connected yet no db is selected yet!");
    connection.query("CREATE DATABASE IF NOT EXISTS wiljob", function (err, result) {
        if (err) throw err;
        console.log("Database created");
        var sql = "CREATE TABLE IF NOT EXISTS user (user_id VARCHAR(200) NOT NULL, first_name VARCHAR(45) NOT NULL, middle_name VARCHAR(45) NOT NULL,last_name VARCHAR(45) NOT NULL,email VARCHAR(45) NOT NULL,phone_number VARCHAR(45) NOT NULL,date_of_birth DATE NOT NULL,user_type VARCHAR(45) NOT NULL,password VARCHAR(45) NOT NULL, description VARCHAR(500) NULL,skills VARCHAR(500) NULL,Intrests VARCHAR(500) NULL, download_src TEXT,PRIMARY KEY (user_id),UNIQUE KEY unique_email(email))";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log(" User Table created");
        })

        var sql = "CREATE TABLE IF NOT EXISTS job (job_id VARCHAR(200) NOT NULL, e_user_id VARCHAR(200) NOT NULL, post_title VARCHAR(50),post_description VARCHAR(50),post_salary VARCHAR(50),post_date DATE, expiry_date DATE,job_status VARCHAR(50),CONSTRAINT e_user_id FOREIGN KEY (e_user_id) REFERENCES user (user_id),PRIMARY KEY (job_id))";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log(" job Table created");
        })

        var sql = "CREATE TABLE IF NOT EXISTS appliedjobs (applied_id VARCHAR(200) NOT NULL, applied_user_id VARCHAR(200) NOT NULL, job_id VARCHAR(200) NOT NULL,cover_letter VARCHAR(500),PRIMARY KEY (applied_id),CONSTRAINT applied_user_id FOREIGN KEY (applied_user_id) REFERENCES user (user_id),CONSTRAINT job_id FOREIGN KEY (job_id) REFERENCES job (job_id))";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log(" appliedjobs Table created");

        })
        //table for CV
        connection.query("CREATE TABLE IF NOT EXISTS users_file(id INT(10) NOT NULL AUTO_INCREMENT, file_src TEXT, cv_user_id VARCHAR(200) NOT NULL,CONSTRAINT cv_user_id FOREIGN KEY (cv_user_id) REFERENCES user (user_id),PRIMARY KEY(id))", function (err, result) {
            if (err) throw err;
            console.log("Image File table created");
        });
    });
});


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 5000
const server = app.listen(port, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`WilJob app listening at http://${host}:${port}`);
});
app.get('/', (req, res) => {
    res.send('Will Job Management')
});



// Add users of database
app.post('/users', (req, res) => {
    //attributes
    let first_name = req.body.first_name;
    let middle_name = req.body.middle_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone_number = req.body.phone_number;
    let date_of_birth = req.body.date_of_birth;
    let user_type = req.body.user_type;
    let password = req.body.password;
    let description = req.body.description;
    let skills = req.body.skills;
    let Intrests = req.body.Intrests;
    let user_id = uuidv4();

    //insert into user table
    let insertQuery = "INSERT INTO user SET ?"
    const user = { user_id, first_name, middle_name, last_name, email,
         phone_number, date_of_birth, user_type, password, description, skills, Intrests }
    connection.query(insertQuery, user, (err, results) => {
        //if else condition
        if (err) {
            //if error occurs
            console.log("insert error", err);
            res.send({ error: true, data: err, message: 'unable to register user, Try with different email address!' })
        }
        else {
            //if successful
            console.log(results)
            res.send({ error: true, data: results, message: 'user has been updated successfully.' });
        }
    });
});

// get users form the database
app.get('/users', (req, res) => {
    // sql query to get users from user table
    const selectQuery = 'SELECT * FROM user';
    connection.query(selectQuery, (err, results) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json({ data: results })
        }
    });
});

// get userById form the database
app.post('/userById', (req, res) => {
    // sql query to get users from user table
    var user_id=req.body.user_id;
    const selectQuery = 'SELECT * FROM user WHERE user_id=?';
    connection.query(selectQuery,[user_id], (err, results) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json({ data: results, success: true })
        }
    });
});


// update detail of users
// update detail of users
app.post('/updateUser', (req, res) => {
  //attributes
  let first_name = req.body.first_name;
  let middle_name = req.body.middle_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let phone_number = req.body.phone_number;
  let date_of_birth = req.body.date_of_birth;
  let password = req.body.password;
  let description = req.body.description;
  let skills = req.body.skills;
  let Intrests = req.body.Intrests;
  let user_id = req.body.user_id;
  let updateQuery ='UPDATE user SET first_name=?, middle_name=?, last_name=?, email=?, phone_number=?,date_of_birth=?,description=?, skills=?, Intrests=? WHERE user_id=?';
  const udpateDetails = [first_name, middle_name, last_name, email,
      phone_number, date_of_birth, description, skills, Intrests,user_id]

  connection.query(updateQuery,[first_name, middle_name, last_name, email,
      phone_number, date_of_birth, description, skills, Intrests,user_id], (err, results) => {
      if(err) {
          console.log("Update error");
          res.send(err)
      }
      else {
          res.send({ error: false, data: results, message: "User details has been updated successfully" });
      }
  });   
});

//delete user
app.post("/deleteUser", (req, res) => {
    let id = req.body.user_id;
    let sql = 'DELETE  FROM user WHERE user_id=?';
    connection.query(sql, [id], (error, results, fields) => {
        if (error)
            console.error(error.message);
        console.log("Deleted Row(s):", results.affectedRows);
        res.json({ error: false, data: results })
    });
});

//delete job
app.post("/deleteJob", (req, res) => {
    let id = req.body.job_id;
    
    let sql = 'DELETE  FROM job WHERE job_id=?';
    connection.query(sql, [id], (error, results, fields) => {
        if (error) {
          res.send({ 'success': false, error });
        } else {
          res.send({ 'success': true });
        }                
    });
});

// login function
app.post('/users/login', function (req, res) {
    //get email and password.
    var email = req.body.email;
    var password = req.body.password;

    //sql query to select user whose email and password matches 
    connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], function (err, row) {
        if (err) {
            console.log(err);
        }

        if (row.length > 0) {
            res.send({ 'success': true, 'user': row[0] });
        }
        else {
            res.send({ 'success': false, 'message': 'User not found please, try again' });
        }
    });
});

//create job post
app.post('/users/job', function (req, res) {
    //attributes
    var post_title = req.body.post_title;
    var post_description = req.body.post_description;
    var post_salary = req.body.post_salary;
    var post_date = req.body.post_date;
    var expiry_date = req.body.expiry_date;
    var e_user_id = req.body.user_id;
    var job_status=req.body.job_status;
    var job_id = uuidv4();

    //query to apply
    let insertQuery = "INSERT INTO job SET ?"
    const user = { job_id, e_user_id, post_title, post_description, post_salary, post_date, expiry_date,job_status }
    connection.query(insertQuery, user, (err, results) => {
        if (err) {
            //if fails throw error log and error message
            console.log("insert error");
            res.send({ error: true, data: err, message: ' error in job posting' })
        }
        else {
            //if success return reesults
            console.log(results)
            res.send({ error: false, data: results, message: ' Job posted' });
        }
    });
});

//get all jobs by admin
app.get('/allJobs', (req, res) => {
    //query to get all jobs from job table
    const selectQuery = 'SELECT * FROM job';
    connection.query(selectQuery, (err, results) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json({ data: results })
        }
    });
});

//select CV URL of a selected applicant
app.post('/selectCVURL', function (req, res) {
  var cv_user_id = req.body.user_id;    
  connection.query('SELECT file_src FROM users_file WHERE cv_user_id=?', [cv_user_id], function (err, results) {
      if (err) {
          res.send({success: false, error: err})
      }
      else {
          res.json({ data: results, success: true })
      }
  });
});

//get all approved jobs for students
app.get('/approvedJobs', (req, res) => {
    //query to get all jobs from job table
    const selectQuery = 'SELECT * FROM job WHERE job_status="approved"';
    connection.query(selectQuery, (err, results) => {
        if (err) {
            res.send({success: false, error: err})
        }
        else {
            res.json({ data: results, success:true })
        }
    });
});

//update job_status by admin
app.post('/updateJobStatus', (req, res) => {
    var job_status=req.body.job_status;
    var job_id=req.body.job_id;
    var data={job_status,job_id};
    //query to get all jobs from job table
    const updateQuery = 'Update job SET job_status=? WHERE job_id=?';
    connection.query(updateQuery,[job_status,job_id], (err, results) => {
        if (err) {
            res.send(err)
        }
        else {
            res.json({ data: results })
        }
    });
});

//delete Job
app.post("/deleteJob/", (req, res) => {
    let job_id = req.body.job_id;
    let sql = 'DELETE  FROM Job WHERE job_id=?';
    connection.query(sql, [job_id], (error, results, fields) => {
        if (error)
            console.error(error.message);
        console.log("Deleted Row(s):", results.affectedRows);
        res.json({ error: false, data: results })
    });
});

//Search Job
app.get('/jobSearch', function (req, res) {
    // variable for job category
    var job_title = req.body.job_title;

    //search according to job category
    connection.query('SELECT * FROM job WHERE post_title LIKE job_title%', [job_title], function (err, results) {
        if (err) {
            res.send(err)
        }
        else {
            res.json({ data: results })
        }
    });
});


//update job
app.post('/job/update', (req, res) => {  
  var job_id = req.body.job_id
  var post_title = req.body.post_title;
  var post_description = req.body.post_description;
  var post_salary = req.post_salary;
  var post_date = req.post_date;
  var expiry_date = req.body.expiry_date;
  //var user_id = req.body.user_id;

  let updateQuery ='UPDATE job SET post_title=?, post_description=?, post_salary=?, post_date=?, expiry_date=? WHERE job_id=?';  
 
  connection.query(updateQuery,[post_title, post_description, post_salary, post_date,
      expiry_date, job_id], (err, results) => {
      if(err) {
        res.send({success: false, error: err})
      }
      else {
        res.send({ error: false, success: true, data: results, message: "job detail has bee updated successfully" });
      }
  });  
});


// list job by employer id
app.post('/jobByEId', function (req, res) {
    var employer_id = req.body.employer_id;

    console.log(req.body,'----')
    
    connection.query('SELECT * FROM job WHERE e_user_id=?', [employer_id], function (err, results) {
        if (err) {
            res.send({error: err, success: true})
        }
        else {
            res.json({ data: results, success: true })
        }

    });
});

//List of job applied by single candidate
app.post('/listAppliedJobs', function (req, res) {  
  var applied_user_id = req.body.user_id;
  connection.query('SELECT * FROM appliedjobs LEFT JOIN user ON appliedjobs.applied_user_id=user.user_id  WHERE applied_user_id=?', [applied_user_id], function (err, results) {
      if (err) {
          res.send({error:err, success: false})
      }
      else {
          res.json({ data: results, success: true })
      }
  });
});

//candidates who applied the specific job
app.post('/jobApplicants', function (req, res) {
    var job_id = req.body.job_id;    
    connection.query('SELECT * FROM appliedjobs LEFT JOIN user ON appliedjobs.applied_user_id=user.user_id  WHERE job_id=?', [job_id], function (err, results) {
        if (err) {
            res.send({success: false, error: err})
        }
        else {
            res.json({ data: results, success: true })
        }

    });
});


//apply for job
app.post('/applyJob', function (req, res) {
    //attributes
    var applied_user_id = req.body.user_id;
    var job_id = req.body.job_id;
    var cover_letter = req.body.cover_letter;
    var applied_id = uuidv4();

    //apply query for appliedjobs table
    let insertQuery = "INSERT INTO appliedjobs SET ?"
    const job_user_id = { applied_id, applied_user_id, job_id, cover_letter };
    connection.query(insertQuery, job_user_id, (err, results) => {
        if (err) {
            console.log("insert error");

            res.send({ error: true, data: err, message: 'Job application unsuccessful' })
        }
        else {
            console.log(results)
            res.send({ error: false,success: true, data: results, message: ' Job applied Successfully' });
        }
    });
});


//file upload
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
// Static Files
app.use(express.static('public'));
app.use(express.static('upload'));
// set view engine
app.set('view engine', 'ejs')
app.use(morgan('dev'));

//upload in database and source
app.post('/upload2', (req, res) => {

    if (!req.files) {
        res.send("No file upload")
    } else {
        var file = req.files.file
        var fileName = file.name;
        var cv_user_id=req.body.cv_user_id;
        var downloadCVURL="https://wiljob.herokuapp.com/docs/";
        console.log(fileName);
        var file_src = 'https://wiljob.herokuapp.com/docs/'  + file.name;
        var download_src=downloadCVURL+file.name;
        var insertData1 = "INSERT INTO users_file SET ?"
        var insertData2 = "UPDATE user SET download_src=? WHERE user_id=?"
        var data1={file_src,cv_user_id};
        var data2={download_src,cv_user_id};
        connection.query(insertData1, data1, (err, result) => {
            if (err) {
                res.send({success: false})
            } else {
                file.mv('public/docs/' + file.name);
                connection.query(insertData2, [download_src,cv_user_id], (err, result) => {
                })
                res.send({success: true})
            }
        })
    }
});
