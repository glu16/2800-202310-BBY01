import React, { useState, useEffect } from "react";
import { useSpring, useSprings, animated } from "react-spring";
import { ProgressBar } from "react-step-progress-bar";
import axios from "axios";

import "react-step-progress-bar/styles.css";
import styles from "../css/home.module.css";

const Home = () => {
  /* React Spring animation to create text animation */
  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });
  /* End of text animation */

  /* React Spring animation to create a draggable list */
  const listData = [
    { id: 1, text: "Deadlift: 4 Sets x 8 Reps" },
    { id: 2, text: "Seated Cable Row: 3 Sets x 12 Reps" },
    { id: 3, text: "Bench Press: 4 Sets x 8 Reps" },
  ];

  const [springs, setSprings] = useSprings(listData.length, (index) => ({
    y: index * 70,
    zIndex: listData.length - index,
  }));

  const handleDrag = (index) => (event) => {
    setSprings((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [prev];
      return prevArray.map((props, i) => {
        return i === index
          ? { ...props, y: event.clientY - 35, zIndex: listData.length }
          : props;
      });
    });
  };

  const handleDragEnd = (index) => {
    setSprings((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [prev];
      return prevArray.map((props, i) => {
        return i === index
          ? { ...props, y: index * 70, zIndex: listData.length - index }
          : props;
      });
    });
  };
  /* End of draggable list animation */

  const [userName, setUserName] = useState("");

  /* Retrieves logged in user's name */
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
  /* End of user name retrieval */

  /* Retrieves and displays a random diet or fitness tip from MongoDB */
  const [tip, setTip] = useState("");

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
  /* End of tip retrieval */

  /* Retrieves user's completion status from MongoDB */
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
  /* End of completion status retrieval */

  /* Increments the progress bar based on completion */
  const [dietProgress, setDietProgress] = useState(0);
  const [fitnessProgress, setFitnessProgress] = useState(0);

  const handleDietProgressChange = (newProgress) => {
    setDietProgress(newProgress);
  };

  const handleFitnessProgressChange = (newProgress) => {
    setFitnessProgress(newProgress);
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
            <animated.h1 className={styles.homeHeader} style={greetings}>
              Welcome, {userName}!
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
        className={`d-flex justify-content-center align-items-center h-100 ${styles.progressCard}`}
      >
        <div className={styles.progressCard}>
          <h4 className={styles.progressHeader}>Diet Tracker</h4>
          <div className="progress-bar-container">
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
      </div>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.listCard}`}
      >
        {springs.map((props, index) => (
          <animated.div
            key={listData[index].id}
            style={{
              ...props,
              position: "absolute",
              width: "100%",
              height: "70px",
              cursor: "grab",
            }}
            onMouseDown={handleDrag(index)}
            onTouchStart={handleDrag(index)}
            onMouseUp={() => handleDragEnd(index)}
            onTouchEnd={() => handleDragEnd(index)}
          >
            {listData[index].text}
          </animated.div>
        ))}
      </div>
    </div>
  );
  /* End of Home.jsx component render */
};

export default Home;
