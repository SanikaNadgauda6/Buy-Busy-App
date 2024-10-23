import React, { useEffect } from 'react';
import "./orders.css";
import { useDispatch, useSelector } from 'react-redux';
import { getOrderItems, orderSelector } from './orderSlice';

export const Orders = () => {

  const dispatch = useDispatch();
  const { orders } = useSelector(orderSelector); //importing the state to use in jsx

//dispatching the action to fetch the order Items
  useEffect(() => {
    dispatch(getOrderItems());
  }, [dispatch]);

  const formatTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return 'N/A'; 
  return new Date(timestamp.seconds * 1000).toLocaleString(); 
};

  return (
    <div className="orders-page">
      <h2>Recent Orders</h2>
      {orders.length > 0 ? (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatTimestamp(order.timestamp)}</td>
                  <td>
                    <ul className="order-items-list">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="order-item-details">
                          <img src={item.image} alt={item.name} className="order-item-image" />
                          <div className="item-details">
                            <p><strong>Item Name:</strong> {item.name}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Price:</strong> ${item.price}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}