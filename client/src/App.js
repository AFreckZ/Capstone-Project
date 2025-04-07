import React from 'react';
import Register from './Templates/Register';
import Login from './Templates/Login';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

//import logo from './logo.svg';
//import './css/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
