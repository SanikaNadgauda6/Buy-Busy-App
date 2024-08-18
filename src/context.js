import React, { createContext, useEffect, useState } from 'react';
import { db } from './firebaseInit';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    if(!isLoggedIn){
      toast.success("Signed Out Successfully!");
    }else{
      toast.success("Login Successful");
    }
  }, [isLoggedIn]);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        setUser(currentUser);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);


  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, user }}>
      {children}
    </LoginContext.Provider>
  );

  
};

export const CartContext = createContext();

export const CartProvider = ({children}) => {
  const auth = getAuth();
  const [cartItems, setCartItems] = useState([]);
  
  // Function to add item to cart and Firestore under the user's ID
  const cart = async (item) => {
    const user = auth.currentUser;
    if (!user) return; 

    const isInCart = cartItems.find((i) => i.id === item.id);
    const userCartRef = doc(db, 'users', user.uid, 'cart', item.id);
    
    if (isInCart) {
      const updatedCartItems = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      setCartItems(updatedCartItems);
      // Add item to Firestore under the user's cart
      setDoc(userCartRef, item)
        .then(() => {
          console.log('Item added to cart with ID:', item.id);
          toast.success('Successfully added to the cart');
        })
        .catch((error) => {
          console.error('Error adding item to cart:', error);
          setCartItems(cartItems); // Revert local state change on error
          toast.error('Failed to add item to the cart');
        });
    } else {
      setCartItems((prev) => [{ ...item, quantity: 1 }, ...prev]);
      setDoc(userCartRef, item)
        .then(() => {
          console.log('Item added to cart with ID:', item.id);
          toast.success('Successfully added to the cart');
        })
        .catch((error) => {
          console.error('Error adding item to cart:', error);
          setCartItems(cartItems); // Revert local state change on error
          toast.error('Failed to add item to the cart');
        });
    }
  };
  
  const removeFromCart = async (itemId) => {
    const user = auth.currentUser;
    if (!user) return;

    const userCartRef = doc(db, 'users', user.uid, 'cart', itemId);
    await deleteDoc(userCartRef);
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  // Function to handle checkout and save the order under the user's ID
  const checkout = async (items) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userOrdersRef = collection(db, 'users', user.uid, 'orders');
      const orderDocRef = await addDoc(userOrdersRef, {
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
