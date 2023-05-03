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
              <label htmlFor="diet-reminders">Diet Progress Reminders</label>
              <input type="checkbox" data-toggle="toggle"></input>
              <br />
              <label htmlFor="fitness-reminders">Fitness Progress Reminders</label>
              <input type="checkbox" data-toggle="toggle"></input>
              <br />
              <label htmlFor="fitness-reminders">Leaderboard Reminders</label>
              <input type="checkbox" data-toggle="toggle"></input>
              <br />
              <label htmlFor="fitness-reminders">Mini-challenge Releases</label>
              <input type="checkbox" data-toggle="toggle"></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
