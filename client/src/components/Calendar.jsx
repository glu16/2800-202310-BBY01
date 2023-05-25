// Import statements
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

// CSS module import statement
import styles from "../css/calendar.module.css";

const Calendar = () => {
  // useState hook variables for the calendar events
  const [events, setEvents] = useState([]);

  // useEffect hook to retrieve the user's 7-day workout plan
  // from the database and convert them into calendar events
  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await fetch(
          `http://localhost:5050/fitness/${localStorage.getItem("username")}`
        );
        const data = await response.json();
        // Check if the data is of type "object"
        if (typeof data === "object") {
          const workouts = Object.entries(data);
          // Generate calendar events from the workouts data
          const calendarEvents = workouts.flatMap(([date, exercises]) => {
            const isoDate = new Date(date).toISOString().split("T")[0];

            const exercisesList = Object.values(exercises);
            // Map function to assign the values to the calendar events
            return exercisesList.map((exercise) => ({
              title: exercise.name,
              date: isoDate,
              extendedProps: {
                setsAndReps: exercise.setsAndReps,
                calories: exercise.calories,
              },
              classNames: [styles.fullCalendar],
            }));
          });
          // Update the component's state with the calendar events
          setEvents(calendarEvents);
        }
      } catch (error) {
        console.error("Error retrieving workout:", error);
      }
    }
    // Fetch the workout data when the component mounts
    fetchWorkout();
  }, []);
  // End of workout retrieval

  // Function to render the calendar events
  function renderEventContent(eventInfo) {
    return (
      <div>
        <h3 className={styles.workoutEventTitle}>{eventInfo.event.title}</h3>
        <p className={styles.workoutEvent}>
          {eventInfo.event.extendedProps.setsAndReps}
        </p>
      </div>
    );
  }

  // Renders Calendar.jsx component
  return (
    <div className={styles.calendarBody}>
      <div className={`d-flex justify-content-center align-items-center h-100`}>
        <div className={`${styles.calendarCard}`}>
          <div className="card-body">
            <div className="d-flex flex-column align-items-center text-center">
              <h1 className={styles.calendarTitle}>Calendar Events</h1>
              <div className={styles.calendar}>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  eventContent={renderEventContent}
                  className={styles.fullCalendar}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // End of Calendar.jsx component
};

export default Calendar;
