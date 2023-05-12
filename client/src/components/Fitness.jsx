import React, { useState, useEffect } from 'react';
import styles from "../css/fitness.module.css";
// import Modal from 'react-modal';

// import server hosting port
const port = '5050';

// used to identify user for database modification
const username = localStorage.getItem("username");

// get first item from user's workouts field from database
var workout;
async function getWorkout() {
  var response = await fetch(`http://localhost:5050/fitness/${username}`, {
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
  
  // use today variable to determine which day of workout is rendered to display
  const [daysToAdd, setDaysToAdd] = useState(0);
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = today.toLocaleDateString('en-CA', dateOptions);
  // tracks which day x/7 of the weeklong workout plan is today's, going to use this to limit button navigation
  const [dayOfWorkoutPlan, setDayOfWorkoutPlan] = useState(0);
  
  // for previous day and next day button navigation
  const handleIncrementDays = () => {
    setDaysToAdd(daysToAdd + 1); 
  };
  const handleDecrementDays = () => {
    setDaysToAdd(daysToAdd - 1); 
  };

  // for modal stuff
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    console.log("modal opened");
    setShowModal(true);
  };
  const handleCloseModal = () => {
    console.log("modal closed");
    setShowModal(false);
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
            
            // check if key matches date so only render the one day on the page
            if (key == date) {
              // sets the dayOfWorkoutPlan equal to the index of the today's workout in the workoutPlan in database
              setDayOfWorkoutPlan(index);

              // check if empty rest day
              if (Object.keys(obj[key]).length === 0) {
                // use this to check if current page is today to render title card
                let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
                let today = new Date().toLocaleDateString('en-US', options);
                // if this page is today
                if (key == today) {
                  return (
                    <div key={index} className={styles.day}>
                      <strong>Today, {key}:</strong> Rest day
                    </div>
                  );
                // if page is not today
                } else {
                  return (
                    <div key={index} className={styles.day}>
                      <strong>{key}:</strong> Rest day
                    </div>
                  );
                }

              // sends the day title ex. Thursday, May 11, 2023:
              } else {
                // use this to check if current page is today to render title card
                let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
                let today = new Date().toLocaleDateString('en-US', options);
                // if this page is today
                if (key == today) {
                  return (
                    <div key={index} className={styles.day}>
                      <strong>Today, {key}</strong>
                      {renderExercise(obj[key])}
                    </div>
                  );
                // if page is not today
                } else {
                  return (
                    <div key={index} className={styles.day}>
                      <strong>{key}</strong>
                      {renderExercise(obj[key])}
                    </div>
                  );
                }
              }
            // return nothing if this workout-day-object does not match the desired day (current day + daysToAdd)
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
              // dispaly detailKey if it is calories
              } else if (detailKey == "calories") {
                return (
                  <div key={detailKey} className={styles.aKey}>
                    Calories: {detailValue}
                  </div>
                );
              // shouldn't be any other option currently
              } else {
                return; 
              }
            })}
          {/* this opens up images for the exercise */}
          {/* <button onClick={handleOpenModal}>Get instructions</button>
          <Modal
            isOpen={showModal}
            onRequestClose={handleCloseModal}
            contentLabel="Image Popup"
            appElement={document.getElementById('root')}
            ariaHideApp={false}
          >
            {/* Modal content goes here */}
            {/* <img src="path/to/your/image.jpg" alt="Image" /> */}
            {/* <p>test</p>
          </Modal> */} 
          

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
            // dynamically generate a new variable with the name of the date and exercise
            // caution dangerous to use eval
            // fixed eval error by assigning each variableName the day of the week so only works on max 7-days plan
            // console.log("variableName: " + variableName + ". key: " + key + ". variableValue: " + variableValue);
            eval(`var ${variableName.substring(0, variableName.indexOf(","))} = { key: "${key}", value: "${variableValue}" };`); 
          }
        }
      }
      assignVariables(workoutData);
    }
  }

    fetchData();
  }, [daysToAdd]); // Trigger useEffect whenever daysToAdd changes

  return (
    <div>
      <h2>{username}'s Workout</h2>
      <button onClick={handleDecrementDays} disabled={dayOfWorkoutPlan <= 0}>Previous Day</button>
      <button onClick={handleIncrementDays} disabled={dayOfWorkoutPlan >= 6}>Next Day</button> 
      <div className="d-flex align-items-center text-center justify-content-center row">{workout}</div>
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
    const response = await fetch(`http://localhost:${port}/fitness/${username}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(data),
    });
    const updatedUser = await response.json();
    console.log("New workout " + JSON.stringify(updatedUser.workouts) + " added to " + username);
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
          <form id="addWorkout" onSubmit={addWorkoutToUser}>
            <input type="hidden" name="username" value={username}></input>
            {/* button displays different text if clicked or not clicked */}
            <button type="submit" className="btn btn-success" disabled={isFormSubmitting}>
              {isFormSubmitting ? (
                <div>
                  <p>Generating...</p>
                  <div id="processing" className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                'Create new workout plan'
              )}
            </button>
            
              <p><small>Generating takes 30-60 seconds</small></p>
          </form>
        </div>


        <Workout/>

        </div>
      </div>
    </div>
  );
};

export default Fitness;
