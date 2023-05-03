import React from "react";
import { Link } from "react-router-dom";

import "../css/main.css";

const Leaderboard = () => {
  return (
    <div className="container homeContainer">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1>Leaderboard</h1>
            <p>Check your rankings!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
