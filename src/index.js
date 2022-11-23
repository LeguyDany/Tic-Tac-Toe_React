// ====================================================== Notice ======================================================
// This page handles the routes for our front-end app. Here are the available pages:
// "http://localhost:3000/" => Single player page
// "http://localhost:3000/Multi" => Setting up a multiplayer session
// "http://localhost:3000/Multi/Game/:token" => Page of a multiplayer mode session

// ====================================================== Imports ======================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './index.css';
import {SingleSession, HostSession, MultiSession} from './SessionHandling';
import {Header} from './Navigation.js';

// ====================================================== Routes ======================================================
const ShowPage = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<SingleSession />} />
        <Route path="/Multi" element={<HostSession />} />
        <Route path="/Multi/Game/:token" element={<MultiSession />} />
      </Routes>
    </Router>
  )
}

// ====================================================== Render ======================================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <Header/>
    <ShowPage />
  </React.Fragment>
);