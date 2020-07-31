import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';


const SignUp = ()=> {
    
    const history = useHistory();
    const [name,setName]= useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword]= useState("");
    const [image,setImage] = useState("");
    const [url,setUrl]=useState("");
    
    useEffect(()=>{
        if(url) {
            uploadFields();
        }
    },[url])


    const uploadPic = ()=>{
        const data = new FormData();
       data.append("file",image);
       data.append("upload_preset","insta-clone");
       data.append("cloud_name","posts")
       fetch("https://api.cloudinary.com/v1_1/posts/image/upload",{
        method:"post",
        body:data
       })
       .then(res=>res.json())
       .then(data=>{
           setUrl(data.url)                 //Updating url state with pic url recieved from cloudinary.
       })
       .catch(err=>{
           console.log(err);
       });
    }

    const uploadFields = ()=>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                profilePic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.error) {
                M.toast({html: data.error,classes:"#d32f2f red darken-2"})
            }else {
                M.toast({html: data.message,classes:"#43a047 green darken-1"})
                history.push('/login')
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const postData = ()=> {
        if(image) {
            uploadPic();
        }else{
            uploadFields();
        }
    }
    
    
    
    
    
    return (
            <div id="wrapper">
                <div className="main-content">
            <div className="header">
            <img src="https://i.imgur.com/zqpwkLQ.png" alt="instagram" />
            </div>
            <div className="l-part">
            <input type="text" placeholder="Name" className="input-1" value={name} onChange={(e)=>{
                setName(e.target.value);
            }} />
            <input type="text" placeholder="Username" className="input-1" value={email} onChange={(e)=>{
                setEmail(e.target.value);
            }}  />
            <div className="overlap-text">
                <input type="password" placeholder="Password" className="input-2" value={password} onChange={(e)=>{
                    setPassword(e.target.value);
                }} />
                <a href="#">Forgot?</a>
            </div>
            <div className="file-field input-field">
            <div className="btn">
            <span>UPLOAD PROFILE PIC</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            <input type="button" value="Sign Up" className="btn" onClick={()=>postData()} />
            </div>
            <div className="sub-content">
            <div className="s-part">
            Already have an account?  <Link style={{color:"blue"}} to="./login">Login</Link>
            </div>
            </div>
        </div>
        
        </div>
        </div>
    );
}

export default SignUp;