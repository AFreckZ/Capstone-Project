import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Templates/Register';
import Login from './Templates/Login';
import TouristProfilePage from './Templates/touristProfilePage';
import InterestPage from './Templates/Preferences';
import TouristPreferencesForm from './Templates/TouristPreferences';
import TripInformationPage from './Templates/TripInformation';
import logo from './logo.svg';
import './css/App.css';
import CreateEventPage from './Templates/CreateEventPage';
import Welcome from './Templates/WelcomePage';
import ItineraryGenerator from './Templates/itinerarygen';
import CreateVenuePage from './Templates/CreateVenuePage';
import Header from './Templates/Header';
import ProtectedRoute from './Templates/ProtectedRoutes';
import DebugUser from './Templates/debuguser';
import { AuthProvider } from './contexts/AuthContext';
//used to manage user sessions
import AuthDebug from './Templates/debugAuth';
function App() {

  return (
   <AuthProvider>
      <AuthDebug/>
      <Routes>
        <Route path="/debug" element={<DebugUser/>}/>
        <Route path ="/" element={<Welcome/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tourist-profile" element={<TouristProfilePage />} />
        <Route path="/prefer" element={<InterestPage />} />
        <Route path="/preferences" element={<TouristPreferencesForm />} /> 
        <Route path="/info" element={<TripInformationPage />} />
        <Route path="/eventinfo" element={<CreateEventPage />} />
        <Route path="/venueinfo" element={<CreateVenuePage />} />
        <Route path="/generate" element={<ItineraryGenerator />} />
      </Routes>
      </AuthProvider>
  );
}

export default App;
