import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import '../css/welcomepage.css';


function Welcome(){
    return(
        <div className="welcome-container">
            <div className="welcome-banner">
            <h1>Welcome to Yaad Quest</h1>
            <h2> The Jamaican Trip Planner App</h2>
            <button ><Link to= "/register">Register</Link></button>
            <button ><Link to= "/login">Login</Link></button>

            </div>
        </div>
    )
}
export default Welcome; 