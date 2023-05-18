import React, { useState } from "react";
import axios from "axios";

import styles from "../css/settings.module.css";

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    dietReminders: false,
    fitnessReminders: false,
    leaderboardReminders: false,
    challengeReminders: false,
  });

  const saveNotificationSettings = async () => {
    try {
      const username = localStorage.getItem("username");
      await axios.post(`http://localhost:5050/settings/${username}`, notificationSettings);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.settingsContainer}`}
    >
      <div className={`${styles.settingsCard}`}>
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <div className={styles.settings}>
              <h1 className={styles.settingsHeader}>Notification Preferences</h1>
              <div className="form-check form-switch">
                <label htmlFor="diet-reminders" className="form-switch-label">
                  Diet Progress Reminders
                  <input
                    className="form-check-input"
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
              <div className="form-check form-switch">
                <label
                  htmlFor="fitness-reminders"
                  className="form-switch-label"
                >
                  Fitness Progress Reminders
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="diet-reminders"
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
              <div className="form-check form-switch">
                <label
                  htmlFor="leaderboard-reminders"
                  className="form-switch-label"
                >
                  Leaderboard Reminders
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="diet-reminders"
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
              <div className="form-check form-switch">
                <label
                  htmlFor="challenge-reminders"
                  className="form-switch-label"
                >
                  Mini Challenge Reminders
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="diet-reminders"
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

export default Settings;
