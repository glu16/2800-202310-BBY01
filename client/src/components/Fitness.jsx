import React from "react";
import axios from "axios"; 


import "../css/fitness.css";

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

// used to identify user for database modification
const userEmail = localStorage.getItem("email");

const Fitness = () => {
  // used to update user in database with workout plan
  async function handleSubmit(event) {
    event.preventDefault();

    // key to store individual workout
    const today = new Date().toISOString().slice(0, 10);
    const workoutKey = "workout_" + today;
    const workout = {
      "Day1": {
          "Exercise1": {
              "name": "Push-ups",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          },
          "Exercise2": {
              "name": "Bench press",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 150
          },
          "Exercise3": {
              "name": "Cable fly",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          }
      },
      "Day2": {
          "Exercise1": {
              "name": "Lat pulldown",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          },
          "Exercise2": {
              "name": "Seated cable row",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 150
          },
          "Exercise3": {
              "name": "Bent over row",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          }
      },
      "Day3": {
          "Exercise1": {
              "name": "Dumbbell fly",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          },
          "Exercise2": {
              "name": "Incline press",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 150
          },
          "Exercise3": {
              "name": "Dumbbell pullover",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          }
      },
      "Day4": {
          "Exercise1": {
              "name": "Cable chest press",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          },
          "Exercise2": {
              "name": "Chest dip",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 150
          },
          "Exercise3": {
              "name": "Push-up with rotation",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          }
      },
      "Day5": {
          "Exercise1": {
              "name": "Rowing machine",
              "setsAndReps": "Rowing machine, ",
              "calories": 300
          },
          "Exercise2": {
              "name": "Treadmill walk incline",
              "setsAndReps": "Treadmill walk incline, ",
              "calories": 300
          }
      },
      "Day6": {
          "Exercise1": {
              "name": "Elliptical machine",
              "setsAndReps": "Elliptical machine, ",
              "calories": 300
          },
          "Exercise2": {
              "name": "Stationary bike",
              "setsAndReps": "Stationary bike, ",
              "calories": 300
          }
      },
      "Day7": {
          "Exercise1": {
              "name": "Bodyweight squats",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          },
          "Exercise2": {
              "name": "Lunges",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 150
          },
          "Exercise3": {
              "name": "Leg press",
              "setsAndReps": "3 sets of 12 reps",
              "calories": 100
          }
      }
  }

    const data = { [workoutKey]: workout };
    const response = await fetch(`http://localhost:8000/users/${userEmail}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(data),
    });
    const updatedUser = await response.json();
    console.log("New workout " + updatedUser + " added to " + userEmail);
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card">
        <div className="fitness-card-body card-body">
        <h1>Exercises</h1>

        <div>
          {userEmail}
          <form id="addWorkout" onSubmit={handleSubmit}>
            <input type="hidden" name="userEmail" value={userEmail}></input>
            <button type="submit" className="btn btn-danger">Add workout plan to user</button>
          </form>
        </div>


          <div className="d-flex align-items-center text-center justify-content-center row">
            
            {exercises.map((exercise) => (
              <Exercises
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
