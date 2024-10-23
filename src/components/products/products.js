import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseInit';

import { onSnapshot, collection } from 'firebase/firestore';
import "./product.css"
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../auth/authSlice';
import { addItem } from '../Pages/cart/cartSlice';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [items, setItems] = useState([]);
  const { isAuthenticated } = useSelector(authSelector);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
  console.log("Initializing Products component...");
  
  const fetchItems = async () => {
    try {
      const collectionRef = collection(db, 'products');
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched items:", fetchedItems);
        setItems(fetchedItems);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching items from Firestore:", error);
    }
  };

  fetchItems();
  console.log("Products component initialized.");
}, []);

  const handleAddtoCart = (item) => {
    if (isAuthenticated) {
      dispatch(addItem(item));
    }
    else {
      alert("Please sign in to add products to your cart !");
      navigate('/Sign-in-Signup');
    }
  }

  return (
    <div>
      <h1 className='title'>Featured Products</h1>
      <div className='container'>
        
      <div className="product-container">
        {items.map(item => (
          <div className="product-card" key={item.id}>
            <img className="product-image" src={item.image} alt={item.name} />
            <div className="product-info">
              <p className="product-name">{item.name}</p>
              <p className="product-price"> ₹ {item.price}</p>
            </div>
            <button className='add-to-cart-button' onClick={() => { handleAddtoCart(item)}}> Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
   </div>
  );
};

export default Products;