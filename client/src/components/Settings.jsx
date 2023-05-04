import React, { useState } from "react";
import axios from "axios";

import "../css/settings.css";

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    dietReminders: false,
    fitnessReminders: false,
    leaderboardReminders: false,
    challengeReminders: false,
  });

  const saveNotificationSettings = async () => {
    try {
      await axios.post("/api/notification-settings", notificationSettings);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <div className="settings">
              <h1>Notification Preferences</h1>
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
                    checked={notificationSettings.leaderboardReminders}
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
                className="btn btn-primary btn-settings"
                onClick={saveNotificationSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
