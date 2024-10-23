import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseInit";

const initialState = {
    orderItems: []
};

// createasyncthunk for fetching the order items
export const getOrderItems = createAsyncThunk('order/getOrderItems', async (arg, thunkAPI) => {
    const user = getAuth().currentUser;

    console.log("This is user- order items", user);

    if (!user) {
        console.log("User is not authenticated");
        return thunkAPI.rejectWithValue('User not authenticated');
    }

    try {
        const userOrdersCollection = collection(db, 'users', user.uid, 'orders');
      const querySnapshot = await getDocs(userOrdersCollection);
      const fetchedOrders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
        
        thunkAPI.dispatch(setInitialState(fetchedOrders));
        return fetchedOrders;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return thunkAPI.rejectWithValue(error.message);
    }
});


const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setInitialState: (state, action) => {
            state.orderItems = [...action.payload];
        },
    },
    extraReducers: (builder) => {
        //fetch the order Items
        builder.addCase(getOrderItems.fulfilled, (state, action) => {
            state.orderItems = action.payload;
        })
            .addCase(getOrderItems.rejected, (state, action) => {
                console.error('Failed to fetch cart items:', action.payload);
            });
    }
})
//exporting the actions 
const { setInitialState } = orderSlice.actions;

//export the reducer
export default orderSlice.reducer;

//Creating selectors to use state in order.js
export const orderSelector = (state) => ({
  orders: state.order.orderItems,
});