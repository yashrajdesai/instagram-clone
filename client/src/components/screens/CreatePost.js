import React, { useState,useEffect } from "react";
import M from 'materialize-css';
import { useHistory } from "react-router-dom";

const CreatePost = ()=> {
    
    const history = useHistory();
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl]=useState("");

    useEffect(()=>{                         //fetches for backend only when the url is updated.
        if(url) {
            fetch("/createpost",{                //updating our backend with new post.
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")       //authenticating user with token from local storage.
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error) {
                    M.toast({html: data.error,classes:"#d32f2f red darken-2"})
                }else {
                    M.toast({html:"post saved successfully!" ,classes:"#43a047 green darken-1"})
                    history.push('/')
                }
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },[url])


   const postDetails = ()=>{                //Posting data to cloudinary server.
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

    
    return(
        <div className="card input-filed"
       style={{
           margin:"30px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
       }}
       >
           <input 
           type="text"
            placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
           <input
            type="text"
             placeholder="body"
             value={body}
            onChange={(e)=>setBody(e.target.value)}
             />
           <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1" style={{width:"30%"}}>
                <span>Upload</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper" style={{paddingTop:"20px"}}>
                <input className="file-path validate" type="text" />
            </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>postDetails()}
            style={{height: "45px",
            width: "166px",
            marginLeft: "145px"}}
            >
                Submit post
            </button>

       </div>
   )
}


export default CreatePost;