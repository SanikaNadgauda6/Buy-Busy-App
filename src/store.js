import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./components/auth/authSlice";
import cartReducer from "./components/Pages/cart/cartSlice";
import orderReducer from "./components/Pages/orders/orderSlice";

//adding the reducers to the store
export default configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
    },
})

