import React from "react";
import { Link } from "react-router-dom";
import "./css/navfooter.css";

function NavbarBeforeLogin() {
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
            <Link to="/about" className="nav-link">
              <span class="material-symbols-outlined"> info </span>About Us
            </Link>
            <Link to="/contact" className="nav-link">
              <span class="material-symbols-outlined"> help </span>Contact Us
            </Link>
            <Link to="/careers" className="nav-link">
              <span class="material-symbols-outlined"> work </span>Careers
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarBeforeLogin;
