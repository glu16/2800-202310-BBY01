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
              <div class="form-check form-switch">
<<<<<<< HEAD
              <label htmlFor="diet-reminders">Diet Progress Reminders</label>
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                ></input>
              </div>
              <br />
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                ></input>
                <label htmlFor="fitness-reminders">Fitness Progress Reminders</label>
                <label
                  htmlFor="fitness-reminders"
                  className="form-switch-label"
                >
                  Fitness Progress Reminders
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckChecked"
                  ></input>
                </label>
              </div>
              <br />
              <div class="form-check form-switch">
              <label htmlFor="leaderboard-reminders">Leaderboard Reminders</label>
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                ></input>
              </div>
              <br />
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                ></input>
                <label htmlFor="challenge-reminders">Mini Challenge Reminders</label>
=======
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
>>>>>>> Gin_Lu_Settings
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
