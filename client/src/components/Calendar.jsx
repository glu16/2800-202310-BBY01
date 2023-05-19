import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import styles from "../css/calendar.module.css";

const Calendar = () => {
  return (
    <div className={styles.calendarBody}>
      <div
        className={`d-flex justify-content-center align-items-center h-100 ${styles.calendarContainer}`}
      >
        <div className={`${styles.calendarCard}`}>
          <div className="card-body">
            <div className="d-flex flex-column align-items-center text-center">
              <h1 className={styles.calendarTitle}>Welcome to the Calendar Page</h1>
              <div className={styles.calendar}>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={[
                    { title: "Gym Day", date: "2023-05-05" },
                    { title: "Gym Day", date: "2023-05-08" },
                  ]}
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
