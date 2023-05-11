import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "../css/profile.module.css";
import profile from "../img/placeholder-profile.png";

const Profile = ({ username }) => {
  /* Retrieves logged in user's data */
  const [userName, setUserName] = useState("");
  const userEmail = localStorage.getItem("email");
  const userID = localStorage.getItem("username");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `http://localhost:5050/users/${localStorage.getItem("username")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const firstName = response.data.firstName;
        setUserName(firstName);
        const phoneNumber = response.data.phoneNumber;
        setUserPhoneNumber(phoneNumber);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, []);
  /* End of user data retrieval */

  /* Retrieves logged in user's stats */
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/profile/${localStorage.getItem(
            "username"
          )}`
        );
        setUserStats(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserStats();
  }, [username]);
  /* End of user stats retrieval */

  /* Allows the user to update their profile */
  const [data, setData] = useState({
    username: `${userID}`,
    email: `${userEmail}`,
    phoneNumber: "",
    age: "",
    height: "",
    weight: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:5050/profile/${localStorage.getItem(
        "username"
      )}`;
      const { data: res } = await axios.post(url, data);
    } catch (error) {
      console.log(error);
    }
  };
  /* End of user profile update */

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.profileBody}`}
    >
      <div className={`card ${styles.profileCard}`}>
        <div className={`card-body ${styles.cardBody}`}>
          <div className="row">
            <div className="col-md-6">
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
                    <h5 className={styles.profileHeader}>Name</h5>
                    <p>
                      <span id="name-goes-here">{userName}</span>
                    </p>
                  </div>
                  <div className={`${styles.profileItem} email`}>
                    <h5 className={styles.profileHeader}>Email</h5>
                    <p>
                      <span id="email-goes-here">{userEmail}</span>
                    </p>
                  </div>
                  <div className={`${styles.profileItem} phone`}>
                    <h5 className={styles.profileHeader}>Phone</h5>
                    <p>
                      <span id="phone-goes-here">{userPhoneNumber}</span>
                    </p>
                  </div>
                  <div className={`${styles.profileItem} phone`}>
                    <h5 className={styles.profileHeader}>User Statistics</h5>
                    {userStats && (
                      <>
                        <p>Sex: {userStats[0].sex}</p>
                        <p>Age: {userStats[0].age}</p>
                        <p>Height: {userStats[0].height}m</p>
                        <p>Weight: {userStats[0].weight} kg</p>
                      </>
                    )}
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
            <div className="col-md-6">
              <div className="d-flex flex-column align-items-center text-center">
                <h1 className={styles.chatHeader}>Chat History</h1>
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
              <h5
                className={`modal-title ${styles.formLabel}`}
                id="editModalLabel"
              >
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
                  <label
                    htmlFor="nameInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="emailInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="emailInput"
                    className="form-control"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="phoneInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Phone
                  </label>
                  <input
                    type="phone"
                    className="form-control"
                    id="phoneInput"
                    name="phoneNumber"
                    value={data.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="phoneInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="ageInput"
                    name="age"
                    value={data.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="phoneInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Height
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    id="heightInput"
                    name="height"
                    value={data.height}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="phoneInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Weight
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-control"
                    id="weightInput"
                    name="weight"
                    value={data.weight}
                    onChange={handleChange}
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
