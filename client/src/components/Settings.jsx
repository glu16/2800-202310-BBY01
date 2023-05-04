import React from "react";
import "../css/settings.css";

const Settings = () => {
  return (
    <div className="container settingsContainer">
      <div className="card h-100">
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
                    id="flexSwitchCheckChecked"
                  ></input>
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
                    id="flexSwitchCheckChecked"
                  ></input>
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
                    id="flexSwitchCheckChecked"
                  ></input>
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
                    id="flexSwitchCheckChecked"
                  ></input>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
