// Import statements
import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import axios from "axios";

// CSS module import statement
import styles from "../css/diet.module.css";

// Username variable for retrieving the logged in user's username
const username = localStorage.getItem("username");

// Function to retrieve the user's diet plan from the database
async function getDiet() {
  var response = await axios.get(`https://healthify-enxj.onrender.com/diet/${username}`);
  // check if diets are empty
  if (response.data === "empty") {
    return "empty";
  } else {
    return response.data;
  }
}

// Function to display the user's diet plan, can't be async
function Diet() {
  const [diet, setDiet] = useState(null);
  const [dayOfMealPlan, setDayOfMealPlan] = useState(0);

  // Use today's variable to determine which day of diet is rendered to display
  const [daysToAdd, setDaysToAdd] = useState(0);
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  // Format the date to a specific format
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = today.toLocaleDateString("en-CA", dateOptions);

  // Handle click event to show today's diet plan
  const handleToday = () => {
    setDaysToAdd(0);
  };

  // Handle click event to increment the days of the diet plan
  const handleIncrementDays = () => {
    setDaysToAdd(daysToAdd + 1);
  };

  // Handle click event to decrement the days of the diet plan
  const handleDecrementDays = () => {
    setDaysToAdd(daysToAdd - 1);
  };

  // useEffect hook that retrieves the data for the diet plan
  useEffect(() => {
    async function fetchData() {
      const dietData = await getDiet();

      // Format options for displaying today's date
      const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      };

      // Get today's date in the desired format
      let today = new Date().toLocaleDateString("en-US", options);

      if (dietData === "empty") {
        setDiet("No diet plan available.");
      } else {
        function renderNestedObject(obj) {
          // Check if the object is a nested object
          if (typeof obj === "object" && obj !== null) {
            // If it's a nested object, recursively render its properties
            return Object.keys(obj).map((key, index) => {
              // Check if key matches date
              if (key === date) {
                setDayOfMealPlan(index);
                // Check if empty rest day
                if (Object.keys(obj[key]).length === 0) {
                  return (
                    <div key={index} className={styles.day}>
                      <strong>{key}:</strong> Rest day
                    </div>
                  );
                  // Sends the date (ex. Thursday, May 11, 2023)
                } else {
                  // If this page is today
                  if (key === today) {
                    return (
                      <div key={index} className={styles.day}>
                        <strong className={styles.date}>
                          <h5>Today, {key}</h5>
                        </strong>
                        {renderDiet(obj[key])}
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className={styles.day}>
                        <strong className={styles.date}>
                          <h5>{key}</h5>
                        </strong>
                        {renderDiet(obj[key])}
                      </div>
                    );
                  }
                }
              } else {
                return null;
              }
            });
          }
          return obj;
        }

        // Function that renders the diet object for a specific day
        function renderDiet(dietObj) {
          return Object.keys(dietObj).map((dietKey, index) => {
            return (
              <div key={index} className={styles.mealCard}>
                <strong className={styles.aDietTitle}>{dietKey}</strong>{" "}
                {Object.entries(dietObj[dietKey]).map(
                  ([detailKey, detailValue]) => {
                    // Don't display detailKey if it's "Name" or "Nutritional Info"
                    if (
                      detailKey === "Name" ||
                      detailKey === "Nutritional Info"
                    ) {
                      return (
                        <div key={detailKey} className={``}>
                          {detailValue}
                        </div>
                      );
                    } else {
                      return (
                        <div key={detailKey} className={`calories`}>
                          {detailKey}: {detailValue}
                        </div>
                      );
                    }
                  }
                )}
              </div>
            );
          });
        }
        setDiet(renderNestedObject(dietData));

        function assignVariables(data, variablePrefix = "") {
          // Object to store variable assignments
          const variables = {};

          for (const key in data) {
            const value = data[key];
            const variableName = variablePrefix + key;

            if (typeof value === "object") {
              // Handles nested objects recursively and returns 'variables' object with assignments
              const nestedVariables = assignVariables(
                value,
                variableName + "_"
              );
              // Dynamically stores variable assignments in the 'variables' object
              variables[variableName] = { ...nestedVariables };
            } else {
              variables[variableName] = { key, value };
            }
          }

          return variables;
        }

        assignVariables(dietData);
      }
    }
    fetchData();
  }, [daysToAdd]);
  // End of useEffect hook that retrieves the data for the diet plan

  return (
    <div>
      <button
        onClick={handleToday}
        disabled={daysToAdd === 0}
        className={`btn btn-primary  ${styles.dietBtn} ${styles.dietBtnToday}`}
      >
        {"Today"}
      </button>{" "}
      <button
        onClick={handleDecrementDays}
        disabled={dayOfMealPlan === 0}
        className={`btn btn-primary  ${styles.dietBtn} ${styles.dietBtn1}`}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>{" "}
      {/* Add the decrement button */}
      <button
        onClick={handleIncrementDays}
        disabled={dayOfMealPlan >= 6}
        className={`btn btn-primary  ${styles.dietBtn} ${styles.dietBtn2}`}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>{" "}
      {/* Add the increment button */}
      <div className="d-flex align-items-center text-center justify-content-center row">
        {diet}
      </div>
    </div>
  );
}

// Renders the page
const DietPlan = () => {
  // Visual page animation effects
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 600,
  });
  // End of visual page animation effects

  // useState hook variables for the form submission
  const [isFormSubmitting, setFormSubmitting] = useState(false);

  // Function to update user in database with diet plan
  async function addDietToUser(event) {
    event.preventDefault();

    // Ignore form submission if already submitting
    if (isFormSubmitting) {
      return;
    }
    setFormSubmitting(true);

    // Key to store individual workout
    const today = new Date().toISOString().slice(0, 10);
    const mealKey = "meal_" + today;
    // Diet plan to write into user database, will generate with server side call to diet.js
    const diet = {};

    const data = { [mealKey]: diet };
    await axios.put(
      `https://healthify-enxj.onrender.com/diet/${localStorage.getItem("username")}`
    );

    // Re-enable button after finishing code
    setFormSubmitting(false);
    // Reload page so new diet plan is displayed
    window.location.reload();
  }

  // Handle click event to display an alert message popup for the user
  // Renders Diet.jsx component
  return (
    <animated.div className={`${styles.dietContainer}`} style={fadeIn}>
      <div className={`card ${styles.dietCard}`}>
        <div className={`card-body ${styles.fitnessCardBody}`}>
          <div>
            <form id="addDiet" onSubmit={addDietToUser}>
              <h2>{username}'s Diet Plan</h2>
              <input type="hidden" name="userEmail" value={username}></input>
              <button
                type="submit"
                className={`btn btn-primary  ${styles.dietBtn}`}
                disabled={isFormSubmitting}
              >
                {isFormSubmitting ? (
                  <div className={styles.loading}>
                    <p>Generating...</p>
                    <div
                      id="processing"
                      className="spinner-border"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  "Generate New Diet Plan"
                )}
              </button>
              <p>
                <small>Generating takes 1 to 2 minutes</small>
              </p>
            </form>
          </div>

          <Diet />
        </div>
      </div>
    </animated.div>
  );
  // End of Diet.jsx component
};

export default DietPlan;
