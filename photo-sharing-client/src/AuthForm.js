import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { useState, useEffect } from 'react';

const AuthForm = ({ isSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`http://localhost:5000/${isSignup ? 'signup' : 'login'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);
  };
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   password: '',
  // });

  // const handleChange = (event) => {
  //   setFormData({
  //     ...formData,
  //     [event.target.name]: event.target.value,
  //   });
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const response = await fetch(`http://localhost:5000/${isSignup ? 'signup' : 'login'}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(formData),
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      {isSignup && (
        <TextField 
          id="outlined-basic" 
          label="Name" 
          variant="outlined" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <TextField 
        id="outlined-basic" 
        label="Email" 
        variant="outlined" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField 
        id="outlined-basic" 
        label="Password" 
        variant="outlined" 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button 
        variant="contained"
        type="submit"
      >
        {isSignup ? 'Sign Up' : 'Log In'}
      </Button>
    </Box>
  );
};

export default AuthForm;
