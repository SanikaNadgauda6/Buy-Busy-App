import { NavLink, Outlet } from "react-router-dom";
import "./navbar.css"
import { useContext } from "react";
import { LoginContext } from "../../../context";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons'; // Import the desired icon


export const Navbar = () => {

  const { isLoggedIn } = useContext(LoginContext);
  console.log("logedin?", isLoggedIn);


  return (
    <div>
      <nav className="navbar">
      <div className="Logo"> 
        <FontAwesomeIcon icon={faStore} className="icon"/>
        <h2>Buy Busy</h2>
      </div>
      <div className="menu">
        <NavLink className="nav-link" isactiveclassname=".active" to="/">
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
        {isLoggedIn? (
            <NavLink className="nav-link" activeClassName="active" to="/Sign-in-Signup">
            Sign Out
            </NavLink>
        ):(
          <NavLink className="nav-link" isactiveclassname=".active" to="/Sign-in-Signup">
          Sign-In
        </NavLink>
        )}
      </div>
      </nav>
      <Outlet />
    </div>
  );
};
