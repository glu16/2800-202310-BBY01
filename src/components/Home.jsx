import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div class="container bg-light p-5 mx-auto">
      <h1 class="display-4">
        Hello, <span id="name-goes-here"></span>!
      </h1>
    </div>
  );
};

export default Home;
