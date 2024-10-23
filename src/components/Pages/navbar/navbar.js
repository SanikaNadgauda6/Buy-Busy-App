import { NavLink, Outlet } from "react-router-dom";
import "./navbar.css"
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons'; 
import { useSelector } from "react-redux";
import { authSelector } from "../../auth/authSlice";



export const Navbar = () => {

    const { isAuthenticated, user } = useSelector(authSelector);


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
        {isAuthenticated && (
          <>
            <NavLink className="nav-link" activeClassName="active" to="/cart">
              Cart
            </NavLink>
            <NavLink className="nav-link" activeClassName="active" to="/orders">
              Orders
            </NavLink>
          </>
          )}
          
          {isAuthenticated ? (
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
