import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarAfterLogin from "./components/NavbarAfterLogin";
import Index from "./components/Index";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

import Home from "./components/Home";
import SignupDetails from "./components/SignupDetails";
import Coach from "./components/Coach";
import Diet from "./components/Diet";
import Fitness from "./components/Fitness";
import Leaderboard from "./components/Leaderboard";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import useToken from './components/useToken';



function App() {

  const { token, setToken } = useToken();
  
  console.log(token);

  if (!token) {
    return <Login setToken={setToken}/>
  }

  return (
    <Router>
      <NavbarAfterLogin />
      <Routes>
        <Route path="/index" element={<Index />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signupdetails" element={<SignupDetails />} />
        <Route path="/home" element={<Home />} />
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
