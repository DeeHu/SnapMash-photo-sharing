import React, { useEffect, useState } from 'react';
import axios from 'axios';
import auth from './Login/Firebase-config';
import { Button } from '@mui/material';

const UserPhotos = (props) => {
  const [photoPaths, setPhotoPaths] = useState([]);
  const userId = auth.currentUser?.uid;
  
  useEffect(() => {
    const fetchPhotos = async () => {
      const userId = auth.currentUser?.uid;
      try {
        const response = await axios.get('http://127.0.0.1:5001/get-user-photos', {
          params: {
            user_id: userId
          }
        });
        setPhotoPaths(response.data.photos);
      } catch (error) {
        console.error("Error fetching user photos:", error);
      }
    };

    fetchPhotos();
  }, [props.photoUploaded]); // useEffect listens to changes for prop here

  const handleDelete = async (photoId) => {
    try {
      const response = await axios.post('http://127.0.0.1:5001/delete-photo', {
        photo_id: photoId,
        user_id: userId  // send the user id to backend
      });
      if (response.status === 200) {
        setPhotoPaths(prevPaths => prevPaths.filter(path => path.id !== photoId));
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  }
  
  return (
    <div>
      {photoPaths.map(({ path, id, User_ID }, index) => {
        if (!path) return null; 
        const imagePath = `http://127.0.0.1:5001/images/${path.split("/").pop()}`;
        return (
          <div key={index}>
            <img src={imagePath} alt="User Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
            {User_ID === userId && (
              // <button onClick={() => handleDelete(id)}>Delete</button>
              <Button variant="contained" color="error" onClick={() => handleDelete(id)}>
                Delete
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserPhotos;
