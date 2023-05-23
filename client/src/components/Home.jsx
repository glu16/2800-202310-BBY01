import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { ProgressBar } from "react-step-progress-bar";
import axios from "axios";
import { addScaleCorrector, Reorder } from "framer-motion";

import "react-step-progress-bar/styles.css";
import styles from "../css/home.module.css";

const Home = () => {
  // Retrieves the logged in user's username
  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await axios.get(
          `https://healthify-enxj.onrender.com/users/${localStorage.getItem("username")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const username = response.data.username;
        console.log("Logged in user's name:", username);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchUserName();
  }, []);
  // End of username retrieval

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
        `https://healthify-enxj.onrender.com/fitness/${localStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response === "empty") {
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
    delay: 300,
  });

  // useState hook variables for the username
  const [userName, setUserName] = useState("");

  async function fetchUserData() {
    try {
      const response = await axios.get(
        `http://localhost:5050/users/${localStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { firstName, points } = response.data;
      console.log(firstName);
      console.log(points);
      setUserName(firstName);
      setUserPoints(points);
    } catch (error) {
      console.error(error.message);
    }
  }

  // useEffect hook to retrieve logged in user's name
  useEffect(() => {
    fetchUserData();
  }, []);
  // End of user name retrieval

  // useState hook variables for the tips
  const [tip, setTip] = useState("");

  // useEffect hook that retrieves and displays a random diet or fitness tip from MongoDB
  useEffect(() => {
    async function fetchTip() {
      try {
        const currentDate = new Date().toISOString().slice(0, 10);
        const storedDate = localStorage.getItem("tipDate");
        const storedTip = localStorage.getItem("tip");

        if (storedDate === currentDate && storedTip) {
          setTip(storedTip);
        } else {
          const response = await axios.get("https://healthify-enxj.onrender.com/home/tips");
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

  // Function to retrieve challenges from MongoDB
  const fetchChallenges = async () => {
    try {
      const username = localStorage.getItem("username");
      const response = await axios.get(
        `http://localhost:5050/home/challenges/${username}`
      );
      setChallenges(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect hook to call fetchChallenges function
  useEffect(() => {
    fetchChallenges();
  }, []);
  // End of challenges retrieval

  // useState hook variables to add challenges
  const [userChallenges, setUserChallenges] = useState([]);

  // Function to add challenges
  const addChallenge = async (challengeId, challenge, points) => {
    try {
      const response = await axios.post(
        `https://healthify-enxj.onrender.com/home/challenges/${localStorage.getItem(
          "username"
        )}`,
        { challengeId, challenge, points }
      );
      console.log("Response:", response.data);
      console.log("Challenge added:", challenge);

      setUserChallenges((prevUserChallenges) => [
        ...prevUserChallenges,
        challengeId,
      ]);

      // Store updated user challenges in local storage
      const updatedChallenges = [...userChallenges, challengeId];
      setUserChallengesInStorage(updatedChallenges);
    } catch (error) {
      console.error("Error occurred while adding challenge:", error);
    }
  };

  // Click event handler for adding a challenge
  const handleAddChallenge = async (challengeId, points) => {
    const challenge = challenges.find(
      (challenge) => challenge._id === challengeId
    );

    // Checks to see if the challenge is valid
    if (!challenge) {
      console.error("Challenge not found");
      return;
    }

    // Constants for the challenge's fields
    const {
      _id,
      challenge: challengeString,
      points: challengePoints,
    } = challenge;

    // Add the challenge to the user's "completedChallenges" array
    try {
      await addChallenge(_id, challengeString, challengePoints);
      alert("Challenge added successfully!");
    } catch (error) {
      console.error(error);
      return;
    }
  };

  // useEffect hook to get logged in user's challenge's from localstorage
  useEffect(() => {
    // Get user challenges from localstorage on component mount
    const challenges = getUserChallengesFromStorage();
    setUserChallenges(challenges);
  }, []);

  // Function to get user challenges from localstorage
  function getUserChallengesFromStorage() {
    const userChallengesString = localStorage.getItem("userChallenges");
    if (userChallengesString) {
      return JSON.parse(userChallengesString);
    }
    return [];
  }

  // Function to set user challenges in local git rstorage
  function setUserChallengesInStorage(userChallenges) {
    localStorage.setItem("userChallenges", JSON.stringify(userChallenges));
  }

  // useState hook variables to apply the points
  const [userPoints, setUserPoints] = useState(0);

  // Function to handle completing a challenge
  const handleCompleteChallenge = async (challengeId, points) => {
    try {
      console.log("handleDoneClick called with challengeId:", challengeId);
      console.log("Points:", points);
      console.log("User's current points balance:", userPoints);

      // Adds the challenge points to the user's points balanace in the database
      await axios.put(
        `https://healthify-enxj.onrender.com/users/${localStorage.getItem("username")}`,
        { points: points, challengeId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Remove the challenge from the user's "challenges" array
      setUserChallenges((prevUserChallenges) =>
        prevUserChallenges.filter((id) => id !== challengeId)
      );

      // Remove the challenge from the user's "challenges" array in the database
      await axios.delete(
        `https://healthify-enxj.onrender.com/home/challenges/${localStorage.getItem(
          "username"
        )}/${challengeId}`
      );

      // Remove the challenge from localStorage
      const storedChallenges = getUserChallengesFromStorage();
      const updatedChallenges = storedChallenges.filter(
        (id) => id !== challengeId
      );
      localStorage.setItem("userChallenges", JSON.stringify(updatedChallenges));

      console.log("Challenge completed and points added!");
      window.alert("Challenge completed and points added!");
    } catch (error) {
      console.error("Error occurred while completing challenge:", error);
    }
    fetchUserData();
  };

  // useState hook variables for the completed challenges
  const [completedChallenges, setCompletedChallenges] = useState([]);

  // Click event handler for completing a challenge
  const handleDoneClick = (challengeId, points) => {
    // Update the user's points in the database
    handleCompleteChallenge(challengeId, points);

    // Add the completed challenge to the completedChallenges array
    setCompletedChallenges((prevCompletedChallenges) => [
      ...prevCompletedChallenges,
      challengeId,
    ]);

    // Remove the completed challenge from the challenges array
    setChallenges((prevChallenges) =>
      prevChallenges.filter((challenge) => challenge._id !== challengeId)
    );
  };

  // useState hook variables for the diet progress
  const [dietProgress, setDietProgress] = useState(0);

  // Click event handler to increment the diet progress
  const handleDietProgressChange = () => {
    setDietProgress(dietProgress + 25);
  };

  // useState hook variables for the fitness progress
  const [fitnessProgress, setFitnessProgress] = useState(0);

  // Click event handler to increment the fitness progress
  const handleFitnessProgressChange = () => {
    setFitnessProgress(fitnessProgress + 25);
  };

  // Renders Home.jsx component
  return (
    <div className={`row justify-content- ${styles.cardWrapper}`}>
      <animated.div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.homeCard}`}
        style={greetings}>
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
          </div>
        </div>
      </animated.div>
      <animated.div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.challengeCard}`}
        style={greetings}>
        <animated.div className="card-body" style={greetings}>
          <div className={styles.challengeInnerCard}>
            <h1 className={styles.challengeHeader} style={greetings}>
              Weekly Challenges
            </h1>
            {/* {console.log("Challenges:", challenges)} */}
            {challenges.length > 0 ? (
              challenges
                .filter(
                  (challenge) => !completedChallenges.includes(challenge._id)
                )
                .map((challenge) => (
                  <div key={challenge._id}>
                    <h5 className="card-title">
                      Challenge: {challenge.challenge}
                    </h5>
                    <h5 className="card-text">Points: {challenge.points}</h5>
                    {userChallenges.includes(challenge._id) ? (
                      <button
                        id={`doneButton_${challenge._id}`}
                        className={`btn btn-success ${styles.challengeBtn}`}
                        onClick={() => {
                          handleDoneClick(challenge._id, challenge.points);
                        }}>
                        Done
                      </button>
                    ) : (
                      <button
                        className={`btn btn-primary ${styles.challengeBtn}`}
                        onClick={() =>
                          handleAddChallenge(challenge._id, challenge.points)
                        }>
                        Add Challenge
                      </button>
                    )}
                  </div>
                ))
            ) : (
              <p className={styles.noChallenge}>No challenges available.</p>
            )}
            <hr />
            <h5 className={styles.pointsBalance}>
              Points Balance: {userPoints}
            </h5>
          </div>
        </animated.div>
      </animated.div>

      <animated.div
        className={`col-md mx-md-3 h-100 ${styles.progressCard} ${styles.diet}`}
        style={greetings}>
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
            onClick={() => handleDietProgressChange(25)}>
            Update Progress
          </button>
        </div>
      </animated.div>
      <animated.div
        className={`col-md mx-md-3 h-100 ${styles.progressCard} ${styles.fitness}`}
        style={greetings}>
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
            onClick={() => handleFitnessProgressChange(25)}>
            Update Progress
          </button>
        </div>
      </animated.div>
      <animated.div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.progressCard} ${styles.draggableList}`}
        style={greetings}>
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
