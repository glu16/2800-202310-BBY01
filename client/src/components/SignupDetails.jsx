import React from "react";

import styles from "../css/signupDetails.module.css";

function SignupDetails() {

async function saveUserStats() {
    const email = localStorage.getItem("email");
    const response = await fetch(`http://localhost:5050/signupdetails/${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  }




  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
saveUserStats();
      // window.location = "";
    } catch (error) {
      //ERROR IS CAUGHT HERE
      console.log(error.response.data);
    }
  };





  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.detailsContainer}`}
    >
      <div className={`card ${styles.signupCard}`}>
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 id={styles.detailsLabel}>Details</h1>
            <form id={styles.signupDetails} onSubmit={handleSubmit}>
              <div className={styles.radioInput}>
                <label htmlFor="gender">Male</label>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  className={`user-input ${styles.userInput}`}
                  value="Male"
                  required
                />
                <label htmlFor="gender">Female</label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  className={`user-input ${styles.userInput}`}
                  value="Female"
                  required
                />
              </div>

              <label htmlFor="age"></label>
              <input
                type="number"
                id="age"
                name="age"
                className={`user-input ${styles.userInput}`}
                placeholder="Age"
                min="0"
                max="99"
                required
              />

              <label htmlFor="height"></label>
              <input
                type="number"
                step="any"
                id="heightInput"
                name="height"
                className={`user-input ${styles.userInput}`}
                placeholder="Height (m)"
                required
              />

              <label htmlFor="weight"></label>
              <input
                type="number"
                step="any"
                id="weightInput"
                name="weight"
                className={`user-input ${styles.userInput}`}
                placeholder="Weight (kg)"
                required
              />
              <label htmlFor="activityLevel"></label>
              <select
              defaultValue={"Activity Level"}
                type="select"
                id={styles.activityLevel}
                name="activityLevel"
                className={`user-input ${styles.userInput}`}
                required
              >
                <option disabled >
                  Activity Level
                </option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
                <option value="Extremely Active">Extremely Active</option>
              </select>

              <label htmlFor="goal"></label>
              <select
                defaultValue={"Fitness Goals"}
                type="select"
                id={styles.fitnessGoals}
                name="goal"
                className={`user-input ${styles.userInput}`}
                required
              >
                <option disabled >
                  Fitness Goals
                </option>
                <option value="Losing weight">Losing weight</option>
                <option value="Gain muscle">Gain muscle</option>
                <option value="Maintain Figure">Maintain figure</option>
              </select>
              <label htmlFor="submit-btn"></label>
              <input
                type="submit"
                id={styles.submitBtn}
                name="submit"
                value="Sign Up"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupDetails;
