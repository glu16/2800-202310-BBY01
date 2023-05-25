// Import statements
import React from "react";
import { useSpring, animated } from "react-spring";

// CSS import statement
import "../css/main.css";
// CSS module import statement
import styles from "../css/about.module.css";

const About = () => {
  // Visual text animation effects
  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });
  // End of visual text animation effects

  // Renders About.jsx component
  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.aboutBody}`}
    >
      <div className={`card-body ${styles.aboutCard}`}>
        <animated.h1 className={styles.aboutHeader} style={greetings}>
          About Us
        </animated.h1>
        <h4 className={`card-body ${styles.aboutDescription}`}>
          Welcome to Healthify, your comprehensive companion on your journey to
          a healthier and fitter lifestyle! Our app is designed to empower and
          support you every step of the way, providing you with the tools and
          resources you need to achieve your diet and fitness goals.
          <br />
          <br />
          With Healthify, you can embark on a transformative experience that
          combines cutting-edge technology with expert guidance. Whether you're
          aiming to lose weight, build muscle, improve endurance, or simply
          adopt healthier habits, our app caters to your unique needs and
          preferences.
          <br />
          <br />
          Stay motivated and accountable with our user-friendly interface and
          intuitive features. We understand that everyone has different starting
          points, so we offer personalized plans and adaptable programs that can
          be tailored to your specific goals and fitness level. You'll never
          feel overwhelmed or lost on your journey because our app provides
          clear guidance and progress tracking to keep you on the right track.
        </h4>
        <div className="row">
          <div className="col-md-3">
            <img src="" alt="Team Member 1" />
          </div>
          <div className="col-md-3">
            <img src="" alt="Team Member 2" />
          </div>
          <div className="col-md-3">
            <img src="" alt="Team Member 3" />
          </div>
          <div className="col-md-3">
            <img src="" alt="Team Member 4" />
          </div>
        </div>
      </div>
    </div>
  );
  // End of About.jsx component
};

export default About;
