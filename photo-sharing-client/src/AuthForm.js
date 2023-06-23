import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


// replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthForm = ({ isSignup, setIsLogged}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(isSignup) {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLogged(true);
        alert("User created successfully");
        setEmail("");
        setPassword("");
        setName("");
      })
      .catch((error) => {
        alert(error.message);
      });
    } else {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLogged(true);
        alert("Logged in successfully");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        alert(error.message);
      });
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
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
      <Button variant="contained" type="submit">
        {isSignup ? "Sign Up" : "Log In"}
      </Button>
    </Box>
  );

};

export default AuthForm;
