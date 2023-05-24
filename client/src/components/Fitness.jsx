import React, {useState, useEffect, useRef} from "react";
import styles from "../css/fitness.module.css";
import Modal from "react-modal";
import {useSpring, animated} from "react-spring";
import {VictoryPie, VictoryLabel} from "victory";
import axios from "axios";

// import server hosting port
const port = "5050";

// used to identify user for database modification
const username = localStorage.getItem("username");

// FUNCTION CALLED TO CONNECT TO DATABASE AND GET FIRST WORKOUT PLAN OBJECT
var workout;
async function getWorkout() {
  var response = await fetch(
    `https://healthify-server.vercel.app/fitness/${username}`,
    {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    }
  );
  var data = await response.json();
  // check if workouts is empty
  if (data == "empty") {
    return "empty";
  } else {
    workout = data;
    return data;
  }
}

// FUNCTION TO GET USER'S NAME FOR EASTER EGG
var firstName;
var lastName;
async function getName() {
  var response = await fetch(
    `https://healthify-server.vercel.app/getName/${username}`,
    {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    }
  );
  var data = await response.json();
  firstName = data.firstName;
  lastName = data.lastName;
  // return [firstName, lastName];
}
getName();

// CHECK IF EXERCISE FOR TODAY ALREADY DONE
var doneToday = false;
async function getDoneToday() {
  var response = await fetch(
    `https://healthify-server.vercel.app/doneToday/${username}`,
    {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    }
  );
  var data = await response.json();
  doneToday = data;
}
getDoneToday();

// GET USER'S SEX FOR MODAL PICTURES
var sex = "male";
async function getSex() {
  var response = await fetch(
    `https://healthify-server.vercel.app/getSex/${username}`,
    {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    }
  );
  var data = await response.json();
  sex = data.toLowerCase();
}
getSex();

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
        className={styles.fitnessSVG}
        // view= x, y, width, height
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
        className={styles.fitnessSVG}
        // view= x, y, width, height
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

// PARSE AND DISPLAY WORKOUT PLAN FROM DATABASE
function Workout({handleOpenModal}) {
  const fadeIn = useSpring({
    opacity: 1,
    from: {opacity: 0},
    delay: 300,
  });

  const [workout, setWorkout] = useState(null);

  // passed to modal
  const [modalExercise, setModalExercise] = useState("");

  // use the today variable to determine which day of workout is rendered to display
  const [daysToAdd, setDaysToAdd] = useState(0);
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = today.toLocaleDateString("en-CA", dateOptions);
  // tracks which day x/7 of the weeklong workout plan is today's, going to use this to limit button navigation
  const [dayOfWorkoutPlan, setDayOfWorkoutPlan] = useState(0);

  // for previous day and next day button navigation
  const handleIncrementDays = () => {
    setDaysToAdd(daysToAdd + 1);
  };

  const handleDecrementDays = () => {
    setDaysToAdd(daysToAdd - 1);
  };

  const handleToToday = () => {
    setDaysToAdd(0);
  };

  useEffect(() => {
    async function fetchData() {
      // workoutData == the first workout plan object from the user database field workouts
      const workoutData = await getWorkout();

      // handles if workout field is empty
      if (workoutData === "empty") {
        setWorkout("No workout available");
      } else {
        function renderNestedObject(obj) {
          // check if current object is a nested object, recursively render its properties
          if (typeof obj === "object" && obj !== null) {
            return Object.keys(obj).map((key, index) => {
              // check if key matches date so only render the one day on the page
              if (key == date) {
                // tracks number of exercises on page, used for complete exercse buttons
                // using browser local storage because state variables not too disfunctional with so many sub-components
                let numOfExercises = Object.keys(workoutData[date]).length;
                localStorage.setItem("numberOfExercises", numOfExercises);

                // sets the dayOfWorkoutPlan equal to the index of the today's workout in the workoutPlan in database
                setDayOfWorkoutPlan(index);

                // check if empty rest day
                if (Object.keys(obj[key]).length === 0) {
                  // use this to check if current page is today to render title card
                  let options = {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  };
                  let today = new Date().toLocaleDateString("en-US", options);
                  // if this page is today
                  if (key == today) {
                    return (
                      <animated.div
                        key={index}
                        className={styles.day}
                        style={fadeIn}
                      >
                        <h5>Today, {key}:</h5> Rest day
                      </animated.div>
                    );
                    // if page is not today
                  } else {
                    return (
                      <div key={index} className={styles.day}>
                        <h5>{key}:</h5> Rest day
                      </div>
                    );
                  }

                  // sends the day title ex. Thursday, May 11, 2023:
                } else {
                  // use this to check if current page is today to render title card
                  let options = {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  };
                  let today = new Date().toLocaleDateString("en-US", options);
                  // if this page is today
                  if (key == today) {
                    return (
                      <div key={index} className={styles.day}>
                        <h5>Today, {key}</h5>
                        <div className={styles.exercisesContainer}>
                          {renderExerciseToday(obj[key])}
                        </div>
                      </div>
                    );
                    // if page is not today
                  } else {
                    return (
                      <div key={index} className={styles.day}>
                        <h5>{key}</h5>
                        <div className={styles.exercisesContainer}>
                          {renderExercise(obj[key])}
                        </div>
                      </div>
                    );
                  }
                }
                // return nothing if this workout-day-object does not match the desired day (current day + daysToAdd)
              } else {
                return null;
              }
            });
          }
          return obj;
        }

        // for the sublevel exercise object inside day object
        function renderExercise(exerciseObj) {
          return Object.keys(exerciseObj).map((exerciseKey, index) => {
            return (
              <div key={index} className={styles.anExercise}>
                {Object.entries(exerciseObj[exerciseKey]).map(
                  ([detailKey, detailValue]) => {
                    if (detailKey == "name") {
                      return (
                        <strong key={detailKey} className={styles.aKey}>
                          {detailValue}
                        </strong>
                      );
                    } else if (detailKey == "setsAndReps") {
                      return (
                        <div key={detailKey} className={styles.aKey}>
                          {detailValue}
                        </div>
                      );
                    } else if (detailKey == "calories") {
                      return (
                        <div key={detailKey} className={styles.aKey}>
                          Calories: {detailValue}
                        </div>
                      );
                      // shouldn't be any other option currently
                    } else {
                      return;
                    }
                  }
                )}

                {/* this opens up images for the exercise */}
                <div className={styles.exerciseButtonsContainer}>
                  <button
                    onClick={handleOpenModal}
                    className={`btn btn-info ${styles.modalButton}`}
                  >
                    Help
                  </button>
                </div>
              </div>
            );
          });
        }

        // for the sublevel exercise object inside day object
        function renderExerciseToday(exerciseObj) {
          // EASTER EGG Stuff
          const isSaitama = firstName.toLowerCase() == "saitama";

          return Object.keys(exerciseObj).map((exerciseKey, index) => {
            return (
              // EASTER EGG STUFF
              <div
                key={index}
                className={`${styles.anExercise} ${
                  isSaitama ? styles.saitamaStyle : ""
                }`}
                style={
                  isSaitama
                    ? {
                        backgroundImage:
                          "url('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')",
                        opacity: 1,
                        backgroundSize: "100% 100%",
                      }
                    : null
                }
              >
                {Object.entries(exerciseObj[exerciseKey]).map(
                  ([detailKey, detailValue]) => {
                    if (detailKey == "name") {
                      return (
                        <strong key={detailKey} className={styles.aKey}>
                          {detailValue}
                        </strong>
                      );
                    } else if (detailKey == "setsAndReps") {
                      return (
                        <div key={detailKey} className={styles.aKey}>
                          {detailValue}
                        </div>
                      );
                    } else if (detailKey == "calories") {
                      return (
                        <div key={detailKey} className={styles.aKey}>
                          Calories: {detailValue}
                        </div>
                      );
                      // shouldn't be any other option currently
                    } else {
                      return;
                    }
                  }
                )}

                <div className={styles.exerciseButtonsContainer}>
                  {/* this opens up images for the exercise */}
                  <button
                    onClick={handleOpenModal}
                    className={`btn btn-info ${styles.modalButton}`}
                  >
                    Help
                  </button>

                  {/* button to mark task completed */}
                  <CompleteExercisesButton />
                </div>
              </div>
            );
          });
        }

        // recursively go through the nested json object that is workoutData
        setWorkout(renderNestedObject(workoutData));

        function assignVariables(data, variablePrefix = "") {
          for (const key in data) {
            const value = data[key];
            // console.log("value: " + value);
            const variableName = variablePrefix + key;
            // console.log("variableName: " + variableName);

            if (typeof value === "object") {
              assignVariables(value, variableName + "_");
            } else {
              // Assign the value directly
              const variableValue = value;
              // dynamically generate a new variable with the name of the date and exercise
              // caution dangerous to use eval
              // fixed eval error by assigning each variableName the day of the week so only works on max 7-days plan
              // console.log("variableName: " + variableName + ". key: " + key + ". variableValue: " + variableValue);
              eval(
                `var ${variableName.substring(
                  0,
                  variableName.indexOf(",")
                )} = { key: "${key}", value: "${variableValue}" };`
              );
            }
          }
        }
        assignVariables(workoutData);
      }
    }

    fetchData();
  }, [daysToAdd]); // Trigger useEffect whenever daysToAdd changes

  // return for Workout()
  return (
    <div>
      {/* <h2>{username}'s 7-Day Workout</h2> */}
      <button
        onClick={handleToToday}
        disabled={daysToAdd == 0}
        className={`btn btn-info ${styles.paginationButton}`}
      >
        Today
      </button>

      <button
        onClick={handleDecrementDays}
        disabled={dayOfWorkoutPlan <= 0}
        className={`btn btn-info ${styles.paginationButton}`}
      >
        {/* left arrow */}
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      <button
        onClick={handleIncrementDays}
        disabled={dayOfWorkoutPlan >= 6}
        className={`btn btn-info ${styles.paginationButton}`}
      >
        {/* right arrow */}
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      <div>{workout}</div>
    </div>
  );
}

// FOR THE TASK COMPLETION BUTTONS
const CompleteExercisesButton = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      let numberOfExercises = parseInt(
        localStorage.getItem("numberOfExercises")
      );
      numberOfExercises--;
      localStorage.setItem("numberOfExercises", numberOfExercises);
    } else {
      let numberOfExercises = parseInt(
        localStorage.getItem("numberOfExercises")
      );
      numberOfExercises++;
      localStorage.setItem("numberOfExercises", numberOfExercises);
    }
  };
  return (
    <div onClick={handleClick}>
      <input className="form-check-input" type="checkbox"></input>
      <label className={`form-check-label ${styles.doneButton}`}>
        &nbsp;Done!
      </label>
    </div>
  );
};

// GET AND DISPLAY STREAK AND STATS
const Streak = () => {
  const [currentStreak, setCurrentStreak] = useState(null);
  const [longestStreak, setLongestStreak] = useState(null);
  const [doneToday, setDoneToday] = useState(null);
  const [daysDone, setDaysDone] = useState(null);
  const [daysMissed, setDaysMissed] = useState(null);
  // FUNCTION GETS USER STREAK STATS FROM DATABASE
  async function getStreak() {
    try {
      const response = await axios.get(
        `https://healthify-server.vercel.app/streak/${username}`
      );
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
  useEffect(() => {
    getStreak();
  }, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

  // Render loading state if streak data is not yet available
  if (currentStreak === null || longestStreak === null) {
    return <div>Loading streak...</div>;
  }

  // set which symbol via url to display if today's workout is done or not
  var doneTodaySymbol;
  var doneTodayMessage;
  if (doneToday) {
    doneTodaySymbol =
      "https://icones.pro/wp-content/uploads/2021/02/icone-de-tique-ronde-verte.png";
    doneTodayMessage = "Today Completed!";
  } else {
    doneTodaySymbol =
      "https://res.cloudinary.com/dqhi5isl1/image/upload/v1684885670/675px-White_X_in_red_background2_l79org.png";
    doneTodayMessage = "Today not yet done";
  }

  var percentDaysDone = (100 * daysDone) / (daysDone + daysMissed);
  percentDaysDone = Math.floor(percentDaysDone);
  // to prevent NaN error dividing 0
  if (daysDone + daysMissed == 0) {
    percentDaysDone = 0;
  }

  return (
    <div id="streakContainer" className={styles.streakContainer}>
      <div className={styles.doneContainer}>
        <img src={doneTodaySymbol} className={styles.doneTodaySymbol}></img>
        {doneTodayMessage}
      </div>

      {/* <MyBarChart currentStreak={currentStreak} longestStreak={longestStreak} /> */}

      <div id="graphs" className={styles.graphs}>
        <CirclePercentDaysDone percentDaysDone={percentDaysDone} />
        <CircleStreak
          currentStreak={currentStreak}
          longestStreak={longestStreak}
        />
      </div>
    </div>
  );
};

// PAGE RENDER COMPONENT
const Fitness = () => {
  // Text animation
  const fadeIn = useSpring({
    opacity: 1,
    from: {opacity: 0},
    delay: 300,
  });

  const [isWorkoutFormVisible, setWorkoutFormVisible] = useState(false);
  const toggleWorkoutFormVisibility = () => {
    setWorkoutFormVisible(!isWorkoutFormVisible);
  };

  // used to disable button after clicking until current execution is finished
  const [isFormSubmitting, setFormSubmitting] = useState(false);

  // function to update user in database with workout plan
  async function addWorkoutToUser(event) {
    event.preventDefault();

    // store form variables
    var muscleGroups = Array.from(event.target.elements)
      .filter((element) => element.type === "checkbox" && element.checked)
      .map((element) => element.name);
    if (muscleGroups.length == 0) {
      muscleGroups = ["all"];
    }
    var level = event.target.intensity.value;

    // ignore form submission if already submitting
    if (isFormSubmitting) {
      return;
    }
    setFormSubmitting(true);

    // key to store individual workout
    const today = new Date().toISOString().slice(0, 10);
    const workoutKey = "workout_" + today;
    // workout to write into user database, will generate with server side call to workouts.js
    const workout = {};

    // data we are sending to server.js via app.put
    const data = {
      workoutKey,
      workout,
      muscleGroups,
      level,
    };

    // call server.js app.put method
    const response = await fetch(
      `https://healthify-server.vercel.app/fitness/${username}`,
      {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      }
    );
    const updatedUser = await response.json();
    console.log(
      "New workout " +
        JSON.stringify(updatedUser.workouts) +
        ` added to ${username}  `
    );
    // re-enable button after finishing code
    setFormSubmitting(false);
    // reload page so new workout is displayed
    window.location.reload();
  }

  const ExerciseModal = ({isOpen, onRequestClose, modalExercise, sex}) => {
    //Overlay styling for the modal
    const overlayStyles = {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    };

    var source = "ModalExercise";
    if (modalExercise) {
      // img source is url to the dev branch folder of exercise images
      source =
        `https://raw.githubusercontent.com/glu16/2800-202310-BBY01/dev/client/src/img/exercises/${sex}/` +
        // replace whitespaces with underscore and tolowercase as per image naming convention
        modalExercise.replace(/\s/g, "_").toLowerCase() +
        `.gif`;
    }

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Image Popup"
        appElement={document.getElementById("root")}
        ariaHideApp={false}
        style={{overlay: overlayStyles}}
        className={styles.modal}
      >
        <strong>{modalExercise}</strong>
        {/* <small>{source}</small> */}
        <img
          className={styles.modalImage}
          src={source}
          alt="No image avaiable for this exercise."
        />
      </Modal>
    );
  };

  const [showModal, setShowModal] = useState(false);
  const [modalExercise, setModalExercise] = useState(null);

  const handleOpenModal = (event) => {
    // get the name of the exercise via html structure then send it to modal
    const strongElement =
      event.target.parentElement.parentElement.firstElementChild.textContent;
    setModalExercise(strongElement);
    // makes modal appear
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // For completeAllExercises button
  const [numberOfExercises, setNumberOfExercises] = useState(99);
  const [completeAllExercisesClicked, setCompleteAllExercisesClicked] =
    useState(false);
  useEffect(() => {
    const storedValue = localStorage.getItem("numberOfExercises");
    setNumberOfExercises(Number(storedValue));
  }, []);
  useEffect(() => {
    localStorage.setItem("numberOfExercises", numberOfExercises);
  }, [numberOfExercises]);

  // COMPLETE ALL EXERCISES BUTTON SHOULD CALL TWO SERVER METHODS
  const completeAllExercises = async () => {
    // console.log("All exercises complete! Top");

    // disable the button after it is clicked
    setCompleteAllExercisesClicked(true);

    // incriment the user field: streak
    try {
      const response = await fetch(
        `http://localhost:${port}/fitness/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username, // Replace with the actual username
          }),
        }
      );

      if (response.ok) {
        // Field update successful
        console.log("Field updated successfully!");
      } else {
        // Field update failed
        console.log("Field update failed!");
      }
    } catch (error) {
      console.log("Error updating field:", error);
    }

    // reload page to rerender everything
    window.location.reload();

    // console.log("All exercises complete! Bottom");
  };

  // Pseudo-event listener for when numberOfExercises is modified
  const prevNumberOfExercisesRef = useRef(
    localStorage.getItem("numberOfExercises")
  );
  useEffect(() => {
    const checkLocalStorage = () => {
      const currentNumberOfExercises =
        localStorage.getItem("numberOfExercises");
      if (currentNumberOfExercises !== prevNumberOfExercisesRef.current) {
        // console.log('numberOfExercises has been modified:', currentNumberOfExercises);
        prevNumberOfExercisesRef.current = currentNumberOfExercises;
        setNumberOfExercises(Number(currentNumberOfExercises)); // Trigger re-render
      }
    };
    const interval = setInterval(checkLocalStorage, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // return for Fitness()
  return (
    <animated.div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.fitnessContainer}`}
      style={fadeIn}
    >
      <h2>{username}'s Workout Plan</h2>

      {/* <form id="updateStreaks" onSubmit={updateStreaks}>
        <button type="submit">Test Cron Job</button>
      </form> */}

      <Streak />

      {showModal && (
        <ExerciseModal
          isOpen={showModal}
          onRequestClose={handleCloseModal}
          modalExercise={modalExercise}
          sex={sex}
        />
      )}

      <button
        onClick={toggleWorkoutFormVisibility}
        className={`btn btn-info ${styles.paginationButton}`}
      >
        {isWorkoutFormVisible
          ? "Hide Create Workout Plan Form"
          : "Create A New Workout Plan"}
      </button>

      <div
        id="workoutForm"
        className={`${styles.workoutForm} ${
          isWorkoutFormVisible ? "" : styles.hidden
        }`}
      >
        <form id={styles.addWorkout} onSubmit={addWorkoutToUser}>
          {/* SEND USERNAME FOR DATABASE SEARCH */}
          <input type="hidden" name="username" value={username}></input>

          {/* SEND INTENSITY FOR WORKOUT GENERATION */}

          <input
            type="radio"
            id="beginnerOption"
            name="intensity"
            value="beginner"
            className="btn-check"
          ></input>
          <label
            htmlFor="beginnerOption"
            className={`btn btn-info ${styles.formButtons}`}
          >
            Beginner
          </label>
          <input
            type="radio"
            id="intermediateOption"
            name="intensity"
            value="intermediate"
            className="btn-check"
            defaultChecked={true}
          ></input>
          <label
            htmlFor="intermediateOption"
            className={`btn btn-info ${styles.formButtons}`}
          >
            Intermediate
          </label>
          <input
            type="radio"
            id="expertOption"
            name="intensity"
            value="expert"
            className="btn-check"
          ></input>
          <label
            htmlFor="expertOption"
            className={`btn btn-info ${styles.formButtons}`}
          >
            Expert
          </label>
          <p>Select desired intensity level</p>
          <br />

          {/* SEND MUSCLE GROUPS FOR WORKOUT GENERATION */}

          <input
            type="checkbox"
            name="arms"
            className="btn-check"
            id="arms"
          ></input>
          <label
            className={`btn btn-info ${styles.formButtons}`}
            htmlFor="arms"
          >
            Arms
          </label>
          <input
            type="checkbox"
            name="legs"
            className="btn-check"
            id="legs"
          ></input>
          <label
            className={`btn btn-info ${styles.formButtons}`}
            htmlFor="legs"
          >
            Legs
          </label>
          <input
            type="checkbox"
            name="chest"
            className="btn-check"
            id="chest"
          ></input>
          <label
            className={`btn btn-info ${styles.formButtons}`}
            htmlFor="chest"
          >
            Chest
          </label>
          <input
            type="checkbox"
            name="back"
            className="btn-check"
            id="back"
          ></input>
          <label
            className={`btn btn-info ${styles.formButtons}`}
            htmlFor="back"
          >
            Back
          </label>
          <input
            type="checkbox"
            name="shoulders"
            className="btn-check"
            id="shoulders"
          ></input>
          <label
            className={`btn btn-info ${styles.formButtons}`}
            htmlFor="shoulders"
          >
            Shoulders
          </label>
          <input
            type="checkbox"
            name="core"
            className="btn-check"
            id="core"
          ></input>
          <label
            className={`btn btn-info ${styles.formButtons}`}
            htmlFor="core"
          >
            Core
          </label>
          <input
            type="checkbox"
            name="glutes"
            className="btn-check"
            id="glutes"
          ></input>
          <label
            className={`btn btn-info ${styles.formButtons}`}
            htmlFor="glutes"
          >
            Glutes
          </label>
          <p>Select muscle group(s) you want to focus on</p>

          <br />

          {/* button displays different text if clicked or not clicked */}
          <button
            type="submit"
            className={`btn btn-info ${styles.formButtons}`}
            disabled={isFormSubmitting}
          >
            {isFormSubmitting ? (
              <div>
                <p>Generating...</p>
                {/* Bootstrap loadinng circle */}
                <div id="processing" className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              "Create new workout plan"
            )}
          </button>

          <p>
            <small>Generating takes 30-60 seconds</small>
            <br />
            {/* <small>If you just registered a new account, please wait 1 minute for your new workout to appear</small> */}
          </p>
        </form>
      </div>
      <Workout workout={workout} handleOpenModal={handleOpenModal} />

      <button
        id="completeAllButton"
        className={`btn btn-success ${styles.completeAllButton}`}
        onClick={completeAllExercises}
        disabled={
          numberOfExercises !== 0 || completeAllExercisesClicked || doneToday
        }
      >
        Mark ALL exercises complete!
      </button>
    </animated.div>
  );
};

export default Fitness;
