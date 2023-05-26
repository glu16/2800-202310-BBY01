// Import statements
import React, { useState } from "react";
import SignupPrefRes from "./SignupPrefRes";
import axios from "axios";

// CSS module import statement
import styles from "../css/signupDetails.module.css";

function SignupDetails() {
  // useState hook variables for users to input their information
  const [data, setData] = useState({
    sex: "",
    age: 0,
    height: 0,
    weight: 0,
    activityLevel: "",
    goal: "",
  });

  // useState hook variables for the user's preferences
  const [showPreferences, setShowPreferences] = useState(false);

  // useState hook variables for throwing errors
  const [error, setError] = useState("");

  // Allows the user to submit their information to the database
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:5050/signupdetails/${localStorage.getItem(
        "username"
      )}`;
      const { data: res } = await axios.post(url, data);
      setShowPreferences(true);
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  // Saves the user's inputted information
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // Renders SignupDetails.jsx component
  return (
    <>
      {showPreferences ? (
        <SignupPrefRes />
      ) : (
        <div className={`card-body ${styles.signupCard}`}>
          <h1 id={styles.detailsHeader}>Details</h1>
          <form id={styles.signupDetails} onSubmit={handleSubmit}>
            <div className={`${styles.radioInput}`}>
              <label htmlFor="male">Male</label>
              <input
                type="radio"
                id="male"
                name="sex"
                className={`user-input form-check-input ${styles.userInput}`}
                value="Male"
                onChange={handleChange}
                required
              />
              <label htmlFor="female">Female</label>
              <input
                type="radio"
                id="female"
                name="sex"
                className={`user-input form-check-input ${styles.userInput}`}
                value="Female"
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="number"
              id="age"
              name="age"
              className={`user-input ${styles.userInput}`}
              min="0"
              max="99"
              value={0 ? data.weight : null}
              onChange={handleChange}
              required
            />
            <label htmlFor="age" className={`${styles.inputLabel}`}>
              <span className={`${styles.inputName} ${styles.agePlaceholder}`}>
                Age
              </span>
            </label>
            <input
              type="number"
              step="any"
              id="heightInput"
              name="height"
              className={`user-input ${styles.userInput}`}
              min="0"
              max="4"
              value={0 ? data.weight : null}
              onChange={handleChange}
              required
            />
            <label htmlFor="heightInput" className={`${styles.inputLabel}`}>
              <span
                className={`${styles.inputName} ${styles.heightPlaceholder}`}
              >
                Height (m){" "}
              </span>
            </label>
            <label htmlFor="weight"></label>
            <input
              type="number"
              step="any"
              id="weightInput"
              name="weight"
              min="10"
              max="250"
              className={`user-input ${styles.userInput}`}
              value={0 ? data.weight : null}
              onChange={handleChange}
              required
            />
            <label htmlFor="weightInput" className={`${styles.inputLabel}`}>
              <span className={`${styles.inputName}`}>Weight (kg)</span>
            </label>
            <label htmlFor="activityLevel"></label>
            <select
              defaultValue={"Activity Level"}
              type="select"
              id={styles.activityLevel}
              name="activityLevel"
              className={`user-input ${styles.userInput}`}
              onChange={handleChange}
              required
            >
              <option disabled>Activity Level</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Lightly Active">Lightly Active</option>
              <option value="Moderately Active">Moderately Active</option>
              <option value="Very Active">Very Active</option>
              <option value="Extremely Active">Extremely Active</option>
            </select>
            <label htmlFor="goal"></label> <br />
            <select
              defaultValue={"Fitness Goals"}
              type="select"
              id={styles.fitnessGoals}
              name="goal"
              className={`user-input ${styles.userInput}`}
              required
              onChange={handleChange}
            >
              <option disabled>Fitness Goals</option>
              <option value="Lose weight">Losing weight</option>
              <option value="Gain muscle">Gain muscle</option>
              <option value="Maintain Figure">Maintain figure</option>
            </select>
            <label htmlFor="submit-btn"></label>
            <input
              type="submit"
              id={styles.submitBtn}
              name="submit"
              value="Next"
            />
          </form>
        </div>
      )}
    </>
  );
  // End of SignupDetails.jsx component
}

export default SignupDetails;
