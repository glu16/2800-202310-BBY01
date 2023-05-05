import React from "react";
import { Link } from "react-router-dom";

import "../css/index.css";

const Index = () => {
  return (
    <div className="index-body">
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="card-body index-card">
          <div className="d-flex flex-column align-items-center text-center">
            <h1>Welcome to Healthify!</h1>
            <h4>
              Healthify is a comprehensive fitness and dietary app designed to
              help users achieve their health goals. The app provides
              personalized fitness plans, workout routines, and meal plans based
              on users' unique needs, preferences, and goals.
            </h4>
            <div className="button-group">
              <Link to="/signup">
                <button className="btn btn-primary btn-lg">Sign Up</button>
              </Link>
              <Link to="/login">
                <button className="btn btn-primary btn-lg">Log In</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
