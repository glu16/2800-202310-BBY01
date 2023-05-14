import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "../css/leaderboard.module.css";

const Leaderboard = () => {
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

  // Retrieves users from the database
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/leaderboard/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);
  // End of users retrieval

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

  // Displays the friend request modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const addFriend = async (friendUsername) => {
    try {
      const username = localStorage.getItem("username");
      console.log("Specified user's name:", friendUsername);
      console.log("Logged in user's name:", username);

      await axios.post(`http://localhost:5050/leaderboard/${friendUsername}`, {
        username: username,
        friendUsername: friendUsername,
      });

      console.log("Friend added successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  // Click event handler
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Modal close handler
  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  // Alert popup to yield closure
  const handleClick = () => {
    window.alert("Friend added successfully!");
  };

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
                  handleClick();
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
  // End of friend request modal

  // Allows users to switch between global and local leaderboards
  const [activeTab, setActiveTab] = useState("global");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderLeaderboard = () => {
    if (activeTab === "global") {
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
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
                  {" "}
                  <a
                    className={styles.userNameLink}
                    onClick={() => handleUserClick(user)}
                  >
                    {user.username}
                  </a>
                </td>
                <td>{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (activeTab === "local") {
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
            {friends.map((friend, index) => (
              <tr key={friend._id}>
                <td>{index + 1}</td>
                <td>{friend.username}</td>
                <td>{friend.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };
  // End of global to local leaderboard switch

  return (
    <div className={styles.cardWrapper}>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.ranksCard}`}
      >
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 className={styles.ranksHeader}>Leaderboard Ranks</h1>
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
                  activeTab === "local" ? styles.active : ""
                }`}
                onClick={() => handleTabChange("local")}
              >
                Local Leaderboard
              </button>
            </div>
            {renderLeaderboard()}
          </div>
        </div>
      </div>
      {/* Render the FriendRequestModal */}
      {showModal && <AddFriendModal />}
    </div>
  );
};

export default Leaderboard;
