import React,{useEffect,createContext,useReducer, useContext} from 'react';
import NavBar from './components/Navbar';
import "./App.css";
import {BrowserRouter,Route,Switch, useHistory} from 'react-router-dom';
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";
import SignUp from "./components/screens/SignUp";
import CreatePost from './components/screens/CreatePost';
import {reducer,initialState} from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserProfile from './components/screens/SubscribedUserProfile';

export const UserContext = createContext();


  const Routing = ()=> {
    
    const history=useHistory();
    const {state,dispatch} =useContext(UserContext);     
    
    
    useEffect(()=>{   
      const user = JSON.parse(localStorage.getItem("user")); 
      if(user) {
        dispatch({type:"USER",payload:user});   //As when user closes the application the state is also destroyed so to give acess to protected data we update the state.
      }else{
        history.push('/login');
      }
    },[]);


    return (
        <Switch>                  //Allows only one route to be active. //exact keyword is used because "/profile" is used multiple times so it renders this exact path.
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route exact path="/profile">  
        <Profile />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost" >
        <SubscribedUserProfile />
      </Route>
        </Switch>
      )
  }

function App() {
  const [state,dispatch] = useReducer(reducer,initialState);

  return (                          //passes state and dispatch method to the descendants with the help of value prop.
    <UserContext.Provider value={{state,dispatch}}>  
        <BrowserRouter>
      <NavBar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>

  );
}

export default App;
