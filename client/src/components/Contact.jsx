import React, {useState} from "react";
import {useSpring, animated} from "react-spring";

import "../css/main.css";

const Contact = () => {
  const greetings = useSpring({
    opacity: 1,
    from: {opacity: 0},
    delay: 500,
  });

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <animated.h1 className="display-6" style={greetings}>
              Contact Us
            </animated.h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
