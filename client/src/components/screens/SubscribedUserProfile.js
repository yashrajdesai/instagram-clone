import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const SubscribedUserProfile = ()=> {
   const [data,setData] = useState([]);
   const {state,dispatch} = useContext(UserContext);
  
    useEffect(()=>{
        fetch('/getsubpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(res=>{
            setData(res.posts);
        })
    },[])
    
    function handleLike(id) {
        fetch('/like',{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{             //This id to re-render a page when a post like/unlike is updated.
                                                         
                if(item._id===result._id) {             //Checks which post is updated and returns updated posts in new data.
                    return result;
                }else {
                    return item;
                }
            })
            setData(newData)
        })
        .catch(err=>console.log(err));
    }
    function handleUnlike(id) {
        fetch('/unlike',{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData = data.map(item=>{            //This id to re-render a page when a post like/unlike is updated.
                if(item._id===result._id) {             //Checks which post is updated and returns updated posts in new data.
                    return result;
                }else {
                    return item;
                }
            })
            setData(newData)
        })
        .catch(err=>console.log(err));
    }

    const makeComment = (text,postId)=> {
        fetch('/comment',{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                postId,
                text
            })
        })
        .then(res=>res.json())
        .then(result=>{ 
            
            const newData = data.map(item=>{            //This id to re-render a page when a post is updated.
                if(item._id===result._id) {             //Checks which post is updated and returns updated posts in new data.
                    return result;
                }else {
                    return item;
                }
            })
            setData(newData)
        })
        .catch(err=>console.log(err));   
    }
    
    const deletePost = (postId)=> {
        fetch(`/deletepost/${postId}`,{         //concatenate postId at end
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.filter(item=>{        // returns that posts which are not equal to the deleted post
                return item._id !== result._id
            })
            setData(newData); 
        })               
    } 
    
    const deleteComment = (commentId,postId) => {
        fetch(`/deletecomment/${commentId}`,{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                postId
            })
        })
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{            //This id to re-render a page when a post like/unlike is updated.
                if(item._id===result._id) {             //Checks which post is updated and returns updated posts in new data.
                    return result;
                }else {
                    return item;
                }
            })
            setData(newData) 
        })
    }

    return (
        data.map(item=>{    //maps all the data from dB with the card style.
           return (
           <div className="home">
            <div className="card home-card" key={item._id}>
             <h5 style={{padding:"6px"}} key={item._id}> <Link to= {item.postedBy._id ===state._id ? "/profile":"/profile/"+item.postedBy._id }>{item.postedBy.name} </Link > {state._id ===item.postedBy._id
             &&<i className="material-icons" style={{float:"right"}} onClick={()=>{deletePost(item._id)}}>delete</i>
             }</h5>
            <div className="card-image">
            <img src={item.photo} />
            </div>
            <div className="card-content">
                <i className="material-icons" style={{color:"red"}} >favorite</i>
                {item.likes.includes(state._id)                             //checks if user has already liked the post.
                ?<i className="material-icons" style={{padding:"0px 20px"}} onClick={()=>{handleUnlike(item._id)}}>thumb_down</i>
                :<i className="material-icons" style={{padding:"0px 20px"}} onClick={()=>handleLike(item._id)} >thumb_up</i>
                }
                
                <h6>Likes {item.likes.length}</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {
                    item.comments.map(record=>{
                        return (
                            <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}
                            {state._id ===item.postedBy._id
                                 &&<i className="material-icons" style={{float:"right"}} onClick={()=>{deleteComment(record._id,item._id)}}>delete</i>
                            }
                        </h6>
                        )
                    })
                }
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    makeComment(e.target[0].value,item._id);
                }}>
                <input type="text" placeholder="Add a comment" />
                </form>
                
            </div>
            </div>
        </div> ) 
        })  
    );
}

export default SubscribedUserProfile;