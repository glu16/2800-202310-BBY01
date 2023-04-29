import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container bg-black mx-auto">
      <h1 className="display-4">
        Hello, <span id="name-goes-here"></span>!
      </h1>
    </div>
  );
};

export default Home;
