import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Templates/Register';
import Login from './Templates/Login';
import ProfilePage from './Templates/ProfilePage';
import SignUpPage from './Templates/SignUpPage';
import TouristProfileForm from './Templates/TouristProfileForm';
import InterestPage from './Templates/Preferences';
import TripInformationPage from './Templates/TripInformation';
import BusinessProfileForm from './Templates/BusinessProfileForm';
import CreateEventPage from './Templates/CreateEventPage';
import CreateVenuePage from './Templates/CreateVenuePage';
import Welcome from './Templates/WelcomePage';
import AgencyProfilePage from './Templates/AgencyProfilePage';
import BusinessProfilePage from './Templates/BusinessProfilePage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/tourist-profile" element={<TouristProfileForm />} />
        <Route path="/preferences" element={<InterestPage />} />
        <Route path="/trip-info" element={<TripInformationPage />} />
        <Route path="/business-profile" element={<BusinessProfileForm />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/create-venue" element={<CreateVenuePage />} />
        <Route path="/agencyprofilepage" element={<AgencyProfilePage />} />
        <Route path="/business" element={<BusinessProfilePage />} />

      </Routes>
    </Router>
  );
}

export default App;