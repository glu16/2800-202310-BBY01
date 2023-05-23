import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import styles from "../css/calendar.module.css";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await fetch(
          `https://healthify-server.vercel.app/fitness/${localStorage.getItem(
            "username"
          )}`
        );
        const data = await response.json();

        if (data === "empty") {
          setEvents([]);
        } else {
          if (typeof data === "object") {
            const workouts = Object.entries(data);
            console.log("Workouts:", workouts);

            const calendarEvents = workouts
              .map(([date, exercises]) => {
                const formattedDate = new Date(date).toLocaleDateString(
                  undefined,
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                );

                const exercisesList = Object.values(exercises);
                console.log("Exercises:", exercisesList);

                return exercisesList.map((exercise) => ({
                  title: exercise.name,
                  date: formattedDate,
                  extendedProps: {
                    setsAndReps: exercise.setsAndReps,
                    calories: exercise.calories,
                  },
                }));
              })
              .flat();

            console.log("Calendar events:", calendarEvents);
            setEvents([...calendarEvents]);
          } else {
            console.log("Invalid data format:", data);
          }
        }
      } catch (error) {
        console.error("Error retrieving workout:", error);
      }
    }

    fetchWorkout();
  }, []);

  function renderEventContent(eventInfo) {
    return (
      <div>
        <h3>{eventInfo.event.title}</h3>
        <p>{eventInfo.event.extendedProps.setsAndReps}</p>
      </div>
    );
  }

  return (
    <div className={styles.calendarBody}>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.calendarContainer}`}
      >
        <div className={`${styles.calendarCard}`}>
          <div className="card-body">
            <div className="d-flex flex-column align-items-center text-center">
              <h1 className={styles.calendarTitle}>
                Welcome to the Calendar Page
              </h1>
              <div className={styles.calendar}>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  eventContent={renderEventContent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
