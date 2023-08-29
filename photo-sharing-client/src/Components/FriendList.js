import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, Container } from '@mui/material';
import axios from 'axios';
import auth from "../Components/Login/Firebase-config";

const FriendList = ({ updateFriends, setUpdateFriends }) => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const currentUserId = auth.currentUser?.uid;
      const response = await axios.get(`http://127.0.0.1:5001/friend-list?currentUserId=${currentUserId}`);
      setFriends(response.data);
    };
    fetchFriends();
    if (updateFriends) {
        setUpdateFriends(false);
    }
  }, [updateFriends, setUpdateFriends]);

  const handleDeleteFriend = async (friendId) => {
    const currentUserId = auth.currentUser?.uid;
    try {
      const response = await axios.delete(`http://127.0.0.1:5001/delete-friend?currentUserId=${currentUserId}&friendId=${friendId}`);
      if (response.status === 200) {
        setFriends(friends.filter(friend => friend.id !== friendId));
        // alert(response.data.message);
      } else {
        alert('Error deleting friend.');
      }
    } catch (error) {
      console.error("Error deleting friend:", error);
      alert('Error deleting friend. Please try again.');
    }
  };

  const handleFriendClick = (friendID) => {
    navigate(`/dashboard/${friendID}`);
  };

  return (
    <Container>
      <h2>Friends</h2>
      <List>
        {friends.map(friend => (
          <ListItem key={friend.id}> 
            <span onClick={() => handleFriendClick(friend.id)} style={{cursor: 'pointer'}}>
              {friend.email}
            </span>
            <Button variant="outlined" onClick={(e) => {
              e.stopPropagation(); // prevent the ListItem click event from firing
              handleDeleteFriend(friend.id)
            }}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FriendList;
