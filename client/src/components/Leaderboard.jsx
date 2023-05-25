import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import styles from "../css/leaderboard.module.css";
import { useSpring, animated } from "react-spring";
import pfpPlaceholder from "../img/placeholder-profile.png";

const Leaderboard = () => {
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
          `http://localhost:5050/users/${localStorage.getItem("username")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const username = response.data.username;
        // console.log("Logged in user's name:", username);
        // localStorage.setItem("username", username);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchUserName();
  }, []);
  // End of username retrieval

  // useState hook variable for all the users
  const [users, setUsers] = useState([]);

  // Retrieves users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/leaderboard/users"
        );
        const sortedUsers = response.data.sort((a, b) => b.points - a.points);
        setUsers(sortedUsers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);
  // End of users retrieval

  // useState hook variables to display the friends
  const [friends, setFriends] = useState([]);

  // Retrieves the logged in user's friends from the database
  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/leaderboard/${localStorage.getItem("username")}`
      );
      // console.log(response.data);
      setFriends(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect hook to fetchFriends
  useEffect(() => {
    fetchFriends();
  }, []);
  // End of user's friends retrieval

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
                Welcome to the Leaderboard!
                <br />
                <br />
                Here, you can discover where you stand among other users based
                on your points. Check out the global ranks to see how you
                compare with users worldwide, or explore the friend ranks to see
                how you stack up against your friends.
                <br />
                <br />
                Don't forget, you can add a user as a friend by simply clicking
                on their username.
                <br />
                <br />
                Connect with others, challenge each other, and achieve your
                goals together!
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={`btn btn-primary ${styles.modalBtn}`}
                onClick={closeInfoModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // End of info modal component

  // useState hook variables for adding a friend
  const [selectedUser, setSelectedUser] = useState(null);

  // useState hook variables for the add friend modal
  const [showModal, setShowModal] = useState(false);

  // Function to add a friend
  const addFriend = async (friendUsername) => {
    try {
      const username = localStorage.getItem("username");
      // console.log("Specified user's name:", friendUsername);
      // console.log("Logged in user's name:", username);

      if (friendUsername === username) {
        window.alert("Cannot add yourself as a friend.");
        return;
      } else {
        window.alert("Friend added successfully!");
        await axios.post(
          `http://localhost:5050/leaderboard/${friendUsername}`,
          {
            username: username,
            friendUsername: friendUsername,
          }
        );
      }
      // console.log("Done!");
      fetchFriends();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  // Click event handler
  const handleUserClick = (user) => {
    if (user.username === "Rick") {
      handleSurpriseUsernameClick();
    } else {
      setSelectedUser(user);
      setShowModal(true);
    }
  };

  // Add friend modal close handler
  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  // Beginning of add friend modal component
  const AddFriendModal = () => {
    return (
      <div
        className={showModal ? `modal fade show` : `modal fade`}
        id="addFriendModal"
        tabIndex="-1"
        aria-labelledby="addFriendModalLabel"
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
                id="addFriendModalLabel"
              >
                Add Friend
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
              <p>Do you want to add {selectedUser.username} as a friend?</p>
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
                className={`btn btn-primary ${styles.modalBtn}`}
                onClick={() => {
                  addFriend(selectedUser.username);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // End of add friend modal component

  // useState hook variables for the Easter Egg surprise modal
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);

  // useRef hook variable to hold the YouTube player reference
  const playerRef = useRef(null);
  const videoId = "dQw4w9WgXcQ";

  // Click event handler for the Easter Egg surprise
  const handleSurpriseUsernameClick = () => {
    setShowSurpriseModal(true);
  };

  // Easter Egg surprise modal close handler
  const closeSurpriseModal = () => {
    setShowSurpriseModal(false);
    // window.location.reload();
  };

  // Beginning of Easter Egg modal
  const EasterEggModal = () => {
    let player;
    // Creates a YouTube video API
    useEffect(() => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // Create and initialize the YouTube player when the API is ready
      window.onYouTubeIframeAPIReady = () => {
        player = new window.YT.Player(playerRef.current, {
          height: "500px",
          width: "800px",
          width: "100%",
          videoId: videoId,
          playerVars: {
            autoplay: 1,
          },
        });
      };

      return () => {
        delete window.onYouTubeIframeAPIReady;
      };
    }, []);
    // End of YouTube video API

    return (
      <div
        className={showSurpriseModal ? "modal fade show" : "modal fade"}
        id="surpriseModal"
        tabIndex="-1"
        aria-labelledby="surpriseModalLabel"
        aria-hidden="false"
        style={{ display: showSurpriseModal ? "block" : "none" }}
        role={showSurpriseModal ? "dialog" : ""}
        aria-modal={showSurpriseModal ? "true" : "false"}
      >
        <div className="modal-dialog" style={{ maxWidth: "1000px" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className={`modal-title ${styles.formLabel}`}
                id="surpriseModalLabel"
              >
                You Just Got Rick Rolled!
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeSurpriseModal}
              ></button>
            </div>
            <div className="modal-body">
              <div ref={playerRef}></div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={`btn btn-primary ${styles.modalBtn}`}
                onClick={closeSurpriseModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // End of Easter Egg modal

  // Allows users to switch between global and friend ranks
  const [activeTab, setActiveTab] = useState("global");

  // Click event handler for switching between ranks
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Beginning of global to friend leaderboard switch
  const renderLeaderboard = () => {
    if (activeTab === "global") {
      const sortedUsers = users.sort((a, b) => b.points - a.points);
      return (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td className={`${styles.names}`}>
                  {" "}
                  <a
                    className={styles.userNameLink}
                    onClick={() => handleUserClick(user)}
                  >
                    <img src={user.imageURL || pfpPlaceholder} />{" "}
                    {user.username}
                  </a>
                </td>
                <td>{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (activeTab === "friend") {
      const sortedFriends = friends.sort((a, b) => b.points - a.points);
      return (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedFriends.map((friend, index) => (
              <tr key={friend._id}>
                <td>{index + 1}</td>
                <td className={styles.names}>
                  {" "}
                  <img src={friend.imageURL || pfpPlaceholder} />{" "}
                  {friend.username}
                </td>
                <td>{friend.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };
  // End of global to friend leaderboard switch

  return (
    <div className={styles.cardWrapper}>
      <animated.div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.ranksCard}`}
        style={fadeIn}
      >
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 className={styles.ranksHeader}>
              Leaderboard Ranks{" "}
              <a
                className={`${styles.icon} ${styles.infoLink} material-symbols-outlined`}
                onClick={openInfoModal}
              >
                info
              </a>
            </h1>
            <div className={styles.tabs}>
              <button
                className={`${styles.button} ${
                  activeTab === "global" ? styles.active : ""
                }`}
                onClick={() => handleTabChange("global")}
              >
                Global Leaderboard
              </button>
              <button
                className={`${styles.button} ${
                  activeTab === "friend" ? styles.active : ""
                }`}
                onClick={() => handleTabChange("friend")}
              >
                Friends Leaderboard
              </button>
            </div>
            {renderLeaderboard()}
          </div>
        </div>
      </animated.div>
      {/* Render the FriendRequestModal */}
      {showModal && <AddFriendModal />}
      {/* Render the InfoModal */}
      {showInfoModal && (
        <InfoModal closeModal={() => setShowInfoModal(false)} />
      )}
      {/* Render the EasterEggModal */}
      {showSurpriseModal && (
        <EasterEggModal
          closeSurpriseModal={() => setShowSurpriseModal(false)}
        />
      )}
    </div>
  );
};

export default Leaderboard;
