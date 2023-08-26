import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import axios from 'axios';
import auth from "./Firebase-config";

const AuthForm = ({ isSignup, setIsLogged }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSignup) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          var user = userCredential.user;
          return updateProfile(user, {
            displayName: name,
          });
        })
        .then(() => {
          // var user = userCredential.user;
          var user = auth.currentUser;
          var registrationDate = new Date(user.metadata.creationTime);

          setIsLogged(true);
          alert("User created successfully");
          setEmail("");
          setPassword("");
          setName("");

          // sending user data to db
          axios.post('http://127.0.0.1:5001/user', {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            date: registrationDate,
          })
          .then(response => {
              console.log('Saved to db successfully:', response.data);
          })
          .catch((error) => {
              console.error('Error saving to db:', error);
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setIsLogged(true);
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  useEffect(() => {
    // Set up the listener on mount
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        setIsLogged(true);
      } else {
        // User is logged out
        setIsLogged(false);
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [setIsLogged]); // Dependency on setIsLogged so the effect doesn't re-run unless setIsLogged changes


  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography component="h1" variant="h5">
          {isSignup ? "Sign Up" : "Log In"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {isSignup && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            {isSignup ? "Sign Up" : "Log In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to={isSignup ? "/login" : "/signup"} variant="body2">
                {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthForm;
