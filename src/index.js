import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './index.css';
import {SingleSession, HostSession, MultiSession} from './SessionHandling';
import {Header} from './Navigation.js';

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <Header/>
    <ShowPage />
  </React.Fragment>
);