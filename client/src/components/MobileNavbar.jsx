import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../css/navfooter.css";

function MobileNavbar() {
  // useState hook variables for opening the navbar
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Click event handler to close the toggle menu dropdown
  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  // Removes the user's token and logs them out
  function logout() {
    sessionStorage.removeItem("token");
    window.location.href = "/index";
  }

  return (
    <footer className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid nav-dropdown">
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
        <div
          className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
          id="navbarNavAltMarkup"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="material-symbols-outlined">
                  {" "}
                  account_circle
                </span>{" "}
                Account
              </a>
              <ul
                className="dropdown-menu custom-dropdown-menu"
                aria-labelledby="navbarDropdown"
              >
                <Link
                  to="/profile"
                  className="nav-link"
                  onClick={handleNavClose}
                >
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>{" "}
                  Profile
                </Link>
                <Link
                  to="/calendar"
                  className="nav-link"
                  onClick={handleNavClose}
                >
                  <span className="material-symbols-outlined">
                    calendar_month
                  </span>{" "}
                  Calendar
                </Link>
                <Link
                  to="/settings"
                  className="nav-link"
                  onClick={handleNavClose}
                >
                  <span className="material-symbols-outlined">settings</span>{" "}
                  Settings
                </Link>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/index" className="nav-link" onClick={logout}>
                <span className="material-symbols-outlined"> logout </span> Log
                out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default MobileNavbar;
