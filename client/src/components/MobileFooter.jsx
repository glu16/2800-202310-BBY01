import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../css/navfooter.css";

function MobileFooter() {
  /* Checks to see if the screen is in mobile view */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  /* End of mobile view function */

  function logout() {
    sessionStorage.removeItem("token");
    window.location.href = "/index";
  }

  return (
    <footer className="navbar navbar-expand-lg navbar-dark fixed-bottom">
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
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse`}
          id="navbarNavAltMarkup"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <span className="material-symbols-outlined"> home </span> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/coach" className="nav-link">
                <span className="material-symbols-outlined"> smart_toy </span>{" "}
                Coach
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/diet" className="nav-link">
                <span className="material-symbols-outlined"> nutrition </span>{" "}
                Diet
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/fitness" className="nav-link">
                <span className="material-symbols-outlined"> exercise </span>{" "}
                Fitness
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/leaderboard"
                className="nav-link"
              >
                <span className="material-symbols-outlined"> leaderboard </span>{" "}
                Ranks
              </Link>
            </li>
          </ul>
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
                >
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>{" "}
                  Profile
                </Link>
                <Link
                  to="/calendar"
                  className="nav-link"
                >
                  <span className="material-symbols-outlined">
                    calendar_month
                  </span>{" "}
                  Calendar
                </Link>
                <Link
                  to="/settings"
                  className="nav-link"
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

export default MobileFooter;
