import React from "react";
import { useState } from "react";
import axios from "axios";
import styles from "../css/signupPrefRes.module.css";

function SignupPrefRes() {
  // useState hook variables for users to input their information
  const [data, setData] = useState({
    foodPreferences: "",
    dietaryRestrictions: "",
    // workoutPreferences: "",
    // workoutRestrictions: "",
  });

  const [error, setError] = useState("");

  // Allows the user to submit their information to the database
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:5050/signupPrefRes/${localStorage.getItem(
        "username"
      )}`;
      const { data: res } = await axios.post(url, data);
      window.location = "/login";

      const userName = localStorage.getItem("email");
      const today = new Date().toISOString().slice(0, 10);
      const workoutKey = "workout_" + today;
      const workout = {};

      // Generates and stores the user's workout plan
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

      // Generates and stores the user's diet plan
      const data3 = { [mealKey]: diet };
      const dietRequest = fetch(
        `http://localhost:5050/diet/${localStorage.getItem("username")}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data3),
        }
      );

      // ChatGPT was used to generate the code that allows for concurrent API calls
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

  // Adds and removes input.value depending on if it is already in the dietaryRestrictions string
  const handleCheckbox = ({ currentTarget: input }) => {
    const dietaryRestrictions = data.dietaryRestrictions;
    const newInput = input.value;
    if (dietaryRestrictions.includes(newInput)) {
      let removedRestriction = dietaryRestrictions.replace(newInput, "");
      setData({ ...data, dietaryRestrictions: removedRestriction });
      console.log("Removed " + dietaryRestrictions);
    } else {
      setData({
        ...data,
        dietaryRestrictions: dietaryRestrictions + " " + input.value,
      });
      console.log("Checked ");
      console.log(dietaryRestrictions);
    }
  };

  return (
    <>
      <div className={`card-body ${styles.signupCard}`}>
        <form id={styles.signupDetails} onSubmit={handleSubmit}>
          <h1 id={styles.detailsHeader}>Preferences and Restrictions </h1>

          <label htmlFor="foodPreferences"></label>
          <select
            type="select"
            id={`${styles.foodPreferences}`}
            name="foodPreferences"
            defaultValue={"Food Preferences"}
            className={`user-input ${styles.userInput}`}
            value={0 ? data.weight : null} //Fix this stuff
            onChange={handleChange}
            required
          >
            <option disabled>Food Preferences</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Pescatarian">Pescatarian</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Paleo">Paleo</option>
            <option value="Keto">Keto</option>
            <option value="None">None</option>
          </select>
          <div className={styles.restrictionsHeader}>Dietary Restrictions</div>
          <div className={styles.checkboxes}>
            <div className={styles.checkboxGroup1}>
              <input
                type="checkbox"
                name="gluten-free"
                className="btn-check"
                id="gluten-free"
                value="gluten,"
                onChange={handleCheckbox}
              ></input>
              <label
                className={`btn btn-outline-info ${styles.checkboxLabel}`}
                htmlFor="gluten-free"
              >
                Gluten-free
              </label>
              <input
                type="checkbox"
                name="lactose-intolerant"
                className="btn-check"
                id="lactose-intolerant"
                value="lactose-intolerant,"
                onChange={handleCheckbox}
              ></input>
              <label
                className={`btn btn-outline-info ${styles.checkboxLabel}`}
                htmlFor="lactose-intolerant"
              >
                Lactose Intolerant
              </label>
              <input
                type="checkbox"
                name="kosher"
                className="btn-check"
                id="kosher"
                value="kosher,"
                onChange={handleCheckbox}
              ></input>
              <label
                className={`btn btn-outline-info ${styles.checkboxLabel}`}
                htmlFor="kosher"
              >
                Kosher
              </label>
              <input
                type="checkbox"
                name="nut-allergy"
                className="btn-check"
                id="nut-allergy"
                value="nuts,"
                onChange={handleCheckbox}
              ></input>
              <label
                className={`btn btn-outline-info ${styles.checkboxLabel}`}
                htmlFor="nut-allergy"
              >
                Nut Allergy
              </label>
            </div>
            <div className={styles.checkboxGroup2}>
              <input
                type="checkbox"
                name="wheat-allergy"
                className="btn-check"
                id="wheat-allergy"
                value="wheat,"
                onChange={handleCheckbox}
              ></input>
              <label
                className={`btn btn-outline-info ${styles.checkboxLabel}`}
                htmlFor="wheat-allergy"
              >
                Wheat Allergy
              </label>
              <input
                type="checkbox"
                name="fish-allergy"
                className="btn-check"
                id="fish-allergy"
                value="fish,"
                onChange={handleCheckbox}
              ></input>
              <label
                className={`btn btn-outline-info ${styles.checkboxLabel}`}
                htmlFor="fish-allergy"
              >
                Fish Allergy
              </label>
              <input
                type="checkbox"
                name="shellfish-allergy"
                className="btn-check"
                id="shellfish-allergy"
                value="shellfish,"
                onChange={handleCheckbox}
              ></input>
              <label
                className={`btn btn-outline-info ${styles.checkboxLabel}`}
                htmlFor="shellfish-allergy"
              >
                Shellfish Allergy
              </label>
              <input
                type="checkbox"
                name="soy-allergy"
                className="btn-check"
                id="soy-allergy"
                value="soy,"
                onChange={handleCheckbox}
              ></input>
              <label
                className={`btn btn-outline-info ${styles.checkboxLabel}`}
                htmlFor="soy-allergy"
              >
                Soy Allergy
              </label>
            </div>
          </div>
          {/* <label htmlFor="workoutPreferences"></label>
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
          </label> */}

          <input
            type="submit"
            id={styles.submitBtn}
            name="submit"
            value="Sign up"
          />
        </form>
      </div>
    </>
  );
}

export default SignupPrefRes;
