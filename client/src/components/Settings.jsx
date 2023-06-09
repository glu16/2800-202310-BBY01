// Import statements
import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import axios from "axios";

// CSS module import statement
import styles from "../css/settings.module.css";

const Settings = () => {
  // Visual page animation effects
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });
  // End of visual page animation effects

  // useState hook variables for the notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    dietReminders: false,
    fitnessReminders: false,
    leaderboardReminders: false,
    challengeReminders: false,
  });
  const [isSaved, setIsSaved] = useState(false);

  // Saves the user's notification preferences
  const saveNotificationSettings = async () => {
    try {
      const username = localStorage.getItem("username");
      await axios.post(
        `https://healthify-enxj.onrender.com/settings/${username}`,
        notificationSettings
      );
    } catch (error) {
      console.log(error);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  // Retrieves notification settings from database
  const fetchNotificationSettings = async () => {
    try {
      const username = localStorage.getItem("username");
      const response = await axios.get(
        `https://healthify-enxj.onrender.com/settings/${username}`
      );

      // Sets retrieved settings as initial values for attributes of notifcationSettings
      setNotificationSettings((settings) => ({
        ...settings,
        dietReminders: response.data.dietReminders || false,
        fitnessReminders: response.data.fitnessReminders || false,
        leaderboardReminders: response.data.leaderboardReminders || false,
        challengeReminders: response.data.challengeReminders || false,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect hook to call fetchNotificationSettings function
  useEffect(() => {
    fetchNotificationSettings();
  }, []);
  // End of user's notifications retrieval

  // Renders Settings.jsx component
  return (
    <animated.div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.settingsContainer}`}
      style={fadeIn}
    >
      <div className={`${styles.settingsCard}`}>
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <div className={styles.settings}>
              <h1 className={styles.settingsHeader}>
                Notification Preferences
              </h1>
              <div className={styles.savedMessage}>
                {" "}
                {isSaved
                  ? "Settings were successfully saved!"
                  : "\u00a0\u00a0\u00a0"}{" "}
              </div>
              <div className={`form-check form-switch ${styles.toggleDiv}`}>
                <label htmlFor="diet-reminders" className="form-switch-label">
                  Diet Progress Reminders
                  <input
                    className={`form-check-input ${styles.remindersInput}`}
                    type="checkbox"
                    role="switch"
                    id="diet-reminders"
                    checked={notificationSettings.dietReminders}
                    onChange={(event) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        dietReminders: event.target.checked,
                      })
                    }
                  />
                </label>
              </div>
              <br />
              <div className={`form-check form-switch ${styles.toggleDiv}`}>
                <label
                  htmlFor="fitness-reminders"
                  className="form-switch-label"
                >
                  Fitness Progress Reminders
                  <input
                    className={`form-check-input ${styles.remindersInput}`}
                    type="checkbox"
                    role="switch"
                    id="fitness-reminders"
                    checked={notificationSettings.fitnessReminders}
                    onChange={(event) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        fitnessReminders: event.target.checked,
                      })
                    }
                  />
                </label>
              </div>
              <br />
              <div className={`form-check form-switch ${styles.toggleDiv}`}>
                <label
                  htmlFor="leaderboard-reminders"
                  className="form-switch-label"
                >
                  Leaderboard Reminders
                  <input
                    className={`form-check-input ${styles.remindersInput}`}
                    type="checkbox"
                    role="switch"
                    id="leaderboard-reminders"
                    checked={notificationSettings.leaderboardReminders}
                    onChange={(event) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        leaderboardReminders: event.target.checked,
                      })
                    }
                  />
                </label>
              </div>
              <br />
              <div className={`form-check form-switch ${styles.toggleDiv}`}>
                <label
                  htmlFor="challenge-reminders"
                  className="form-switch-label"
                >
                  Mini Challenge Reminders
                  <input
                    className={`form-check-input ${styles.remindersInput}`}
                    type="checkbox"
                    role="switch"
                    id="challenge-reminders"
                    checked={notificationSettings.challengeReminders}
                    onChange={(event) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        challengeReminders: event.target.checked,
                      })
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                className={`btn btn-primary ${styles.settingsBtn}`}
                onClick={saveNotificationSettings}
                disabled={isSaved}
              >
                {isSaved ? "Settings saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
  // End of Settings.jsx component
};

export default Settings;
