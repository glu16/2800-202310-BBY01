import React, {useState, useEffect} from "react";
import styles from "../css/diet.module.css";

// This is literally the same as Fitness.jsx but with different variable names
// Might need an update

// used to identify user for database modification
const username = localStorage.getItem("username");

var diet;
async function getDiet() {
  var response = await fetch(`http://localhost:5050/diet/${username}`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
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

// display user's diet, can't be async
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
      const dietData = await getDiet();

      if (dietData === "empty") {
        setDiet("No workout available"); // Set default value
      } else {
        function renderNestedObject(obj) {
          // check if the object is a nested object
          if (typeof obj === "object" && obj !== null) {
            // if it's a nested object, recursively render its properties
            return Object.keys(obj).map((key, index) => {
              // check if key matches date
              if (key == date) {
                setDayOfMealPlan(index);
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
                      <strong className={styles.date}>{key}</strong>
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
              <div key={index} className={styles.mealCard}>
                <strong className={styles.aDietTitle}>{dietKey}</strong>{" "}
                {Object.entries(dietObj[dietKey]).map(
                  ([detailKey, detailValue]) => {
                    // don't display detailKey if it is name or setsAndReps
                    if (
                      detailKey == "Name" ||
                      detailKey == "Nutritional Info"
                    ) {
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
              variables[variableName] = {...nestedVariables};
            } else {
              variables[variableName] = {key, value};
            }
          }

          return variables;
        }

        assignVariables(dietData);
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
      <button
        onClick={handleDecrementDays}
        disabled={dayOfMealPlan == 0}
        className={`btn btn-primary  ${styles.dietBtn}`}
      >
        Previous Day
      </button>{" "}
      {/* Add the decrement button */}
      <button
        onClick={handleIncrementDays}
        disabled={dayOfMealPlan >= 6}
        className={`btn btn-primary  ${styles.dietBtn}`}
      >
        Next Day
      </button>{" "}
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
function Modal({onClose, children}) {
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

    const data = {[mealKey]: diet};
    const response = await fetch(
      `http://localhost:5050/diet/${localStorage.getItem("username")}`,
      {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
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
    <div className={`${styles.dietContainer}`}>
      <div className={`card ${styles.dietCard}`}>
        <div className={`card-body ${styles.fitnessCardBody}`}>
          <div>
            <form id="addWorkout" onSubmit={addDietToUser}>
              <h2>Your Diet Plan</h2>
              <input type="hidden" name="userEmail" value={username}></input>
              <button
                type="submit"
                className={`btn btn-primary  ${styles.dietBtn}`}
                disabled={isFormSubmitting}
                onClick={handleClick}
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
