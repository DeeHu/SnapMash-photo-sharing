import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from '@mui/material';
import auth from "../Components/Login/Firebase-config";

const BASE_URL = "http://127.0.0.1:5001";

export const FriendRequest = ({ onRequestSent }) => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users?email=${email}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleSendRequest = async () => {
    const currentUserId = auth.currentUser?.uid;
    try {
      await axios.post(`${BASE_URL}/friendship`, {
        User_ID: currentUserId,
        Friend_ID: user.ID,
      });
      alert("Friend request sent!");
      setRequestSent(true);
      onRequestSent();
    } catch (error) {
        console.error("Error sending friend request:", error);
        const errorMessage = error.response && error.response.data.message ? error.response.data.message : "User not found";
        alert(errorMessage);
    }
  };

  return (
    <div>
      <h2>Search Friend</h2>
      <TextField
        label="Search by email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
      {user && !requestSent && (
        <div>
          <p>{user.User_name}</p>
          <Button variant="contained" color="secondary" onClick={handleSendRequest}>
            Send Friend Request
          </Button>
        </div>
      )}
    </div>
  );
};
