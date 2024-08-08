// context.js
import React, { createContext, useEffect, useState } from 'react';
import { db } from './firebaseInit';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
export const LoginContext = createContext();


export const LoginProvider = ({ children }) => {
  // Initialize isLoggedIn state with the value from local storage if available
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
  });

  // Update local storage when isLoggedIn changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    if(!isLoggedIn){
      toast.success("Signed Out Successful!");
    }else{
      toast.success("Login Successful");
    }
    }, [isLoggedIn]);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};

export const CartContext = createContext();

export const CartProvider = ({children}) => {

  const [cartItems, setCartItems] = useState([]);

  const cart = (item) => {
    const isInCart = cartItems.find((i) => i.id === item.id);
    if (isInCart) {
      const updatedCartItems = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      setCartItems(updatedCartItems);
      // Add item to Firestore
      setDoc(doc(db, 'cart', item.id), item)
        .then(() => {
          console.log('Item added to cart with ID:', item.id);
          toast.success('Successfully added to the cart');
        })
        .catch((error) => {
          console.error('Error adding item to cart:', error);
          // Revert local state change on error
          setCartItems(cartItems);
          toast.error('Failed to add item to the cart');
        });
    } else {
      setCartItems((prev) => [{ ...item, quantity: 1 }, ...prev]);
      // Add item to Firestore
      setDoc(doc(db, 'cart', item.id), item)
        .then(() => {
          console.log('Item added to cart with ID:', item.id);
          toast.success('Successfully added to the cart');
        })
        .catch((error) => {
          console.error('Error adding item to cart:', error);

          setCartItems(cartItems);
          toast.error('Failed to add item to the cart');
        });
    }
  };
  

  const removeFromCart = async (itemId) => {
      console.log("Item id:", itemId);
      await deleteDoc(doc(db, 'cart', itemId));
      // console.log('Item removed from Firestore with ID:', itemId);
      // toast.success('Successfully deleted from the cart');
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    }

  // Function to handle checkout
const checkout = async (items) => {
  try {
    // Create a new document orders 
    const orderDocRef = await addDoc(collection(db, 'orders'), {
      items: items,
      timestamp: new Date(),
    });

    console.log('Order placed successfully! Order ID:', orderDocRef.id);
    toast.success('Order placed successfully!');
  } catch (error) {
    console.error('Error placing order:', error);
    toast.error('Error placing order. Please try again.');
  }
};

  return(
    <CartContext.Provider
      value={{cartItems, setCartItems, cart, removeFromCart, checkout}}>
      {children}
    </CartContext.Provider>
  );

}



