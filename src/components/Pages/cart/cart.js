import React, { useEffect } from 'react';
import "./cart.css";
import { useDispatch, useSelector } from 'react-redux';
import { cartSelector, checkoutOrders, decreaseQuantity, getCartItems, increaseQuantity, removeItem} from './cartSlice';

export const Cart = () => {
  const dispatch = useDispatch();
  // selector for cart items
  const cartItems = useSelector(cartSelector);

  useEffect(() => {
      dispatch(getCartItems());
  }, [dispatch]);


//calculate the total price
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 1);
  };

  //dispatch the increase quantity with the item id
  const handleIncreaseQuantity = (id) => {
    dispatch(increaseQuantity(id));
  };

  //dispatch the decrease quantity with the item id
  const handleDecreaseQuantity = (itemId) => {
    dispatch(decreaseQuantity(itemId));
  }

  //dispatch the remove Item from cart with the item id
  const handleRemoveFromCart = (itemId) => {
    dispatch(removeItem(itemId));
  };

  //added here the dispatch function
  const handleCheckout = () => {
    dispatch(checkoutOrders(cartItems)); 
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
                        <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn">Remove</button>
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



