import React, { useContext, useEffect } from 'react';
import "./cart.css";
import { CartContext } from '../../../context';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseInit';


export const Cart = () => {
  const { cartItems, setCartItems, removeFromCart, checkout } = useContext(CartContext);
// Function to fetch cart items from Firestore
const fetchCartItems = async () => {
    try {
      const cartItemsCollection = collection(db, 'cart');
      const querySnapshot = await getDocs(cartItemsCollection);
      const fetchedCartItems = querySnapshot.docs.map(doc => {
        // console.log("Document ID:", doc.id); // Log the document ID
        const data = doc.data();
        // Ensure quantity is at least 1
        const quantity = data.quantity && data.quantity > 0 ? data.quantity : 1;
        return { id: doc.id, ...data, quantity: quantity };
      });
      setCartItems(fetchedCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  
  // Fetch cart items when the component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);  

  // Function to calculate total price
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 1);
  };

  // Function to handle increasing quantity
  const handleIncreaseQuantity = (id) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
  };
// Function to handle decreasing quantity
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
    // Filter out null items (those with quantity 0) and update cartItems
    setCartItems(updatedItems.filter(item => item !== null));
  };
  

// Function to remove item from cart
const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  // Function to handle checkout
  const handleCheckout = (itemId) => {
    // Clear cart items
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
          {/* <div className="checkout-section">
            <span className="total-text">Total:</span>
            <span className="total-price_C">Rs. {calculateTotalPrice()}</span>
            <button onClick={handleCheckout} className="checkout-btn">Checkout</button>
          </div> */}
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
      {/* <tr> */}
      {/* </tr> */}
    </tbody>
  </table>
  <div className="checkout-container">
    <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
  </div>
</div>

      </>
      ) : (
        <h2 className="empty-cart-msg">Your Cart is Empty!</h2>
      )}
    </div>
    </>

  );
};

