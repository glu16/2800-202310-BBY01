import React from "react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="container homeContainer">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1>Welcome to the Settings Page</h1>
            <p>Customize your notifications and preferences here!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;