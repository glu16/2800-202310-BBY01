import React from "react";
import { Link } from "react-router-dom";

import "../css/leaderboard.css";

const Leaderboard = () => {
  return (
    <div className="container ranksContainer">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1>Leaderboard Ranks</h1>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody id="leaderboard-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
