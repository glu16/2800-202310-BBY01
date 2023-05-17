import React from "react";
import { useState } from "react";
import axios from "axios";
import styles from "../css/signupPrefRes.module.css";

function SignupPrefRes() {
  const [data, setData] = useState({
    foodPreferencs: "",
    foodRestrictions: "",
    workoutPreferences: "",
    workoutRestrictions: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:5050/signupdetails/${localStorage.getItem(
        "username"
      )}`;
      const { data: res } = await axios.post(url, data);
      window.location = "/login";

      const userName = localStorage.getItem("email");
      const today = new Date().toISOString().slice(0, 10);
      const workoutKey = "workout_" + today;
      const workout = {};

      // GENERATES AND STORES WORKOUT PLAN
      const data2 = { [workoutKey]: workout };
      const workoutRequest = fetch(
        `http://localhost:5050/fitness/${localStorage.getItem("username")}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data2),
        }
      );

      const mealKey = "meal_" + today;
      const diet = {};

      // GENERATES AND STORES DIET PLAN
      const data3 = { [mealKey]: diet };
      const dietRequest = fetch(
        `http://localhost:5050/diet/${localStorage.getItem("username")}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data3),
        }
      );

      //ChatGPT was used to generate the code that allows for concurrent API calls
      const [workoutResponse, dietResponse] = await Promise.all([
        workoutRequest,
        dietRequest,
      ]);
      const updatedUser = await workoutResponse.json();
      const updatedUser2 = await dietResponse.json();

      console.log(
        "New workout " +
          JSON.stringify(updatedUser.workouts) +
          " added to " +
          userName
      );
      console.log(
        "New workout " +
          JSON.stringify(updatedUser2.diets) +
          " added to " +
          userName
      );
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  return (
    <>
      <div className={`card-body ${styles.signupCard}`}>
        <form id={styles.signupDetails} onSubmit={handleSubmit}>
        <h1 id={styles.detailsHeader}>Preferences and Restrictions  </h1>

          <input
            type="text"
            id="foodPreferencs"
            name="foodPreferencs"
            className={`user-input ${styles.userInput}`}
            value={0 ? data.weight : null} //Fix this stuff
            onChange={handleChange}
            required
          />
          <label htmlFor="foodPreferencs" className={`${styles.inputLabel}`}>
            <span className={`${styles.inputFoodName}`}>
              Food Preferences
            </span>
          </label>

          <input
            type="text"
            step="any"
            id="foodRestrictions"
            name="foodRestrictions"
            className={`user-input ${styles.userInput}`}
            value={0 ? data.weight : null}
            onChange={handleChange}
            required
          />
          <label htmlFor="foodRestrictions" className={`${styles.inputLabel}`}>
            <span className={`${styles.inputFoodName}`}>Food Restrictions </span>
          </label>

          <label htmlFor="workoutPreferences"></label>
          <input
            type="text"
            id="workoutPreferences"
            name="workoutPreferences"
            className={`user-input ${styles.userInput}`}
            value={0 ? data.weight : null}
            onChange={handleChange}
            required
          />
          <label
            htmlFor="workoutPreferences"
            className={`${styles.inputLabel}`}
          >
            <span className={`${styles.inputName}`}>Workout Preferences</span>
          </label>

          <label htmlFor="workoutRestrictions"></label>
          <input
            type="text"
            id="workoutRestrictions"
            name="workoutRestrictions"
            className={`user-input ${styles.userInput}`}
            value={0 ? data.weight : null}
            onChange={handleChange}
            required
          />
          <label
            htmlFor="workoutRestrictions"
            className={`${styles.inputLabel}`}
          >
            <span className={`${styles.inputName}`}>Workout Restrictions</span>
          </label>

          <input
            type="submit"
            id={styles.submitBtn}
            name="submit"
            value="Finalize"
          />
        </form>
      </div>
    </>
  );
}

export default SignupPrefRes;
