import React, { useState,useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {UserContext} from '../../App'
import M from 'materialize-css';

const Login = ()=> {
    const {state,dispatch}= useContext(UserContext)
    const history = useHistory();
    const [email,setEmail] = useState("");
    const [password,setPassword]= useState("");
    
    const postData = ()=> {
        fetch("/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
           
            if(data.error) {
                M.toast({html: data.error,classes:"#d32f2f red darken-2"})
            }else {
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user});
                M.toast({html: "Signed in successfully !",classes:"#43a047 green darken-1"});       //as in local stotarge only strings can be stored.
                history.push('/');
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }


    return (
            <div id="wrapper">
        <div className="main-content">
            <div className="header">
            <img src="https://i.imgur.com/zqpwkLQ.png" alt="instagram" />
            </div>
            <div className="l-part">
            <input type="text" placeholder="Username" className="input-1" value={email} onChange={(e)=>{
                setEmail(e.target.value);
            }} />
            <div className="overlap-text">
                <input type="password" placeholder="Password" className="input-2" value={password} onChange={(e)=>{
                    setPassword(e.target.value);
                }} />
                <a href="#">Forgot?</a>
            </div>
            <input style={{marginTop:"50px",height:"40px"}} type="button" value="Log in" className="btn" onClick={()=>postData()} />
            </div>
            <div className="sub-content">
            <div className="s-part">
            Don't have an account?  <Link to="./SignUp" style={{color:"blue"}} >Sign up</Link>
            </div>
        </div>
        </div>
        
        </div>
    );
}

export default Login;