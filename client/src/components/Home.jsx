import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { ProgressBar, Step } from "react-step-progress-bar";

import "react-step-progress-bar/styles.css";
import styles from "../css/home.module.css";

const Home = () => {
  const [progress, setProgress] = useState(0);

  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  const fetchCompletionStatus = async () => {
    try {
      const response = await fetch("MongoDB status here");
      const data = await response.json();
      setProgress(data.completed ? 100 : 50);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompletionStatus();
  }, []);

  const handleIncrement = (incrementValue) => {
    setProgress((prevProgress) => {
      const newProgress = prevProgress + incrementValue;
      return newProgress > 100 ? 100 : newProgress;
    });
  };

  return (
    <div className={styles.cardWrapper}>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.homeCard}`}
      >
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <animated.h1
              className={styles.title}
              style={greetings}
            >
              Hello BBY-01!
            </animated.h1>
            <animated.h1
              className={styles.title}
              style={greetings}
            >
              Track your diet and fitness progresses below.
            </animated.h1>
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
};

export default Home;
