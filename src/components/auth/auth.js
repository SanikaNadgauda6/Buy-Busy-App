import React, { useState } from 'react';
import "./auth.css";
import { Link, Navigate, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, handleSignIn, handleSignOut, handleSignUp } from './authSlice';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const Auth = () => {

    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const { isAuthenticated, error } = useSelector(authSelector); //importing the auth and errors for rendering in UI
    const navigate = useNavigate();
    const firestore = getFirestore(); // Initialize Firestore
    const auth = getAuth();


    //functions to handle click and send the dispatch functions

    //dispatch signUp along with the parameters, send navigate as hooks are not allowed in the createAsyncThunk
    const handleSignUpClick = () => {
        dispatch(handleSignUp({username, email, password, navigate, firestore, auth}));
    }
    
    //dispatch signIn 
    const handleSignInClick = () => {
        dispatch(handleSignIn({email, password, navigate, auth}));
    }
    
    //dispatch Signout
    const handleSignOutClick = () => {
        dispatch(handleSignOut({navigate, auth}));
    }
  
  
    return (
            <div className="register-signin-container">
                {isAuthenticated? (<>
                    <Link to="/"> <button>View Products</button></Link>
                    <button onClick={handleSignOutClick}>Sign Out</button>                    
                    </>):
                    (<>
                    <h2>Register / Sign-In</h2>
                        <input type='text' placeholder='Name' onChange={(e) => setUsername(e.target.value)} />
                        <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={handleSignUpClick}>Sign Up</button>
                        <button onClick={handleSignInClick}>Sign In</button>
                        {isAuthenticated ? (<Navigate to= "/" />): null}
                        </>
                    )}
                {error && <p>{error}</p>}
            </div>
    )
};

