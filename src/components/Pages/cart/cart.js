import React, { useContext, useEffect } from 'react';
import "./cart.css";
import { CartContext } from '../../../context';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseInit';
import { getAuth } from 'firebase/auth';

export const Cart = () => {
  const { cartItems, setCartItems, removeFromCart, checkout } = useContext(CartContext);
  const auth = getAuth();
  
  useEffect(() => {
    const fetchCartItems = async () => {
    const user = auth.currentUser;
    if (!user) return; 

    try {
      const cartItemsCollection = collection(db, 'users', user.uid, 'cart');
      const querySnapshot = await getDocs(cartItemsCollection);
      const fetchedCartItems = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const quantity = data.quantity && data.quantity > 0 ? data.quantity : 1;
        return { id: doc.id, ...data, quantity: quantity };
      });
      setCartItems(fetchedCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
    };
    

    fetchCartItems();
  }, [auth.currentUser, setCartItems]);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 1);
  };

  const handleIncreaseQuantity = (id) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
  };

  const handleDecreaseQuantity = (id) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          handleRemoveFromCart(id);
          return null;
        }
      }
      return item;
    });
    setCartItems(updatedItems.filter(item => item !== null));
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    checkout(cartItems);
    cartItems.forEach((item) => removeFromCart(item.id));
  };

  return (
    <>
      <h2>Your Cart</h2>
      <div className="cart-page">
        {cartItems.length > 0 ? (
          <>
            <div className="cart-table-container">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.image} alt={item.name} className="product-image" />
                        <span className="product-name">{item.name}</span>
                      </td>
                      <td className="product-price">Rs. {item.price}</td>
                      <td className="quantity">
                        <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                        {item.quantity}
                        <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                      </td>
                      <td className="total-price">Rs. {item.price * item.quantity}</td>
                      <td className="remove-btnC">
                        <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='Summary'>
              <table className="summary-table">
                <thead>
                  <tr>
                    <th className="summary-heading" colSpan="2">Summary</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="summary-item">Total Items:</td>
                    <td className="summary-value">{cartItems.reduce((total, item) => total + item.quantity, 0)}</td>
                  </tr>
                  <tr>
                    <td className="summary-item">Total Amount:</td>
                    <td className="summary-value">Rs. {calculateTotalPrice()}</td>
                  </tr>
                  <tr>
                    <td className="summary-item">Discount:</td>
                    <td className="summary-value">0</td>
                  </tr>
                  <tr>
                    <td className="summary-item">Delivery Charges:</td>
                    <td className="summary-value">Free</td>
                  </tr>
                  <tr>
                    <td className="summary-item">Billing Amount:</td>
                    <td className="summary-value">Rs. {calculateTotalPrice()}</td>
                  </tr>
                  </tbody>
              </table>

              <button onClick={handleCheckout} className="checkout-button">Proceed to Checkout</button>
                   
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </>
  );
};



