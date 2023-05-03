import React from "react";
import { Link } from "react-router-dom";

import "../css/main.css";

const Diet = () => {
  return (
    <div className="container homeContainer">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1>Welcome to the Diet Page</h1>
            <p>This is the Diet page of our application</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
