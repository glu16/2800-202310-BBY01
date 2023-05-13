import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "../css/leaderboard.module.css";

const Leaderboard = () => {
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
  // End of user retrieval

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const addFriend = async (userId) => {
    try {
      await axios.post("", { userId });
      console.log("Friend added successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const FriendRequestModal = () => {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Friend Request</h2>
          </div>
          <div className={styles.modalBody}>
            <p>
              Do you want to send a friend request to {selectedUser.firstName}?
            </p>
          </div>
          <div className={styles.modalFooter}>
            <button onClick={() => addFriend(selectedUser.userId)}>
              Send Request
            </button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

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
                    {user.firstName}
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
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.points}</td>
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
      {showModal && <FriendRequestModal />}
    </div>
  );
};

export default Leaderboard;
