import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../css/profile.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSaveChanges = () => {};

  return (
    <div>
      <div>
        <div className="container">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <div className="profile-image">
                  <img
                    className="img-profile"
                    src="/img/placeholder-profile.png"
                    alt="Profile Image"
                    id="profile-picture"
                  />
                  <label htmlFor="img-upload">
                    <i className="fa fa-camera"></i>
                  </label>
                  <input type="file" id="img-upload" />
                </div>
                <div className="mt-3">
                <div className="email">
                    <h5>Name</h5>
                    <p>
                      <span id="name-goes-here">{name}</span>
                    </p>
                  </div>
                  <div className="email">
                    <h5>Email</h5>
                    <p>
                      <span id="email-goes-here">{email}</span>
                    </p>
                  </div>
                  <div className="phone">
                    <h5>Phone</h5>
                    <p>
                      <span id="phone-goes-here">{phone}</span>
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Edit Profile
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="profile-form">
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneInput" className="form-label">
                    Phone
                  </label>
                  <input
                    type="phone"
                    className="form-control"
                    id="phoneInput"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
