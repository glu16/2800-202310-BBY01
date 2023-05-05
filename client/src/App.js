import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import NavbarAfterLogin from "./components/NavbarAfterLogin";
import NavbarBeforeLogin from "./components/NavbarBeforeLogin";
import Index from "./components/Index";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import About from "./components/About";
import Contact from "./components/Contact";
import Careers from "./components/Careers";
import Home from "./components/Home";
import SignupDetails from "./components/SignupDetails";
import Coach from "./components/Coach";
import Diet from "./components/Diet";
import Fitness from "./components/Fitness";
import Leaderboard from "./components/Leaderboard";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import useToken from "./components/useToken";

function App() {
  const {token, setToken} = useToken();

  console.log(token);

  if (!token) {
    return (
      <>
        <Router>
          <NavbarBeforeLogin />
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signupdetails" element={<SignupDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/" element={<Index />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </>
    );
  }

  return (
    <Router>
      <NavbarAfterLogin />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/fitness" element={<Fitness />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
