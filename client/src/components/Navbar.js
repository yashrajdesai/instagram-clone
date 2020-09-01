import React, { useContext,useEffect,useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

const NavBar = ()=>{

    const searchModal = useRef(null);
    const [search,setSearch] = useState('');
    const {state,dispatch} = useContext(UserContext);
    const [userDetails,setUserDetails]=useState([])
    useEffect(()=>{
      M.Modal.init(searchModal.current)
    },[])
   
    const renderList= ()=> {
        if(state) {
         return [
           <li key="1"><i data-target="modal1" style={{color:"black"}} className="material-icons modal-trigger">search</i></li>,
          <li key="2"><Link to="/profile">Profile</Link></li>,
          <li key="3"><Link to="/createpost">Create Post</Link></li>,
          <li key="4"><Link to="/myfollowingpost">My Following Post</Link></li>,
          <li key="5"><Link to="/login" onClick={()=>{
            localStorage.clear();
            dispatch({type:"CLEAR"});
          }}>Logout</Link></li>
        ]
        }else {
         return [
          <li key="6"><Link to="/login">Login</Link></li>,
          <li key="7"><Link to="/signup">Sign Up</Link></li>]
        }
    }

    const fetchUsers =(query)=>{
        setSearch(query);
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        })
        .then(res=>res.json())
        .then(result=>{
          setUserDetails(result.user);
        })
    }

    return(
      <div>
    <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger right"><i class="material-icons">menu</i></a>
      <ul className="right hide-on-med-and-down">
          {renderList()}
      </ul>
    </div>
    </nav>
    <ul className="sidenav hide-on-large-only" id="mobile-demo">
            {renderList()}
        </ul>
        <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
        <div className="modal-content">
        <input type="text" placeholder="search users" value={search} onChange={(e)=>{
                fetchUsers(e.target.value);
            }} />
          <ul className="collection">
            {userDetails.map(item=>{
              return <Link to={item._id!==state._id?"/profile/"+item._id:"/profile"} onClick={()=>{
                  M.Modal.getInstance(searchModal.current).close()
                  setSearch('')
              }}>
               <li className="collection-item">{item.email}</li>
              </Link>            
              })}
          </ul>
        </div>
        <div className="modal-footer">
          <button href="#!" className="modal-close waves-effect waves-red btn-flat">Close</button>
        </div>
      </div>
      </div>
 )
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, {edge:'right'});
});

export default NavBar;