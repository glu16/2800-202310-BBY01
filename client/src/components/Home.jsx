import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import "../css/main.css";

const Home = () => {
  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <animated.h1 className="display-4" style={greetings}>
              Hello BBY-01!
            </animated.h1>
            <animated.h1 className="display-6" style={greetings}>
              Welcome to Healthify!
            </animated.h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
