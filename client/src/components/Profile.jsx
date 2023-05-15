import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "../css/profile.module.css";
import profile from "../img/placeholder-profile.png";

const Profile = ({ username }) => {
  // Retrieves the logged in user's username
  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await axios.get(
          `http://localhost:5050/users/${localStorage.getItem("username")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const username = response.data.username;
        console.log("Logged in user's name:", username);
        localStorage.setItem("username", username);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchUserName();
  }, []);
  // End of username retrieval

  // Retrieves logged in user's data
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("email");
  const userID = localStorage.getItem("username");

  // Function to fetch user data
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
  useEffect(() => {
    fetchUserData();
  }, []);
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
        body.removeAttribute("style");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    // Regex for validating email format
    var emailReg =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Checks to see if username that was input is a minimum of 3 characters
    if (data["username"].length < 3) {
      setError("Username must be a minimum of 3 characters.");
      return;
    }
    // Checks email formatting
    if (!emailReg.test(data["email"])) {
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
      console.log(data.age);
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

  // Sorts the list of friends by alphabetical order
  const sortedFriends = friends.sort((a, b) =>
    a.username.localeCompare(b.username)
  );

  // useState hook variable for the info modal
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Info modal open handler
  const openInfoModal = () => {
    setShowInfoModal(true);
  };

  // Info modal close handler
  const closeInfoModal = () => {
    setShowInfoModal(false);
  };

// Beginning of info modal component
  const InfoModal = () => {
    return (
      <div
        className={showInfoModal ? `modal fade show` : `modal fade`}
        id="deleteFriendModal"
        tabIndex="-1"
        aria-labelledby="deleteFriendModalLabel"
        aria-hidden="false"
        style={{ display: showInfoModal ? "block" : "none" }}
        role={showInfoModal ? "dialog" : ""}
        aria-modal={showInfoModal ? "true" : "false"}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className={`modal-title ${styles.formLabel}`}
                id="addFriendModalLabel"
              >
                Information
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeInfoModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                To delete a friend, click on their username and confirm the
                deletion.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={`btn btn-primary ${styles.modalBtn}`}
                onClick={closeInfoModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // End of info modal component

  // useState hook variables for deleting a friend
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to delete a friend
  const deleteFriend = async (friendId) => {
    try {
      const username = localStorage.getItem("username");
      console.log("Friend's ID:", friendId);
      console.log("Logged in user's ID", username);

      await axios.delete(`http://localhost:5050/profile/${friendId}`, {
        data: {
          username: username,
        },
      });

      console.log("Friend removed successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  // Click event handler
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Delete friend modal close handler
  const closeModal = () => {
    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  // Alert popup to yield closure for removing a friend
  const handleClick = () => {
    window.alert("Friend removed successfully!");
    window.location.reload();
  };

  // Beginning of delete friend modal component
  const DeleteFriendModal = () => {
    const handleRemoveFriend = async () => {
      try {
        const friendId = selectedUser._id;
        await deleteFriend(friendId);
        handleClick();
        closeModal();
      } catch (error) {
        console.error(error);
      }
    };
    return (
      <div
        className={showDeleteModal ? `modal fade show` : `modal fade`}
        id="deleteFriendModal"
        tabIndex="-1"
        aria-labelledby="deleteFriendModalLabel"
        aria-hidden="false"
        style={{ display: showDeleteModal ? "block" : "none" }}
        role={showDeleteModal ? "dialog" : ""}
        aria-modal={showDeleteModal ? "true" : "false"}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className={`modal-title ${styles.formLabel}`}
                id="addFriendModalLabel"
              >
                Remove Friend
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>Do you want to remove {selectedUser.username} as a friend?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn btn-danger ${styles.modalBtn}`}
                onClick={handleRemoveFriend}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // End of delete friend modal component

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
              <h1 className={styles.friendsHeader}>
                Friends List
                <a
                  className={`${styles.icon} ${styles.infoLink} material-symbols-outlined`}
                  onClick={openInfoModal}
                >
                  info
                </a>
              </h1>
              {sortedFriends.map((friend, index) => (
                <div className={styles.friendsList} key={index}>
                  <a
                    className={styles.userNameLink}
                    onClick={() => handleUserClick(friend)}
                  >
                    {friend.username}
                  </a>
                </div>
              ))}
            </div>
          </div>
          {/* Render the DeleteFriendModal */}
          {showDeleteModal && (
            <DeleteFriendModal
              selectedUser={selectedUser}
              closeModal={() => setShowDeleteModal(false)}
            />
          )}
          {/* Render the InfoModal */}
          {showInfoModal && (
            <InfoModal closeModal={() => setShowDeleteModal(false)} />
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <div
        className={showModal ? `modal fade show` : `modal fade`}
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="false"
        style={{ display: showModal ? "block" : "none" }}
        role={showModal ? "dialog" : ""}
        aria-modal={showModal ? "true" : "false"}
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
                  {error.includes("Username") && (
                    <span className={`${styles.errorMessage}`}>{error}</span>
                  )}
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
                  {error.includes("Email") && (
                    <span className={`${styles.errorMessage}`}>{error}</span>
                  )}
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
