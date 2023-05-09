import React, { useState, useEffect } from 'react';
import "../css/fitness.css";

// import server hosting port
const port = '8000';

// used to identify user for database modification
const userEmail = localStorage.getItem("email");

// get workout from user database

const exercises = [
  {
    day: "Day 1",
    exercise1: "Pull-ups",
    exercise2: "Push-ups",
    exercise3: "Running",
    calories1: 100,
    calories2: 100,
    calories3: 100,
  },
  {
    day: "Day 2",
    exercise1: "Squats",
    exercise2: "Leg Press",
    exercise3: "Lunges",
    calories1: 200,
    calories2: 100,
    calories3: 100,
  },
];

const Exercises = (props) => {
  return (
    <div className="card exerciseCard col-md">
      <h1>{props.day}</h1>
      <h3>Exercise 1</h3>
      <p>
        <b>{props.exercise1}</b>
      </p>
      <p>{props.calories1}</p>

      <h3>Exercise 2</h3>
      <p>
        <b>{props.exercise2}</b>
      </p>
      <p>{props.calories2}</p>

      <h3>Exercise 3</h3>
      <p>
        <b>{props.exercise3}</b>
      </p>
      <p>{props.calories3}</p>
    </div>
  );
};




// get user's workout from database, async parts
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
    workout = data[0];
    // console.log(data[0]); //full week
    // console.log(data[0].Day1); //day
    // console.log(data[0].Day1.Exercise2); //exericse
    // console.log(data[0].Day1.Exercise2.calories); //exercise-details
    console.log(data[0])
    return data[0];
  }
}


// display user's workout, can't be async
function Workout() {
  const [workout, setWorkout] = useState(null);

  // if (getWorkout() == "empty") {
  //   useEffect(()
  // }

  useEffect(() => {
    async function fetchData() {

      // recursive use of Array.map() to iterate through nested JSON object sent from server
      function renderNestedObject(obj) {
        // Check if the object is an array
        if (Array.isArray(obj)) {
          // If it's an array, recursively render its elements
          return obj.map((item, index) => (
            <div key={index}>{renderNestedObject(item)}</div>
          ));
        }
        // Check if the object is a nested object
        if (typeof obj === 'object' && obj !== null) {
          // If it's a nested object, recursively render its properties
          return Object.keys(obj).map((key, index) => (
            <div key={index}>
              <strong>{key}:</strong> {renderNestedObject(obj[key])}
            </div>
          ));
        }
        // Base case: render the value as is
        return obj;
      }
      setWorkout(renderNestedObject(await getWorkout()));
    }
    fetchData();
  }, []);
  
  return (
    <div>
      <h2>Your Workout</h2>
      <div>{workout}</div>
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
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card">
        <div className="fitness-card-body card-body">
        <h1>Exercises</h1>

        <div>
          {userEmail}
          <form id="addWorkout" onSubmit={addWorkoutToUser}>
            <input type="hidden" name="userEmail" value={userEmail}></input>
            <button type="submit" className="btn btn-success" disabled={isFormSubmitting}>
              {isFormSubmitting ? 'Generating...' : 'Create workout plan'}
              </button>
          </form>
        </div>


        <Workout/>



          <div className="d-flex align-items-center text-center justify-content-center row">
            
            {exercises.map((exercise, index) => (
              <Exercises
                key = {index}
                day={exercise.day}
                exercise1={exercise.exercise1}
                exercise2={exercise.exercise2}
                exercise3={exercise.exercise3}
                calories1={exercise.calories1}
                calories2={exercise.calories2}
                calories3={exercise.calories3}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fitness;
