import React, { useState } from 'react';
import styles from "../css/fitness.module.css";

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
  {
    day: "Day 3",
    exercise1: "Lat pulldowns",
    exercise2: "Cable rows",
    exercise3: "Deadlifts",
    calories1: 300,
    calories2: 200,
    calories3: 100,
  },
  {
    day: "Day 4",
    exercise1: "Bench Press",
    exercise2: "Shoulder Press",
    exercise3: "Tricep pulldowns",
    calories1: 200,
    calories2: 200,
    calories3: 100,
  },
  {
    day: "Day 5",
    exercise1: "Cable Flyes",
    exercise2: "Dips",
    exercise3: "Skull crushers",
    calories1: 100,
    calories2: 100,
    calories3: 100,
  },
  
  
  
];
const Exercises = (props) => {
  return (
    <div className={`card col-md ${styles.exerciseCard}`}>
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

// used to identify user for database modification
const userEmail = localStorage.getItem("email");

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
    const response = await fetch(`http://localhost:8000/fitness/${userEmail}`, {
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
    <div className={`d-flex justify-content-center align-items-center h-100`}>
      <div className={`card`}>
        <div className={`card-body ${styles.fitnessCardBody}`}>
        <h1 className={`${styles.title}`}>Exercises</h1>

        <div>
          {userEmail}
          <form id="addWorkout" onSubmit={addWorkoutToUser}>
            <input type="hidden" name="userEmail" value={userEmail}></input>
            <button type="submit" className="btn btn-success" disabled={isFormSubmitting}>
              {isFormSubmitting ? 'Generating...' : 'Create workout plan'}
              </button>
          </form>

        </div>


          <div className={`d-flex align-items-center text-center justify-content-center row`}>
            
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
