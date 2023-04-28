import React from "react";
import navbarAfterLogin from "./navbarAfterLogin.js";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <navbarAfterLogin/>
            <h1>Home Page</h1> 
            <p> Welcome!</p>
        </div>
    );
};

export default Home;