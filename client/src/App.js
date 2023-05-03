import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarAfterLogin from "./components/NavbarAfterLogin";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import SignupDetails from "./components/SignupDetails"
import Diet from "./components/Diet";
import Fitness from "./components/Fitness";
import Leaderboard from "./components/Leaderboard";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <NavbarAfterLogin />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signupdetails" element={<SignupDetails />} />
          <Route path="/home" element={<Home />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
    </Router>
  );
}

export default App;
