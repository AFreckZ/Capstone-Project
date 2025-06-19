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
import ProtectedRoute from './Templates/ProtectedRoutes';
import { AuthProvider } from './contexts/AuthContext';
import TravelProfilePage from './Templates/travelagencyprofilepage';
import BusinessProfilePage from './Templates/businessprofilepage';
import EventVenueCreator from './Templates/EventVenueCreator';
import SearchEvent from './components/searchpage';
//used to manage user sessions
import AuthDebug from './Templates/debugAuth';
function App() {

  return (
   <AuthProvider>
      
      <Routes>
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
        <Route path="/business-profile" element={<BusinessProfilePage/>} />
        <Route path ="/travel-profile" element= {<TravelProfilePage/>}/>
        <Route path ="/EVregister" element={<EventVenueCreator/>}/>
        <Route path ="/search" element ={<SearchEvent/>}/>
      </Routes>
      
      </AuthProvider>
  );
}

export default App;
