import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import auth from "./Components/Login/Firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from './Components/Login/AuthForm';
import Dashboard from './Components/Dashboard'; 

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoadingAuthState, setIsLoadingAuthState] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLogged(!!user);
      setIsLoadingAuthState(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoadingAuthState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={isLogged ? <Navigate to="/dashboard" /> : <AuthForm isSignup={false} setIsLogged={setIsLogged}/>}/>
          <Route path="/signup" element={isLogged ? <Navigate to="/dashboard" /> : <AuthForm isSignup={true} setIsLogged={setIsLogged}/>}/>
          <Route path="/dashboard" element={isLogged ? <Dashboard /> : <Navigate to="/login" />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;