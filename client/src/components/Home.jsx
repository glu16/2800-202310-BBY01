// Import statements
import React, {useState, useEffect} from "react";
import {useSpring, animated} from "react-spring";
import {ProgressBar} from "react-step-progress-bar";
import {Reorder} from "framer-motion";
import {VictoryPie, VictoryLabel} from "victory";
import axios from "axios";

// CSS for progress bar import statement
import "react-step-progress-bar/styles.css";
// CSS module import statement
import styles from "../css/home.module.css";

const Home = () => {
  // useEffect hook that retrieves the logged in user's username
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
        // console.log("Logged in user's name:", username);
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchUserName();
  }, []);
  // End of useEffect hook that retrieves the logged in user's username

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
        // console.log(exercisesForToday);
        if (exercisesForToday === undefined) {
          return;
        }
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

  // Stores total number of calories suggested to be consumed
  const [calories, setCalories] = useState(0);

  // Tracks number of calories consumed
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);

  async function getDiet() {
    try {
      const response = await axios.get(
        `https://healthify-enxj.onrender.com/diet/${localStorage.getItem("username")}`
      );
      if (response === "empty") {
        return "empty";
      } else {
        // Assigns the object containing today's meals to the variable
        const dietForToday = response.data[date];
        var caloriesForToday = 0;
        if (dietForToday === undefined) {
          return;
        }
        // Sums up the total Calories of all the meals suggested for current day
        for (let i = 1; i <= 5; i++) {
          caloriesForToday += Number(dietForToday[`Meal ${i}`].Calories);
        }
        // Sets calories variable to contain caloriesForToday
        setCalories(caloriesForToday);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect hook to call getDiet function
  useEffect(() => {
    getDiet();
    console.log("Calories for today: " + calories);
  }, []);
  // End of getDiet function

  const CirclePercentDaysDone = ({percentDaysDone}) => {
    const data = [
      {x: 1, y: percentDaysDone},
      {x: 2, y: 100 - percentDaysDone},
    ];
    const svgSize = 150; // Adjust the size of the SVG container
    const radius = (svgSize - 65) / 2; // Adjust the radius of the circle
    let color;
    if (percentDaysDone >= 66) {
      color = "green";
    } else if (percentDaysDone >= 33) {
      color = "yellow";
    } else {
      color = "red";
    }
    return (
      <div className={styles.graph}>
        <svg
          className={styles.homeSVG}
          // view = x, y, width, height
          viewBox={` ${svgSize / 4.3} ${svgSize / 5} ${svgSize / 1.7} ${
            svgSize / 1.7
          }`}
          width={svgSize}
          height={svgSize}
        >
          <VictoryPie
            standalone={false}
            width={svgSize}
            height={svgSize}
            data={data}
            innerRadius={radius - 10}
            cornerRadius={25}
            labels={() => null}
            style={{
              data: {
                fill: ({datum}) => (datum.x === 1 ? color : "transparent"),
              },
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={svgSize / 2}
            y={svgSize / 2}
            text={`${percentDaysDone}%`}
            style={{fontSize: 20, fill: "white"}}
          />
        </svg>
        <p>Workout Completion Rate</p>
      </div>
    );
  };

  const CircleStreak = ({currentStreak, longestStreak}) => {
    const percentStreak = (100 * currentStreak) / longestStreak;
    const data = [
      {x: 1, y: percentStreak},
      {x: 2, y: 100 - percentStreak},
    ];
    const svgSize = 150; // Adjust the size of the SVG container
    const radius = (svgSize - 65) / 2; // Adjust the radius of the circle
    const fontSize = 20; // Adjust the font size of the label
    let color;
    if (percentStreak == 100) {
      color = "green";
    } else if (percentStreak >= 50) {
      color = "yellow";
    } else {
      color = "red";
    }
    return (
      <div className={styles.graph}>
        <svg
          className={styles.homeSVG}
          // view = x, y, width, height
          viewBox={` ${svgSize / 4.3} ${svgSize / 5} ${svgSize / 1.7} ${
            svgSize / 1.7
          }`}
          width={svgSize}
          height={svgSize}
        >
          <VictoryPie
            standalone={false}
            width={svgSize}
            height={svgSize}
            data={data}
            innerRadius={radius - 10}
            cornerRadius={25}
            labels={() => null}
            style={{
              data: {
                fill: ({datum}) => (datum.x === 1 ? color : "transparent"),
              },
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={svgSize / 2}
            y={svgSize / 2}
            text={` ${currentStreak} / ${longestStreak} \n days`}
            style={{fontSize: 16, fill: "white"}}
          />
        </svg>
        <p>Current vs Longest Streak</p>
      </div>
    );
  };

  // Retrieves the user's streak and stats
  const Streak = () => {
    const [currentStreak, setCurrentStreak] = useState(null);
    const [longestStreak, setLongestStreak] = useState(null);
    const [doneToday, setDoneToday] = useState(null);
    const [daysDone, setDaysDone] = useState(null);
    const [daysMissed, setDaysMissed] = useState(null);
    // Function that retrieves the user's streak stats from the database
    async function getStreak() {
      const username = localStorage.getItem("username");
      try {
        const response = await axios.get(`https://healthify-enxj.onrender.com/streak/${username}`);

        setCurrentStreak(response.data.currentStreak);
        setLongestStreak(response.data.longestStreak);
        setDoneToday(response.data.doneToday);
        setDaysDone(response.data.daysDone);
        setDaysMissed(response.data.daysMissed);
      } catch (error) {
        // Handle any errors that occur during the fetch
        console.error("Error fetching streak:", error);
      }
    }
    getStreak();

    // Render loading state if streak data is not yet available
    if (currentStreak === null || longestStreak === null) {
      return <div>Loading streak...</div>;
    }

    // Set which symbol via url to display if today's workout is done or not
    var doneTodaySymbol;
    var doneTodayMessage;
    if (doneToday) {
      doneTodaySymbol =
        "https://icones.pro/wp-content/uploads/2021/02/icone-de-tique-ronde-verte.png";
      doneTodayMessage = "Exercises for today completed!";
    } else {
      doneTodaySymbol =
        "https://res.cloudinary.com/dqhi5isl1/image/upload/v1684885670/675px-White_X_in_red_background2_l79org.png";
      doneTodayMessage = "Exercises not completed";
    }

    var percentDaysDone = Math.floor(
      (100 * daysDone) / (daysDone + daysMissed)
    );
    // to prevent NaN error dividing 0
    if (daysDone + daysMissed == 0) {
      percentDaysDone = 0;
    }

    return (
      <div id="streakContainer" className={styles.streakContainer}>
        <div className={styles.doneContainer}>
          <img src={doneTodaySymbol} className={styles.doneTodaySymbol}></img>
          <p>{doneTodayMessage}</p>
        </div>

        {/* <MyBarChart currentStreak={currentStreak} longestStreak={longestStreak} /> */}

        <CirclePercentDaysDone percentDaysDone={percentDaysDone} />
        <CircleStreak
          currentStreak={currentStreak}
          longestStreak={longestStreak}
        />

        {/* Current streak: {currentStreak} 
      <br />
      Longest streak: {longestStreak} 
      <br />
      Days completed: {daysDone}
      <br />
      Days missed: {daysMissed} */}
      </div>
    );
  };

  // Visual text animation effects
  const greetings = useSpring({
    opacity: 1,
    from: {opacity: 0},
    delay: 300,
  });
  // End of visual text animation effects

  // useState hook variables for the username
  const [userName, setUserName] = useState("");

  async function fetchUserData() {
    try {
      const response = await axios.get(
        `https://healthify-enxj.onrender.com/users/${localStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const {firstName, points} = response.data;
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
  // End of useEffect hook to retrieve logged in user's name

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
  // End of useEffect hook that retrieves and displays a random diet or fitness tip from MongoDB

  // useState hook variables for the challenges
  const [challenges, setChallenges] = useState([]);

  // Function to retrieve challenges from MongoDB
  const fetchChallenges = async () => {
    try {
      const username = localStorage.getItem("username");
      const response = await axios.get(
        `https://healthify-enxj.onrender.com/home/challenges/${username}`
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
  // End of useEffect hook to call fetchChallenges function

  // useState hook variables to add challenges
  const [userChallenges, setUserChallenges] = useState([]);

  // Function to add challenges
  const addChallenge = async (challengeId, challenge, points) => {
    try {
      const response = await axios.post(
        `https://healthify-enxj.onrender.com/home/challenges/${localStorage.getItem(
          "username"
        )}`,
        {challengeId, challenge, points}
      );
      // console.log("Response:", response.data);
      // console.log("Challenge added:", challenge);

      setUserChallenges((prevUserChallenges) => [
        ...prevUserChallenges,
        challengeId,
      ]);

      // Store updated user challenges in localStorage
      const updatedChallenges = [...userChallenges, challengeId];
      setUserChallengesInStorage(updatedChallenges);
    } catch (error) {
      console.error("Error occurred while adding challenge:", error);
    }
  };

  // Handle click event for adding a challenge
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

  // useEffect hook to get logged in user's challenge's from localStorage
  useEffect(() => {
    // Get user challenges from localStorage on component mount
    const challenges = getUserChallengesFromStorage();
    setUserChallenges(challenges);
  }, []);

  // Function to get user challenges from localStorage
  function getUserChallengesFromStorage() {
    const userChallengesString = localStorage.getItem("userChallenges");
    if (userChallengesString) {
      return JSON.parse(userChallengesString);
    }
    return [];
  }

  // Function to set user challenges in localStorage
  function setUserChallengesInStorage(userChallenges) {
    localStorage.setItem("userChallenges", JSON.stringify(userChallenges));
  }

  // useState hook variables to apply the points
  const [userPoints, setUserPoints] = useState(0);

  // Function to handle completing a challenge
  const handleCompleteChallenge = async (challengeId, points) => {
    try {
      // Adds the challenge points to the user's points balance in the database
      await axios.put(
        `https://healthify-enxj.onrender.com/users/${localStorage.getItem("username")}`,
        {points: points, challengeId},
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

      window.alert("Challenge completed and points added!");
    } catch (error) {
      console.error("Error occurred while completing challenge:", error);
    }
    fetchUserData();
  };

  // useState hook variables for the completed challenges
  const [completedChallenges] = useState([]);

  // Handle click event for completing a challenge
  const handleDoneClick = (challengeId, points) => {
    // Update the user's points in the database
    handleCompleteChallenge(challengeId, points);

    // Remove the completed challenge from the challenges array
    setChallenges((prevChallenges) =>
      prevChallenges.filter((challenge) => challenge._id !== challengeId)
    );
  };

  // useState hook variables for the diet progress
  const [dietProgress, setDietProgress] = useState(0);

  // localStorage boolean variable to track
  localStorage.setItem("caloriesMet", false);
  // Handle click event to increment the diet progress
  const handleDietProgressChange = () => {
    if (dietProgress < 100) {
      // Updates Calories consumed
      setCaloriesConsumed(caloriesConsumed + calories / 5);
      // Updates dietProgress bar
      setDietProgress(dietProgress + 20);
    } else {
      return;
    }
  };

  const handleDietCompletion = () => {
    localStorage.setItem("caloriesMet", true);
  };

  // Renders Home.jsx component
  return (
    <div className={`row justify-content- ${styles.cardWrapper}`}>
      <animated.div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.homeCard}`}
        style={greetings}
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
          </div>
        </div>
      </animated.div>
      <animated.div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.challengeCard}`}
        style={greetings}
      >
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
                        }}
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        className={`btn btn-primary ${styles.challengeBtn}`}
                        onClick={() =>
                          handleAddChallenge(challenge._id, challenge.points)
                        }
                      >
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
        style={greetings}
      >
        <div className={styles.progressInnerCard}>
          <h4 className={styles.progressHeader}>Diet Tracker</h4>
          <div className={styles.progressBarContainer}>
            <span className={styles.calories}>
              {" "}
              {caloriesConsumed} / {calories} Calories
            </span>
            <ProgressBar
              percent={dietProgress}
              height="18px"
              filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
            />
          </div>
          {caloriesConsumed === calories ? (
            <button
              className={`btn btn-primary ${styles.progressBtn}`}
              onClick={() => handleDietCompletion()}
              disabled={localStorage.getItem("caloriesMet") ? true : false}
            >
              Progress complete!
            </button>
          ) : (
            <button
              className={`btn btn-primary ${styles.progressBtn}`}
              onClick={() => handleDietProgressChange()}
            >
              Update Progress
            </button>
          )}
        </div>
      </animated.div>
      <animated.div
        className={`col-md mx-md-3 h-100 ${styles.progressCard} ${styles.fitness}`}
        style={greetings}
      >
        <div className={styles.progressInnerCard}>
          <h4 className={styles.progressHeader}>Fitness Tracker</h4>
          <Streak />
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
  // End of Home.jsx component
};

export default Home;
