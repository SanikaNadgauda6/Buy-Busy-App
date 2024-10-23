import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

//initial state for the authentication
const initialState = {
    user: null,
    isAuthenticated: false,
    error: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login_success: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        logout_success: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        auth_error: (state, action) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
    },
})

//Exporting the actions 
export const { login_success, logout_success, auth_error } = authSlice.actions;

//Exporting the state using selector
export const authSelector = (state) => state.auth;


//Async Thunk function for user Sign-Up, using the parameters sent through the dispatch function
export const handleSignUp = createAsyncThunk('auth/signUp', async ({username, email, password, navigate, firestore, auth}, thunkAPI) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed up successfully from authSlice!', userCredential.user);
        //set Doc for storing in Firestore
        await setDoc(doc(firestore, 'users', user.uid), {
            username: username,
                email: email
        });
        //updating profile with display name to show on the Navbar as Welcome..User.
        await updateProfile(user, { displayName: username });

        //dispatch to action for state update
        thunkAPI.dispatch(login_success(user));
        toast.success("Sign Up Successful");
        navigate('/');

    } catch (error) {
        thunkAPI.dispatch(auth_error(error.message));
        toast.error("Sign Up Failed");
    }
    
});

//Async Thunk function for user Sign-Ip, using the parameters sent through the dispatch function
export const handleSignIn = createAsyncThunk('auth/signIn', async({email, password, navigate, auth}, thunkAPI) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); //Navigate to home page after login

            //dispatch to action for state update
            thunkAPI.dispatch(login_success(userCredential.user));
            toast.success("Login Successfull!");
        } catch (error) {
            //dispatch to action for state update
            thunkAPI.dispatch(auth_error(error.message)); 
            toast.error("Sign Up Failed");
        }
});

//Async Thunk function for user SignOut
export const handleSignOut = createAsyncThunk('auth/signOut', async({navigate, auth}, thunkAPI) => {
      try {
          await signOut(auth);
          navigate('/Sign-in-Signup'); //Navigate to signIn-signOut Page for signing in again if needed
          //dispatch to action for state update
          thunkAPI.dispatch(logout_success());
          toast.success("Signed Out Successfully");
      } catch (error) {
            thunkAPI.dispatch(auth_error(error.message));
            toast.error("Sign Out Failed");
      }
    });

// Check if user is already authenticated
export const checkAuthState = createAsyncThunk('auth/checkAuthState', async ({auth}, thunkAPI) => {
    console.log("From the checkAuthState", auth);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            thunkAPI.dispatch(login_success(user)); //dispatch to action for state update
        } else {
            thunkAPI.dispatch(logout_success());//dispatch to action for state update
        }
    });
});

// export the reducer
export default authSlice.reducer;
