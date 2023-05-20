import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../css/navfooter.css";

function NavbarBeforeLogin() {
  // useState hook variables for opening the navbar
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Click event handler to close the toggle menu dropdown
  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid nav-dropdown">
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={handleNavClose}>
                <span className="material-symbols-outlined"> info </span>About
                Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarBeforeLogin;
