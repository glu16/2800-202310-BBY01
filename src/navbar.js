import React from 'react';
import { Link } from 'react-router-dom';
import './css/navfooter.css';

function Navbar() {
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
            <a className="nav-link" href="/fitness">
              <span className="material-symbols-outlined"> vital_signs </span> Fitness
            </a>
            <a className="nav-link" href="/diet">
              <span className="material-symbols-outlined"> nutrition </span>Diet
            </a>
            <a className="nav-link" href="/leaderboard">
              <span className="material-symbols-outlined"> leaderboard </span> Ranks
            </a>
            <a className="nav-link" href="/profile">
              <span className="material-symbols-outlined"> account_circle</span> Profile
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
