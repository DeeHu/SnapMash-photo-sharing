import React from "react";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import auth from "./Firebase-config";

const LogoutButton = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
