import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Templates/Register';
import Login from './Templates/Login';
import ProfilePage from './Templates/ProfilePage';
import InterestPage from './Templates/Preferences';
import TripInformationPage from './Templates/TripInformation';
import logo from './logo.svg';
import './css/App.css';
import CreateEventPage from './Templates/CreateEventPage';
import Welcome from './Templates/WelcomePage';
import ItineraryGenerator from './Templates/itinerarygen';
import CreateVenuePage from './Templates/CreateVenuePage';
import Header from './Templates/Header';
function App() {

  return (
   
      <Routes>
        <Route path ="/" element={<Welcome/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<ProfilePage />} />
        <Route path="/prefer" element={<InterestPage />} />
        <Route path="/info" element={<TripInformationPage />} />
        <Route path="/eventinfo" element={<CreateEventPage />} />
        <Route path="/venueinfo" element={<CreateVenuePage />} />
        <Route path="/generate" element={<ItineraryGenerator />} />
      </Routes>
  );
}

export default App;
