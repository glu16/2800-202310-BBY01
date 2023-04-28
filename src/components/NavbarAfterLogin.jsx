import React from "react";
import { Link } from "react-router-dom";

import "../css/navfooter.css";

function NavbarAfterLogin() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="logo.png" title="Logo" alt="Logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link to="/fitness" className="nav-link">
              <span className="material-symbols-outlined"> vital_signs </span>{" "}
              Fitness
            </Link>
            <Link to="/diet" className="nav-link">
              <span className="material-symbols-outlined"> nutrition </span>{" "}
              Diet
            </Link>
            <Link to="/leaderboard" className="nav-link">
              <span className="material-symbols-outlined"> leaderboard </span>{" "}
              Ranks
            </Link>
            <Link to="/profile" className="nav-link">
              <span className="material-symbols-outlined"> account_circle</span>{" "}
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAfterLogin;
