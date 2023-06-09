import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavbarAfterLogin from "./components/NavbarAfterLogin";
import NavbarBeforeLogin from "./components/NavbarBeforeLogin";
import MobileFooter from "./components/MobileFooter";
import MobileNavbar from "./components/MobileNavbar";
import Index from "./components/Index";
import About from "./components/About";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import Home from "./components/Home";
import Coach from "./components/Coach";
import Diet from "./components/Diet";
import Fitness from "./components/Fitness";
import Leaderboard from "./components/Leaderboard";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import useToken from "./components/useToken";

function App() {
  // useState hook variables to set user token
  const { token, setToken } = useToken();

  // useState hook variables for mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  // useEffect hook to check if the screen is in mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // End of useEffect hook to check if the screen is in mobile view

  if (!token) {
    return (
      <>
        <Router>
          <NavbarBeforeLogin />
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/signup" element={<SignUp setToken={setToken} />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Index />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </>
    );
  }

  return (
    <Router>
      {isMobile ? <MobileNavbar /> : <NavbarAfterLogin />}
      {isMobile && <MobileFooter />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/fitness" element={<Fitness />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
