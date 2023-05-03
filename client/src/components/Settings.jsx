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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
