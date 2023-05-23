import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";

import styles from "../css/calendar.module.css";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`https://healthify-server.vercel.app/calendar/${localStorage.getItem("username")}`)
      .then((response) => {
        const plans = response.data;

        // Map function to display the plans on the calendar
        const calendarEvents = plans.map((plan) => ({
          title: plan.title,
          date: plan.date,
        }));

        setEvents(calendarEvents);
      })
      .catch((error) => {
        console.error("Error retrieving plans:", error);
      });
  }, []);

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
