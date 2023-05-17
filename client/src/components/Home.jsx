import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { ProgressBar } from "react-step-progress-bar";
import axios from "axios";
import { addScaleCorrector, Reorder } from "framer-motion";

import "react-step-progress-bar/styles.css";
import styles from "../css/home.module.css";

const Home = () => {
  // Formatting for date, to be used in toLocaleDateString function
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Instantiate an object with today's date
  const today = new Date();
  const date = today.toLocaleDateString("en-CA", dateOptions);

  // Fetches exercises from database
  async function fetchExercises() {
    try {
      const response = await axios.get(
        `http://localhost:5050/fitness/${localStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response == "empty") {
        setItems(["empty"]);
      } else {
        // Assigns the object containing today's exercise to the variable
        const exercisesForToday = response.data[date];
        console.log(exercisesForToday);

        /* Gets array containing keys of the object. The map() function
        then iterates over each key to create the exerciseDetailsArray */
        const exerciseDetailsArray = Object.keys(exercisesForToday).map(
          (key) => {
            const exercise = exercisesForToday[key];
            const detailsString = `${exercise.name},
             Sets and Reps: ${exercise.setsAndReps},
             Calories: ${exercise.calories}`;
            return detailsString;
          }
        );
        // set items variable to contain the exercise array after retrieving it
        setItems(exerciseDetailsArray);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect hook to call fetchExercises function
  useEffect(() => {
    fetchExercises();
  }, []);
  const [items, setItems] = useState(["rest day"]);
  // End of fetchExercises function

  // Text animation
  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  // useState hook variables for the username
  const [userName, setUserName] = useState("");

  // Retrieves logged in user's name
  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await axios.get(
          `http://localhost:5050/users/${localStorage.getItem("username")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const firstName = response.data.firstName;
        console.log(firstName);
        setUserName(firstName);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchUserName();
  }, []);
  // End of user name retrieval

  // useState hook variables for the tips
  const [tip, setTip] = useState("");

  // Retrieves and displays a random diet or fitness tip from MongoDB
  useEffect(() => {
    async function fetchTip() {
      try {
        const currentDate = new Date().toISOString().slice(0, 10);
        const storedDate = localStorage.getItem("tipDate");
        const storedTip = localStorage.getItem("tip");

        if (storedDate === currentDate && storedTip) {
          setTip(storedTip);
        } else {
          const response = await axios.get("http://localhost:5050/home/tips");
          const newTip = response.data.tip;
          setTip(newTip);
          localStorage.setItem("tipDate", currentDate);
          localStorage.setItem("tip", newTip);
        }
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchTip();
  }, []);
  // End of tip retrieval

  // useState hook variables for the challenges
  const [challenges, setChallenges] = useState([]);

  // Retrieves the challenges from MongoDB
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/home/challenges"
        );
        setChallenges(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChallenges();
  }, []);
  // End of challenges retrieval

  // Retrieves user's completion status from MongoDB
  const fetchCompletionStatus = async () => {
    try {
      const response = await fetch("MongoDB status here");
      const data = await response.json();
    } catch (error) {
      console.log("Failed to retrieve completion status from the server");
    }
  };

  useEffect(() => {
    fetchCompletionStatus();
  }, []);
  // End of completion status retrieval

  // Increments the progress bar based on completion
  const [dietProgress, setDietProgress] = useState(0);
  const [fitnessProgress, setFitnessProgress] = useState(0);

  const handleDietProgressChange = (newProgress) => {
    setDietProgress(newProgress);
  };

  const handleFitnessProgressChange = (newProgress) => {
    setFitnessProgress(newProgress);
  };

  // Renders Home.jsx component
  return (
    <div className={`row justify-content- ${styles.cardWrapper}`}>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.homeCard}`}
      >
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <animated.h1 className={styles.homeHeader} style={greetings}>
              Welcome, <span className={styles.username}>{userName}</span>!
            </animated.h1>
            <animated.h4 className={styles.homeHeader} style={greetings}>
              Here's your daily tip:
            </animated.h4>
            <animated.h4 className={styles.homeHeader} style={greetings}>
              {tip}
            </animated.h4>
            <animated.h4 className={styles.homeHeader} style={greetings}>
              Track your diet and fitness progresses below.
            </animated.h4>
          </div>
        </div>
      </div>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.challengeCard}`}
      >
        <div className="card-body">
          {challenges.length > 0 ? (
            challenges.map((challenge) => (
              <div key={challenge._id}>
                <h5 className="card-title">{challenge.challenge}</h5>
                <p className="card-text">{challenge.points}</p>
              </div>
            ))
          ) : (
            <p>No challenges available.</p>
          )}
        </div>
      </div>
      <animated.div
        className={`col-md mx-md-3 h-100 ${styles.progressCard}`}
        style={greetings}
      >
        <div className={styles.progressInnerCard}>
          <h4 className={styles.progressHeader}>Diet Tracker</h4>
          <div className={styles.progressBarContainer}>
            <ProgressBar
              percent={dietProgress}
              filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
            />
          </div>
          <button
            className={`btn btn-primary ${styles.progressBtn}`}
            onClick={() => handleDietProgressChange(25)}
          >
            Update Progress
          </button>
        </div>
      </animated.div>

      <animated.div
        className={`col-md mx-md-3 h-100 ${styles.progressCard}`}
        style={greetings}
      >
        <div className={styles.progressInnerCard}>
          <h4 className={styles.progressHeader}>Fitness Tracker</h4>
          <div className={styles.progressBarContainer}>
            <ProgressBar
              percent={fitnessProgress}
              filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
            />
          </div>
          <button
            className={`btn btn-primary ${styles.progressBtn}`}
            onClick={() => handleFitnessProgressChange(25)}
          >
            Update Progress
          </button>
        </div>
      </animated.div>
      <animated.div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.progressCard} ${styles.draggableList}`}
        style={greetings}
      >
        <animated.div className={styles.progressInnerCard} style={greetings}>
          <Reorder.Group onReorder={setItems} values={items}>
            <p className={styles.exerciseDate}>Exercises for {date}</p>
            {items.map((item) => (
              <Reorder.Item key={item} value={item}>
                {item}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </animated.div>
      </animated.div>
    </div>
  );
  // End of Home.jsx component render
};

export default Home;
