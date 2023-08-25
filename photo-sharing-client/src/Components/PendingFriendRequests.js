import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, Container } from '@mui/material';
import axios from 'axios';
import auth from "../Components/Login/Firebase-config";

const PendingFriendRequests = ({ updateFriends, setUpdateFriends, requestSent }) => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const currentUserId = auth.currentUser?.uid;
      const response = await axios.get(`http://127.0.0.1:5001/pending-friend-requests?currentUserId=${currentUserId}`);
      setReceivedRequests(response.data.received || []);
      setSentRequests(response.data.sent || []);
    };
    fetchRequests();
  }, [updateFriends, requestSent]);

  const handleRequest = async (friendId, action) => {
    const currentUserId = auth.currentUser?.uid;
    const endpoint = action === 'accept' ? 'accept-friend-request' : 'decline-friend-request';
    try {
      const response = await axios.post(`http://127.0.0.1:5001/${endpoint}`, { 
        friendId: friendId,
        currentUserId: currentUserId
      });
      if (response.status === 200) {
        setReceivedRequests(prevRequests => prevRequests.filter(req => req.id !== friendId));
        setSentRequests(prevRequests => prevRequests.filter(req => req.id !== friendId));
        alert(response.data.message);
        if (action === 'accept') {
          setUpdateFriends(prevState => !prevState);
        }
      } else {
        alert('Error processing request.');
      }
    } catch (error) {
      console.error("Error processing friend request:", error);
      alert('Error processing request. Please try again.');
    }
  };

  const handleDeleteRequest = async (friendId) => {
    const currentUserId = auth.currentUser?.uid;
    try {
      await axios.delete(`http://127.0.0.1:5001/friendship`, {
        data: {
          User_ID: currentUserId,
          Friend_ID: friendId
        }
      });
      setSentRequests(prevRequests => prevRequests.filter(req => req.id !== friendId));
      alert("Friend request deleted!");
    } catch (error) {
      console.error("Error deleting friend request:", error);
      alert("Error deleting friend request. Please try again.");
    }
  };  

  return (
    <Container>
      <h2>Friend Requests</h2>
      <h3>Received Requests</h3>
      <List>
        {receivedRequests.map(request => (
          <ListItem key={request.id}>
            {request.email}
            <Button variant="outlined" onClick={() => handleRequest(request.id, 'accept')}>Accept</Button>
            <Button variant="outlined" color="error" onClick={() => handleRequest(request.id, 'decline')}>Decline</Button>
          </ListItem>
        ))}
      </List>

      <h3>Sent Requests</h3>
      <List>
        {sentRequests.map(request => (
          <ListItem key={request.id}>
            {request.email}
            <Button variant="outlined" color="error" onClick={() => handleDeleteRequest(request.id)}>
              Cancel
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PendingFriendRequests;
