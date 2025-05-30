import React from 'react';
//import Register from './Templates/Register';
import Login from './Templates/Login';
//import Login from './Templates/Login';
//import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProfilePage from './Templates/ProfilePage';
//import InterestPage from './Templates/Preferences';
//import TripInformationPage from './Templates/TripInformation';
//import logo from './logo.svg';
//import './css/App.css';
//import CreateEventPage from './Templates/CreateEventPage';
//import Welcome from './Templates/WelcomePage';

//import CreateVenuePage from './Templates/CreateVenuePage';
function App() {

  return (
    <div>
      <Login/>
      <ProfilePage />
    </div>
    /*
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>*/
  );
}

export default App;
