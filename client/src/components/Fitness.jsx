import React from "react";

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

const Fitness = () => {
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card">
        <div className="fitness-card-body card-body">
        <h1>Exercises</h1>
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
