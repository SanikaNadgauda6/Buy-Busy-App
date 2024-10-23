import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseInit';
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const initialState = {
    cartItems: [],
    totalAmount: 0,
    totalItems: 0
};

// createasyncthunk for fetching the cart items
export const getCartItems = createAsyncThunk('Cart/getCartItems', async (arg, thunkAPI) => {
    const user = getAuth().currentUser;
    console.log("This is user- cart items", user);
    if (!user) return;
    try {
        const cartItemsCollection = collection(db, 'users', user.uid, 'cart');
        const querySnapshot = await getDocs(cartItemsCollection);
        const fetchedCartItems = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const quantity = data.quantity && data.quantity > 0 ? data.quantity : 1;
            return { id: doc.id, ...data, quantity: quantity };
        });
        thunkAPI.dispatch(setInitialState(fetchedCartItems));
        return fetchedCartItems;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setInitialState: (state, action) => {
            state.cartItems = [...action.payload];  
        },
        clearCart: (state, action) => {
            state.cartItems = [];
            state.totalAmount = 0;
            state.totalItems = 0;
        }
    },
    //extraReducers will update the state after fetching the data from database. 
    extraReducers: (builder) => {

        //fetch the cart Items
        builder.addCase(getCartItems.fulfilled, (state, action) => {
            state.cartItems = action.payload;
        })
            .addCase(getCartItems.rejected, (state, action) => {
                console.error('Failed to fetch cart items:', action.payload);
            })
            //add Item
            .addCase(addItem.fulfilled, (state, action) => {
                const newItem = action.payload;
                const existingItem = state.cartItems.find((i) => i.id === newItem.id);
                    
                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                    console.log("This is inside recuder - existing item added to the cart", existingItem);
                }
                else {
                    state.cartItems.push({ ...newItem, quantity: 1 });
                    console.log("This is inside recuder - newItem added to the cart", newItem);
                }
            })
            .addCase(addItem.rejected, (state, action) => {
                console.error('Failed to add item to cart:', action.payload);
            })
            //removeItem
            .addCase(removeItem.fulfilled, (state, action) => {
                state.cartItems.filter((item) => item.id !== action.payload);
                console.log("Removed Item from state", action.payload);
            })
            .addCase(removeItem.rejected, (state, action) => {
                console.error('Failed to remove item from cart:', action.payload);
            })
            //increase quantity
            .addCase(increaseQuantity.fulfilled, (state, action) => {
                const itemId = action.payload; 
                const existingItem = state.cartItems.find(item => item.id === itemId);
                if (existingItem) {
                    existingItem.quantity += 1;
                    console.log("Item quantity increased in state", existingItem);
                }
            })
            .addCase(increaseQuantity.rejected, (state, action) => {
                console.error('Failed to increase item quantity cart:', action.payload);
            })
            //decrease quantity
            .addCase(decreaseQuantity.fulfilled, (state, action) => {
                const itemId = action.payload; 
                const existingItem = state.cartItems.find(item => item.id === itemId);
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                    console.log("Item quantity decrease in state", existingItem);
                }
                else {
                    state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
                    console.log("Removed Item from state", action.payload);
                }
            })
            .addCase(decreaseQuantity.rejected, (state, action) => {
                console.error('Failed to decrease item quantity cart:', action.payload);
            });
    }
});


// Export the actions from cartSlice
export const {setInitialState, clearCart} = cartSlice.actions;

// export the reducer
export default cartSlice.reducer;

//Creating selectors to use state in cart.js
export const cartSelector = (state) => state.cart.cartItems || [];

//Add to cart asyncThunk
export const addItem = createAsyncThunk('Cart/addItem', async (item, thunkAPI) => {
    const user = getAuth().currentUser;

    if (!user) {
        console.log("You are not authenticated");
    }
    try {
        const userCartRef = doc(db, 'users', user.uid, 'cart', item.id);
        await setDoc(userCartRef, item);
        console.log('Item added to cart with ID:', item.id);
        toast.success('Successfully added to the cart');
        thunkAPI.dispatch(getCartItems());
        return item;
    } catch (error) {
        console.log("Error Occured - ", error);
        return thunkAPI.rejectWithValue(error.message);
    }
});


//Remove from cart asyncThunk
export const removeItem = createAsyncThunk('cart/removeItem', (itemId, thunkAPI) => {
    try {
        const user = getAuth().currentUser;
        if (!user) return;
        const userCartRef = doc(db, 'users', user.uid, 'cart', itemId);
        deleteDoc(userCartRef);
        console.log('Item removed from the cart(firestore) with ID:', itemId);
        toast.success('Successfully removed Item from the cart');
        thunkAPI.dispatch(getCartItems());
        return userCartRef;
    }
    catch (error) {
        console.log("Error Occured", error);
        return thunkAPI.rejectWithValue(error.message);

    }
});


//Increase the item quantity
export const increaseQuantity = createAsyncThunk('cart/increaseQuantity', (id, thunkAPI) => {
    try {
        const user = getAuth().currentUser;
        if (!user) return;
        const itemRef = doc(db, 'users', user.uid, 'cart', id);
        updateDoc(itemRef, { quantity: increment(1) });
        console.log('Item quantity increased (firestore) with ID:', id);
        toast.success('Item added to the cart');
        return id;
    } catch (error) {
        console.log("Error -", error);
        return thunkAPI.rejectWithValue(error.message);
    }
})

//decrease the item quantity
export const decreaseQuantity = createAsyncThunk('cart/decreaseQuantity', async (id, thunkAPI) => {
    try {
        const user = getAuth().currentUser;
        if (!user) return;
        const itemRef = doc(db, 'users', user.uid, 'cart', id);
        const querySnapshotref = (await getDoc(itemRef)).data();
        if (querySnapshotref.quantity > 1) {
            await updateDoc(itemRef, { quantity: increment(-1) });
            console.log('Item quantity decrease (firestore) with ID:', id);
            toast.success('Item decreased to the cart');
        }
        else {
            thunkAPI.dispatch(removeItem(id));            
        }
        return id;
    } catch (error) {
        console.log("Error -", error);
        return thunkAPI.rejectWithValue(error.message);

    }
})


//proceed to checkout
export const checkoutOrders = createAsyncThunk('cart/checkoutOrders', async (cartItems, thunkAPI) => {
    try {
        const user = getAuth().currentUser;
        const userOrdersRef = collection(db, 'users', user.uid, 'orders');
        const orderDocRef = await addDoc(userOrdersRef, {
            items: cartItems,
            timestamp: new Date(),
        });
        console.log('Order placed successfully! Order ID:', orderDocRef.id);
        toast.success('Order placed successfully!');
        
        //here also need to clear cart from firestore
        await Promise.all(
            cartItems.map(async (item) => {
                console.log("Dispatching.......for removing", item.id);
                await thunkAPI.dispatch(removeItem(item.id));
            })
        );
        thunkAPI.dispatch(clearCart());
        return orderDocRef.id;
        
    } catch (error) {
        console.error('Error during checkout:', error);
        toast.error('Failed to complete checkout');
        return thunkAPI.rejectWithValue(error.message);
    }
})

