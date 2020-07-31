import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';

const NavBar = ()=>{
    const {state,dispatch} = useContext(UserContext);
    const renderList= ()=> {
        if(state) {
         return [
          <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/createpost">Create Post</Link></li>,
          <li><Link to="/myfollowingpost">My Following Post</Link></li>,
          <li><Link to="/login" onClick={()=>{
            localStorage.clear();
            dispatch({type:"CLEAR"});
          }}>Logout</Link></li>
        ]
        }else {
         return [
          <li><Link to="/login">Login</Link></li>,
          <li><Link to="/signup">Sign Up</Link></li>]
        }
    }

    return(
        <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
          {renderList()}
      </ul>
    </div>
  </nav>
 )
}


export default NavBar;