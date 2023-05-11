import React, { useState, useEffect } from 'react';
import styles from "../css/fitness.module.css";

// import server hosting port
const port = '5050';

// used to identify user for database modification
const userEmail = localStorage.getItem("email");

// get first item from user's workouts field from database
var workout;
async function getWorkout() {
  var response = await fetch(`http://localhost:${port}/fitness/${userEmail}`, {
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

  useEffect(() => {
    async function fetchData() {
      const workoutData = await getWorkout();

      if (workoutData === "empty") {
        setWorkout("No workout available"); // Set default value
      } else {

       function renderNestedObject(obj) {
        // Check if the object is a nested object
        if (typeof obj === 'object' && obj !== null) {
          // If it's a nested object, recursively render its properties
          return Object.keys(obj).map((key, index) => {
            const isDayKey = key.match(/^Day[1-7]$/); // Check if key matches 'Day1' to 'Day7' pattern
            if (isDayKey) {
              // check if empty rest day
              if (Object.keys(obj[key]).length === 0) {
                return (
                  <div key={index} className={styles.day}>
                    <strong>{key}:</strong> Rest day
                  </div>
                );

              } else {
                return (
                  <div key={index} className={styles.day}>
                    <strong>{key}:</strong> {renderNestedObject(obj[key])}
                  </div>
                );
              }
            } else {
              return (
                <div key={index}>
                  <strong>{key}:</strong> {renderNestedObject(obj[key])}
                </div>
              );
            }
          });
        }
        // if obj is not an object aka it's the lowest level detail string or int
        return obj;
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
            eval(`var ${variableName} = { key: ${JSON.stringify(key)}, value: ${JSON.stringify(value)} };`);
          }
        }
      }
      
      assignVariables(workoutData);
    }
  }

    fetchData();
  }, []);

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
              <p><small>Please note generating can take 15-30 seconds</small></p>
          </form>
        </div>


        <Workout/>

        </div>
      </div>
    </div>
  );
};

export default Fitness;
