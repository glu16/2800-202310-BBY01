import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

import "../css/main.css";
import styles from "../css/about.module.css";

const Contact = () => {
  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.aboutBody}`}
    >
      <div className={`card-body ${styles.aboutCard}`}>
        <animated.h1 className={styles.aboutHeader} style={greetings}>
          Contact Us
        </animated.h1>
      </div>
    </div>
  );
};

export default Contact;
