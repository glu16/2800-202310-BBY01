import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "../css/profile.module.css";
import profile from "../img/placeholder-profile.png";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const userEmail = localStorage.getItem("email");

  /* Retrieves logged in user's data */
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/${localStorage.getItem("email")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const firstName = response.data.firstName;
        setUserName(firstName);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, []);
  /* End of user data retrieval */

  const handleSaveChanges = () => {};

  return (
    <div
      className={`${styles.profileContainer} d-flex justify-content-center align-items-center h-100`}
    >
      <div className={`card ${styles.card}`}>
        <div className={`card-body ${styles.cardBody}`}>
          <div className="d-flex flex-column align-items-center text-center">
            <div className={`${styles.profileImage} profile-image`}>
              <img
                className={`${styles.imgProfile}`}
                src={profile}
                alt="Profile Image"
                id="profile-picture"
              />
              <label htmlFor="img-upload">
                <i className="fa fa-camera"></i>
              </label>
              <input type="file" id="img-upload" />
            </div>
            <div className={`mt-3 ${styles.profileInfo}`}>
              <div className={`${styles.profileItem} email`}>
                <h5 className={styles.subtitle}>Name</h5>
                <p>
                  <span id="name-goes-here">{userName}</span>
                </p>
              </div>
              <div className={`${styles.profileItem} email`}>
                <h5 className={styles.profileTitle}>Email</h5>
                <p>
                  <span id="email-goes-here">{userEmail}</span>
                </p>
              </div>
              <div className={`${styles.profileItem} phone`}>
                <h5 className={styles.subtitle}>Phone</h5>
                <p>
                  <span id="phone-goes-here"></span>
                </p>
              </div>
              <button
                className={`btn btn-primary ${styles.editProfileButton}`}
                data-bs-toggle="modal"
                data-bs-target="#editModal"
              >
                Edit Profile
              </button>
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
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
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
                    value={userEmail}
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
                    value=""
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
