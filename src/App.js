import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarAfterLogin from './components/navbarAfterLogin';
import Home from './components/Home';
import Fitness from './components/Fitness';
import Diet from './components/Diet';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';

import './css/App.css';
import './css/main.css';
import './css/navfooter.css';

function App() {
  return (
    <Router>
      {/* <div> */}
        <NavbarAfterLogin />
        <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        </div>
      {/* </div> */}
    </Router>
  );
}

export default App;