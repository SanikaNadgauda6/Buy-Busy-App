import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../../context';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseInit';
import './orders.css';


export const Orders = () => {




  const [orderedItems, setOrderedItems] = useState([]);

  useEffect(() => {
    const fetchOrderedItems = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const querySnapshot = await getDocs(ordersCollection);
        // console.log('Fetched query snapshot:', querySnapshot.docs);
        const fetchedOrderedItems = querySnapshot.docs.map((doc) => doc.data());
        console.log('Fetched ordered items:', fetchedOrderedItems);
        setOrderedItems(fetchedOrderedItems);
      } catch (error) {
        console.error('Error fetching ordered items:', error);
      }
    };
    fetchOrderedItems();
  }, []); 

  console.log('Ordered items:', orderedItems);
  return (
    <div className="orders-page">
      {/* {orderedItems.length > 0 ? (
        {orderedItems.

        ))}
      ): (
        <h2>No Orders Yet!</h2>
      )}       */}


<div>
  <h2>Recent Orders</h2>
  <div className="order-list">
    {orderedItems.map((order, index) => (
        <div key={index} className="order-item">
          {/* Display order details */}
          <p>Order ID: {order.orderId}</p>
          <p>Total Amount: {order.totalAmount}</p>
          <p>Order Date: {new Date(order.timestamp).toLocaleString()}</p>
          {/* You can add more details here */}
        </div>
      ))}
  </div>
</div>

    </div>
  );
  
};

export default Orders;
