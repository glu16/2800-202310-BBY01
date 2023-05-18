import React from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import styles from "../css/index.module.css";
import image from "../img/indexPhone.png";

const Index = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <div className={`row justify-content-between align-items-center h-100 ${styles.indexBody}`}>
      <div className="col-md-6">
        <div className={`card-body ${styles.indexCard}`}>
          <div className="text-center">
            <h1 className={styles.indexTitle}>Healthify</h1>
            <h4 className={styles.indexDescription}>
              Healthify is a comprehensive fitness and dietary app designed to
              help users achieve their health goals. The app provides
              personalized fitness plans, workout routines, and meal plans based
              on users' unique needs, preferences, and goals.
            </h4>
            <div className={styles["button-group"]}>
              <Link to="/signup">
                <button
                  className={`btn btn-primary btn-lg ${styles.indexBtn}`}
                >
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button
                  className={`btn btn-primary btn-lg ${styles.indexBtn}`}
                >
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <animated.img
          style={fadeIn}
          src={image}
          alt="Fitness"
          className={styles.indexImage}
        />
      </div>
    </div>
  );
};

export default Index;
