import React from 'react';
import {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard'; // assuming you have created a Dashboard component

function App() {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={isLogged ? <Navigate to="/dashboard" /> : <AuthForm setIsLogged={setIsLogged}/>}/>
          <Route path="/dashboard" element={isLogged ? <Dashboard /> : <Navigate to="/login" />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
