// Import statements
import React, { useState, useEffect, useRef } from 'react';
import styles from "../css/fitness.module.css";
import Modal from "react-modal";
import { VictoryPie, VictoryLabel } from 'victory';

// Username variable used to identify user for database interactions,
//  taken from local storage pushed there from login.
const username = localStorage.getItem("username");


// Function retrieves the user's workout plan from the database via a server call
//  and stores it globally in the variable 'workout'.
var workout;
async function getWorkout() {
  var response = await fetch(`https://healthify-enxj.onrender.com/fitness/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  var data = await response.json();
  if (data == "empty") {
    return "empty";
  } else {
    workout = data;
    return data;
  }
}


// Function retrieves the user's first name which will be used to identify them for Easter Eggs
//  and stores it globally in the variable 'firstName'.
//  Called immediately upon page loading.
var firstName = "";
async function getName() {
  var response = await fetch(`https://healthify-enxj.onrender.com/getName/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  var data = await response.json();
  firstName = data.firstName;
}
getName();


// Function retrieves the user's status of if they already completed today's workout or not
//  and stores it globally in the variable 'doneToday'.
//  Called immediately upon page loading.
var doneToday = false;
async function getDoneToday() {
  var response = await fetch(`https://healthify-enxj.onrender.com/doneToday/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  var data = await response.json();
  doneToday = data;
}
getDoneToday();


// Function retrieves the user's sex which is used to filter which exercise gif images are displayed
//  and stores it globally in the variable 'sex'.
//  Called immediately upon page loading.
var sex = "male";
async function getSex() {
  var response = await fetch(`https://healthify-enxj.onrender.com/getSex/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  var data = await response.json();
  sex = data.toLowerCase();
}
getSex();


// Function generates a circle graph representing the user's workout stat 'percentDaysDone' 
//  to be displayed on the page.
//  Source: Adapted from ChatGPT 
const CirclePercentDaysDone = ({percentDaysDone}) => {
  const data = [
    {x: 1, y: percentDaysDone},
    {x: 2, y: 100 - percentDaysDone},
  ];
  const svgSize = 150; 
  const radius = (svgSize - 65) / 2; 
  let color;
  if (percentDaysDone >= 66) {
    color = "green";
  } else if (percentDaysDone >= 33) {
    color = "yellow";
  } else {
    color = "red";
  }
  // Return CirclePercentDaysDone component.
  return (
    <div className={styles.graph}>
      <svg
        className={styles.fitnessSVG}
        viewBox={` ${svgSize / 4.3} ${svgSize / 5} ${svgSize / 1.7} ${ svgSize / 1.7 }`}
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

// Function generates a circle graph representing the user's workout stats 'currentStreak' and 'longestStreak'
//  to be displayed on the page.
//  Source: Adapted from ChatGPT 
const CircleStreak = ({currentStreak, longestStreak}) => {
  const percentStreak = (100 * currentStreak) / longestStreak;
  const data = [
    {x: 1, y: percentStreak},
    {x: 2, y: 100 - percentStreak},
  ];
  const svgSize = 150; 
  const radius = (svgSize - 65) / 2; 
  let color;
  if (percentStreak === 100) {
    color = "green";
  } else if (percentStreak >= 50) {
    color = "yellow";
  } else {
    color = "red";
  }
  // Return CircleStreak component.
  return (
    <div className={styles.graph}>
      <svg
        className={styles.fitnessSVG}
        viewBox={` ${svgSize / 4.3} ${svgSize / 5} ${svgSize / 1.7} ${ svgSize / 1.7 }`}
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


// Function parses the user's 7-day workout plan stored in the variable 'workout' 
//  and displays an individual day's workout on the page.
// handleOpenModal passed as a prop.
function Workout({ handleOpenModal }) {

  // State variable 'workout' stores the individual day's workout
  const [workout, setWorkout] = useState(null);

  // This code block calculates today's date to compare it to the workout plan days
  //  to determine if which day x/7 should be displayed on the page and to navigate between.
  //  Source: Adapted from ChatGPT 
  const [daysToAdd, setDaysToAdd] = useState(0);
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric",};
  const date = today.toLocaleDateString("en-CA", dateOptions);
  const [dayOfWorkoutPlan, setDayOfWorkoutPlan] = useState(0);
    // Handle 'next day' pagination button
    const handleIncrementDays = () => {
      setDaysToAdd(daysToAdd + 1);
    };
    // Handle 'previous day' pagination button
    const handleDecrementDays = () => {
      setDaysToAdd(daysToAdd - 1);
    }
    // Handle 'today' pagination button
    const handleToToday = () => {
      setDaysToAdd(0);
    }
  // End of section
  

  // Create and return the html elements displaying the workout plan
  useEffect(() => {

    // Parse the workout plan data recursivly given that workout plan is a nested JSON object
    //  Source: Adapted from ChatGPT 
    async function fetchData() {

      // Variable 'workoutData' stores the first workout plan object from the user database field workouts
      const workoutData = await getWorkout();

      // Handles if workout field is empty
      if (workoutData === "empty") { setWorkout("No workout available");
      } else {

      // 
      function renderNestedObject(obj) {

        // check if current object is a nested object, recursively render its properties
        if (typeof obj === 'object' && obj !== null) {
          
          // use .map function to check recursively
          return Object.keys(obj).map((key, index) => {
            
            // check if key matches date so only render the one day on the page
            if (key == date) {

              // tracks number of exercises on page, used for complete exercse buttons
              // using browser local storage because state variables not too disfunctional with so many sub-components
              let numOfExercises = Object.keys(workoutData[date]).length;
              localStorage.setItem('numberOfExercises', numOfExercises);

              // sets the dayOfWorkoutPlan equal to the index of the today's workout in the workoutPlan in database
              setDayOfWorkoutPlan(index);

                // check if empty rest day
                if (Object.keys(obj[key]).length === 0) {
                  // use this to check if current page is today to render title card
                  let options = { weekday: "long", month: "long", day: "numeric", year: "numeric", };
                  let today = new Date().toLocaleDateString("en-US", options);

                  // if this page is today
                  if (key == today) {
                    return (
                      <div key={index} className={styles.day}>
                        <h5>Today, {key}:</h5> Rest day
                      </div>
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
                let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
                let today = new Date().toLocaleDateString('en-US', options);
                // if this page is today
                if (key == today) {
                  return (
                    <div key={index} className={styles.day}>
                      <h5>{key}</h5>
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
            {Object.entries(exerciseObj[exerciseKey]).map(([detailKey, detailValue]) => {

              if (detailKey == "name") {
                return <strong key={detailKey} className={styles.aKey}>{detailValue}</strong>;
              } else if (detailKey == "setsAndReps") {
                return <div key={detailKey} className={styles.aKey}>{detailValue}</div>;
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
            })}

            {/* this opens up images for the exercise */}
            <div className={styles.exerciseButtonsContainer}>
              <button onClick={handleOpenModal} className={`btn ${styles.modalButton}`}>Help</button>
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
            className={`${styles.anExercise} ${isSaitama ? styles.saitamaStyle : ""}`}
            style={isSaitama ? { backgroundImage: "url('https://staticg.sportskeeda.com/editor/2022/04/8e856-16505616347217-1920.jpg')", opacity: 1, backgroundSize: "100% 100%" } : null}
            >

              {Object.entries(exerciseObj[exerciseKey]).map(([detailKey, detailValue]) => {

                if (detailKey == "name") {
                  return <strong key={detailKey} className={styles.aKey}>{detailValue}</strong>;
                } else if (detailKey == "setsAndReps") {
                  return <div key={detailKey} className={styles.aKey}>{detailValue}</div>;
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
              })
            }

            <div className={styles.exerciseButtonsContainer}>

              {/* this opens up images for the exercise */}
              <button onClick={handleOpenModal} className={`btn ${styles.modalButton}`}>Help</button>
              
              {/* button to mark task completed */}
              <CompleteExercisesButton index={index} />
            </div>

          </div>

          );
        });
      }

      // Recursively go through the nested json object that is workoutData.
      setWorkout(renderNestedObject(workoutData));

        function assignVariables(data, variablePrefix = "") {
          for (const key in data) {
            const value = data[key];
            const variableName = variablePrefix + key;

            if (typeof value === "object") {
              assignVariables(value, variableName + "_");
            } else {
              // Assign the value directly
              const variableValue = value;
              // Dynamically generate a new variable with the name of the date and exercise!
              // Caution dangerous to use eval!
              // Fixed eval error by assigning each variableName the day of the week so only works on max 7-days plan
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
      <button onClick={handleToToday} disabled={dayOfWorkoutPlan == 0} className={`btn ${styles.paginationButton}`}> 
        Today
      </button>
      
      <button onClick={handleDecrementDays} disabled={dayOfWorkoutPlan <= 0} className={`btn ${styles.paginationButton}`}>
        {/* left arrow */}
        &larr; 
      </button>

      <button onClick={handleIncrementDays} disabled={dayOfWorkoutPlan >= 6} className={`btn ${styles.paginationButton}`}>
        {/* right arrow */}
        &rarr;
      </button>

      <div>
        {workout}
      </div>

    </div>
  );
}

// Component for a button for each exercise to mark it as done.
//  Each button inc/decrements a local storage value used to enable/disable the completeAllExercises button.
const CompleteExercisesButton = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleClick = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      let numberOfExercises = parseInt(localStorage.getItem('numberOfExercises'));
      numberOfExercises--;
      localStorage.setItem('numberOfExercises', numberOfExercises);
    } else {
      let numberOfExercises = parseInt(localStorage.getItem('numberOfExercises'));
      numberOfExercises++;
      localStorage.setItem('numberOfExercises', numberOfExercises);
    }
  };
  return (
    <div>
      <input type="checkbox" className="btn-check" id={`doneExercise${props.index}`}></input>
      <label onClick={handleClick} className={`btn ${styles.doneExerciseButton}`} htmlFor={`doneExercise${props.index}`}>Completed!</label>
    </div>
  );
};


// Component for a display of the user's workout stats/streak.
const Streak = () => {
  const [currentStreak, setCurrentStreak] = useState(null);
  const [longestStreak, setLongestStreak] = useState(null);
  const [doneToday, setDoneToday] = useState(null);
  const [daysDone, setDaysDone] = useState(null);
  const [daysMissed, setDaysMissed] = useState(null);
  
  // Function retrieves the user information from the database.
  async function getStreak() {
    try {
      const response = await fetch(`https://healthify-enxj.onrender.com/streak/${username}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setCurrentStreak(data.currentStreak);
      setLongestStreak(data.longestStreak);
      setDoneToday(data.doneToday);
      setDaysDone(data.daysDone);
      setDaysMissed(data.daysMissed);
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  }
  useEffect(() => {
    getStreak();
  }, []);

  // Render loading state if streak data is not yet available.
  if (currentStreak === null || longestStreak === null) {
    return <div>Loading streak...</div>;
  }

  // Set the symbol and message to be displayed representing if user completed today's workout or not.
  //  Img sources from https://icones.pro
  var doneTodaySymbol;
  var doneTodayMessage;
    if (doneToday) {
      doneTodaySymbol = 'https://icones.pro/wp-content/uploads/2021/02/icone-de-tique-ronde-verte.png'
      doneTodayMessage = 'Today Completed!'
    } else {
      doneTodaySymbol = 'https://icones.pro/wp-content/uploads/2021/04/logo-excel-rouge.png'
      doneTodayMessage = 'Today not yet done'
    }

  // Calculate percentDaysDone later sent to the circle graphs.
  var percentDaysDone = 100 * daysDone / (daysDone + daysMissed);
  percentDaysDone = Math.floor(percentDaysDone);
    // Prevent NaN error dividing 0
    if (daysDone + daysMissed == 0) { percentDaysDone = 0; }

  // Return Streak component.
  return (
    <div className={styles.streakContainer}>

      <div className={styles.doneContainer}>
        <img src={doneTodaySymbol} className={styles.doneTodaySymbol} alt="Done today symbol"></img>
        {doneTodayMessage}
      </div>

      <CirclePercentDaysDone percentDaysDone={percentDaysDone} />

      <CircleStreak currentStreak={currentStreak} longestStreak={longestStreak} />

    </div>
  );
};


// The Main component for the page.
const Fitness = () => {

  // Hides the workout form to generate a new workout plan unless user button to open it.
  const [isWorkoutFormVisible, setWorkoutFormVisible] = useState(false);
  const toggleWorkoutFormVisibility = () => {
    setWorkoutFormVisible(!isWorkoutFormVisible);
  };
  
  // Disables the generate new workout plan button after clicking until current execution is finished.
  const [isFormSubmitting, setFormSubmitting] = useState(false);

  // Function to update user in database with workout plan.
  async function addWorkoutToUser(event) {
    event.preventDefault();

    // Disables the generate new workout plan button after clicking until current execution is finished.
    if (isFormSubmitting) { return; }
    setFormSubmitting(true);

    // Use today's date as the key to store the newly generated workout plan in the user's database.
    const today = new Date().toISOString().slice(0, 10);
    const workoutKey = "workout_" + today;
    const workout = {};

    // Get the user-selected muscle groups and intensity level
    //  Source: Adapted from ChatGPT.
    var muscleGroups = Array.from(event.target.elements)
    .filter((element) => element.type === 'checkbox' && element.checked)
    .map((element) => element.name);
    if (muscleGroups.length == 0) {
      muscleGroups = ["all"];
    }
    var level = event.target.intensity.value;

    // Store all the client-side data to be sent to workout generation via later app.put call to server.js.
    const data = {
      workoutKey,
      workout,
      muscleGroups,
      level,
    };

    // Call server.js app.put method to generate a new workout plan for the user.
    const response = await fetch(
      `https://healthify-enxj.onrender.com/fitness/${username}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    // re-enable button after finishing code
    setFormSubmitting(false);
    // reload page so the new workout is displayed
    window.location.reload();
  }


  // Component for displaying a modal containing an exercise gif.
  const ExerciseModal = ({ isOpen, onRequestClose, modalExercise, sex }) => {

    // Overlay styling for the modal.
    const overlayStyles = {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    };

    // Get and set the image source to be displayed.
    var source = "ModalExercise"
    if (modalExercise) {
      // Images are stored in our github dev branch in sex-specific folders.
      source = `https://raw.githubusercontent.com/glu16/2800-202310-BBY01/dev/client/src/img/exercises/${sex}/`
      // Replace whitespaces with underscore and tolowercase as per image naming convention
      + modalExercise.replace(/\s/g, "_").toLowerCase()
      + `.gif`
    }

    // Return ExerciseModal component.
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Image Popup"
        appElement={document.getElementById("root")}
        ariaHideApp={false}
        className = {styles.modal}
        style={{overlay: overlayStyles}}
      >
        <strong>{modalExercise}</strong>
        <img className={styles.modalImage} 
        src={source}
        alt="Sorry, no image avaiable for this exercise." 
        // If no valid image is found, display a default one.
        onError={(e) => {
          e.target.onerror = null; // Prevents infinite loop if default image is also not found
          e.target.src = 'https://media.tenor.com/aYgdn4RqQRMAAAAC/thinking-eye-squinting.gif';
        }}
        />
      </Modal>
    );
  };

  // State variables to show a Modal.
  const [showModal, setShowModal] = useState(false);
  const [modalExercise, setModalExercise] = useState(null);
  // Open modal.
  const handleOpenModal = (event) => {
    // Get the name of the exercise via html structure then send it to modal.
    const strongElement = event.target.parentElement.parentElement.firstElementChild.textContent;
    setModalExercise(strongElement);
    setShowModal(true);
  };
  // Close modal.
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Create the button to completeAllExercises.
  const [numberOfExercises, setNumberOfExercises] = useState(99);
  const [completeAllExercisesClicked, setCompleteAllExercisesClicked] = useState(false);
  useEffect(() => {
    const storedValue = localStorage.getItem('numberOfExercises');
      setNumberOfExercises(Number(storedValue));
  }, []);

  // Check local storage if all exercises on the pages are marked as done, then enable completeAllExercises button.
  useEffect(() => {
    localStorage.setItem('numberOfExercises', numberOfExercises);
  }, [numberOfExercises]);

  // Clicking completeAllExercisesButton calls server app.post method to update user stats.
  const completeAllExercises = async () => {

    // Disable the button after it is clicked.
    setCompleteAllExercisesClicked(true);

    // Call server.js to incriment the user field 'streak'.
    try {
      const response = await fetch(`https://healthify-enxj.onrender.com/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
        }),
      });
      if (response.ok) {
        console.log('Field updated successfully!');
      } else {
        console.log('Field update failed!');
      }
    } catch (error) {
      console.log('Error updating field:', error);
    }

    // Reload page to rerender everything
    window.location.reload();
  };

  // Pseudo-event listener for when numberOfExercises is modified
  const prevNumberOfExercisesRef = useRef(localStorage.getItem('numberOfExercises'));
  useEffect(() => {
    const checkLocalStorage = () => {
      const currentNumberOfExercises = localStorage.getItem('numberOfExercises');
      if (currentNumberOfExercises !== prevNumberOfExercisesRef.current) {
        prevNumberOfExercisesRef.current = currentNumberOfExercises;
        setNumberOfExercises(Number(currentNumberOfExercises)); // Trigger re-render
      }
    };
    const interval = setInterval(checkLocalStorage, 1000); 
    return () => {
      clearInterval(interval);
    };
  }, []);


  // Return Fitness component.
  return (
    <div className={`d-flex justify-content-center align-items-center h-100 ${styles.fitnessContainer}`}>
      
      {/* Title displaying the user's username. */}
      <h2>{username}'s Workout Plan</h2>

      {/* Streak Component. */}
      <Streak />

      {/* Button to open form to create a new workout plan. */}
      <button onClick={toggleWorkoutFormVisibility} className={`btn ${styles.paginationButton}`}>
        {isWorkoutFormVisible ? 'Hide Create Workout Plan Form' : 'Create A New Workout Plan'}
      </button>

      {/* Form to generate a new workout plan. */}
      <div
        id="workoutForm"
        className={`${styles.workoutForm} ${isWorkoutFormVisible ? '' : styles.hidden}`}
      >
        <form id="addWorkout" onSubmit={addWorkoutToUser}>

          {/* Not displayed, username data to send to workout generation. */}
          <input type="hidden" name="username" value={username}></input>

          {/* User can choose an intensity level to send to workout generation. */}
          <input type="radio" id="beginnerOption" name="intensity" value="beginner" className="btn-check"></input>
          <label htmlFor="beginnerOption" className={`btn ${styles.radioButton}`}>Beginner</label>
          <input type="radio" id="intermediateOption" name="intensity" value="intermediate" className="btn-check" defaultChecked={true}></input>
          <label htmlFor="intermediateOption" className={`btn ${styles.radioButton}`}>Intermediate</label>
          <input type="radio" id="expertOption" name="intensity" value="expert" className="btn-check"></input>
          <label htmlFor="expertOption" className={`btn ${styles.radioButton}`}>Expert</label>
          <p>Select desired intensity level</p>
          <br />

          {/* User can choose muscle groups they want to focus on to send to workout generation.*/}
          <input type="checkbox" name="arms" className="btn-check" id="arms"></input>
          <label className={`btn ${styles.muscleGroupButton}`} htmlFor="arms">Arms</label>
          <input type="checkbox" name="legs" className="btn-check" id="legs"></input>
          <label className={`btn ${styles.muscleGroupButton}`} htmlFor="legs">Legs</label>
          <input type="checkbox" name="chest" className="btn-check" id="chest"></input>
          <label className={`btn ${styles.muscleGroupButton}`} htmlFor="chest">Chest</label>
          <input type="checkbox" name="back" className="btn-check" id="back"></input>
          <label className={`btn ${styles.muscleGroupButton}`} htmlFor="back">Back</label>
          <input type="checkbox" name="shoulders" className="btn-check" id="shoulders"></input>
          <label className={`btn ${styles.muscleGroupButton}`} htmlFor="shoulders">Shoulders</label>
          <input type="checkbox" name="core" className="btn-check" id="core"></input>
          <label className={`btn ${styles.muscleGroupButton}`} htmlFor="core">Core</label>
          <input type="checkbox" name="glutes" className="btn-check" id="glutes"></input>
          <label className={`btn ${styles.muscleGroupButton}`} htmlFor="glutes">Glutes</label>
          <p>Select muscle group(s) you want to focus on</p>

          <br />

          {/* Button to submit form to generate a new workout plan. Displays different text if clicked or not clicked */}
          <button
            type="submit"
            className="btn btn-success"
            disabled={isFormSubmitting}
          >
            {isFormSubmitting ? (
              <div>
                <p>Generating...</p>
                {/* Bootstrap loadinng circle */}
                <div id="processing" className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>
              </div>
            ) : (
              "Create new workout plan"
            )}
          </button>

          {/* Disclaimer. */}
          <p> 
            <small>Generating takes 1 to 2 minutes</small>
            <br />
            <small>Please DO NOT refresh the page</small>
            <br />
          </p>
        </form>
      </div>

      {/* The main content of the page. All exercises for the specific date.*/}
      <Workout workout={workout} handleOpenModal={handleOpenModal} />

      {/* Modal. Only displayed if clicked. */}
      {showModal && (
        <ExerciseModal
          isOpen={showModal}
          onRequestClose={handleCloseModal}
          modalExercise={modalExercise}
          sex = {sex}
          />
      )}

      {/* Button for user to mark today's workout complete and update database.*/}
      <button id="completeAllButton" className={`btn btn-success ${styles.completeAllButton}`}
        onClick={completeAllExercises} 
        disabled={numberOfExercises !== 0 || completeAllExercisesClicked || doneToday}
        >Mark ALL exercises complete!
      </button>
      
    </div>
  );
};

export default Fitness;
