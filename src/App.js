import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavbarAfterLogin from './navbarAfterLogin';
import FitnessPage from './fitnessPage';

import './css/App.css';
import './css/main.css';
import './css/navfooter.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavbarAfterLogin />
        <Routes>
          <Route path="/fitness" element={<FitnessPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;