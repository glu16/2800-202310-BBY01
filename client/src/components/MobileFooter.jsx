import React from "react";
import { Link } from "react-router-dom";

import "../css/navfooter.css";

function MobileFooter() {
  return (
    <footer className="footer navbar-expand-lg navbar-dark fixed-bottom">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row justify-content-between">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <span className="material-symbols-outlined"> home </span> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/coach" className="nav-link">
            <span className="material-symbols-outlined"> smart_toy </span> Coach
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/diet" className="nav-link">
            <span className="material-symbols-outlined"> nutrition </span> Diet
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/fitness" className="nav-link">
            <span className="material-symbols-outlined"> exercise </span>{" "}
            Fitness
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/leaderboard" className="nav-link">
            <span className="material-symbols-outlined">
              {" "}
              social_leaderboard{" "}
            </span>{" "}
            Ranks
          </Link>
        </li>
      </ul>
    </footer>
  );
}

export default MobileFooter;
