import React, { useState } from "react";
import Products from "../../products/products";
import banner from "../../../assets/images/banner.jpg";

export const Home = () =>{
    return (
        <div className="Home">
            <img src={banner}/>
            {/* <h1>Welcome to home page</h1> */}
            <Products/>
        </div>
    )
}