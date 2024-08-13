import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../../firebaseInit';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import "./orders.css";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const auth = getAuth();

  const fetchOrders = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userOrdersCollection = collection(db, 'users', user.uid, 'orders');
      const querySnapshot = await getDocs(userOrdersCollection);
      // const fetchedOrders = querySnapshot.docs.map(doc => doc.data());

      const fetchedOrders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });

      setOrders(fetchedOrders);
      console.log("All ordered items",orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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