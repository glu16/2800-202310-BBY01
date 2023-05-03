import React from "react";
import { Link } from "react-router-dom";

import "../css/main.css";

const Calendar = () => {
  return (
    <div className="container homeContainer">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1>Welcome to the Calendar Page</h1>
            <p>Track your daily goals here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
