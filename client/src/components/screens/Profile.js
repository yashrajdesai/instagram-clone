import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Profile = ()=> {
    const [pics,setPics] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    const [image,setImage] = useState("");
    const [url,setUrl]=useState("");

    useEffect(()=>{
        fetch("/mypost",{
           headers: {"Authorization":"Bearer "+localStorage.getItem("jwt")}
        })
        .then(res=>res.json())
        .then(result=>{
            setPics(result.posts);
        })
    },[])
    useEffect(()=>{
        if(image) {
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
                setUrl(data.url);                //Updating url state with pic url recieved from cloudinary.
                fetch('/updatepic',{             //To store update pic in db.
                    method:"put",
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("jwt"),
                        "Content-Type":"application/json"   
                    },
                    body:JSON.stringify({
                        profilePic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,profilePic:result.profilePic}))            
                    dispatch({type:"UPDATEPIC",payload:result.profilePic})
                })
            })
            .catch(err=>{
                console.log(err);
            });
        }
    },[image])

    

    const updatePhoto = (file)=> {
        setImage(file); 
    }
    
    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>

         
           <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={state?state.profilePic:"loading"}
                   />
                 
               </div>
               <div>
                   <h4>{state?state.name:"loading"}</h4>
                   <h5>{state?state.email:"loading"}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{pics.length} posts</h6>
                       <h6>{state?state.followers.length:"0"} followers</h6>
                       <h6>{state?state.following.length:"0"} following</h6>
                   </div>

               </div>
           </div>
        
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1" style={{width:"30%"}}>
                <span>Update pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            </div>      
           <div className="gallery">
               {
                   pics.map(item=>{
                       return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                       )
                   })
               }

           
           </div>
       </div>
    );
}

export default Profile;