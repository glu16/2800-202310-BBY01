import React from "react";

import "../css/signupDetails.css";

function SignUp() {
  return (
    <div className="container detailsContainer">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 id="detailsLabel">Details</h1>
            <form id="signupDetails">
              <div class="radioInput">
                <label htmlFor="sex">Male</label>
                <input
                  type="radio"
                  id="male"
                  name="sex"
                  className="user-input"
                  value="Male"
                  required
                />
                <label htmlFor="sex">Female</label>
                <input
                  type="radio"
                  id="female"
                  name="sex"
                  className="user-input"
                  value="Female"
                  required
                />
              </div>

              <label htmlFor="ageInput"></label>
              <input
                type="number"
                id="age"
                name="ageInput"
                className="user-input"
                placeholder="Age"
                min="0"
                max="99"
                required
              />

              <label htmlFor="heightInput"></label>
              <input
                type="number"
                step="any"
                id="heightInput"
                name="heightInput"
                className="user-input"
                placeholder="Height (m)"
                required
              />

              <label htmlFor="weightInput"></label>
              <input
                type="number"
                step="any"
                id="weightInput"
                name="weightInput"
                className="user-input"
                placeholder="Weight (kg)"
                required
              />
              <label htmlFor="activityLevel"></label>
              <select
                type="select"
                id="activityLevel"
                name="activityLevel"
                className="user-input"
                required
              >
                <option value="" disabled selected>Activity Level</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
                <option value="Extremely Active">Extremely Active</option>
              </select>

            
            <label htmlFor="fitnessGoals"></label>
              <select
                type="select"
                id="fitnessGoals"
                name="fitnessGoals"
                className="user-input"
                required
              >
                <option value="" disabled selected>Fitness Goals</option>
                <option value="Losing weight">Losing weight</option>
                <option value="Gain muscle">Gain muscle</option>
                <option value="Maintain Figure">Maintain figure</option>
              </select>
              <label htmlFor="submit-btn"></label>
              <input type="submit" id="submit-btn" value="Submit" />
            </form>
            <p>
              Already have an account? <a href="/login"> Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
