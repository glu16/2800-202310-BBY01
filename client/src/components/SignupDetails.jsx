import React from "react";
import { useState } from "react"; 
import axios from "axios";
import styles from "../css/signupDetails.module.css";

function SignupDetails() {
  const [data, setData] = useState({
    sex: "",
    age: 0,
    height: 0,
    weight: 0,
    activityLevel: "",
    goal: "",
  });

  const [isModified, setIsModified] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const url = `http://localhost:5050/signupdetails/${localStorage.getItem("username")}`;
    const { data: res } = await axios.post(url, data);
    window.location = "/";

    const userName = localStorage.getItem("email");
    const today = new Date().toISOString().slice(0, 10);
    const workoutKey = "workout_" + today;
    const workout = {};

    // GENERATES AND STORES WORKOUT PLAN
    const data2 = { [workoutKey]: workout };
    const workoutRequest = fetch(`http://localhost:5050/fitness/${localStorage.getItem("email")}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data2),
    });

    const mealKey = "meal_" + today;
    const diet = {};

    // GENERATES AND STORES DIET PLAN
    const data3 = { [mealKey]: diet };
    const dietRequest = fetch(`http://localhost:5050/diet/${localStorage.getItem("email")}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data3),
    });

    //ChatGPT was used to generate the code that allows for concurrent API calls
    const [workoutResponse, dietResponse] = await Promise.all([workoutRequest, dietRequest]);
    const updatedUser = await workoutResponse.json();
    const updatedUser2 = await dietResponse.json();

    console.log("New workout " + JSON.stringify(updatedUser.workouts) + " added to " + userName);
    console.log("New workout " + JSON.stringify(updatedUser2.diets) + " added to " + userName);
  } catch (error) {
    console.log(error.response.data);
    setError(error.response.data);
  }
};


  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.signupDetailsBody}`}
    >
      <div className={`card-body ${styles.signupCard}`}>
            <h1 id={styles.detailsHeader}>Details</h1>
            <form id={styles.signupDetails} onSubmit={handleSubmit}>
              <div className={styles.radioInput}>
                <label htmlFor="sex">Male</label>
                <input
                  type="radio"
                  id="male"
                  name="sex"
                  className={`user-input ${styles.userInput}`}
                  value="Male"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="sex">Female</label>
                <input
                  type="radio"
                  id="female"
                  name="sex"
                  className={`user-input ${styles.userInput}`}
                  value="Female"
                  onChange={handleChange}
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
                value={0 ? data.weight: null}
                onChange={handleChange}
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
                value={0 ? data.weight: null}
                onChange={handleChange}
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
                value={0 ? data.weight: null}
                onChange={handleChange}
                required
              />
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
                <option disabled >
                  Activity Level
                </option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
                <option value="Extremely Active">Extremely Active</option>
              </select>

              <label htmlFor="goal"></label> <br/>
              <select
                defaultValue={"Fitness Goals"}
                type="select"
                id={styles.fitnessGoals}
                name="goal"
                className={`user-input ${styles.userInput}`}
                required
                onChange={handleChange}
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
  );
}

export default SignupDetails;
