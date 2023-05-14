import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "../css/profile.module.css";
import profile from "../img/placeholder-profile.png";

const Profile = ({ username }) => {
  // Retrieves logged in user's data
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("email");
  const userID = localStorage.getItem("username");

  // Function to fetch user data
  async function fetchUserData() {
    try {
      const response = await axios.get(
        `http://localhost:5050/users/${localStorage.getItem(
          "username"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserInfo(response.data);
      const phoneNumber = response.data.phoneNumber;
      // Sets retrieved phone number as an initial value for state variable 'data'
      setData((prevData) => ({
        ...prevData,
        phoneNumber: phoneNumber,
        age: response.data.userStats[0].age,
        height: response.data.userStats[0].height,
        weight: response.data.userStats[0].weight,
      }));
    } catch (error) {
      console.error(error.response.data);
    }
  }

  // useEffect hook to call fetchUserData function
  useEffect(() => {fetchUserData()}, []);
  /* End of user data retrieval */

  // Allows the user to update their profile
  const [data, setData] = useState({
    username: `${userID}`,
    email: `${userEmail}`,
    phoneNumber: "",
    age: "",
    height: "",
    weight: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    // Input is saved into the data array
    setData({ ...data, [input.name]: input.value });

    // Clears error message on change
    setError("");
  };

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
        setShowModal(false);
        document.querySelector(".modal-backdrop").remove();
        let body = document.querySelector("body");
        body.classList.remove("modal-open");
        body.removeAttribute('style');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    // Regex for validating email format
    var emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Checks to see if username that was input is a minimum of 3 characters
    if (data["username"].length < 3){
      setError("Username must be a minimum of 3 characters.");
      return;
    };
    // Checks email formatting
    if (!emailReg.test(data["email"])){
      setError("Email must be valid.");
      return;
    }

    try {
      const url = `http://localhost:5050/profile/${localStorage.getItem(
        "username"
      )}`;
      const { data: res } = await axios.post(url, data);

      // Updates localStorage with newly entered username
      localStorage.setItem("username", data.username);
      console.log(data.age)
      setShowModal(true);
      setShowAlert(true);
      fetchUserData();
    } catch (error) {
      console.log(error.response.data);
      //Error returned from server 
      setError(error.response.data);
    }
  };
  // End of user profile update

  // Retrieves the logged in user's friends from the database
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/leaderboard/${localStorage.getItem(
            "username"
          )}`
        );
        console.log(response.data);
        setFriends(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();
  }, []);
  // End of user's friends retrieval

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.profileBody}`}
    >
      <div className={styles.cardContainer}>
        <div className={`${styles.profileCard}`}>
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
                  <h5 className={styles.profileHeader}>Name</h5>
                  <p>
                    <span id="name-goes-here">{userID}</span>
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
                    <span id="phone-goes-here">
                      {userInfo && userInfo.phoneNumber}
                    </span>
                  </p>
                </div>
                <div className={`${styles.profileItem} phone`}>
                  <h5 className={styles.profileHeader}>User Statistics</h5>
                  {userInfo && (
                    <>
                      <p>Sex: {userInfo.userStats[0].sex}</p>
                      <p>Age: {userInfo.userStats[0].age}</p>
                      <p>Height: {userInfo.userStats[0].height}m</p>
                      <p>Weight: {userInfo.userStats[0].weight} kg</p>
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
        </div>
        <div className={`${styles.friendsCard}`}>
          <div className={`card-body ${styles.friendsBody}`}>
            <div className="d-flex flex-column align-items-center text-center">
              <h1 className={styles.friendsHeader}>Friends List</h1>
              {friends.map((friend, index) => (
                <div className={styles.friendsList} key={index}>
                  <p>{friend.username}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <div
        className={ showModal ? `modal fade show` : `modal fade`} 
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="false"
        style={{display:  showModal ? "block" : "none"}}
        role={showModal? "dialog": ""}
        aria-modal={showModal? "true" : "false"}
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
                    required
                  />
                  {error.includes("Username") && <span className={`${styles.errorMessage}`}>{error}</span>}
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
                  {error.includes("Email") && <span className={`${styles.errorMessage}`}>{error}</span>}
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
              {showAlert && (
                <div className="alert alert-success" role="alert">
                  Profile updated successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
