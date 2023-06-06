import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const AuthForm = ({ isSignup }) => {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      {isSignup && (
        <TextField id="outlined-basic" label="Name" variant="outlined" />
      )}
      <TextField id="outlined-basic" label="Email" variant="outlined" />
      <TextField id="outlined-basic" label="Password" variant="outlined" type="password" />
      <Button variant="contained">{isSignup ? 'Sign Up' : 'Log In'}</Button>
    </Box>
  );
};

export default AuthForm;
