import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../css/navfooter.css";

function NavbarAfterLogin() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand" onClick={handleNavClose}>
          Healthify
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={setIsNavOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link to="/fitness" className="nav-link" onClick={handleNavClose}>
              <span className="material-symbols-outlined"> vital_signs </span>{" "}
              Fitness
            </Link>
            <Link to="/diet" className="nav-link" onClick={handleNavClose}>
              <span className="material-symbols-outlined"> nutrition </span>{" "}
              Diet
            </Link>
            <Link to="/leaderboard" className="nav-link" onClick={handleNavClose}>
              <span className="material-symbols-outlined"> leaderboard </span>{" "}
              Ranks
            </Link>
            <Link to="/calendar" className="nav-link" onClick={handleNavClose}>
              <span className="material-symbols-outlined"> calendar_month </span>{" "}
              Calendar
            </Link>
            <Link to="/profile" className="nav-link" onClick={handleNavClose}>
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
