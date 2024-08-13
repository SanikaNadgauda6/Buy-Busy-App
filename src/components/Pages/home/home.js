import React from "react";
import "./home.css";
import Products from "../../products/products";
import banner1 from "../../../assets/images/backgroundimage2.png";

export const Home = () =>{
    return (
        <div className="Home">
            <div className="banner">
                <div className="text">
                    <h1>Your Smart Shopping Companion!</h1>
                    <p>Say goodbye to the hassle of juggling your shopping lists and finding the best deals. With Buy Busy, your smart shopping companion, you can streamline your shopping experience, track your purchases, and discover great offers—all in one place. Whether you're a deal-hunter or a casual shopper, Buy Busy keeps you organized and ahead of the curve. Get busy with buying, and let us handle the rest!</p>
                </div>
                <div className="img">
                    <img src={banner1} alt="Banner" />
                </div>
            </div> 
            <Products/>
        </div>
    )
}