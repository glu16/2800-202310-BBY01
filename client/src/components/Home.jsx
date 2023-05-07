import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { ProgressBar, Step } from "react-step-progress-bar";

import "react-step-progress-bar/styles.css";
import styles from "../css/home.module.css";

const Home = () => {

  /* Text animation */
  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });
  /* End of text animation */

  /* Retrieves and displays a random diet or fitness tip from MongoDB */
  const [tip, setTip] = useState("");

  useEffect(() => {
    fetch("/api/tips")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const randomIndex = Math.floor(Math.random() * data.length);
        setTip(data[randomIndex].tip);
      })
      .catch((error) => {
        console.log("Failed to fetch tip from the server");
      });
  }, []);
  /* End of tip retrieval */

  /* Retrieves user's completion status from MongoDB */
  const fetchCompletionStatus = async () => {
    try {
      const response = await fetch("MongoDB status here");
      const data = await response.json();
      setProgress(data.completed ? 100 : 50);
    } catch (error) {
      console.log("Failed to retrieve completion status from the server");
    }
  };

  useEffect(() => {
    fetchCompletionStatus();
  }, []);
  /* End of completion status retrieval */

  /* Increments the progress bar based on completion */
  const [progress, setProgress] = useState(0);
  
  const handleIncrement = (incrementValue) => {
    setProgress((prevProgress) => {
      const newProgress = prevProgress + incrementValue;
      return newProgress > 100 ? 100 : newProgress;
    });
  };
  /* End of progress bar increment */

  /* Renders Home.jsx component */
  return (
    <div className={styles.cardWrapper}>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.homeCard}`}
      >
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <animated.h1 className={styles.title} style={greetings}>
              Hello BBY-01!
            </animated.h1>
            <animated.h4 style={greetings}>Here's your daily tip:</animated.h4>
            <animated.h4 style={greetings}>{tip}</animated.h4>
            <animated.h4 className={styles.title} style={greetings}>
              Track your diet and fitness progresses below.
            </animated.h4>
          </div>
        </div>
      </div>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.progressCard}`}
      >
        <div className={styles.progressCard}>
          <h4 className={styles.progressHeader}>Diet Tracker</h4>
          <div className="card-body">
            <ProgressBar
              className={styles.progressBar}
              percent={progress}
              filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
            >
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    0
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    25
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    50
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    75
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    100
                  </div>
                )}
              </Step>
            </ProgressBar>
          </div>
        </div>
      </div>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.progressCard}`}
      >
        <div className={styles.progressCard}>
          <h4 className={styles.progressHeader}>Fitness Tracker</h4>
          <div className="card-body">
            <ProgressBar
              className={styles.progressBar}
              percent={progress}
              filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
            >
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    0
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    25
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    50
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    75
                  </div>
                )}
              </Step>
              <Step>
                {({ accomplished }) => (
                  <div className={`step ${accomplished ? "completed" : null}`}>
                    100
                  </div>
                )}
              </Step>
            </ProgressBar>
          </div>
        </div>
      </div>
    </div>
  );
  /* End of Home.jsx component render */
};

export default Home;
