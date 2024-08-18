import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from './components/Pages/navbar/navbar';
import { LoginProvider, CartProvider } from './context';
import { Home } from './components/Pages/home/home';
import Auth from './components/auth/auth';
import { Cart } from './components/Pages/cart/cart';
import { Orders } from './components/Pages/orders/orders';
import { initializeFirestoreDataIfNeeded } from './components/Pages/storingdata';
import { useEffect } from 'react';



export default function App() {

  useEffect(() => {
    initializeFirestoreDataIfNeeded();
  }, []);


  return (
    <div className="App">
      <Router>
        <LoginProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="Sign-in-Signup" element={<Auth />} />
            {/* <Route path="SignOut" element={<Auth />} /> */}
            <Route path='cart' element={<Cart />}/>
            <Route path='orders' element={<Orders />}/>
          </Routes>
          </CartProvider>
        </LoginProvider>
      </Router>
    </div>
  );
}
