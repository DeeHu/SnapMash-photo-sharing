import React, { useState } from 'react';
import AuthForm from './AuthForm';
import Button from '@mui/material/Button';

function App() {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <div className="App">
      <h1>{isSignup ? 'Sign Up' : 'Log In'}</h1>
      <AuthForm isSignup={isSignup} />
      <Button onClick={() => setIsSignup(!isSignup)}>
        Switch to {isSignup ? 'Log In' : 'Sign Up'}
      </Button>
    </div>
  );
}

export default App;
