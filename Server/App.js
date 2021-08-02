import React, {useState} from "react";
import Axios from "Axios";
import "./App.css";
import { response } from "express";


function App(){

    const[usernameReg, setUsernameReg] = useState('')
    const[PasswordReg, setPasswordReg] = useState('')

    const register = () => {
        Axios.post('https://localhost5000/user/register',{
            username:usernameReg,
            password:PasswordReg
        }).then((response)=> {
            console.log(response);
        })

    }
return (
    <div className ="App">
    
     <div className="register">
            <h1> register  </h1>
            <label>username  </label>
            <input type="text" onChange={
                ()=> {setUsernameReg(e.target.value)}}/>
            <label>password</label>
            <input type="text" onChange={
                ()=> {setPasswordReg(e.target.value)}}/>
            <button>register</button>
    </div>

    <div className="login">
        <h1>login </h1>
        <input type="text" placeholder="Username..."/>
        <input type="password" placeholder="Password..."/>
        <button>register</button>


    </div>

    </div>
 
);


}

export default App;