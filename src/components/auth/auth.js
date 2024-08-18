import React, { useContext, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import "./auth.css";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context';
import { doc, Firestore, getFirestore, setDoc } from 'firebase/firestore';



const Auth = () => {
    const auth = getAuth();
    const firestore = getFirestore(); // Initialize Firestore
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(null); 
    // const user = getAuth().currentUser;

    const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
    const navigate = useNavigate();    


    const handleSignUp = async () => {
        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('User signed up successfully!');

            await setDoc(doc(firestore, 'users', user.uid), {
                username: username,
                email: email
            });
            
            setUsername(username);
            setEmail(email);
            setIsLoggedIn(true);

            await updateProfile(user, { displayName: username }); 

            setDoc(doc(Firestore, 'users', user.uid), {
                username: username,
                email: email
            });

        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('User signed in successfully! from auth page', username);
            setIsLoggedIn(true);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignOut = async () => {
      try {
        await signOut(auth);
        console.log("is loggedin before setting it", isLoggedIn);
        setIsLoggedIn(false);
        console.log("is loggedin after setting it", isLoggedIn);
        navigate('/Sign-in-Signup');
        console.log('User signed out successfully!');
      } catch (error) {
        console.error('Error signing out:', error.message);
      }
    };
  
    return (
            <div className="register-signin-container">
                {isLoggedIn? (<>
                    <Link to="/"> <button>View Products</button></Link>
                    <button onClick={handleSignOut}>Sign Out</button>                    
                    </>):
                    (<>
                    <h2>Register / Sign-In</h2>
                        <input type='text' placeholder='Name' onChange={(e) => setUsername(e.target.value)} />
                        <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={handleSignUp}>Sign Up</button>
                        <button onClick={handleSignIn}>Sign In</button>
                        {isLoggedIn ? (<Navigate to= "/" />): null}
                        </>
                    )}
                {error && <p>{error}</p>}
                
            </div>
    )
};

export default Auth;
