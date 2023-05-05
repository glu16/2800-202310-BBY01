import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../css/navfooter.css";

function NavbarBeforeLogin() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
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
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
          id="navbarNavAltMarkup"
        >
          <div className="navbar-nav">
            <Link to="/about" className="nav-link" onClick={handleNavClose}>
              <span className="material-symbols-outlined"> info </span>About Us
            </Link>
            <Link to="/contact" className="nav-link" onClick={handleNavClose}>
              <span className="material-symbols-outlined"> help </span>Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarBeforeLogin;
