import React, { useState, useEffect } from 'react';
import styles from "../css/fitness.module.css";

// import server hosting port
const port = '5050';

// used to identify user for database modification
const userEmail = localStorage.getItem("email");

// get first item from user's workouts field from database
var workout;
async function getWorkout() {
  var response = await fetch(`https://healthify-enxj.onrender.com/fitness/${userEmail}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", },
  });
  var data = await response.json(); 
  // check if workouts is empty
  if (data == "empty") {
    return "empty";
  } else {
    workout = data;
    return data;
  }
}

// display user's workout, can't be async
function Workout() {
  const [workout, setWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  // use today variable to determine which day of workout is rendered to display
  const [daysToAdd, setDaysToAdd] = useState(0);
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = today.toLocaleDateString('en-CA', dateOptions);
  // console.log(date);

  const handleIncrementDays = () => {
    setDaysToAdd(daysToAdd + 1); // Increment daysToAdd by 1
  };
  const handleDecrementDays = () => {
    setDaysToAdd(daysToAdd - 1); // Decrement daysToAdd by 1
  };

  useEffect(() => {
    async function fetchData() {
      const workoutData = await getWorkout();

      if (workoutData === "empty") {
        setWorkout("No workout available"); // Set default value
      } else {

       function renderNestedObject(obj) {
        // check if the object is a nested object
        if (typeof obj === 'object' && obj !== null) {
          // if it's a nested object, recursively render its properties
          return Object.keys(obj).map((key, index) => {
            // check if key matches date
            if (key == date) {
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
                    {renderExercise(obj[key])}
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
      function renderExercise(exerciseObj) {
        return Object.keys(exerciseObj).map((exerciseKey, index) => {
          return (
            <div key={index} className={styles.anExercise}>
            <strong className={styles.anExerciseTitle}>{exerciseKey}</strong>{" "}
            {Object.entries(exerciseObj[exerciseKey]).map(([detailKey, detailValue]) => {
              // don't display detailKey if it is name or setsAndReps
              if (detailKey == "name" || detailKey == "setsAndReps") {
                return <div key={detailKey} className={styles.aKey}>{detailValue}</div>;
              } else {
                return (
                  <div key={detailKey} className={styles.aKey}>
                    {detailKey}: {detailValue}
                  </div>
                );
              }
            })}
          </div>
          );
        });
      }
      setWorkout(renderNestedObject(workoutData));

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
            eval(`var ${variableName} = { key: "${key}", value: "${variableValue}" };`); 
          }
        }
      }
      assignVariables(workoutData);
    }
  }

    fetchData();
  }, [daysToAdd]); // Trigger useEffect whenever daysToAdd changes

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  return (
    <div>
      <h2>Your Workout</h2>
      <button onClick={handleDecrementDays}>Previous Day</button> {/* Add the decrement button */}
      <button onClick={handleIncrementDays}>Next Day</button> {/* Add the increment button */}
      <div className="d-flex align-items-center text-center justify-content-center row">{workout}</div>
      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h3>{selectedExercise}</h3>
          {/* Render the details of the selected exercise */}
          {/* For example: */}
          <div>{selectedExercise.details.details_values}</div>
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
const Fitness = () => {

  // used to disable button after clicking until current execution is finished
  const [isFormSubmitting, setFormSubmitting] = useState(false);

  // function to update user in database with workout plan
  async function addWorkoutToUser(event) {
    event.preventDefault();

    // ignore form submission if already submitting
    if (isFormSubmitting) {
      return; 
    }
    setFormSubmitting(true);

    // key to store individual workout
    const today = new Date().toISOString().slice(0, 10);
    const workoutKey = "workout_" + today;
    // workout to write into user database, will generate with server side call to workouts.js
    const workout = {}

    const data = { [workoutKey]: workout };
    const response = await fetch(`http://localhost:${port}/fitness/${userEmail}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(data),
    });
    const updatedUser = await response.json();
    console.log("New workout " + JSON.stringify(updatedUser.workouts) + " added to " + userEmail);
    // re-enable button after finishing code
    setFormSubmitting(false);
    // reload page so new workout is displayed
    window.location.reload();
  }

  return (
    <div className={`d-flex justify-content-center align-items-center h-100 ${styles.fitnessContainer}`}>
      <div className={`card ${styles.exerciseCard}`}>
        <div className={`card-body ${styles.fitnessCardBody}`}>

        <div>
          {userEmail}
          <form id="addWorkout" onSubmit={addWorkoutToUser}>
            <input type="hidden" name="userEmail" value={userEmail}></input>
            <button type="submit" className="btn btn-success" disabled={isFormSubmitting}>
              {isFormSubmitting ? (
                <div>
                  <p>Generating...</p>
                  <div id="processing" className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                'Create workout plan'
              )}
            </button>
              <p><small>generating takes 30-60 seconds</small></p>
          </form>
        </div>


        <Workout/>

        </div>
      </div>
    </div>
  );
};

export default Fitness;
