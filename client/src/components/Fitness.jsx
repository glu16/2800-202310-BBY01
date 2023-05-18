import React, { useState, useEffect, useRef } from 'react';
import styles from "../css/fitness.module.css";
import Modal from "react-modal";

// for task completion buttons

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

// import server hosting port
const port = "5050";

// used to identify user for database modification
const username = localStorage.getItem("username");

// FUNCTION CALLED TO CONNECT TO DATABASE AND GET FIRST WORKOUT PLAN OBJECT 
var workout;
async function getWorkout() {
  var response = await fetch(`http://localhost:${port}/fitness/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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

// CHECK IF EXERCISE FOR TODAY ALREADY DONE
var doneToday = false;
async function getDoneToday() {
  var response = await fetch(`http://localhost:${port}/doneToday/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  var data = await response.json();
  doneToday = data;
}
getDoneToday();


// FUNCTION GETS USERSTATS FIELD FROM DATABASE
// async function getUserStats() {
//   var response = await fetch(`http://localhost:${port}/userStats/${username}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });
//   var data = await response.json();
//   console.log(data);
// }

// TEMPORARY TEST FUNCTION FOR CRON-JOB UPDATE USER STREAKS AT MIDNIGHT
function updateStreaks() {
  console.log("button working");
  fetch(`http://localhost:${port}/updateStreaks/`, {
    method: "POST",
  })
}


// PARSE AND DISPLAY WORKOUT PLAN FROM DATABASE
function Workout({ handleOpenModal }) {
  const [workout, setWorkout] = useState(null);
 
  // use the today variable to determine which day of workout is rendered to display
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
  // tracks which day x/7 of the weeklong workout plan is today's, going to use this to limit button navigation
  const [dayOfWorkoutPlan, setDayOfWorkoutPlan] = useState(0);

  // for previous day and next day button navigation
  const handleIncrementDays = () => {
    setDaysToAdd(daysToAdd + 1);
  };

  const handleDecrementDays = () => {
    setDaysToAdd(daysToAdd - 1);
  }
  
  useEffect(() => {
    async function fetchData() {

      // workoutData == the first workout plan object from the user database field workouts
      const workoutData = await getWorkout();

      // handles if workout field is empty
      if (workoutData === "empty") {
        setWorkout("No workout available");

      } else {

       function renderNestedObject(obj) {

        // check if current object is a nested object, recursively render its properties
        if (typeof obj === 'object' && obj !== null) {
          
          return Object.keys(obj).map((key, index) => {
            
            // check if key matches date so only render the one day on the page
            if (key == date) {

              // tracks number of exercises on page, used for complete exercse buttons
              // using browser local storage because state variables not too disfunctional with so many sub-components
              let numOfExercises = Object.keys(workoutData[date]).length;
              localStorage.setItem('numberOfExercises', numOfExercises);

              // sets the dayOfWorkoutPlan equal to the index of the today's workout in the workoutPlan in database
              setDayOfWorkoutPlan(index);

                // check if empty rest day
                if (Object.keys(obj[key]).length === 0) {
                  // use this to check if current page is today to render title card
                  let options = {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  };
                  let today = new Date().toLocaleDateString("en-US", options);
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
                      {renderExerciseToday(obj[key])}
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
            <button onClick={handleOpenModal}>Get instructions</button>

          </div>

          );
        });
      }

      // for the sublevel exercise object inside day object
      function renderExerciseToday(exerciseObj) {
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
            <button onClick={handleOpenModal}>Get instructions</button>

            {/* button to mark task completed */}
            <CompleteExercisesButton />

          </div>

          );
        });
      }
      

      // recursively go through the nested json object that is workoutData
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
              eval(
                `var ${variableName.substring(
                  0,
                  variableName.indexOf(",")
                )} = { key: "${key}", value: "${variableValue}" };`
              );
            }
          }
        }
        assignVariables(workoutData);
      }
    }

    fetchData();
  }, [daysToAdd]); // Trigger useEffect whenever daysToAdd changes

  // return for Workout()
  return (
    <div>
      <h2>{username}'s 7-Day Workout</h2>
      <button onClick={handleDecrementDays} disabled={dayOfWorkoutPlan <= 0}>
        Previous Day
      </button>
      <button onClick={handleIncrementDays} disabled={dayOfWorkoutPlan >= 6}>
        Next Day
      </button>
      <div className="d-flex align-items-center text-center justify-content-center row">
        {workout}
      </div>
    </div>
  );
}

// FOR THE TASK COMPLETION BUTTONS
const CompleteExercisesButton = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      let numberOfExercises = parseInt(localStorage.getItem('numberOfExercises'));
      numberOfExercises--;
      localStorage.setItem('numberOfExercises', numberOfExercises);
    } else {
      let numberOfExercises = parseInt(localStorage.getItem('numberOfExercises'));
      numberOfExercises++;
      localStorage.setItem('numberOfExercises', numberOfExercises);
    }


  };
  return (
    <div className="container mt-5">
    <button
      className="markExerciseComplete btn btn-secondary btn-checkbox"
      onClick={handleClick}
      // disabled={}
    >
      <FontAwesomeIcon
        icon={isChecked ? faCheckSquare : faSquare}
        className="mr-2"
      />Mark exercise complete!
    </button>
  </div>
  );
};


// GET AND DISPLAY STREAK AND STATS
const Streak = () => {
  const [currentStreak, setCurrentStreak] = useState(null);
  const [longestStreak, setLongestStreak] = useState(null);
  const [doneToday, setDoneToday] = useState(null);
  const [daysDone, setDaysDone] = useState(null);
  const [daysMissed, setDaysMissed] = useState(null);
  // FUNCTION GETS USER STREAK STATS FROM DATABASE
  async function getStreak() {
    try {
      const response = await fetch(`http://localhost:${port}/streak/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setCurrentStreak(data.currentStreak);
      setLongestStreak(data.longestStreak);
      setDoneToday(data.doneToday);
      setDaysDone(data.daysDone);
      setDaysMissed(data.daysMissed);
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error('Error fetching streak:', error);
    }
  }
  useEffect(() => {
    getStreak();
  }, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

  // Render loading state if streak data is not yet available
  if (currentStreak === null || longestStreak === null) {
    return <div>Loading streak...</div>;
  }

  // set which symbol via url to display if today's workout is done or not
  var doneTodaySymbol;
  if (doneToday) {
    doneTodaySymbol = 'https://icones.pro/wp-content/uploads/2021/02/icone-de-tique-ronde-verte.png'
  } else {
    doneTodaySymbol = 'https://icones.pro/wp-content/uploads/2021/04/logo-excel-rouge.png'
  }

  return (
    <div id="streakContainer">
      <h2>Streak & Stats</h2>
      <p>Today Done: &nbsp;
          <img src={doneTodaySymbol}
            style={{width:'50px', height:'50px'}}></img>
      </p>
      <p>Current Streak: {currentStreak}</p>
      <p>Longest Streak: {longestStreak}</p>
      <p>Number of days completed workout: {daysDone}</p>
      <p>Number of days missed workout: {daysMissed}</p>
    </div>
  );
};



// PAGE RENDER COMPONENT
const Fitness = () => {
  
  // used to disable button after clicking until current execution is finished
  const [isFormSubmitting, setFormSubmitting] = useState(false);

  // function to update user in database with workout plan
  async function addWorkoutToUser(event) {
    event.preventDefault();

    // store form variables
    var muscleGroups = Array.from(event.target.elements)
    .filter((element) => element.type === 'checkbox' && element.checked)
    .map((element) => element.name);
    if (muscleGroups.length == 0) {
      muscleGroups = ["all"];
    }
    var level = event.target.intensity.value;

    // ignore form submission if already submitting
    if (isFormSubmitting) {
      return;
    }
    setFormSubmitting(true);

    // key to store individual workout
    const today = new Date().toISOString().slice(0, 10);
    const workoutKey = "workout_" + today;
    // workout to write into user database, will generate with server side call to workouts.js
    const workout = {};

    // data we are sending to server.js via app.put
    const data = {
      workoutKey,
      workout,
      muscleGroups,
      level,
    };

    // call server.js app.put method
    const response = await fetch(
      `http://localhost:${port}/fitness/${username}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const updatedUser = await response.json();
    console.log(
      "New workout " 
        + JSON.stringify(updatedUser.workouts) 
        + ` added to ${username}  `
    );
    // re-enable button after finishing code
    setFormSubmitting(false);
    // reload page so new workout is displayed
    window.location.reload();
  }

  const ExerciseModal = ({ isOpen, onRequestClose }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Image Popup"
        appElement={document.getElementById("root")}
        ariaHideApp={false}
      >
        Modal content goes here
        <img className={styles.modalImage} src="" alt="Image" />
        <p>Modal is working now</p>
      </Modal>
    );
  };

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  // For completeAllExercises button
  const [numberOfExercises, setNumberOfExercises] = useState(99);
  const [completeAllExercisesClicked, setCompleteAllExercisesClicked] = useState(false);
  useEffect(() => {
    const storedValue = localStorage.getItem('numberOfExercises');
      setNumberOfExercises(Number(storedValue));
  }, []);
  useEffect(() => {
    localStorage.setItem('numberOfExercises', numberOfExercises);
  }, [numberOfExercises]);

  // COMPLETE ALL EXERCISES BUTTON SHOULD CALL TWO SERVER METHODS
  const completeAllExercises = async () => {
    // console.log("All exercises complete! Top");

    // disable the button after it is clicked
    setCompleteAllExercisesClicked(true);

    // incriment the user field: streak
    try {
      const response = await fetch(`http://localhost:${port}/fitness/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // Replace with the actual username
        }),
      });

      if (response.ok) {
        // Field update successful
        console.log('Field updated successfully!');
      } else {
        // Field update failed
        console.log('Field update failed!');
      }
    } catch (error) {
      console.log('Error updating field:', error);
    }

    // reload page to rerender everything
    window.location.reload();

    // console.log("All exercises complete! Bottom");
  };

  // Pseudo-event listener for when numberOfExercises is modified
  const prevNumberOfExercisesRef = useRef(localStorage.getItem('numberOfExercises'));
  useEffect(() => {
    const checkLocalStorage = () => {
      const currentNumberOfExercises = localStorage.getItem('numberOfExercises');
      if (currentNumberOfExercises !== prevNumberOfExercisesRef.current) {
        // console.log('numberOfExercises has been modified:', currentNumberOfExercises);
        prevNumberOfExercisesRef.current = currentNumberOfExercises;
        setNumberOfExercises(Number(currentNumberOfExercises)); // Trigger re-render
      }
    };
    const interval = setInterval(checkLocalStorage, 1000); 
    return () => {
      clearInterval(interval);
    };
  }, []);


  // return for Fitness()
  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.fitnessContainer}`}
    >
      <div className={`card ${styles.exerciseCard}`}>
        <div className={`card-body ${styles.fitnessCardBody}`}>
          
          
          {/* <form id="getUserStats" onSubmit={getUserStats}>
            <input type="hidden" name="username" value={username}></input>
            <button type="submit">Test Get User Stats</button>
          </form> */}
          
          {/* <form id="updateStreaks" onSubmit={updateStreaks}>
            <button type="submit">Test Cron Job</button>
          </form> */}


          <div>
            <form id="addWorkout" onSubmit={addWorkoutToUser}>
              {/* SEND USERNAME FOR DATABASE SEARCH */}
              <input type="hidden" name="username" value={username}></input>

              {/* SEND INTENSITY FOR WORKOUT GENERATION */}
              
              <input type="radio" id="beginnerOption" name="intensity" value="beginner" className="btn-check"></input>
              <label htmlFor="beginnerOption" className="btn btn-outline-primary">Beginner</label>
              <input type="radio" id="intermediateOption" name="intensity" value="intermediate" className="btn-check" defaultChecked={true}></input>
              <label htmlFor="intermediateOption" className="btn btn-outline-primary">Intermediate</label>
              <input type="radio" id="expertOption" name="intensity" value="expert" className="btn-check"></input>
              <label htmlFor="expertOption" className="btn btn-outline-primary">Expert</label>
              <p>Select desired intensity level for workout</p>
              <br />

              {/* SEND MUSCLE GROUPS FOR WORKOUT GENERATION */}
              
              <input type="checkbox" name="arms" className="btn-check" id="arms"></input>
              <label className="btn btn-outline-primary" htmlFor="arms">Arms</label>
              <input type="checkbox" name="legs" className="btn-check" id="legs"></input>
              <label className="btn btn-outline-primary" htmlFor="legs">Legs</label>
              <input type="checkbox" name="chest" className="btn-check" id="chest"></input>
              <label className="btn btn-outline-primary" htmlFor="chest">Chest</label>
              <input type="checkbox" name="chest" className="btn-check" id="chest"></input>
              <label className="btn btn-outline-primary" htmlFor="back">Back</label>
              <input type="checkbox" name="back" className="btn-check" id="back"></input>
              <label className="btn btn-outline-primary" htmlFor="shoulders">Shoulders</label>
              <input type="checkbox" name="shoulders" className="btn-check" id="shoulders"></input>
              <label className="btn btn-outline-primary" htmlFor="core">Core</label>
              <input type="checkbox" name="core" className="btn-check" id="core"></input>
              <label className="btn btn-outline-primary" htmlFor="glutes">Glutes</label>
              <input type="checkbox" name="glutes" className="btn-check" id="glutes"></input>
              <p>Select muscle groups you want to focus on</p>

              <br />

              {/* button displays different text if clicked or not clicked */}
              <button
                type="submit"
                className="btn btn-success"
                disabled={isFormSubmitting}
              >
                {isFormSubmitting ? (
                  <div>
                    <p>Generating...</p>
                    {/* Bootstrap loadinng circle */}
                    <div id="processing" className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>
                  </div>
                ) : (
                  "Create new workout plan"
                )}
              </button>

              <p>
                <small>Generating takes 30-60 seconds</small>
                <br />
                <small>If you just registered a new account, please wait 1 minute for your new workout to appear</small>
              </p>
            </form>
          </div>
          

          <Streak />



            <Workout workout={workout} handleOpenModal={handleOpenModal} />
          {showModal && (
            <ExerciseModal
              isOpen={showModal}
              onRequestClose={handleCloseModal}
             />
          )}
          <button id="completeAll" 
            onClick={completeAllExercises} 
            disabled={numberOfExercises !== 0 || completeAllExercisesClicked || doneToday}
            >Mark ALL exercises complete!
          </button>
          

        </div>
      </div>
    </div>
  );
};

export default Fitness;
