import React, { useState, useEffect } from "react";
import styles from "../css/fitness.module.css";

// This is literally the same as Fitness.jsx but with different variable names
// Might need an update

// used to identify user for database modification
const username = localStorage.getItem("username");

var diet;
async function getDiet() {
  var response = await fetch(`http://localhost:5050/diet/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  var data = await response.json();
  // check if workouts is empty
  if (data == "empty") {
    return "empty";
  } else {
    diet = data;
    return data;
  }
}

// FUNCTION GETS USERSTATS FIELD FROM DATABASE
async function getUserStats() {
  var response = await fetch(`http://localhost:5050/userStats/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  var data = await response.json();
  console.log(data);
}

// display user's workout, can't be async
function Diet() {
  const [diet, setDiet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [dayOfMealPlan, setDayOfMealPlan] = useState(0);

  // use today variable to determine which day of workout is rendered to display
  const [daysToAdd, setDaysToAdd] = useState(0);
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = today.toLocaleDateString("en-CA", dateOptions);
  // console.log(date);

  const handleIncrementDays = () => {
    setDaysToAdd(daysToAdd + 1); // Increment daysToAdd by 1
  };
  const handleDecrementDays = () => {
    setDaysToAdd(daysToAdd - 1); // Decrement daysToAdd by 1
  };

  useEffect(() => {
    async function fetchData() {
      const workoutData = await getDiet();

      if (workoutData === "empty") {
        setDiet("No workout available"); // Set default value
      } else {
        function renderNestedObject(obj) {
          // check if the object is a nested object
          if (typeof obj === "object" && obj !== null) {
            // if it's a nested object, recursively render its properties
            return Object.keys(obj).map((key, index) => {
              // check if key matches date
              if (key == date) {

                setDayOfMealPlan(index)
                // check if empty rest day
                if (Object.keys(obj[key]).length === 0) {
                  return (
                    <div key={index} className={styles.day}>
                      <strong>{key}:</strong> Rest day
                    </div>
                  );
                  // sends the day title ex. Thursday, May 11, 2023:
                } else {
                  return (
                    <div key={index} className={styles.day}>
                      <strong>{key}</strong>
                      {renderDiet(obj[key])}
                    </div>
                  );
                }
              } else {
                return null;
              }
            });
          }
          return obj;
        }

        // for the sublevel exercise object inside day object
        function renderDiet(dietObj) {
          return Object.keys(dietObj).map((dietKey, index) => {
            return (
              <div key={index} className={styles.aDiet}>
                <strong className={styles.aDietTitle}>{dietKey}</strong>{" "}
                {Object.entries(dietObj[dietKey]).map(
                  ([detailKey, detailValue]) => {
                    // don't display detailKey if it is name or setsAndReps
                    if (detailKey == "name" || detailKey == "nutritionalInfo") {
                      return (
                        <div key={detailKey} className={styles.aKey}>
                          {detailValue}
                        </div>
                      );
                    } else {
                      return (
                        <div key={detailKey} className={styles.aKey}>
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
        setDiet(renderNestedObject(workoutData));

        function assignVariables(data, variablePrefix = "") {
          for (const key in data) {
            const value = data[key];
            // console.log("value: " + value);
            const variableName = variablePrefix + key;
            // console.log("variableName: " + variableName);

            if (typeof value === "object") {
              assignVariables(value, variableName + "_");
            } else {
              // Assign the value directly
              const variableValue = value;
              // Wrap key and value in quotes
              eval(
                `var ${variableName} = { key: "${key}", value: "${variableValue}" };`
              );
            }
          }
        }
        assignVariables(workoutData);
      }
    }

    fetchData();
  }, [daysToAdd]); // Trigger useEffect whenever daysToAdd changes

  const handleExerciseClick = (exercise) => {
    setSelectedDiet(exercise);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2>Your Diet Plan</h2>
      <button onClick={handleDecrementDays} disabled={dayOfMealPlan == 0}>Previous Day</button>{" "}
      {/* Add the decrement button */}
      <button onClick={handleIncrementDays} disabled={dayOfMealPlan >= 6}>Next Day</button>{" "}
      {/* Add the increment button */}
      <div className="d-flex align-items-center text-center justify-content-center row">
        {diet}
      </div>
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h3>{selectedDiet}</h3>
          {/* Render the details of the selected exercise */}
          {/* For example: */}
          <div>{selectedDiet.details.details_values}</div>
        </Modal>
      )}
    </div>
  );
}

// Example Modal component
function Modal({ onClose, children }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
}

// page render
const DietPlan = () => {
  // used to disable button after clicking until current execution is finished
  const [isFormSubmitting, setFormSubmitting] = useState(false);

  // function to update user in database with workout plan
  async function addDietToUser(event) {
    event.preventDefault();

    // ignore form submission if already submitting
    if (isFormSubmitting) {
      return;
    }
    setFormSubmitting(true);

    // key to store individual workout
    const today = new Date().toISOString().slice(0, 10);
    const mealKey = "meal_" + today;
    // workout to write into user database, will generate with server side call to workouts.js
    const diet = {};

    const data = { [mealKey]: diet };
    const response = await fetch(
      `http://localhost:5050/diet/${localStorage.getItem("username")}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const updatedUser = await response.json();
    console.log(
      "New workout " +
        JSON.stringify(updatedUser.diets) +
        " added to " +
        username
    );
    // re-enable button after finishing code
    setFormSubmitting(false);
    // reload page so new workout is displayed
    window.location.reload();
  }

  // alert message popup for the user
  const handleClick = () => {
    window.alert("Generating diet plan... please do not refresh the page!");
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.fitnessContainer}`}
    >
      <div className={`card ${styles.exerciseCard}`}>
        <div className={`card-body ${styles.fitnessCardBody}`}>

        <form id="getUserStats" onSubmit={getUserStats}>
            <input type="hidden" name="username" value={username}></input>
            <button type="submit">Test Get User Stats</button>
          </form>

          <div>
            <form id="addWorkout" onSubmit={addDietToUser}>
              <input type="hidden" name="userEmail" value={username}></input>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isFormSubmitting}
                onClick={handleClick}
              >
                {isFormSubmitting ? (
                  <div>
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
                  "Create diet plan"
                )}
              </button>
              <p>
                <small>Generating takes 30-60 seconds</small>
              </p>
            </form>
          </div>

          <Diet />
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
