import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "../css/profile.module.css";
import profile from "../img/placeholder-profile.png";
import { useSpring, animated } from "react-spring";

const Profile = ({ username }) => {
  // Visual page animation effects
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });
  // End of visual effects

  // Retrieves the logged in user's username
  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await axios.get(
          `https://healthify-server.vercel.app/users/${localStorage.getItem("username")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const username = response.data.username;
        console.log("Logged in user's name:", username);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchUserName();
  }, []);
  // End of username retrieval

  // Retrieves logged in user's data
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState({
    username: "",
    email: "",
    phone: "",
    age: "",
    height: "",
    weight: "",
  });

  const userEmail = localStorage.getItem("email");
  const userID = localStorage.getItem("username");
  const [image, setImage] = useState();
  const [pfp, setPfp] = useState();

  // Function to fetch user data
  async function fetchUserData() {
    try {
      const response = await axios.get(
        `https://healthify-server.vercel.app/users/${localStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserInfo(response.data);
      const phoneNumber = response.data.phoneNumber;
      // Sets retrieved phone number as an initial value for state variable 'data'
      setPfp(response.data.imageURL);
      setData((prevData) => ({
        ...prevData,
        phoneNumber: phoneNumber,
        age: response.data.userStats[0].age,
        height: response.data.userStats[0].height,
        weight: response.data.userStats[0].weight,
        foodPref: response.data.userStats[0].foodPref,
        foodRes: response.data.userStats[0].foodRes,
        // workoutPref: response.data.userStats[0].workoutPref,
        // workoutRes: response.data.userStats[0].workoutRes,
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
    foodPref: "",
    foodRes: "",
    // workoutPref: "",
    // workoutRes: "",
  });

  // useState hook variables for displaying the edit modal
  const [showModal, setShowModal] = useState(false);

  // useState hook variables for displaying the alert
  const [showAlert, setShowAlert] = useState(false);

  // Click event handler for saving the profile changes
  const handleChange = ({ currentTarget: input }) => {
    // Input is saved into the data array
    setData({ ...data, [input.name]: input.value });

    // Clears error message on change
    setError({ ...error, [input.name]: "" });
  };

  // useEffect hook to handle image uploads
  useEffect(() => {
    if (image) {
      handleImageUpload();
    }
  }, [image]);
  // End of image upload

  // Allows the user to change their profile picture
  const handleImageChange = ({ currentTarget: input }) => {
    setPfp(URL.createObjectURL(input.files[0]));
    setImage(input.files[0]);
    console.log(input.files[0]);
  };

  // Executes the image upload to store the URL in the database
  const handleImageUpload = async () => {
    try {
      let imageURL = "";
      console.log(image);
      if (image) {
        console.log("Inside image upload");
        console.log(image);
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "healthify-app");
        console.log(formData);
        const dataRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dqhi5isl1/image/upload",
          formData
        );
        imageURL = dataRes.data.url;
        console.log("******" + imageURL);

        const submitPost = {
          image: imageURL,
        };
        await axios.post(
          `https://healthify-server.vercel.app/pfp/${localStorage.getItem("username")}`,
          submitPost
        );
      } else {
        console.log("Error with image upload");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect hook to close the modal after 3 seconds of saving the changes
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

  // Saves the user's profile changes
  const handleSaveChanges = async (event) => {
    event.preventDefault();

    // Regex for validating email format
    var emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Regex for validating phone format
    var phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

    var usernameValid = true;
    var emailValid = true;
    var phoneValid = true;
    var ageValid = true;
    var heightValid = true;
    var weightValid = true;

    // Checks to see if username that was input is a minimum of 3 characters
    if (data["username"].length < 3) {
      setError((error) => ({
        ...error,
        username: "Username must be a minimum of 3 characters.",
      }));
      usernameValid = false;
    }

    // Checks email formatting
    if (!emailRegex.test(data["email"])) {
      setError((error) => ({ ...error, email: "Email must be valid." }));
      emailValid = false;
    }

    // Validates phone formatting
    if (!phoneRegex.test(data["phoneNumber"])) {
      setError((error) => ({
        ...error,
        phone: "Phone number must follow the format (000) 000-0000",
      }));
      phoneValid = false;
    }

    // Age validation
    if (data["age"] <= 0) {
      setError((error) => ({ ...error, age: "Please enter a valid age." }));
      ageValid = false;
    }

    // Height validation
    if (data["height"] <= 0) {
      setError((error) => ({
        ...error,
        height: "Please enter a valid height.",
      }));
      heightValid = false;
    }

    // Weight validation
    if (data["weight"] <= 0) {
      setError((error) => ({
        ...error,
        weight: "Please enter a valid weight.",
      }));
      weightValid = false;
    }

    if (
      !usernameValid ||
      !emailValid ||
      !phoneValid ||
      !ageValid ||
      !heightValid ||
      !weightValid
    ) {
      console.log(error);
      return;
    }

    try {
      const url = `https://healthify-server.vercel.app/profile/${localStorage.getItem(
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

  // useState hook variables for the user's friends
  const [friends, setFriends] = useState([]);

  // Retrieves the logged in user's friends from the database
  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        `https://healthify-server.vercel.app/leaderboard/${localStorage.getItem("username")}`
      );
      console.log(response.data);
      setFriends(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect hook for calling fetchFriends
  useEffect(() => {
    fetchFriends();
  }, []);
  // End of user's friends retrieval

  // Sorts the list of friends by alphabetical order
  const sortedFriends = friends.sort((a, b) => {
    const usernameA = a.username || "";
    const usernameB = b.username || "";
    return usernameA.localeCompare(usernameB);
  });

  // useState hook variables for the info modal
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
        id="infoModal"
        tabIndex="-1"
        aria-labelledby="infoModalLabel"
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
                id="infoModalLabel"
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
                To remove a friend, click on their username and confirm the
                removal.
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

  // useState hook variables for the delete friend modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to delete a friend
  const deleteFriend = async (friendId) => {
    try {
      const username = localStorage.getItem("username");
      console.log("Friend's ID:", friendId);
      console.log("Logged in user's ID", username);

      await axios.delete(`https://healthify-server.vercel.app/profile/${friendId}`, {
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

  // Beginning of delete friend modal component
  const DeleteFriendModal = () => {
    const handleRemoveFriend = async () => {
      window.alert("Friend removed successfully!");
      try {
        const friendId = selectedUser._id;
        await deleteFriend(friendId);
        // Alert popup to yield closure for removing a friend

        closeModal();
        fetchFriends();
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
                id="deleteFriendModalLabel"
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

  // useState hook variables for the user's challenges
  const [challenges, setChallenges] = useState([]);

  // useEffect hook to retrieve the user's challenges from the database
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        console.log("Logged in user's name:", localStorage.getItem("username"));
        const response = await axios.get(
          `https://healthify-server.vercel.app/profile/${localStorage.getItem("username")}`
        );
        console.log(response.data);
        setChallenges(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChallenges();
  }, [localStorage.getItem("username")]);
  // End of user's challenges retrieval

  // useState hook variables to add challenges
  const [userChallenges, setUserChallenges] = useState([]);

  // useEffect hook to get logged in user's challenge's from localStorage
  useEffect(() => {
    // Get user challenges from localstorage on component mount
    const challenges = getUserChallengesFromStorage();
    setUserChallenges(challenges);
  }, []);

  // Function to get user challenges from localStorage
  function getUserChallengesFromStorage() {
    const userChallengesString = localStorage.getItem("userChallenges");
    if (userChallengesString) {
      return JSON.parse(userChallengesString);
    }
    return [];
  }

  // useState hook variables to apply the points
  const [userPoints, setUserPoints] = useState(0);

  // Function to handle completing a challenge
  const handleCompleteChallenge = async (challengeId, points) => {
    try {
      console.log("handleDoneClick called with challengeId:", challengeId);
      console.log("Points:", points);
      console.log("User's current points balance:", userPoints);

      // Adds the challenge points to the user's points balance in the database
      await axios.put(
        `https://healthify-server.vercel.app/users/${localStorage.getItem("username")}`,
        { points: points, challengeId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Remove the challenge from the user's "challenges" array
      setUserChallenges((prevUserChallenges) =>
        prevUserChallenges.filter((id) => id !== challengeId)
      );

      // Remove the challenge from the user's "challenges" array in the database
      await axios.delete(
        `https://healthify-server.vercel.app/home/challenges/${localStorage.getItem(
          "username"
        )}/${challengeId}`
      );

      // Remove the challenge from localStorage
      const storedChallenges = getUserChallengesFromStorage();
      const updatedChallenges = storedChallenges.filter(
        (id) => id !== challengeId
      );
      localStorage.setItem("userChallenges", JSON.stringify(updatedChallenges));

      console.log("Challenge completed and points added!");
      window.alert("Challenge completed and points added!");
    } catch (error) {
      console.error("Error occurred while completing challenge:", error);
    }
    fetchUserData();
  };

  // Click event handler for completing a challenge
  const handleDoneClick = (challengeId, points) => {
    // Update the user's points in the database
    handleCompleteChallenge(challengeId, points);

    // Remove the completed challenge from the challenges array
    setChallenges((prevChallenges) =>
      prevChallenges.filter((challenge) => challenge._id !== challengeId)
    );
  };

  // Function to remove the challenge
  const handleRemoveChallenge = async (challengeId) => {
    try {
      await axios.delete(
        `https://healthify-server.vercel.app/home/challenges/${localStorage.getItem(
          "username"
        )}/${challengeId}`
      );
      // Update the challenges state by filtering out the removed challenge
      setChallenges((prevChallenges) =>
        prevChallenges.filter((challenge) => challenge._id !== challengeId)
      );
      // Remove challenge from localStorage
      const storedChallenges = getUserChallengesFromStorage();
      const updatedChallenges = storedChallenges.filter(
        (id) => id !== challengeId
      );
      localStorage.setItem("userChallenges", JSON.stringify(updatedChallenges));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <animated.div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.profileBody}`}
      style={fadeIn}
    >
      <div className={styles.cardContainer}>
        <div className={`${styles.profileCard}`}>
          <div className={`card-body ${styles.profileInnerCard}`}>
            <div className="d-flex flex-column align-items-center text-center">
              <div className={`${styles.profileImage} profile-image`}>
                <img
                  className={`rounded-circle`}
                  src={pfp ? pfp : profile}
                  alt="Profile Image"
                  id="profile-picture"
                />
                <label htmlFor="img-upload">
                  <i className="fa fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="img-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className={`mt-3 ${styles.profileInfo}`}>
                <div className={`${styles.profileItem} email`}>
                  <h5 className={styles.profileHeader}>Username</h5>
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
                  className={`btn btn-primary ${styles.editProfileBtn}`}
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
          <div className={`${styles.friendsInnerCard}`}>
            <div
              className={`d-flex flex-column align-items-center text-center ${styles.friendsList}`}
            >
              <div className={styles.friendsHeader}>
                <h1>
                  Friends List
                  <a
                    className={`${styles.icon} ${styles.infoLink} material-symbols-outlined`}
                    onClick={openInfoModal}
                  >
                    info
                  </a>
                </h1>
              </div>
              {sortedFriends.map((friend, index) => (
                <div className={styles.friends} key={index}>
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

          <div className={`${styles.challengeInnerCard}`}>
            <div
              className={`d-flex flex-column align-items-center text-center ${styles.friendsList}`}
            >
              <div>
                <h1 className={styles.challengesHeader}>Active Challenges</h1>
              </div>

              {challenges.length > 0 ? (
                <div>
                  {challenges.map((challenge) => (
                    <div key={challenge._id} className={styles.challengeItem}>
                      <div className={styles.challengeBackground}>
                        <h6 className={styles.challengeDesc}>
                          {challenge.challenge}
                        </h6>
                        <h6 className={styles.challengePoints}>
                          Points: {challenge.points}
                        </h6>
                      </div>
                      <div className={styles.buttonContainer}>
                        <button
                          id={`doneButton_${challenge._id}`}
                          className={`btn btn-success ${styles.challengeBtn}`}
                          onClick={() => {
                            handleDoneClick(challenge._id, challenge.points);
                          }}
                        >
                          Done
                        </button>
                        <button
                          className={`btn btn-primary ${styles.clearBtn}`}
                          onClick={() => handleRemoveChallenge(challenge._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.challengeDesc}>No challenges found.</p>
              )}
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
            <InfoModal closeModal={() => setShowInfoModal(false)} />
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
                  />
                  {error && (
                    <span className={`${styles.errorMessage}`}>
                      {error.username}
                    </span>
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
                  {error && (
                    <span className={`${styles.errorMessage}`}>
                      {error.email}
                    </span>
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
                  {error && (
                    <span className={`${styles.errorMessage}`}>
                      {error.phone}
                    </span>
                  )}
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
                  {error && (
                    <span className={`${styles.errorMessage}`}>
                      {error.age}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="phoneInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Height (m)
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
                  {error && (
                    <span className={`${styles.errorMessage}`}>
                      {error.height}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="phoneInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Weight (kg)
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
                  {error && (
                    <span className={`${styles.errorMessage}`}>
                      {error.weight}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="foodPrefInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Food Preferences
                  </label>
                  <select
                    className="form-select"
                    id="foodPrefInput"
                    name="foodPref"
                    value={data.foodPref}
                    onChange={handleChange}
                  >
                    <option value="">Select an option</option>
                    <option value="None">None</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Pescatarian">Pescatarian</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Paleo">Paleo</option>
                    <option value="Keto">Keto</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="foodResInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Food Restrictions
                  </label>
                  <select
                    className="form-select"
                    id="foodResInput"
                    name="foodRes"
                    value={data.foodRes}
                    onChange={handleChange}
                  >
                    <option value="">Select an option</option>
                    <option value="None">None</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Wheat Allergy">Wheat Allergy</option>
                    <option value="Lactose Intolerant">
                      Lactose Intolerant
                    </option>
                    <option value="Fish Allergy">Fish Allergy</option>
                    <option value="Kosher">Kosher</option>
                    <option value="Shellfish Allergy">Shellfish Allergy</option>
                    <option value="Nut Allergy">Nut Allergy</option>
                    <option value="Soy Allergy">Soy Allergy</option>
                  </select>
                </div>
                {/* <div className="mb-3">
                  <label
                    htmlFor="workoutPrefInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Workout Preferences
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="workoutPrefInput"
                    name="workoutPref"
                    value={data.workoutPref}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="workoutResInput"
                    className={`form-label ${styles.formLabel}`}
                  >
                    Workout Restrictions
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="workoutResInput"
                    name="workoutRes"
                    value={data.workoutRes}
                    onChange={handleChange}
                  />
                </div> */}
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
                    className={`btn btn-primary ${styles.saveProfileBtn}`}
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Profile;
