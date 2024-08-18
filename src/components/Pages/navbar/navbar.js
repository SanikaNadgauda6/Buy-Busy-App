import { NavLink, Outlet } from "react-router-dom";
import "./navbar.css"
import { useContext } from "react";
import { LoginContext } from "../../../context";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons'; 



export const Navbar = () => {

  const { isLoggedIn, user } = useContext(LoginContext);
  console.log("logedin?", isLoggedIn);


  return (
    <>
      <nav className="navbar">
      <div className="Logo"> 
        <FontAwesomeIcon icon={faStore} className="icon"/>
        <h2>Buy Busy</h2>
      </div>
      <div className="menu">
        <NavLink className="nav-link" activeClassName="active" to="/">
          Home
        </NavLink>
        {isLoggedIn && (
          <>
            <NavLink className="nav-link" activeClassName="active" to="/cart">
              Cart
            </NavLink>
            <NavLink className="nav-link" activeClassName="active" to="/orders">
              Orders
            </NavLink>
          </>
          )}
          
          {isLoggedIn ? (
            <>            
            <NavLink className="nav-link" activeClassName="active" to="/Sign-in-Signup">
            Sign Out
            </NavLink>
              {user && <span className="username">Welcome, {user.displayName} </span>}
            </>
        ):(
          <NavLink className="nav-link" activeclassname="active" to="/Sign-in-Signup">
          Sign-In
        </NavLink>
          )}
      </div>
      </nav>
      <Outlet />
    </>
  );
};
