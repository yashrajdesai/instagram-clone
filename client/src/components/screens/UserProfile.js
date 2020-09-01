import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const Profile = ()=> {
    const [userProfile,setProfile] = useState();
   
    const {state,dispatch} = useContext(UserContext);
    const {userid} =useParams();
    const [isFollower,setFollow] = useState(state?state.following.includes(userid):false);
    useEffect(()=>{
        fetch(`/user/${userid}`,{
           headers: {"Authorization":"Bearer "+localStorage.getItem("jwt")}
        })
        .then(res=>res.json())
        .then(result=>{
            setProfile(result);
        })
    },[])
    
    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                userid
            })
        })    
        .then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile(prev=>{
               return {
                ...prev,            //As userprofile has two types of fields user and post we retained posts but over ruled user.
                user:{
                    ...prev.user,       //As we only wanted to change followers field so we over write in next field.
                    followers:[...prev.user.followers,data._id]         //Appending our id in followers array. 
                }
               }    
            });
            setFollow(true);
        })    
        
    }

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                userid
            })
        })    
        .then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile(prev=>{
               const newFollowers= prev.user.followers.filter(item=>item!==data._id) 
               return {
                ...prev,            //As userprofile has two types of fields user and post we retained posts but over ruled user.
                user:{
                    ...prev.user,       //As we only wanted to change followers field so we over write in next field.
                    followers: newFollowers       //Updating followers array. 
                }
                }    
            });
            setFollow(false);
        })    
        
    }


    return (
        <> {userProfile ?
        <div className="profile-body">
            <div style={{display: "flex",justifyContent: "space-around", margin: "18px 0px",borderBottom:"1px solid grey"}}>
              <div>
                  <img style={{
                            width: "160px",
                            height: "160px",
                            borderRadius: "80px"
                        }}
                    src={userProfile.user.profilePic} alt="profileimg" />
              </div>  
              <div>
                  <h4>{userProfile.user.name}</h4>
                  
                  <div style={{display: "flex",justifyContent: "space-around", width:"108%"}}>
                      {userProfile.posts.length===1?<h6>1 post</h6>:<h6>{userProfile.posts.length} posts</h6> }
                      <h6>{userProfile.user.followers.length} followers </h6>
                      <h6>{userProfile.user.following.length} following</h6>
                  </div>
                   {isFollower?<button style={{margin:"10px"}} className="btn-small waves-effect waves-light  " onClick={()=>unfollowUser()}>Unfollow</button>
                   :<button style={{margin:"10px"}} className="btn-small waves-effect waves-light " onClick={()=>followUser()}>Follow</button>} 
              </div>
              </div>
              <div className="gallery">
              {userProfile.posts.map(item=>{
                return(
                <img key={item._id} className="item" src={item.photo} alt="profileimg" />
               );
                })}
                </div> 
        </div>
        : <h2>loading...</h2>}
        </>
    );
}

export default Profile;